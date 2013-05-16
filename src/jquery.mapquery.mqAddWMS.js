/* Copyright (c) 2011 by MapQuery Contributors (see AUTHORS for
 * full list of contributors). Published under the MIT license.
 * See https://github.com/mapquery/mapquery/blob/master/LICENSE for the
 * full text of the license. */

(function($) {
$.template('mqAw',
    '<div class="mq-aw ui-widget-content ui-helper-clearfix ">'+
	'<input id="wms-search" class="searchstring replaceinfo" value="${value}" title="${value}" size="22"/><button id="searchwms" title="${value}">add WMS</button>'+
	//'<input id="wms-search" value="http://maps.eurogeosource.eu/geoserver/ows?service=wms&version=1.1.1&request=GetCapabilities" title="${value}"/><button id="searchwms" title="${value}">add WMS</button>'+
	'<ul><li id="wms-results"class="folder"></ul>'+
    '</div>'); 

$.widget("mapQuery.mqAddWMS", {
    options: {
        // The MapQuery instance
        map: undefined,
       
		title: "table of contents"
        

    },
    _create: function() {
        var map;
		var self = this;
		var element = this.element;
		
		map = $(this.options.map).data('mapQuery');
		this.map = map;
		this.element.addClass('ui-widget  ui-helper-clearfix ');
		var AWElement = $.tmpl('mqAw',{value:$.i18n.prop('txt_addwms')}).appendTo(element);			
		AWElement.data('self',self);
		$("li:not(:has(ul))", AWElement).append ('<ul class="ul-closed"></ul>');
		$("#searchwms", AWElement).click(function(e) { self._GetListItemsForList($('#wms-search').val(), map, e);}); 
		
		element.delegate('.searchstring', 'focus', function() {
            if(this.value==$.i18n.prop('txt_addwms')) {
              this.value = "";
              $(this).removeClass('replaceinfo');
           }
        });
        element.delegate('.searchstring', 'blur', function() {
            if(this.value==$.i18n.prop('txt_addwms')||this.value=="") {
              this.value = $.i18n.prop('txt_addwms');
              $(this).addClass('replaceinfo');
           }
        });
		AWElement.delegate('li.li-layer', 'click', function(e) {	
		self._toggleLayer($(this).children("span.layer-selector").data("layermetadata"), map, e);
		if($(this).hasClass('layer-on')) {
			$(this).children("span.layer-selector").attr('title',$.i18n.prop('txt_remove'));
			}
			else {
			$(this).children("span.layer-selector").attr('title',$.i18n.prop('txt_addlayer'))
			}
		});
		 map.bind("removelayer",
            {widget:self,control:AWElement},
            function(e,layer) {
				// layer is being removed from map, so display addlayer icon in front of catalogue tree item
				var $layerselector = $('#aw').find("span.layer-selector");
				
				var $layerset = $layerselector.filter(function (index) {
					var layermetadata = $(this).data("layermetadata"); 
					if (!layermetadata) return false; 
					if (!layermetadata.openlayersid) return false; 
					return layermetadata.openlayersid.id == layer.id;});
				if ($layerset.length > 0) {
					$layerset.parent(".li-layer").addClass("layer-off").removeClass("layer-on").removeClass("loading").attr('title', $.i18n.prop('txt_addlayer'))
						// remove stored openlayers id of currently removed layer from catalogue tree item
						.children("span.layer-selector").data("layermetadata").openlayersid=null;;
				}
				
			});
		
	
    },
	
	_GetListItemsForList: function (url) {
		//todo: check url
		var layermetadata = {};
		layermetadata.url = url;

		// this li element should be replaced by li elements from getcapabilites
		$('#wms-results').empty().append('<span class="layer-selector extwms" ">'+$.i18n.prop('txt_result')+':</span><ul class="ul-open"><li class="li-layer"><span class="layer-selector">WMS services</span></li></ul>');
		var ul = $('#wms-results').find('ul.ul-open');
		
		
		
		
		$.each($(ul).find(">li>span.layer-selector"), function (index, li) {
		$(li).html('<img src="css/images/spinner.gif" />');
		if (url.substring(0,7).toLowerCase() == "http://")
		{
			// todo: take proxy from option, parameter or variable
			url = "/cgi-bin/proxy.cgi?url=" + escape(url);
		}
		$.ajax ( {
			url: url,
			type: 'GET',
			dataType: 'xml', 
			timeout: 5000,
			success: function (data) {
				var element = $('#aw').children('.mq-aw');
				var self = element.data('self');
				getmapurl = $(data).find("Capability Request GetMap Get OnlineResource").attr("xlink:href") ||
					$(data).find("Capability Request GetMap Get OnlineResource").attr("href"); // Opera
				getfeatureinfourl = $(data).find("Capability Request GetFeatureInfo Get OnlineResource").attr("xlink:href") ||
					$(data).find("Capability Request GetFeatureInfo Get OnlineResource").attr("href"); // Opera
				getstylesurl = $(data).find("Capability Request GetStyles Get OnlineResource").attr("xlink:href") ||
					$(data).find("Capability Request GetStyles Get OnlineResource").attr("href"); // Opera
				layertree = self._getLayers(data, "Capability > Layer");
				layers = self._LayerTreeToArray (layertree);
				var firstLayer = true;
				var version = '1.1.0';
				var srs;
				if($(data).find('WMS_Capabilities').attr('version') == '1.3.0') {
				version = '1.3.0';
				if($.inArray('EPSG:900913',layertree[0].crs)!=-1) {
					srs = 'EPSG:900913';
				}
				else if ($.inArray('EPSG:3857',layertree[0].crs)!=-1) {
					srs = 'EPSG:3857';
				}
				else  {
					$(li).text( $.i18n.prop('txt_error') +': projection is not supported').parent().removeClass('li-layer');
					return false;
				}
				}
				else {
				if($.inArray('EPSG:900913',layertree[0].srs)!=-1) {
					srs = 'EPSG:900913';
				}
				else if ($.inArray('EPSG:3857',layertree[0].srs)!=-1) {
					srs = 'EPSG:3857';
				}
				else  {
					$(li).text( $.i18n.prop('txt_error') +': projection is not supported').parent().removeClass('li-layer');
					return false;
				}
				}
				if(layers.length == 0) {
					$(li).text( $.i18n.prop('txt_error') +': no layers found').parent().removeClass('li-layer');
				}
				else {
					$.each(layers, function (index, layer) {
						if (layer.name != "") 
							{
								var newlayermetadata = {
									title: layer.title,
									type: "wms",
									url: getmapurl,
									layers: layer.name,
									format: "image/png",
									srs: srs,
									legendurl: null,
									layeroptions: layermetadata.layeroptions,
									getfeatureinfourl: getfeatureinfourl,
									querylayers: layer.name,
									version: version
								};
								if (layer.styles.length > 0 && layer.styles[0].legendurl != null)
								{
									newlayermetadata.legendurl = layer.styles[0].legendurl;
								}
								if (firstLayer)
								{
									$(li).text(layer.title).attr('title',$.i18n.prop('txt_addlayer'));
									$(li).data("layermetadata", newlayermetadata);
									firstLayer = false;
								} else {
									$newelement = $(li).parent().clone(true);
									$newelement.find("span").text(layer.title).data("layermetadata", newlayermetadata).attr('title',$.i18n.prop('txt_addlayer'));
									$newelement.appendTo($(li).parent().parent());
								}
							}
					});
				}
			},
			error: function (xhr, statusstring, ex) {
				$(li).text(statusstring+': '+ex).parent().removeClass('li-layer');
			}
		});		
		
		
});		
				
	},
	_getLayers: function(data, FilterString) {
		var result = new Array();
		$(data).find(FilterString).each (function (index, layer) {
		var element = $('#toc').children('.mq-toc');
		var self = element.data('self');
			var layerinfo = {
				name: $(layer).find(">Name").text(),
				title: $(layer).find(">Title").text(),
				'abstract': $(layer).find(">Abstract").text(),
				styles: function () { // get array of layer styles
						var styleArray = new Array();
						$(layer).find(">Style").each (function(index, style) {
							styleArray.push ({ 
								name: $(style).find("Name").text(), 
								title: $(style).find("Title").text(),
								legendurl: $(style).find("LegendURL>OnlineResource").attr("xlink:href") || 
									$(style).find("LegendURL>OnlineResource").attr("href") // Opera
							});
						});
						return styleArray;
					} (),
				scalehintmin: $(layer).find(">ScaleHint").attr("min"),
				scalehintmax: $(layer).find(">ScaleHint").attr("max"),
				srs: self._buildTextArray(layer, ">SRS"),
				crs: self._buildTextArray(layer, ">CRS"),
				bbox: function () {
						$llbbox = $(layer).find(">LatLonBoundingBox");
						if ($llbbox.length == 0)
							return null;
						return {
							minx: $llbbox.attr("minx"),
							miny: $llbbox.attr("miny"),
							maxx: $llbbox.attr("maxx"),
							maxy: $llbbox.attr("maxy")
						}
					} (),
				srsboxes: function () {
						var srsresult = new Array();
						$srsbboxes = $(layer).find(">BoundingBox");
						$srsbboxes.each (function (index, bbox) {
							srsresult.push ({
								srs: $(bbox).attr("SRS"), 
								minx: $(bbox).attr("minx"),
								miny: $(bbox).attr("miny"),
								maxx: $(bbox).attr("maxx"),
								maxy: $(bbox).attr("maxy")
							});
						});
						return srsresult;
					} (),
				layers: self._getLayers(layer, ">Layer") // recurse into sublayers
			};
			result.push(layerinfo);
		});
		return result;
	}, // _getLayers
	
	_buildTextArray: function (xmldoc, selector)
	{
		var result = new Array();
		$(xmldoc).find(selector).each (function (index, element) {
			result.push($(element).text());
		});
		return result;
	},
	_LayerTreeToArray:  function (LayerTree)
	{
		var result = new Array();
		$.each (LayerTree, function (index, layer)
		{
			result.push (layer);
			$.each(layer.layers, function (index, layer)
			{
				result.push (layer);
				$.each (layer.layers, function (index, layer)
				{
					result.push(layer);
				});
			});
		});
		return result;
	}, // _LayerTreeToArray
	_toggleLayer: function(layermetadata, map, event)  
	{
		event.stopPropagation(); // should this be here?
		var layer = null;
		if (layermetadata.openlayersid)
		{
			// this is an existing OpenLayers layer
			layer = layermetadata.openlayersid;
			
				// remove layer
				if (layer)
					layer.remove();
				// layer no longer exists as OpenLayers layer
				layermetadata.openlayersid = null;
				
				return;
			
		}
		// create layer if not available
		if (!layer) 
		{
			switch (layermetadata.type)
			{
				case "wms":
					var wmsversion= '1.1.0';
					if(layermetadata.layeroptions && layermetadata.layeroptions.version != null) wmsversion = layermetadata.layeroptions.version;
					layer = [{type:'wms',url:layermetadata.url,layers:layermetadata.layers,sphericalmercatoralias:layermetadata.srs,label:layermetadata.title,format:layermetadata.format,transparent: true,wms_parameters:{singleTile: true,version:wmsversion}}];
					if(layermetadata.legendurl && layermetadata.legendurl.length > 0) layer[0].legend = {url:layermetadata.legendurl};
					break;
				default:
					alert ("AddLayer: type '" + layermetadata.type + "' unknown");
			}
		}
		if (layer) {
			
			layer.layermetadata = layermetadata;
			var newLayer = map.layers(layer);
			newLayer[0].layermetadata = layermetadata;
			layermetadata.openlayersid = newLayer[0];
			

				// layer is being removed from map, so display addlayer icon in front of catalogue tree item
				var $layerselector = $('#aw').find("span.layer-selector");
				
				var $layerset = $layerselector.filter(function (index) {
					var layermetadata = $(this).data("layermetadata"); 
					if (!layermetadata) return false; 
					if (!layermetadata.openlayersid) return false; 
					return layermetadata.openlayersid.id ==  newLayer[0].id;});
				if ($layerset.length > 0) {
					$layerset.parent(".li-layer").addClass("layer-on").removeClass("layer-off").removeClass("loading")
						// remove stored openlayers id of currently removed layer from catalogue tree item
						.children("span.layer-selector").data("layermetadata");
				}
				
			
		}
	} // _toggleLayer
});
})(jQuery);