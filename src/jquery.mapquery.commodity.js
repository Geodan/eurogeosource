/* Copyright (c) 2011 by MapQuery Contributors (see AUTHORS for
 * full list of contributors). Published under the MIT license.
 * See https://github.com/mapquery/mapquery/blob/master/LICENSE for the
 * full text of the license. */


(function($, MQ) {

$.extend(MQ.Map.prototype, {

    //get/set the commodities object
    commodities: function(options) {
        //get the legend object
        var self = this;
        switch(arguments.length) {
        case 0:
            return this._allCommodities();
        case 1:
            if (!$.isArray(options)) {
                return this._addCommodity(options);
            }
            else {
                return $.map(options, function(commodity) {
                    return self._addCommodity(commodity);
                });
            }
            break;
        default:
            throw('wrong argument number');
        }
    },
    //Check if the layer has a maximum box set and if the current box
    //is outside these settings, set the legend.msg accordingly
    _allCommodities: function() {
        if(!this.commoditiesList) {this.commoditiesList =[]}
        var commodities = [];
        $.each(this.commoditiesList, function(id, commodity) {
            var item = [commodity.position(), commodity];
            commodities.push(item);
        });
        var sorted = commodities.sort( function compare(a, b) {
            return a[0] - b[0];
        });
        var result = $.map(sorted, function(item) {
            return item[1];
        });
        return result.reverse();
    },
    //Check if the layer has a minimum or maximum zoom set and if the
    //current zoom is outside these settings, set the legend.msg accordingly
    _addCommodity: function(options) {
        if(!this.commoditiesList) {this.commoditiesList =[]}
        var id = this._createcId();
        var commodity = new $.MapQuery.Commodity(this, id, options);
        this.commoditiesList[id] = commodity;
        this.events.trigger('mqAddCommodity',commodity);
        return commodity;
    },
    _createcId: function() {
        if(!this.idcCounter) { this.idcCounter = 0}
        return 'commodity' + this.idcCounter++;
    },
    _removeCommodity: function(id) {
        this.events.trigger('mqRemoveCommodity',id);
        delete this.commoditiesList[id];
        return this;
    }
});
$.MapQuery.Commodity = function(map, id, options) {
    var self = this;
    // apply default options that are not specific to a layer
    
    this.id = id;
    var cid = this.id;
        // a reference to the map object is needed as it stores e.g. the list
    // of all layers (and we need to keep track of it, if we delete a
    // layer)
    this.map = map;
    this.options = options;
	this.info = {};
	//var geojson_format = new OpenLayers.Format.GeoJSON();
	//this.geometry = geojson_format.read(options.geom);
	/*var layer = new OpenLayers.Layer.Vector(this.options.name);
	//layer.addFeatures(this.geometry);
	this.olLayer = layer;
	this.map.layers(layer);*/
	//GetINFO
	var url;
	if(options.type == 'commodity') {
	url = '/zoek?Service=WPS&Request=Execute&Version=1.0.0&RawDataOutput=Output&Identifier=GetInfoForCommodity&DataInputs=language='+$.i18n.prop('txt_language')+';commodity='+options.code+';jsoncallback=?';   
  }
  else if(options.type == 'resource') { url = '/zoek?Service=WPS&Request=Execute&Version=1.0.0&RawDataOutput=Output&Identifier=GetInfoForResource&DataInputs=language='+$.i18n.prop('txt_language')+';resource='+options.code+';jsoncallback=?';
  }
   
 
		
	

		var kleur = "#"+((1<<24)*Math.random()|0).toString(16);
		var defStyle = {strokeColor: 'black', fillColor: kleur};
		 var sty = OpenLayers.Util.applyDefaults(defStyle, OpenLayers.Feature.Vector.style["default"]);
	var sm =  new OpenLayers.StyleMap({
             'default': sty
        });
	 var layer = {
				styleMap: sm,
                type: 'JSON',
                url: options.url,
                projection: 'EPSG:4326',
                xy: false,
                //url: 'http://localhost:5984/ethiopia_reservate/_design/geo/_list/geojson/all?type=geojson',
				label: options.name,
                dataurl: options.url,
				commodiyId: id,
				kleur: kleur
				
            };
	this.layer = map.layers(layer);
  if(url!==undefined) {
  self._getInfo(url,{cid:id});
  }
	  
};
$.MapQuery.Commodity.prototype = {
  _getInfo: function(url,data) {
      var id = data.cid;
      $.getJSON(url, function(data) {
      var bla = id;
        if(data && data.results){
          var info = {}
          info.id = bla;
          info.results = data.results;
				
          $('#map').data('mapQuery').trigger('gotInfo',info);
        }
      }); 
  
  }
/*
    remove: function() {
        this.map.olMap.removeLayer(this.olLayer);
        // remove references to this layer that are stored in the
        // map object
        return this.map._removeLayer(this.id);
    },
    position: function(pos) {
        if (pos===undefined) {
            return this.map.olMap.getLayerIndex(this.olLayer)-1;
        }
        else {
            return this.map.olMap.setLayerIndex(this.olLayer, pos+1);
        }
    },
    visible: function(vis) {
        if (vis===undefined) {
            return this.olLayer.getVisibility();
        }
        else {
            this.olLayer.setVisibility(vis);
            return this;
        }
    },
    opacity: function(opac) {
         if (opac===undefined) {
            // this.olLayer.opacity can be null if never
        // set so return the visibility
            var value = this.olLayer.opacity ?
            this.olLayer.opacity : this.olLayer.getVisibility();
            return value;
        }
        else {
            this.olLayer.setOpacity(opac);
            return this;
        }
    }*/
};
})(jQuery, $.MapQuery);
