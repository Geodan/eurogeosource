/* Copyright (c) 2011 by MapQuery Contributors (see AUTHORS for
 * full list of contributors). Published under the MIT license.
 * See https://github.com/mapquery/mapquery/blob/master/LICENSE for the
 * full text of the license. */


(function($) {
$.template('mqLayerJsonManager',
    '<div class="mq-layerjsonmanager ui-widget-content  ">'+
    '</div>');
    
$.template('mqCommodityPopup',
    '<div class="ui-dialog-content ui-widget-content" >'+
     '{{each(i, foo) group}}'+
      '<div id="${id}-${i}"></div>'+
     '{{/each}}'+    
    '</div>');
    
$.template('mqLayerJsonManagerElement',
    '<div class="mq-layerjsonmanager-element ui-widget-content ui-corner-all" id="mq-layerjsonmanager-element-${id}">'+
    '<div class="mq-layerjsonmanager-element-header ui-dialog-titlebar ui-widget-header ui-helper-clearfix">'+
    '<img class="folder-img visible mq-layerjsonmanager-visible" src="css/images/layer-on.png" title="${hide}"><li title="${fold}" class="mq-json-list open"><span class="mq-json-label close" title="${drag}">${label}</span></li></span>'+
    //'<span class="mq-layerjsonmanager-label ui-dialog-title">${label}</span>'+
    '<a class="ui-dialog-titlebar-close ui-corner-all mq-layerjsonmanager-close" href="#" role="button">'+
    '<span class="ui-icon ui-icon-closethick" title="${remove}">close</span></a></div>'+
    '<div class="mq-layerjsonmanager-element-content">'+
        
           
            '<div class="mq-layerjsonmanager-element-slider-container">'+
        '<div class="mq-layerjsonmanager-element-slider" title="${transp}"></div>'+
        '</div>'+
        '<div class="mq-layerjsonmanager-element-legend">'+
            '{{if imgUrl}}'+
                '<img src="${imgUrl}" style="opacity:${opacity}"/>'+
            '{{/if}}'+
            '{{if errMsg}}'+
                '${errMsg}'+
            '{{/if}}'+
			 '{{if lnk}}'+
                '<a href="${lnk}" TARGET="_blank">Legend</a>'+
            '{{/if}}'+
        '</div>'+
        '<hr/>'+
        '<div>'+
        	'<span class="mq-layerjsonmanager-attribution">${attr}</span><span class="mq-layerjsonmanager-metadata">${metadata}</span>'+
        '</div>'+
    '</div>'+
    '</div>');

$.template('mqLayerJsonManagerCommodity',
    '<div class=" mq-layerjsonmanager-element mq-layerjsonmanager-commodity ui-widget-content ui-corner-all" id="mq-layerjsonmanager-element-${id}">'+
    '<div class="mq-layerjsonmanager-element-header mq-layerjsonmanager-commodity-header ui-dialog-titlebar ui-widget-header  ui-helper-clearfix" title="${drag}" >'+
    '<span class="mq-layerjsonmanager-label ui-dialog-title close">'+
    '<img class="folder-img visible mq-layerjsonmanager-visible" src="css/images/layer-on.png" title="${hide}"><li title="${fold}"  class="mq-json-list open"><span  title="${graphs}" class="mq-json-label close">${label}</span></li></span>'+
   
    '<a class="ui-dialog-titlebar-close ui-corner-all mq-layerjsonmanager-close" href="#" role="button" >'+
    '<span class="ui-icon ui-icon-closethick" title="${remove}">close</span></a></div>'+
    '<div class="mq-layerjsonmanager-commodity-content mq-layerjsonmanager-element-content">'+    
	'<div class="mq-layerjsonmanager-commodity-legend">'+
  '{{if !admin}}'+
  '<ul class="mq-group-ul">'+
	'${noagg}'+
	'</ul></div></div>'+
  
	'<input class="mq-geom-radio" type=radio name="geom-${id}" value="point" checked/>${point} <input class="mq-geom-radio"  type=radio name="geom-${id}" value="polygon"/>${polygon} '+
  '{{/if}}'+
	'<span class="feature-kleur" style="background:${kleur};opacity: 0.8;border: solid 1px black;width: 20px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>'+
    '</div>');

$.template('mqLayerJsonManagerCommodityInfo', 
					'<div class="mq-layerjsonmanager-commodity-content mq-layerjsonmanager-element-content">'+       
					  '<div class="mq-layerjsonmanager-commodity-legend"><ul class="mq-group-ul">'+
					  '{{each(i, foo) group}}'+
                '<li class="mq-group mq-group-${foo.code} open"><span class="${i}">${foo.title}</span>'+
                    '<ul class="mq-commodity-ul">{{each(j, bar) foo.data }}'+
                    '<li class="mq-commodity mq-commodity-${bar.name} layer-on"><span class="${bar.code}">${bar.name}</span></li>'+
                       '{{/each}}</ul>'+
                '</li>'+
            '{{/each}}'+
			'</ul></div></div>');

$.widget("mapQuery.mqLayerJsonManager", {
    options: {
        // The MapQuery instance
        map: undefined,

        // Title that will be displayed at the top of the popup
        title: "Layer Manager"
    },
    _create: function() {
        var map;
        var zoom;
        var numzoomlevels;
        var self = this;
        var element = this.element;

        //get the mapquery object
        map = $(this.options.map).data('mapQuery');
		this.map = map;
        this.element.addClass('ui-widget  ui-helper-clearfix ' +
                              'ui-corner-all');

        var lmElement = $.tmpl('mqLayerJsonManager').appendTo(element);
        element.find('.ui-icon-closethick').button();

        lmElement.sortable({
            axis:'y',
            handle: '.mq-layerjsonmanager-element-header',
            update: function(event, ui) {
                var layerNodes = ui.item.siblings().andSelf();
                var num = layerNodes.length-1;
                layerNodes.each(function(i) {
                    var layer = $(this).data('layer');
                    var pos = num-i;
                    self._position(layer, pos);
                });
            }
        });

        //these layers are already added to the map as such won't trigger 
    //and event, we call the draw function directly
        $.each(map.layers().reverse(), function(){
           self._layerAdded(lmElement, this);
        });

        element.delegate('.mq-layerjsonmanager-visible',
            'click',function() {
            var checkbox = $(this);
            if(checkbox.hasClass('invisible')) {checkbox.attr('title',$.i18n.prop('txt_hide'))}
            else {checkbox.attr('title',$.i18n.prop('txt_show'))}
            var element = checkbox.parents('.mq-layerjsonmanager-element');
            var layer = element.data('layer');
            var self = element.data('self');
            self._visible(layer,checkbox.hasClass('invisible'));
            return false;
         });

        element.delegate('.ui-icon-closethick', 'click', function() {
            var control = $(this).parents('.mq-layerjsonmanager-element');
            self._remove(control.data('layer'));
        });
        
        element.delegate('.mq-commodity', 'click', function() {
            var checkbox = $(this);
            var group = checkbox.parents('li.mq-group').find('span').attr('class');
            var name = checkbox.text();
            var element = checkbox.parents('.mq-layerjsonmanager-commodity');
            var layer = element.data('layer');
            self._commodityClicked(layer,group,name);
            return false;
        });
		 element.delegate('.mq-geom-radio', 'click', function() {
            var radio = $(this);
			var value = radio.val();
			 var element = radio.parents('.mq-layerjsonmanager-commodity');
            var layer = element.data('layer');
            self._radioClicked(layer,value);
            
        });
        
        element.delegate('.mq-json-list', 'click', function() {
            $(this).toggleClass('open');
            if($(this).hasClass('open')) {$(this).attr('title',$.i18n.prop('txt_fold'))}
            else {$(this).attr('title',$.i18n.prop('txt_unfold'))}
            var json = $(this).parents('.mq-layerjsonmanager-element').find('.mq-layerjsonmanager-element-content');
            json.toggle('blind');
            return false;
        });
        element.delegate('.mq-group', 'click', function(){
            $(this).toggleClass('open');
            var group = $(this).find('.mq-commodity-ul');
            group.toggle('blind');
        });
        //binding events
        map.bind("addlayer",            {widget:self,control:lmElement},             self._onLayerAdd);
		map.bind("gotInfo",            {widget:self,control:lmElement},             self._onGotInfo)
        map.bind("removelayer",
            {widget:self,control:lmElement},
            self._onLayerRemove);

        map.bind("changelayer",
            {widget:self,map:map,control:lmElement},
            self._onLayerChange);

        map.bind("moveend",
            {widget:self,map:map,control:lmElement},
            self._onMoveEnd);
    },
    _destroy: function() {
		
        this.element.removeClass(' ui-widget ui-helper-clearfix ' +
                                 'ui-corner-all')
            .empty();
    },
    //functions that actually change things on the map
    //call these from within the widget to do stuff on the map
    //their actions will trigger events on the map and in return
    //will trigger the _layer* functions
    _add: function(map,layer) {
        map.layers(layer);
    },

    _remove: function(layer) {
        layer.remove();
    },

    _position: function(layer, pos) {
        layer.position(pos);
    },

    _visible: function(layer, vis) {
        layer.visible(vis);
    },

    _opacity: function(layer,opac) {
        layer.opacity(opac);
    },
    _commodityClicked: function(layer,group,name,pie) {
        var names=[];
        if(pie) names= this._pieClick(layer,group,name);
        else names= this._checkBoxes(layer,group,name);
        var url = layer.options.dataurl;
        
        url = url+";group="+layer.info.results.group[group].code+";names="+names;
        layer.options.url=url;
        layer.olLayer.protocol.options.url=url;        
        //layer.olLayer.strategies[0].layer.protocol.url="/2011/geometry2.json";
        //layer.olLayer.strategies[0].refresh();
        layer.olLayer.refresh({force:true});
    },
	_radioClicked: function(layer,name) {
        var names=[];
		var dataurl = layer.options.dataurl;
        var url = layer.options.url;
		var newurl;
        if(name=='polygon') {
			newurl = url.replace('point','polygon');
			layer.options.dataurl = dataurl.replace('point','polygon');
		}		
		if(name=='point') {
		newurl = url.replace('polygon','point');
			layer.options.dataurl = dataurl.replace('polygon','point');
		}
        
        layer.options.url=newurl;
        layer.olLayer.protocol.options.url=newurl;        
        //layer.olLayer.strategies[0].layer.protocol.url="/2011/geometry2.json";
        //layer.olLayer.strategies[0].refresh();
        layer.olLayer.refresh({force:true});
    },
    _checkBoxes: function(layer,group,name) {
        var id = "#mq-layerjsonmanager-element-"+layer.id;
        var element = $(id);
        var groupul = element.find('.mq-group');
        var names=[];
        $.each(groupul, function(index) {
            if(group==index) {
                var groups = $(this).find('.mq-commodity');
                $.each(groups, function() {
                    var text = $(this).text();
                    if(text==name) {
                        $(this).toggleClass('li-layer').toggleClass('layer-on');
                    }
                    if($(this).hasClass('layer-on')) {
                        names.push($(this).find('span').attr('class'));
                    }
                })
               
            }
            else {
                $(this).find('.mq-commodity').addClass('li-layer').removeClass('layer-on');
            }
            
        })
        return names;
    },
    _pieClick: function(layer,group,name) {
        var id = "#mq-layerjsonmanager-element-"+layer.id;
        var element = $(id);
        var groupul = element.find('.mq-group');
        var names=[];
        $.each(groupul, function(index) {
            if(group==index) {
                var groups = $(this).find('.mq-commodity');
                $.each(groups, function() {
                    var text = $(this).text();
                    if(text==name) {
                        $(this).removeClass('li-layer').addClass('layer-on');
                        names.push($(this).find('span').attr('class'));
                    }
                    else {
                        $(this).addClass('li-layer').removeClass('layer-on');
                    }
                })
               
            }
            else {
                $(this).find('.mq-commodity').addClass('li-layer').removeClass('layer-on');
            }
            
        })
        return names;
    },
    //functions that change the widget
    _layerAdded: function(widget, layer) {
        var self = this;
        var error = layer.legend().msg;
		var lnk = layer.legend().lnk;
        var url;
        switch(error){
            case '':
                url =layer.legend().url;
                if(url=='' && lnk ==''){error='No legend for this layer';}				
                break;
            case 'E_ZOOMOUT':
                error = 'Please zoom out to see this layer';
                break;
            case 'E_ZOOMIN':
                error = 'Please zoom in to see this layer';
                break;
            case 'E_OUTSIDEBOX':
                error = 'This layer is outside the current view';
                break;
        }
        if(layer.isVector) {
          
            
            
            var layerElement = $.tmpl('mqLayerJsonManagerCommodity',{
                id: layer.id,
                label: layer.label,
                position: layer.position(),
                visible: layer.visible(),   
                hide: $.i18n.prop('txt_hide'),     
                fold: $.i18n.prop('txt_fold'),    
                graphs: $.i18n.prop('txt_hidegraphs'), 
                point: $.i18n.prop('txt_point'), 
                polygon: $.i18n.prop('txt_polygon'), 
                remove: $.i18n.prop('txt_remove'),
                drag: $.i18n.prop('txt_drag'),
                noagg: $.i18n.prop('txt_noaggregated'),
                admin: layer.options.admin,
                opacity: layer.visible()?layer.opacity():0,
				kleur: layer.options.kleur
                
            })
                // save layer layer in the DOM, so we can easily
                // hide/show/delete the layer with live events
                .data('layer', layer)
                .data('self',self)
                .prependTo(widget);
               
        }
        else {
            var layerElement = $.tmpl('mqLayerJsonManagerElement',{
                id: layer.id,
                label: layer.label,
                position: layer.position(),
                visible: layer.visible(),
                imgUrl: url,                
                opacity: layer.visible()?layer.opacity():0,
                errMsg: error,
                hide: $.i18n.prop('txt_hide'),
                remove: $.i18n.prop('txt_remove'),
                drag: $.i18n.prop('txt_drag'),
                fold: $.i18n.prop('txt_fold'),    
                transp:$.i18n.prop('txt_transp'),
				lnk: lnk,
                attr: layer.options.attribution,
                metadata: layer.options.metadata
            })
                // save layer layer in the DOM, so we can easily
                // hide/show/delete the layer with live events
                .data('layer', layer)
                .data('self',self)
                .prependTo(widget);
            }

       $(".mq-layerjsonmanager-element-slider", layerElement).slider({
           max: 100,
           step: 1,
           value: layer.visible()?layer.opacity()*100:0,
           slide: function(event, ui) {
               var layer = layerElement.data('layer');
               var self =  layerElement.data('self');
               self._opacity(layer,ui.value/100);
           },
           //using the slide event to check for the checkbox often gives errors.
           change: function(event, ui) {
               var layer = layerElement.data('layer');
               var self =  layerElement.data('self');
               if(ui.value>=0.01) {
                   if(!layer.visible()){layer.visible(true);}
               }
               if(ui.value<0.01) {
                   if(layer.visible()){layer.visible(false);}
               }
           }
       });
       
       
    },
    _createPopup: function(commodity, layerElement) {
		var layer = commodity.layer;
         var html = $.tmpl('mqCommodityPopup',{
            id: layer.id,
            group: layer.info.results.group
        });

        var dialog = $('<div id="dia-'+layer.id+'"></div>')
        .html(html)
        .dialog({
            autoOpen: true,
            title: layer.info.results.name,
            close:function(event,ui){
                 layerElement.find('.mq-json-label.close').removeClass('close').addClass('open').attr('title',$.i18n.prop('txt_graphs'));
            }
        });
        this._createPie(commodity,this);
		 layerElement.delegate('.mq-layerjsonmanager-close', 'click', function() {
            dialog.dialog('destroy');  
layerElement.find('.mq-json-label.close').attr('title',$.i18n.prop('txt_hidegraphs'));            
            
        });
        layerElement.delegate('.mq-json-label.close', 'click', function() {
            dialog.dialog('close');
            $(this).removeClass('close').addClass('open').attr('title',$.i18n.prop('txt_graphs'));   
            return false;
        });
        layerElement.delegate('.mq-json-label.open', 'click', function() {
            dialog.dialog('open');
            $(this).removeClass('open').addClass('close').attr('title',$.i18n.prop('txt_hidegraphs'));   
            return false;
        });
       
    },
    _createPie: function(commodity,widget) {
		var layer = commodity.layer;
        var data =layer.info.results;
        var id = layer.id;
		
        $.each(data.group, function(index, value) {
            var r = Raphael(id+"-"+index, 450, 140);
             r.g.txtattr.font = "12px 'Fontin Sans', Fontin-Sans, sans-serif";
            var rvalue =[];
            var rlabel = [];
            var rurl = [];
             $.each(data.group[index].data, function(i,v){
                rlabel[i] = v.name + ' ('+v.values[0].value.toPrecision(3)+" "+v.values[0].unit+')';
                rvalue[i] = v.values[0].value;
               // rurl[i] = '#'+widget.zoomTo(data.group[index].title,v.name); 
            })
            var pie = r.g.piechart(60,70,50, rvalue, {legend:rlabel});
            pie.click(function() {
                var part = this.sector.paper.canvas.parentNode.id;
                part = part.split('-');
                
               widget._commodityClicked(layer,part[1],this.label[1].attrs.text.split('(')[0].slice(0,-1),true);
            });
            pie.hover(function () {
                this.sector.stop();
                this.sector.scale(1.1, 1.1, this.cx, this.cy);
                if (this.label) {
                        this.label[0].stop();
                        this.label[0].scale(1.5);
                        this.label[1].attr({"font-weight": 800});
                    }
                }, function () {
                this.sector.animate({scale: [1, 1, this.cx, this.cy]}, 500, "bounce");
                if (this.label) {
                        this.label[0].animate({scale: 1}, 500, "bounce");
                        this.label[1].attr({"font-weight": 400});
                    }
            });
			var svg = xmlToString(r.canvas);
      if(svg ==undefined) {
        if($("#dia-"+id).find('.ie-error').length==0) {
        $("#dia-"+id).append('<div class="ie-error">'+$.i18n.prop('txt_error')+': Internet Explorer cannot save graphs</div>')
        }
      }
      else {
			var b64 = Base64.encode(svg);
			$("#dia-"+id).append($("<a href-lang='image/svg+xml' target='_blank' href='data:image/svg+xml;base64,\n"+b64+"' title='"+this.code+".svg'>"+this.title+"</a><br/>"));
      }

        });   
		
    },
    _layerRemoved: function(widget, layer) {
        var control = $("#mq-layerjsonmanager-element-"+layer.id);
		var dialog = control.data('dialog');
		
        control.fadeOut(function() {
            $(this).remove();
        });
    },

    _layerPosition: function(widget, layer) {
        var layerNodes = widget.element.find('.mq-layerjsonmanager-element');
        var num = layerNodes.length-1;
        var tmpNodes = [];
        tmpNodes.length = layerNodes.length;
        layerNodes.each(function() {
            var layer = $(this).data('layer');
            var pos = num-layer.position();
            tmpNodes[pos]= this;
        });
        for (i=0;i<tmpNodes.length;i++) {
            layerNodes.parent().append(tmpNodes[i]);
        }
    },

    _layerVisible: function(widget, layer) {
        var layerElement =
        widget.element.find('#mq-layerjsonmanager-element-'+layer.id);
        
        var img = layerElement.find('.mq-layerjsonmanager-visible');
        
        
        /*if(img.hasClass('invisible')) {
            img.attr('src','css/images/layer-on.png');
        }
        else img.attr('src','css/images/layer-off.png')
        img.toggleClass('invisible');
        
        
        var checkbox =
        layerElement.find('.mq-layerjsonmanager-element-vischeckbox');
        checkbox[0].checked = layer.visible();*/
       
        if(layer.visible()) {
            img.attr('src','css/images/layer-on.png');
            img.removeClass('invisible');
        }
        else {
            img.attr('src','css/images/layer-off.png');
            img.addClass('invisible');
        }
        //update the opacity slider as well
        var slider = layerElement.find('.mq-layerjsonmanager-element-slider');
        var value = layer.visible()?layer.opacity()*100: 0;
        slider.slider('value',value);

        //update legend image
        layerElement.find('.mq-layerjsonmanager-element-legend img').css(
            {visibility:layer.visible()?'visible':'hidden'});
        
    },

    _layerOpacity: function(widget, layer) {
        var layerElement = widget.element.find(
            '#mq-layerjsonmanager-element-'+layer.id);
        var slider = layerElement.find(
            '.mq-layerjsonmanager-element-slider');
        slider.slider('value',layer.opacity()*100);
        //update legend image
        layerElement.find(
            '.mq-layerjsonmanager-element-legend img').css(
            {opacity:layer.opacity()});
    },

    _moveEnd: function (widget,lmElement,map) {
        //lmElement.empty();
        /*$.each(map.layers().reverse(), function(){
           widget._layerAdded(lmElement, this);
        });*/
    },

    //functions bind to the map events
    _onLayerAdd: function(evt, layer) {
        evt.data.widget._layerAdded(evt.data.control,layer);
    },
	_onGotInfo : function(evt, info, bla) {
		var self =evt.data.widget;
		var commodity = self.map.commoditiesList[info.id];
		var layerElement =
        self.element.find('#mq-layerjsonmanager-element-'+commodity.layer.id);
		commodity.layer.info = info;
		
		layerElement.find('.mq-layerjsonmanager-commodity-content').html('');
		
		var text = $.tmpl('mqLayerJsonManagerCommodityInfo',{
                
                group: info.results.group

                
            }).appendTo(layerElement[0]);
      
		 self._createPopup(commodity, layerElement );
		
		
			
	},
    _onLayerRemove: function(evt, id) {
        evt.data.widget._layerRemoved(evt.data.control,id);
    },

    _onLayerChange: function(evt, data, property) {
        var layer;
        //since we don't know which layer we get we've to loop through
        //the openlayers.layer.ids to find the correct one
        $.each(evt.data.map.layers(), function(){
           if(this.olLayer.id == data.olLayer.id) {layer=this;}
        });
        //(name, order, opacity, params, visibility or attribution)
         switch(property) {
            case 'opacity':
                evt.data.widget._layerOpacity(evt.data.widget,layer);
            break;
            case 'order':
                evt.data.widget._layerPosition(evt.data.widget,layer);
            break;
            case 'visibility':
                evt.data.widget._layerVisible(evt.data.widget,layer);
            break;
        }
    },
    _onMoveEnd: function(evt) {
        evt.data.widget._moveEnd(evt.data.widget,evt.data.control,evt.data.map);
    }
});
})(jQuery);
