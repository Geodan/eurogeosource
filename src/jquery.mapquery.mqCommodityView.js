/* Copyright (c) 2011 by MapQuery Contributors (see AUTHORS for
 * full list of contributors). Published under the MIT license.
 * See https://github.com/mapquery/mapquery/blob/master/LICENSE for the
 * full text of the license. */

(function($) {
$.template('mqCommodityView',
    '<div class="ui-dialog-content ui-widget-content" >'+
     '{{each(i, foo) group}}'+
      '<div id="${id}-${i}"></div>'+
     '{{/each}}'+    
    '</div>');

$.template('mqCommodityViewLink',
    '<div class="mq-commodityview-button ui-state-default ui-corner-all">'+
    '<div class="mq-commodityview-close ui-icon ui-icon-arrowthick-1-se "></div>'+
    '</div>'+
    '<div id="${id}" class="mq-commodityview ui-widget ">'+
    '</div>');
        
        
$.widget("mapQuery.mqCommodityView", {
    options: {
        // The MapQuery instance
        map: undefined

        // The number of decimals for the coordinates
        // default: 2
  

    },
    _create: function() {
        var map;
        var self = this;
        var element = this.element;
        var mousepos;

        //get the mapquery object
        map = $(this.options.map).data('mapQuery');

      /*  map.bind("mqAddCommodity",
            {widget:self,map:map},
            self._onCommodityAdd);
       */
        this.element.addClass(' ui-widget ui-helper-clearfix ui-dialog ' +
                                 'ui-corner-all');
                                 
         
    },
    _destroy: function() {
        this.element.removeClass(' ui-widget ui-helper-clearfix ui-dialog ' +
                                 'ui-corner-all')
            .empty();
    },
    
    _commodityAdded: function(widget, commodity) {
       /* var id = 'com-dialog-'+commodity.id;
        
        $.tmpl('mqCommodityViewLink',{
            id: id}).appendTo(widget.element);
        
        var html = $.tmpl('mqCommodityView',{
            id: commodity.id,
            group: commodity.options.group
        });
        var dialog =  $('#'+id)
            .html(html)
            .dialog({ title: commodity.options.name});
        
        this._createPie(commodity.options,commodity.id,widget);*/
        this._createGeometry(commodity.options,commodity.id);
    },
    
    _createPie: function(data,id,widget) {
        $.each(data.group, function(index, value) {
            var r = Raphael(id+"-"+index, 280, 140);
             r.g.txtattr.font = "12px 'Fontin Sans', Fontin-Sans, sans-serif";
            var rvalue =[];
            var rlabel = [];
            var rurl = [];
            $.each(data.group[index].data, function(i,v){
                rlabel[i] = v.name;
                rvalue[i] = v.values[0].value;
               // rurl[i] = '#'+widget.zoomTo(data.group[index].title,v.name); 
            })
            var pie = r.g.piechart(60,70,50, rvalue, {legend:rlabel});
            pie.click(function() {
               widget.zoomTo(this.sector.paper.canvas.parentNode.id,this.label[1].attrs.text);
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
        });   
    },
    zoomTo: function(group, name) {
        group = group.split('-');
        var id = group[0];
        var groupid = group[1];
        alert('group='+group+' name='+name);
        
    },
    _createGeometry: function(data,id) {
        var url;
        
            url = /*'/cgi-bin/proxy.cgi?url='+ encodeURIComponent(*/'/zoek?Service=WPS&Request=Execute&Version=1.0.0&RawDataOutput=Output&Identifier=GetGeometryForResource&DataInputs=language='+$.i18n.prop('txt_language')+';resource='+data.code+';';
           // url = '/2012/services.json';
            var layer = {
                type: 'JSON',
                url: url,
                projection: 'EPSG:4326',
                xy: false,
                //url: 'http://localhost:5984/ethiopia_reservate/_design/geo/_list/geojson/all?type=geojson',
                label: data.name,
                data: data,
                dataurl: url
            };
            var map = this.options.map;
            $(map).data('mapQuery').layers(layer);
        
    },
    _onCommodityAdd: function(evt, commodity) {
        evt.data.widget._commodityAdded(evt.data.widget,commodity);
    }
});
})(jQuery);
