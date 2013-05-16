// MapQueryUIFeatureInfo
//
//

(function($) {
$.template('mqGetFeatureInfo',
    '<div class="mq-getfeatureinfo ui-widget ui-helper-clearfix ">'+
	'</div>');

$.widget("mapQuery.mqGetFeatureInfo", {
    options: {
        // The MapQuery instance
        map: undefined
	},
    _create: function() {
        var map;
        var self = this;
        var element = this.element;   
		 //get the mapquery object
        map = $(this.options.map).data('mapQuery');

        var layers = $.map(map.layers(), function(layer) {
            return layer.isVector ? null : layer;
        });+
	
		element.html($.tmpl('mqGetFeatureInfo', {
           
        }));
		$(element).bind("contextmenu", function(e) {
			return false;
		});
		var $featureDialog = $(element).dialog ({autoOpen:false,title: $.i18n.prop('txt_mapinfo'),maxHeight:700});
		map.olMap.viewPortDiv.oncontextmenu = OpenLayers.Function.False;
		map.olMap.events.register('mousedown', map.olMap,
                       function(e){
if (!e) e = window.event;
			if (e) // undefined in IE8
			{
				if (e.ctrlKey)
				// return standard context menu
				return true;
			}
			$featureDialog.html('').dialog('open');
			var map =map = $('#map').data('mapQuery');
			var layers = map.layers();
		 $.each(layers, function() {
			
			
            var layer = this;
			if (layer.visible()) {
				if (layer.layermetadata && layer.layermetadata.getfeatureinfourl && layer.layermetadata.querylayers)
				{
					var html = '<hr /><table><thead><tr><th colspan="2" class="mq-featureinfo-header">' + layer.options.label + '</th></tr></thead><tbody id="gi'+layer.id.replace(/\./g, "_")+'"><tr><td colspan="2" class="mq-featureinfo-result"><img src="css/images/spinner.gif" />'+$.i18n.prop('txt_recieving')+'....</td></tr></tbody></table>';
						$featureDialog.append(html);
						// TODO: version should be same as layer version
						var projection = layer.options.sphericalmercatoralias ? layer.options.sphericalmercatoralias : map.projection;
            var override = 'overridemimetype=text/html&';
            var infoformat ='text/html';
            if(layer.label  =="Natura 2000" || layer.label =="Corine Landcover") {override =''; infoformat='text/xml';}
						var url =  '/cgi-bin/proxy.cgi?'+override+'url=' + escape(layer.layermetadata.getfeatureinfourl +
							"&SERVICE=wms&VERSION=1.1.1"+
							"&REQUEST=GetFeatureInfo" +
							"&EXCEPTIONS=" + infoformat+
							"&SRS=" +  projection + 
							"&BBOX="+ map.olMap.getExtent().toBBOX()+
							"&X="+ e.xy.x +
							"&Y="+ e.xy.y+
							"&INFO_FORMAT=text/html"+//+infoformat+//text/html"+
							"&QUERY_LAYERS="+ layer.layermetadata.querylayers +
							"&LAYERS=" + layer.layermetadata.querylayers +
							"&WIDTH=" + map.olMap.size.w +
							"&HEIGHT=" + map.olMap.size.h);
						$.ajax ( {
							url: url,
							type: 'GET',
							//dataType: 'xml', 
							timeout: 5000,
							success: function (data, status, xhr) {
                var xdata;
                try {
                  xdata = $.parseXML(data);
                } catch(e){
                } finally{
                }
                if($(xdata).find('table>tbody>tr').length > 0||$(xdata).find('table>tr').length>0||$(xdata).find('parsererror').length > 0) {
                  $featureDialog.find("tbody#gi" + layer.id.replace(/\./g, "_")).html('<iframe src="'+url+'"></iframe>');
                  }
                else {
                  var htmldata = '<tr><td colspan="2" class="mq-featureinfo-result">'+ $.i18n.prop('txt_noresult')+ "</td></tr>";
                  $featureDialog.find("tbody#gi" + layer.id.replace(/\./g, "_")).html(htmldata); //security: is htmldata eval()-ed by javascript?
                }
							},
							error: function (xhr, statusstring, ex) {								
								var htmldata = '<tr><td colspan="2" class="mq-featureinfo-result">'+ $.i18n.prop('txt_error') + ':' + statusstring +  "</td></tr>";
								$featureDialog.find("tbody#gi" + layer.id.replace(/\./g, "_")).html(htmldata); //security: is htmldata eval()-ed by javascript?
								//status: statusstring + ", " + ex.name + ": " + ex.message});
							}
              
              
						});	
            
				}
				 else {
						$featureDialog.append('<hr class="mq-featureinfo-line" /><table><thead><tr><th colspan="2" class="mq-featureinfo-header">' + layer.options.label + '</th></tr></thead><tbody><tr><td colspan="2" class="mq-featureinfo-result">'+$.i18n.prop('txt_noinfo')+'</td></tr></tbody></table>');
					}
			}            
        });
        
		});
        this.element.addClass('ui-dialog ui-widget ui-widget-content ' +
                              'ui-corner-all blA');
                              
	}
	
	});

})(jQuery);
