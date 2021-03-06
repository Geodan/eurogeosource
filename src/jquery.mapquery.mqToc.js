/* Copyright (c) 2011 by MapQuery Contributors (see AUTHORS for
 * full list of contributors). Published under the MIT license.
 * See https://github.com/mapquery/mapquery/blob/master/LICENSE for the
 * full text of the license. */

(function($) {
$.template('mqToc',
    '<div class="mq-toc ui-widget-content ui-helper-clearfix ">'+
   '<ul><li id="Background" class="folder">Background Map</li>'+
    '<li id="spba" class="folder">Southern Permian Basin Atlas'+
    '<ul class="ul-closed">'+
		'<li id="spba1" class="folder">1- Introduction, stratigraphic framework and mapping</li>'+
		'<li id="spba2" class="folder">2 - Crustal structure and structural framework</li>'+
		'<li id="spba3" class="folder">3 - Tectonic evolution</li>'+
		'<li id="spba4" class="folder">4 - Pre-Devonian</li>'+
		'<li id="spba5" class="folder">5 - Devonian</li>'+
		'<li id="spba6" class="folder">6 - Carboniferous</li>'+
		'<li id="spba7" class="folder">7 - Rotliegend</li>'+
		'<li id="spba8" class="folder">8 - Zechstein</li>'+
		'<li id="spba9" class="folder">9 - Triassic</li>'+
		'<li id="spba10" class="folder">10 - Jurassic</li>'+
		'<li id="spba11" class="folder">11 - Cretaceous</li>'+
		'<li id="spba12" class="folder">12 - Cenozoic</li>'+
		'<li id="spba13" class="folder">13 - Petroleum generation and migration</li>'+
    '</ul></li>'+
    '<li id="european" class="folder">European data</li>'+
    '<li id="EGSservices" class="folder">EuroGeoSource services</li>'+
    '<li id="countries" class="folder">Country specific data'+
    '<ul class="ul-closed">'+
        '<li id="belgium" class="folder">Belgium'+
        '<ul class="ul-closed">'+
        	'<li id="belgium1" class="folder">Tertiary</li>'+
        	'<li id="belgium2" class="folder">Geology</li>'+
        '</ul></li>'+
        '<li id="denmark" class="folder">Denmark</li>'+
        '<li id="estland" class="folder">Estonia'+
        '<ul class="ul-closed">'+
        	'<li id="estland_aluskord" class="folder">Cristalline basement</li>'+
        	'<li id="estland_aluspohi" class="folder">Bedrock map</li>'+
        	'<li id="estland_pinnakaart" class="folder">Quaternary deposits</li>'+
        '</ul></li>'+
        '<li id="hungary" class="folder">Hungary'+
        '<ul class="ul-closed">'+
        	'<li id="hungary_pretercier" class="folder">Pretertiary</li>'+
        	'<li id="hungary_mfdt" class="folder">MFDT</li>'+
        	'<li id="hungary_atlasz200" class="folder">Atlasz200</li>'+
        '</ul></li>'+
//        '<li id="italy" class="folder">Italy</li>'+
        '<li id="netherlands" class="folder">Netherlands'+
        '<ul class="ul-closed">'+
        	'<li id="netherlands_ado" class="folder">Atlas subsurface</li>'+
        	'<li id="netherlands_dgm" class="folder">DGM</li>'+
        	'<li id="netherlands_geotop" class="folder">GeoTop</li>'+
        	'<li id="netherlands_og" class="folder">Oil&Gas</li>'+
        '</ul></li>'+
        '<li id="norway" class="folder">Norway'+
        '<ul class="ul-closed">'+
        	'<li id="norway_facility" class="folder">Facilities</li>'+
        	'<li id="norway_geology" class="folder">Geology</li>'+
        	'<li id="norway_sa" class="folder">Seismic Aq</li>'+
        	'<li id="norway_wellbores" class="folder">Wellbores</li>'+
        '</ul></li>'+
        '<li id="poland" class="folder">Poland</li>'+
        '<li id="portugal" class="folder">Portugal</li>'+
        '<li id="slovenia" class="folder">Slovenia</li>'+
		'<li id="spain" class="folder">Spain'+
		'<ul class="ul-closed">'+
			'<li id="spain_geol_1m" class="folder">Geology 1m</li>'+
			'<li id="spain_geol_200" class="folder">Geology 200 000</li>'+
			'<li id="spain_magna_50" class="folder">Magna 50 000</li>'+
		'</ul></li>'+
    '</ul></li></ul>'+
    '</div>'); 

$.widget("mapQuery.mqToc", {
    options: {
        // The MapQuery instance
        map: undefined,
        layerDefs: undefined,
		title: "table of contents"
        

    },
    _create: function() {
        var map;
		var self = this;
		var element = this.element;
		
		map = $(this.options.map).data('mapQuery');
		this.map = map;
		this.element.addClass('ui-widget  ui-helper-clearfix ');
		var TOCElement = $.tmpl('mqToc').appendTo(element);			
		TOCElement.data('self',self);
		$.each($("li", TOCElement), function (index, liElement) {
				if (liElement.childNodes[0] && liElement.childNodes[0].nodeType == 3 /* node_text */) {
					$(liElement.childNodes[0]).wrap("<span class='folder'></span>");
				}
			}
		);
		$("li:not(:has(ul))", TOCElement).append ('<ul class="ul-closed"></ul>');
		$.each(this.options.layerDefs, function (index, layermetadata) {	
				$layerlink = $('<span class="layer-selector" id="layer'+ index + '">' + layermetadata.title + '</span>');
				if (!layermetadata.groupselector) layermetadata.groupselector = "";
				// store layer metadata with catalogue tree item
				$layerlink.data("layermetadata", layermetadata);
				if ((layermetadata.groupselector != "")) {
					// check if there are list elements in this element identified by the groupselector
					$listelements = $(layermetadata.groupselector + " ul", TOCElement);
					if ($listelements.length)
					{
						$listelements.append($('<li class="li-layer"></li>').append($layerlink));
					} else {
						// groupselector not found, append to root of list
						$("ul:first", TOCElement).append($('<li class="li-layer"></li>').append($layerlink));
					}
				}
				
				else {
					// otherwise append to root of list
					$("ul:first", TOCElement).append($('<li class="folder"></li>').append($layerlink));
					
				}
				
			}
		);
		
		// mark currently active baselayer
		$("ul span.layer-selector", TOCElement).filter(
			function(index) {return $(this).data("layermetadata").title == 'OpenStreetMap'})
				.parent(".li-layer").addClass("layer-on").removeClass("layer-off");
				
		// read currently loaded layers from map and synchronize catalogue state
		// also fill the layermetadata
		$.each(map.layers(), function (index, layer) {
				var layerfound = false;
				$.each($("span.layer-selector", TOCElement), function (index, layerlink) {
						var $layerlink = $(layerlink);
						var layermetadata = $layerlink.data("layermetadata");
						if (layermetadata.title == layer.label)
						{
							layermetadata.openlayersid = layer;
							layerfound = true;
							// store layer metadata with layer
							layer.layermetadata = layermetadata;
						}
					}
				)
				if (!layerfound)
				{
					// layermetadata not available, generate it
					var layermetadata = { title: layer.name, type: layer.isBaseLayer ? 'baselayer' : 'overlay', openlayersid: layer.id };
					// store layer metadata with layer
					layer.layermetadata = layermetadata;
					// layer exists in map, but not yet in list, so append to root of catalogue tree
					$layerlink = $('<span class="layer-selector" id="layer'+ index + '">' + layer.name + '</span>');
					$layerlink.data("layermetadata", layermetadata);
					$("ul:first", TOCElement).append($('<li></li>').append($layerlink));
				}
			}
		);
		$("li.li-layer", TOCElement).click(function(e) { self._toggleLayer($(this).children("span.layer-selector").data("layermetadata"), map, e); 
    if($(this).hasClass('layer-on')) {
    $(this).children("span.layer-selector").attr('title',$.i18n.prop('txt_remove'));
    }
    else {
    $(this).children("span.layer-selector").attr('title',$.i18n.prop('txt_addlayer'))
    }
    });
		
		element.delegate('li.folder', 'click', function(event){
			var element = $(this).parents('.mq-toc');
			var self = element.data('self');
			self._toggleList(this,event); 
			return false;
		});
		
		 
		 map.bind("removelayer",
            {widget:self,control:TOCElement},
            function(e,layer) {
				// layer is being removed from map, so display addlayer icon in front of catalogue tree item
				var $layerselector = $('#toc').find("span.layer-selector");
				
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
	_toggleList: function (clickedElement,event) {
		event.stopPropagation();
		var $Btn = $(clickedElement);
		var $List = $(clickedElement).children("ul");
		if ($List.is(":visible")) {
			$List
				.css("width", $List.innerWidth())
				.slideUp('fast', function() {$(clickedElement).css("width","auto");})
			;
			$Btn.removeClass('open');
								  
		}
		else {
			this._GetListItemsForList ($List); // first check if new items should be added
			$List.slideDown('fast');
			$Btn.addClass('open');
		}
		
	},
	_GetListItemsForList: function ($List) {
		// $(List) points to <ul> element(s)
		// The <ul> may contain <li> elements that should be expanded to multiple <li> elements by a getcapabilities request to WMS provider
		$.each($List, function (index, ul) {
			$.each($(ul).find(">li>span.layer-selector"), function (index, li) {
				var layermetadata = $(li).data("layermetadata");
				if (layermetadata && (layermetadata.type == "getcapabilities"))
				{	
					// this li element should be replaced by li elements from getcapabilites
					$(li).html('<img src="css/images/spinner.gif" />');
					url = layermetadata.url;
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
							var element = $('#toc').children('.mq-toc');
							var self = element.data('self');
							getmapurl = $(data).find("Capability Request GetMap Get OnlineResource").attr("xlink:href") ||
								$(data).find("Capability Request GetMap Get OnlineResource").attr("href"); // Opera
							getfeatureinfourl = $(data).find("Capability Request GetFeatureInfo Get OnlineResource").attr("xlink:href") ||
								$(data).find("Capability Request GetFeatureInfo Get OnlineResource").attr("href"); // Opera
							getstylesurl = $(data).find("Capability Request GetStyles Get OnlineResource").attr("xlink:href") ||
								$(data).find("Capability Request GetStyles Get OnlineResource").attr("href"); // Opera
							layertree = self._getLayers(data, "Capability > Layer");
							var layers = self._LayerTreeToArray (layertree);
							var firstLayer = true;
							$.each(layers, function (index, layer) {
								if (layer.name != "") 
								{
                   
									var newlayermetadata = {
										title: layer.title,
										type: "wms",
										url: getmapurl,
										layers: layer.name,
										format: "image/png",
										legendurl: null,            
										layeroptions: layermetadata.layeroptions,
										getfeatureinfourl: (layer.name=="onegeology")?null:getfeatureinfourl,
										querylayers: layer.name
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
						},
						error: function (xhr, statusstring, ex) {
							$(li).text($.i18n.prop('txt_layerfailed'));
						}
					});				
				}
				else if (layermetadata && (layermetadata.type == "tmscapabilities"))
				{	
					// this li element should be replaced by li elements from getcapabilites
					$(li).html('<img src="css/images/spinner.gif" />');
					url = layermetadata.url;
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
							var element = $('#toc').children('.mq-toc');
							var self = element.data('self');
							
							layertree = self._getTMS(data, "TileMaps > TileMap");
							
							var firstLayer = true;
							$.each(layertree, function (index, layer) {
								if (layer.name != "") 
								{	
									var newlayermetadata = {};
									if(layer.name.indexOf(':') >= 0) {
											newlayermetadata = {
											title: layer.title.split(':')[1],
											name: layer.title.split(':')[1],
											group: layer.title.split(':')[0],
											type: "tms",
											path: layer.url.substring(0,layer.url.indexOf('1.0.0')),
											layer: layer.url.substring(layer.url.indexOf('1.0.0')+6),
											format: "image/png",
											url:  layer.url
											}
									}
									else {
											newlayermetadata = {
											title: layer.title,
											name: layer.title,
											type: "tms",
											path: layer.url.substring(0,layer.url.indexOf('1.0.0')),
											layer: layer.url.substring(layer.url.indexOf('1.0.0')+6),
											format: "image/png",
											url:  layer.url										
										};		
									}									
									if (firstLayer)
									{
										$(li).text(layer.title);
										$(li).data("layermetadata", newlayermetadata).attr('title',$.i18n.prop('txt_addlayer'));
										firstLayer = false;
									} else {
										$newelement = $(li).parent().clone(true);
										$newelement.find("span").text(layer.title).data("layermetadata", newlayermetadata).attr('title',$.i18n.prop('txt_addlayer'));
										$newelement.appendTo($(li).parent().parent());
									}
								}
							});
						},
						error: function (xhr, statusstring, ex) {
							$(li).text($.i18n.prop('txt_layerfailed'));
						}
					});				
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
	_getTMS: function(data, FilterString) {
		var result = new Array();
		$(data).find(FilterString).each (function (index, layer) {
		var element = $('#toc').children('.mq-toc');
		var self = element.data('self');
			var layerinfo = {
				name: $(layer).attr('title'),
				title:$(layer).attr('title'),
				url: $(layer).attr('href')
			};
			result.push(layerinfo);
		});
		return result;
	}, // _getTMS
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
		if(layermetadata.url=="http://localhost:8080/services?") layermetadata.url = "http://maps.eurogeosource.eu/services?"
		if(layermetadata.legendurl && layermetadata.legendurl.substring(0,22) == "http://localhost:8080/") layermetadata.legendurl = "http://maps.eurogeosource.eu" +layermetadata.legendurl.substring(21);
		if(layermetadata.getfeatureinfourl && layermetadata.getfeatureinfourl.substring(0,22) == "http://localhost:8080/") layermetadata.getfeatureinfourl = "http://maps.eurogeosource.eu" +layermetadata.getfeatureinfourl.substring(21);
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
					layer = [{type:'wms',url:layermetadata.url,layers:layermetadata.layers,label:layermetadata.title,format:layermetadata.format,transparent: true,wms_parameters:{singleTile: true,version:wmsversion}}];
					if(layermetadata.legendurl && layermetadata.legendurl.length > 0) layer[0].legend = {url:layermetadata.legendurl};
					/*layer = new OpenLayers.Layer.WMS(layermetadata.title, layermetadata.url, {
						layers: layermetadata.layers,
						transparent: true,
						format: layermetadata.format
					}, layermetadata.layeroptions);*/
					break;
				case "tms":
					layer = [{type:'tms',url:layermetadata.path,layer:layermetadata.layer,label:layermetadata.title}]
					break;
				case "natura":
					layermetadata.getfeatureinfourl = 'http://discomap.eea.europa.eu/ArcGIS/services/Bio/Natura2000_Dyna_WM/MapServer/WMSServer?';
					layermetadata.querylayers = '1';
					layer = [{label: 'Natura 2000',type:'wms',url: 'http://discomap.eea.europa.eu/ArcGIS/services/Bio/Natura2000_Dyna_WM/MapServer/WMSServer?',layers:'1,2,3,4,5,6,7,8',sphericalmercatoralias:'EPSG:3857',legend:{lnk:'http://discomap.eea.europa.eu/ArcGIS/rest/services/Bio/Natura2000_Dyna_WM/MapServer/legend'}}]				
					break;
				case "corine":
				layermetadata.getfeatureinfourl = 'http://discomap.eea.europa.eu/ArcGIS/services/Land/CLC2006_Dyna_WM/MapServer/WMSServer?';
				layermetadata.querylayers = '1';
					layer = [{label: 'Corine Landcover',type:'wms',url: 'http://discomap.eea.europa.eu/ArcGIS/services/Land/CLC2006_Dyna_WM/MapServer/WMSServer?',sphericalmercatoralias:'EPSG:3857',layers:'1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20',legend:{lnk:' http://discomap.eea.europa.eu/ArcGIS/rest/services/Land/CLC2006_Dyna_WM/MapServer/legend'}}]
					break;
					case "osm":
					layer = [{type: 'osm', label: 'OpenStreetMap', legend:{url:'http://www.openstreetmap.org/assets/osm_logo.png'}}]
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
				var $layerselector = $('#toc').find("span.layer-selector");
				
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