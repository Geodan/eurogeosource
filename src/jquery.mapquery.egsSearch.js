/* Copyright (c) 2011 by MapQuery Contributors (see AUTHORS for
 * full list of contributors). Published under the MIT license.
 * See https://github.com/mapquery/mapquery/blob/master/LICENSE for the
 * full text of the license. */

(function($) {
$.template('egsSearch',
    '<div class="mq-egssearch ui-widget ui-helper-clearfix ">'+
    '<form><input type="text" title="${title}" value="${title}" class="searchstring replaceinfo" size="${size}">'+
    '<input type="submit" title="${title}" class="searchbutton" value="${search}"></form>'+
    '<div class="result"></div>'+
    '</div>');

$.widget("mapQuery.egsSearch", {
    options: {
        // The MapQuery instance
        map: undefined,
        
        // The URL returning the search result as JSON
        // TODO should url have search parameter ??//     
        url: '/zoek?Service=WPS&Request=Execute&Version=1.0.0&RawDataOutput=Output&Identifier=',
        // the size of the search field
        size: 24,
        // the value of the search button
        search: 'Search'

    },
    _create: function() {
        var map;
        var self = this;
        var element = this.element;
        this.type = "Commodity";		
        //get the mapquery object
        map = $(this.options.map).data('mapQuery');
		element.data('self', self)
        $.tmpl('egsSearch',{
            size:self.options.size,
            title:$.i18n.prop('fld_search'),
            search:$.i18n.prop('btn_search')
        }).appendTo(element);

        element.addClass(' ui-widget ui-widget-content ' +
                              'ui-corner-all');
                              
        element.delegate('.searchbutton', 'click', function() {
            var searchterm = element.find('.searchstring').val();         
            self._search(searchterm,'c');
            element.find('.searchstring').val($.i18n.prop('fld_search')).addClass('replaceinfo').blur(); 
            return false;
        });
        
        element.delegate('.searchstring', 'focus', function() {
            if(this.value==$.i18n.prop('fld_search')) {
              this.value = "";
              $(this).removeClass('replaceinfo');
           }
        });
        element.delegate('.searchstring', 'blur', function() {
            if(this.value==$.i18n.prop('fld_search')||this.value=="") {
              this.value = $.i18n.prop('fld_search');
              $(this).addClass('replaceinfo');
           }
        });
        element.delegate('.commodity', 'click', function() {
            var comm = {};
			comm.name = $(this).html();
			comm.code = $(this).attr('name');
            self._getCommodity(comm,self);
        });
         element.delegate('.deposit', 'click', function() {
            var comm = {};
			comm.name = $(this).html();
			comm.code = $(this).attr('name');
            self._getDeposit(comm,self);
        });
		element.delegate('.resource', 'click', function() {
             var comm = {};
			comm.name = $(this).html();
			comm.code = $(this).attr('name');
            self._getResource(comm,self);
        });
        element.delegate('.egsname', 'click', function() {
             var comm = {};
			comm.name = $(this).html();
			comm.code = $(this).attr('name');
            self._getEgsname(comm,self);
        });
    },
    _destroy: function() {
        this.element.removeClass(' ui-widget ui-helper-clearfix ' +
                                 'ui-corner-all')
            .empty();
    },
    _search: function(searchterm,s) {
        //search button click, get json with search string from url
        //list the result
        var element = this.element;		
		var id = element[0].id;		
		$('#'+id).find('.result').empty().append('<b>'+$.i18n.prop('txt_result')+'</b><span class="removeresult">'+$.i18n.prop('txt_rmv')+'</span><hr/>');
        var curl = this.options.url + 'SearchCommodity' +'&DataInputs=language='+ $.i18n.prop('txt_language') + ';search='+ searchterm+';jsoncallback=?';
        var rurl = this.options.url + 'SearchResource' +'&DataInputs=language='+ $.i18n.prop('txt_language') + ';search='+ searchterm+';jsoncallback=?';
        var durl = this.options.url + 'SearchDepositType' +'&DataInputs=language='+ $.i18n.prop('txt_language') + ';search='+ searchterm+';jsoncallback=?';
        var nurl = this.options.url + 'SearchName' +'&DataInputs=' + 'search='+ searchterm+';jsoncallback=?';
		var data ={};
		data.id= id;
		$.getJSON(curl, data, function(data) {
		var elementid = id;	
			var text = $.i18n.prop('err_nomc');
			if(data && data.results && data.results.length > 0) {
			
				var commodities = [];				
				var result = data.results;
				
                $.each(result, function(){
					commodities.push('<li title="'+$.i18n.prop('txt_addtomap')+'" class="commodity" name="'+ this.code+'">' + this.commodity + '</li>');
				});
				 text = $('<ul/>', {
                    'class': 'comm-list',
                    html: commodities.join('')
                });
			}
			$('#'+elementid).find('.result').append('<b>'+$.i18n.prop('txt_mc')+'</b><br/>').append(text).append('<hr/>');
		}).error(function(){$('#'+id).find('.result').append('<br/>'+ $.i18n.prop('err_nomc')+'<hr/>')});
		
		$.getJSON(rurl, data, function(data) {
		var elementid = id;	
			var text = $.i18n.prop('err_noer'); 
			if(data && data.results && data.results.length > 0) {
				
				var commodities = [];				
				var result = data.results;
				
                $.each(result, function(){
					commodities.push('<li  title="'+$.i18n.prop('txt_addtomap')+'" class="resource" name="'+ this.code+'">' + this.resource + '</li>');
				});
				 text = $('<ul/>', {
                    'class': 'res-list',
                    html: commodities.join('')
                });
			}

			$('#'+elementid).find('.result').append('<b>'+$.i18n.prop('txt_er')+'</b><br/>').append(text).append('<hr/>');
		}).error(function(){$('#'+id).find('.result').append($.i18n.prop('err_noer')+'<hr/>')});
    $.getJSON(durl, data, function(data) {
		var elementid = id;	
			var text = $.i18n.prop('err_nodp'); 
			if(data && data.results && data.results.length > 0) {
				
				var commodities = [];				
				var result = data.results;
				
                $.each(result, function(){
					commodities.push('<li  title="'+$.i18n.prop('txt_addtomap')+'" class="deposit" name="'+ this.code+'">' + this.depositType + '</li>');
				});
				 text = $('<ul/>', {
                    'class': 'dep-list',
                    html: commodities.join('')
                });
			}

			$('#'+elementid).find('.result').append('<b>'+$.i18n.prop('txt_dp')+'</b><br/>').append(text).append('<hr/>');
		}).error(function(){$('#'+id).find('.result').append($.i18n.prop('err_nodp')+'<hr/>')});
		
		$.getJSON(nurl, data, function(data) {
		var elementid = id;	
			var text = $.i18n.prop('err_non');
			if(data && data.results && data.results.length > 0) {
			
				var commodities = [];				
				var result = data.results;
				
                $.each(result, function(){
					commodities.push('<li title="'+$.i18n.prop('txt_addtomap')+'" class="egsname" name="'+ this.name+'">' + this.name + '</li>');
				});
				 text = $('<ul/>', {
                    'class': 'name-list',
                    html: commodities.join('')
                });
			}
			$('#'+elementid).find('.result').append('<b>'+$.i18n.prop('txt_n')+'</b><br/>').append(text).append('<hr/>');
		}).error(function(){$('#'+id).find('.result').append($.i18n.prop('err_non')+'<hr/>')});
		
		
	},
	_getCommodity: function(search,element) {
		//var self = element;
		var name = search.name;
    var code = search.code;
		$.ajaxSetup({ scriptCharset: "utf-8" , contentType: "application/json; charset=utf-8"});
		var url = '/zoek?Service=WPS&Request=Execute&Version=1.0.0&RawDataOutput=Output&Identifier=GetGeometryForCommodity&DataInputs=language='+$.i18n.prop('txt_language')+';commodity='+search.code+';geometryType=point';
		var feature;
		
		$.getJSON(url, search, function(data) {			
			
			if(data.type && data.type == "FeatureCollection" && data.features.length > 0){
				feature = {};
				feature.url = url;
				feature.name = data.features[0].properties.FeatureName;;
				feature.code = code;
				feature.type = 'commodity';
			}
		
		}).error(function(){
			
		}).success(function(){
			if(feature!==undefined){
			$('#map').data('mapQuery').commodities(feature);
			}
       else alert( name + ':\n' +$.i18n.prop('txt_nodata') );
		});
		
	},
	_getResource: function(search,element) {
		var name = search.name;
    var code  = search.code;
		var self = element;
		var search = search;
		var url = '/zoek?Service=WPS&Request=Execute&Version=1.0.0&RawDataOutput=Output&Identifier=GetGeometryForResource&DataInputs=language='+$.i18n.prop('txt_language')+';resource='+search.code+';geometryType=point';
		var feature;
		$.getJSON(url, search, function(data) {			
			
			if(data.type && data.type == "FeatureCollection" && data.features.length > 0){
				feature = {};
				feature.url = url;
				feature.name = data.features[0].properties.FeatureName;
				feature.code = code;
				feature.type = 'resource';
			}
		
		}).error(function(){
			
		}).success(function(){
			if(feature!==undefined){
			 $('#map').data('mapQuery').commodities(feature);
			}
      else alert( name + ':\n' +$.i18n.prop('txt_nodata') );
		});
		
	},
  _getDeposit: function(search,element) {
		var name = search.name;
    var code  = search.code;
		var self = element;
		var search = search;
		var url = '/zoek?Service=WPS&Request=Execute&Version=1.0.0&RawDataOutput=Output&Identifier=GetGeometryForDeposit&DataInputs=language='+$.i18n.prop('txt_language')+';depositType='+search.code+';geometryType=point';
		var feature;
		$.getJSON(url, search, function(data) {			
			
			if(data.type && data.type == "FeatureCollection" && data.features.length > 0){
				feature = {};
				feature.url = url;
				feature.name = data.features[0].properties.FeatureName;
				feature.code = code;
				feature.type = 'deposit';
			}
		
		}).error(function(){
			
		}).success(function(){
			if(feature!==undefined){
			 $('#map').data('mapQuery').commodities(feature);
			}
      else alert( name + ':\n' +$.i18n.prop('txt_nodata') );
		});
		
	},
  _getEgsname: function(search,element) {
		var name = search.name;
    var code  = search.code;
		var self = element;
		var search = search;
		var url = '/zoek?Service=WPS&Request=Execute&Version=1.0.0&RawDataOutput=Output&Identifier=GetGeometryForName&DataInputs=language='+$.i18n.prop('txt_language')+';alias='+search.code+';geometryType=point';
		var feature;
		$.getJSON(url, search, function(data) {
			
			if(data.type && data.type == "FeatureCollection" && data.features.length > 0){
				feature = {};
				feature.url = url;
				feature.name = data.features[0].properties.FeatureName;
				feature.code = code;
				feature.type = 'name';
			}
		
		}).error(function(){
			
		}).success(function(){
			if(feature!==undefined){
			 $('#map').data('mapQuery').commodities(feature);
			}
      else alert( name + ':\n' +$.i18n.prop('txt_nodata') );
		});
		
	}
    
});
})(jQuery);
