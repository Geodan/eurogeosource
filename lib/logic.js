function xmlToString(xmlData) { 

    var xmlString;
    //IE
    if (window.ActiveXObject){
        xmlString = xmlData.xml;
    }
    // code for Mozilla, Firefox, Opera, etc.
    else{
        xmlString = (new XMLSerializer()).serializeToString(xmlData);
    }
    return xmlString;
}  
/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
 
var Base64 = {
 
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = Base64._utf8_encode(input);
 
		while (i < input.length) {
 
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
 
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
		}
 
		return output;
	},
 
	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
		while (i < input.length) {
 
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
 
		}
 
		output = Base64._utf8_decode(output);
 
		return output;
 
	},
 
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
 
}
	var _replaceURLWithHTMLLinks = function(text) {
		// adds a reference anchor (a href) to plain URL's in a text string
    if(text==null) return ''
		var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
		return text.replace(exp,"<a href='$1' target=\"_blank\">$1</a>"); 
	}
$(document).ready(function () {
 $('#toc').delegate('#belgium li.li-layer', 'mouseup', function() {
            if(!$(this).hasClass('layer-on')) {
				mq.center({box:[2.546944,51.505444,6.403861,49.49361]});
			}
        });
	/*	$('#toc').delegate('#denmark li.li-layer', 'mouseup', function() {
            if(!$(this).hasClass('layer-on')) {
				mq.center({box:[8.075611,57.748417,15.158834,54.562389]});
			}
        });*/
		$('#toc').delegate('#european li.li-layer', 'mouseup', function() {
            if($(this).children('span').html() == "One Geology" && !$(this).hasClass('layer-on')) {
				if($.cookie('og_alert') == undefined) {
					if($('#yescookies').attr('checked')=='checked') {
						$.cookie('og_alert',true, {expire: 7})
					}
					$('#ogpopup').dialog({
					title: 'One Geology map',
					buttons: {
						Ok: function() {
						  $( this ).dialog( "close" );
						}
					  }});
					
				}
			}
        });
    $('#toc').delegate('#spba', 'mouseup', function() {
          if(!$(this).hasClass('open')) {
            if($.cookie('spba_alert') == undefined) {
					if($('#spbacheck').attr('checked')=='checked') {
						$.cookie('spba_alert',true, {expire: 7})
					}
					$('#spbapopup').dialog({
					title: 'Southern Permian Basin Atlas',
					buttons: {
						Ok: function() {
						  $( this ).dialog( "close" );
						}
					  }});
					
				}
          }
        });
         $('#toc').delegate('#norway', 'mouseup', function() {
          if(!$(this).hasClass('open')) {
            if($.cookie('norway_alert') == undefined) {
					if($('#norwaycheck').attr('checked')=='checked') {
						$.cookie('norway_alert',true, {expire: 7})
					}
					$('#norwaypopup').dialog({
					title: 'Norwegian Petroleum Directorate',
					buttons: {
						Ok: function() {
						  $( this ).dialog( "close" );
						}
					  }});
					
				}
          }
        });
		$('#toc').delegate('#estland li.li-layer', 'mouseup', function() {
            if(!$(this).hasClass('layer-on')) {
				mq.center({box:[21.837584,59.676224,28.209972,57.516193]});
			}
        });
		$('#toc').delegate('#hungary li.li-layer', 'mouseup', function() {
            if(!$(this).hasClass('layer-on')) {
				mq.center({box:[16.111889,48.585667,22.906,45.74361]});
			}
        });
		$('#toc').delegate('#italy li.li-layer', 'mouseup', function() {
            if(!$(this).hasClass('layer-on')) {
				mq.center({box:[6.614889,47.095196,18.513445,36.652779]});
			}
        });
		$('#toc').delegate('#netherlands li.li-layer', 'mouseup', function() {
            if(!$(this).hasClass('layer-on')) {
				mq.center({box:[4,50,6,56]});
			}
        });
         $('#toc').delegate('#norway li.li-layer', 'mouseup', function() {
            if(!$(this).hasClass('layer-on')) {
				mq.center({box:[-1,55.8,47.7,70]});
			}
        });

		$('#toc').delegate('#poland li.li-layer', 'mouseup', function() {
            if(!$(this).hasClass('layer-on')) {
				mq.center({box:[14.123,54.839138,24.150749,49.006363]});
			}
        });
		$('#toc').delegate('#portugal li.li-layer', 'mouseup', function() {
            if(!$(this).hasClass('layer-on')) {
				mq.center({box:[-9.495944,42.145638,-6.182694,36.96125]});
			}
        });
		$('#toc').delegate('#slovenia li.li-layer', 'mouseup', function() {
            if(!$(this).hasClass('layer-on')) {
				mq.center({box:[13.383083,46.877918,16.566,45.413139]});
			}
        });
		$('#toc').delegate('#spain li.li-layer', 'mouseup', function() {
            if(!$(this).hasClass('layer-on')) {
				mq.center({box:[-9.290778,43.791721,4.315389,36.000332]});
			}
        });
		$('#yescookies').change(function() {
			var checked = $(this).attr('checked');
			if(checked == 'checked') {
				$.cookie('og_alert',true, {expire: 7});
			}
			else {
				$.removeCookie('og_alert');
			}
		});
    	$('#spbacheck').change(function() {
			var checked = $(this).attr('checked');
			if(checked == 'checked') {
				$.cookie('spba_alert',true, {expire: 7});
			}
			else {
				$.removeCookie('spba_alert');
			}
		});
    $('#norwaycheck').change(function() {
			var checked = $(this).attr('checked');
			if(checked == 'checked') {
				$.cookie('norway_alert',true, {expire: 7});
			}
			else {
				$.removeCookie('norway_alert');
			}
		});
		$('#toc').delegate('#EGSservices li.li-layer', 'mouseup', function() {
            if(!$(this).hasClass('layer-on')) {
				//mq.center({box:[-9.495944,42.145638,28.209972,57.516193]});
        mq.center({box:[-55,42.145638,30,70]});
			}
        });
		$('#com-search').delegate('.removeresult', 'click', function() {
            $('.result').empty();			
        });
	$(window).resize(function() {
		var width = $(window).width();
		var height = $(window).height();
		if (width < 750) $('body').css({'overflow':'auto'})
		
		if (height < 550) $('body').css({'overflow':'auto'})
	});
  
	function getUrlVars()
	{
	    var vars = [], hash;
	    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	    for(var i = 0; i < hashes.length; i++)
	    {
	        hash = hashes[i].split('=');
	        vars.push(hash[0]);
	        vars[hash[0]] = hash[1];
	    }
	    return vars;
	};
	function loadBundles() {
			var lang = getUrlVars()["lang"];
			jQuery.i18n.properties({
			    name:'Messages', 
			    path:'bundle/', 
			    mode:'both',
			    language:lang
			});
	};
	loadBundles();
    var map = $('#map').mapQuery({projection:'EPSG:900913', layers:[{type:'osm',
            label:'OpenStreetMap',
            legend:{url:'http://www.openstreetmap.org/assets/osm_logo.png'},
            attribution: 'CC-By-SA OpenStreetMap'}
            ]
    }
    );
    
    var mq = map.data('mapQuery');
    mq.center({zoom:4,position:[5,52]})
	
    mq.olMap.addControl(new OpenLayers.Control.ScaleLine({geodesic:true}));
    
    // close & open panel handlers
    $("#open-west").click(function() {
        OpenPanel('west');
        mq.olMap.updateSize();
    });
    $("#close-west").click(function() {
        ClosePanel('west');
        mq.olMap.updateSize();
    });
    $("#open-east").click(function() {
        OpenPanel('east');
        mq.olMap.updateSize();
    });
    $("#close-east").click(function() {
        ClosePanel('east');
        mq.olMap.updateSize();
    });
    $('#popup').mqPopup({
        map: '#map',
        title:  $.i18n.prop('txt_iteminfo'),
        contents: function(feature) {
			var json = JSON.stringify(feature.properties);
			json=json.split("\n").join(" ");
			obj = JSON && JSON.parse(json) || $.parseJSON(json);
			//properties = obj.features[0].properties;
			var text = "<table width='300px'>";
      var dbk;
      var type;
				for (var key in obj) {
          if (key!='dbk') {
          if (key=='Feature') {type = obj[key]}
					text = text + "<tr><td class='key'>"+key+"</td><td class='value'>"+obj[key]+"</td></tr>";
          }          
          
          else dbk = obj[key];
          
				}
				text = text + "</table>";
        text = text + "<div class='moreinfo' name='"+dbk+"' type='"+type+"'>more information</div>"
            return '<p><b>' + feature.properties.FeatureName + '</b></p><p>' + text + '</p>';
        }
    });
    $('#popup').delegate('.moreinfo', 'click', function() {
          var dbk = $(this).attr('name');
          var type = $(this).attr('type');
           var url = '/zoek?Service=WPS&Request=Execute&Version=1.0.0&RawDataOutput=Output&Identifier=GetAll&DataInputs=language='+$.i18n.prop('txt_language')+';dbk='+dbk+';type='+type;
            var text = '';  
           $.getJSON(url, function(data) {
               var response = data.response;
               $.each(response,function(key, obj){
                  for (var val in obj) {
                    if($.isArray(obj[val])) {
                      text = text + "<tr><td class='key header' colspan='2'>"+val+"</td></tr>";
                      $.each(obj[val],function(key1, obj1){
                         for (var val1 in obj1) {
                          if($.isArray(obj1[val1])) {
                            text = text + "<tr><td class='key header2' colspan='2'>"+val1+"</td></tr>";
                             $.each(obj1[val1],function(key2, obj2){
                              for (var val2 in obj2) {
                                text = text + "<tr><td class='key'>"+val2+"</td><td class='value'>"+obj2[val2]+"</td></tr>";
                              }
                            });
                          }
                          else {
                            text = text + "<tr><td class='key'>"+val1+"</td><td class='value'>"+obj1[val1]+"</td></tr>";
                          }
                         }
                      })
                    }
                    else {
                      	text = text + "<tr><td class='key'>"+val+"</td><td class='value'>"+obj[val]+"</td></tr>";
                    }
                  }
               });
               $('#moreinfopopup').html(text);
               $('#moreinfopopup').dialog({
                height: 600,
                dialogClass: "up" ,
                title: 'More information',
                buttons: {
                Ok: function() {
                $( this ).dialog( "close" );
                }
                }});
            
           });
        });
     $('#getinfo').mqGetFeatureInfo({
        map: '#map'
		});
    // map overview-toggle click handler
    $("#overview").mqOverviewMap({
        map: '#map' //pass in the map
        });        
    
    $('#layers').mqLayerJsonManager({map:'#map'});
    $('#toc').mqToc({map:'#map', layerDefs: layerDefs});
	$('#aw').mqAddWMS({map:'#map'});
    $('#mouseposition').mqMousePosition({
        map:'#map',
        x:'lon',
        y:'lat',
        precision:4
        });
      
   /* $('#geo-search').mqGeocoder({
        map:'#map'
    });*/
    $('#zoomslider').mqZoomSlider({
        map:'#map'
        });
    $('#com-search').egsSearch({
           map:'#map'
       });
    $('#com-view').mqCommodityView({
        map:'#map'
        });
     $('#languagePicker').languagePicker();   
    // Preload images
    $.each(["base-off.png", "base-on.png", "folder-on.png", "folder-off.png", "layer-on.png", "layer-off.png", "spinner.gif"], function () {
        var image = new Image();
        image.src = "css/images/" + this;
    });
  
    //TODO: piechart menu
    $(".commodity").click(function() {
    getCommodity(this.innerHTML);
    return false;});
    //einde commodities menu
   

  
  //temp hack
  //AANPASSEN!!!!
  
  $('#com-selector').change(function() {
	var value = "";
	$("#com-selector option:selected").each(function () {
	value += $(this).text() + ",";
	});
	$('#com-search').data('self')._getCommodity(value);
	
  });
 /*  $('#european').click(function() {
      $('#european').toggleClass('closed').toggleClass('open').find('ul').toggle('blind');
  
  });
  $('#european').find('li.li-layer').click(function() {
	  var id = $(this).find('span')[0].id;
	   if(id == 'layer6a') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer6a; if($(this).hasClass('layer-on')) { layer6a= map.data('mapQuery').layers({label: 'Natura 2000',type:'wms',url: 'http://discomap.eea.europa.eu/ArcGIS/services/Bio/Natura2000_Dyna_WM/MapServer/WMSServer?',layers:'1,2,3,4,5,6,7,8'}); $(this).data('layer',layer6a) } else { $(this).data('layer').remove(); } } 
	   else if(id == 'layer6b') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer6b; if($(this).hasClass('layer-on')) { layer6b= map.data('mapQuery').layers({label: 'Corine Landcover',type:'wms',url: 'http://discomap.eea.europa.eu/ArcGIS/services/Land/CLC2006_Dyna_WM/MapServer/WMSServer?',layers:'1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20'}); $(this).data('layer',layer6b) } else { $(this).data('layer').remove(); } } 
	   return false;
	   });*/
  



 function getBounds(polygon)
 {
	var bounds = new OpenLayers.Bounds();
        if (!$.isArray(polygon[0][0])) {
	    // a simple polygon is an array of coordinates (a 2 element array per coordinate);
            var minx, miny, maxx, maxy;
            minx = maxx = polygon[0][0];
            miny = maxy = polygon[0][1];
            for (var i = 0; i < polygon.length; i++) {
               if (polygon[i][0] < minx) {
                 minx = polygon[i][0];
               }
               if (polygon[i][0] > maxx) {
                 maxx = polygon[i][0];
               }
               if (polygon[i][1] < miny) {
                 miny = polygon[i][1];
               }
               if (polygon[i][1] > maxy) {
                 maxy = polygon[i][1];
               }
            }
            bounds.extend(new OpenLayers.Bounds(minx, miny, maxx, maxy));
            return bounds;
	} else {
           for (var j = 0; j < polygon.length; j++) {
             bounds.extend(getBounds(polygon[j]));
          }
        }
        return bounds;
}

 var requestCounter = 0;  
 $("#adminunit").html('<ul><li class="folder"><span class="folder">Administrative Units</span><ul class="ul-closed"></ul></li></ul>');
 var url = '/zoek?Service=WPS&Request=Execute&Version=1.0.0&RawDataOutput=Output&Identifier=GetAdministrativeUnits&DataInputs=language=' + $.i18n.prop('txt_language');
 $.getJSON(url, function(data) {

      $.each(data.results, function (i, result) {
	$("<li>" + result.name + "</li>").appendTo("#adminunit ul li ul").data("id", result.id);
      });
      $("#adminunit").delegate("ul li", "click", function(event) {
        event.stopPropagation();
        
	//alert($(event.target).data("id"));
        var element = $(event.target);
        if (element.is("span")) {
           // li span clicked, set element to li
           element = element.parent();
        }
        var id = element.data("id");
        if (id != null && !$(this).hasClass('open')) {
           // get Geometry
           var thisRequest = ++requestCounter;
           var geomurl = "/zoek?Service=WPS&Request=Execute&Version=1.0.0&RawDataOutput=Output&Identifier=GetGeometryForAdministrativeUnit&DataInputs=addPolygon=true;id=" + id
           $.ajax ( {
             dataType: "json",
             url: geomurl,
             success: function (data) {
                if (thisRequest == requestCounter) {
                  var minx = maxx = data.geometry.geometries[0].coordinates[0];
                  var miny = maxy = data.geometry.geometries[0].coordinates[1];
                  var polygon = data.geometry.geometries[1].coordinates;
                  var bounds = getBounds(polygon);
                  mq.center({box:[bounds.left,bounds.bottom,bounds.right,bounds.top]});
                  /*  var kleur = "#"+((1<<24)*Math.random()|24).toString(16);
                    var defStyle = {strokeColor: kleur, fillColor: 'none',strokeWidth:4};
                    var sty = OpenLayers.Util.applyDefaults(defStyle, OpenLayers.Feature.Vector.style["default"]);
                    var sm =  new OpenLayers.StyleMap({
                      'default': sty
                    });
                    var layer = {  
                      label: data.properties.name,
                      type: 'json',                      
                      projection: 'EPSG:4326',
                      strategy: 'bbox',
                      url: geomurl,
                      styleMap: sm,
                      kleur: kleur,
                      admin: true
                   };
                   $.each(map.data('mapQuery').layers(),function() {
                      if(this.label == data.properties.name) {
                        this.remove();
                      }
                   });
                   var vlayer = map.data('mapQuery').layers(layer);
                  var feature=  vlayer.features({geometry:data.geometry.geometries[1]})
                  var k=0;*/
                }
                //map.zoomToExten(bounds);
             },
             error: function() {
             }
           });
        }
        var subElements = element.children("ul");
        if (subElements.length == 0 && id != null) {
          // get child elements
          subElements = $('<ul><li class="folder"><span class="folder"><img src="css/images/spinner.gif" /></span><ul class="ul-closed"></ul></li>').hide();
          subElements.appendTo(element);
          $.ajax ({
               dataType: "json", 
               url: url + ";parent=" + element.data("id"),
               success: function(data) {
               // new sub-administrative units have arrived
               // remove spinner
                  subElements.empty();
                  if (data.results.length > 0) {
                     $.each(data.results, function (i, result) {
                         $("<li>" + result.name + "</li>").appendTo(subElements).data("id", result.id);
                     });
                  } else {
                     $('<li class="no-admin"><span class="admin-selector">' + "no more sub-units available" + "</span></li>").appendTo(subElements);
                  }
               },
               error: function() {
                   subElements.empty();
                   $('<li class="no-admin"><span class="admin-selector">' + $.i18n.prop('txt_error')+" retrieving sub-units" + "</span></li>").appendTo(subElements);
               }
           });
        }
        if (subElements.is(":visible")) {
           subElements
            .css("width", subElements.innerWidth())
            .slideUp('fast', function() {element.css("width","auto");}) ;
           element.removeClass('open');
        } else {
           // check if we should load child elements
           subElements.slideDown('fast');
           if (!element.children("span").hasClass("layer-selector")) {
              element.addClass('open');
           }
        } 
      }); 
    }
 );

 $("#geosearchtext").focus(function() {
     if ($(this).is('.hint')) {
	$(this).val("");
	$(this).removeClass("hint");
     }
 });
$("#geosearchbutton").click(function() {
      if (!$("#geosearchtext").is(".hint")) {
	var search = $.trim($("#geosearchtext").val());
        if (search.length > 3) {
            var url = "http://nominatim.openstreetmap.org/search?format=json&email=info@eurogeosource.eu&accept-language=" + $.i18n.prop('txt_language') + "&viewbox=-25,72,40,27&bounded=1&q=" + encodeURIComponent(search) + "&json_callback=?" ;
            $.ajax({
              dataType: "jsonp",
              url: url,
              jsonpCallback: "json_callback",
              success: function(data) {
                if (data.length > 0) {
                  var bounds = data[0].boundingbox;
                  mq.center({box:[bounds[2], bounds[0], bounds[3], bounds[1]]});
                } else {
                  alert($.i18n.prop('txt_noresult'));
                }
              },
              error: function() {
                alert($.i18n.prop('txt_error')+": retrieving data from search server");
              }
            });
	}
      }
 });

$("#geosearchtext").keyup(function(event){
    if(event.keyCode == 13){
        $("#geosearchbutton").click();
    }
});
});

