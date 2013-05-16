/* Copyright (c) 2011 by MapQuery Contributors (see AUTHORS for
 * full list of contributors). Published under the MIT license.
 * See https://github.com/mapquery/mapquery/blob/master/LICENSE for the
 * full text of the license. */

(function($) {
$.template('mqJsonSearch',
    '<div class="mq-jsonsearch ui-widget ui-helper-clearfix ">'+
    '<form><input type="text" class="searchstring" size="${size}">'+
    '<input type="submit" class="searchbutton" value="${search}"></form>'+
    '<div class="result"></div>'+
    '</div>');

$.widget("mapQuery.mqJsonSearch", {
    options: {
        // The MapQuery instance
        map: undefined,
        
        // The URL returning the search result as JSON
        // TODO should url have search parameter ??
//        url: '/cgi-bin/proxy.cgi?url=http%3A%2f%2fmularroya15.cps.unizar.es%3A8080%2fDataProcessingService%2fservices%3FService%3DWPS%26Request%3DExecute%26Version%3D1.0.0%26RawDataOutput%3DOutput%26Identifier%3DSearchResource%26DataInputs%3Dlanguage%3D',
//        url: 'http://mularroya15.cps.unizar.es:8080/DataProcessingService/services?Service=WPS&Request=Execute&Version=1.0.0&RawDataOutput=Output&Identifier=SearchResource&DataInputs=language=',
        url: '/zoek?Service=WPS&Request=Execute&Version=1.0.0&RawDataOutput=Output&Identifier=',
        // the size of the search field
        size: 20,
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
        $.tmpl('mqJsonSearch',{
            size:self.options.size,
            search:$.i18n.prop('btn_search')
        }).appendTo(element);

        element.addClass(' ui-widget ui-widget-content ' +
                              'ui-corner-all');
                              
        element.delegate('.searchbutton', 'click', function() {
            var searchterm = element.find('.searchstring').val();         
            self._search(searchterm,'c');
            return false;
        });
        element.delegate('.commodity', 'click', function() {
            var comm = $(this).html();
            self._getCommodity(comm,self);
        });
		element.delegate('.resource', 'click', function() {
            var comm = $(this).html();
            self._getResource(comm);
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
        var url = this.options.url + 'SearchCommodity' +'&DataInputs=language='+ $.i18n.prop('txt_language') + ';search='+ searchterm+';id=1;jsoncallback=?';
        var id = element[0].id;
		if(s == 'c'){
			this._doSearch(url,id,s,searchterm);	
		}
		if(s == 'r'){
			url = this.options.url + 'SearchResource' +'&DataInputs=language='+ $.i18n.prop('txt_language') + ';search='+ searchterm+';id=1;jsoncallback=?';
			this._doSearch(url,id,s,searchterm);
		}		
		
	},
	_doSearch: function(url,id,s,t) {		
		var data ={};
		data.id= id;
		data.s = s;
		data.search = t;
        $.getJSON(url, data,function(data) {		
            var elementid = this.data.split('&')[0].split('=')[1];			
			var commodity = this.data.split('&')[1].split('=')[1];	
			var search = this.data.split('&')[2].split('=')[1];	
			var self = $('#'+elementid).data('self');
            var commodities = [];
            var result;
            var text;
            if(data.results) {
                result = data.results;
                $.each(result, function(){
					if(commodity=='c') {
					self.type = 'Commodity'
                    commodities.push('<li class="commodity">' + this.code + '</li>');}
					else {
					commodities.push('<li class="resource">' + this.code + '</li>');
					self.type = 'Resource';			
					}
                });
                $('#'+elementid).find('.result').empty();
                text = $('<ul/>', {
                    'class': 'my-new-list',
                    html: commodities.join('')
                });
                if(data.results.length==0) {
					if(commodity =='c'){
					self.type = 'Resource';			
					self._search(search,'r');
					}
				text = 'No result';}
            }
            else {
			if(commodity =='c'){
				self._search(search,'r');
				self.type = 'Resource';			
				}
                text = 'No result';
            }
            $('#'+elementid).find('.result').append(text);
			
        });				
    },
    _getCommodity: function(value,element) {
        var url = '/zoek?Service=WPS&Request=Execute&Version=1.0.0&RawDataOutput=Output&Identifier=GetInfoForCommodity&DataInputs=language='+$.i18n.prop('txt_language')+';commodity='+value+';jsoncallback=?';       

       $.getJSON(url,  function(data) {  			
			if(data && data.result)
            $('#map').data('mapQuery').commodities(data.results);
			else{this.error()}
			
       }).error(this._getCommodityGeom(value));
    },
	_getCommodityGeom: function(value) {
		var url = '/zoek?Service=WPS&Request=Execute&Version=1.0.0&RawDataOutput=Output&Identifier=GetGeometryForCommodity&DataInputs=language='+$.i18n.prop('txt_language')+';commodity='+value+';jsoncallback=?';       
         var layer = {
                type: 'JSON',
                url: url,
                projection: 'EPSG:4326',
                xy: false,
                //url: 'http://localhost:5984/ethiopia_reservate/_design/geo/_list/geojson/all?type=geojson',

                dataurl: url
            };
            var map = this.options.map;
            $(map).data('mapQuery').layers(layer);
	},
	_getResource: function(value) {
       // var jqxhr = $.getJSON("http://eurogeosource.geodan.nl/OneGeologyServlet/JSONRetreiver?jsoncallback=?",
//       var url = 'http://mularroya15.cps.unizar.es:8080/DataProcessingService/services?Service=WPS&Request=Execute&Version=1.0.0&RawDataOutput=Output&Identifier=GetInfoForResource&DataInputs=language='+$.i18n.prop('txt_language')+';resource='+value+';jsoncallback=?';
        var url = '/zoek?Service=WPS&Request=Execute&Version=1.0.0&RawDataOutput=Output&Identifier=GetInfoForResource&DataInputs=language='+$.i18n.prop('txt_language')+';resource='+value+';jsoncallback=?';
        
       var id = {resource:value};
       $.getJSON(url,  function(data,element) {           
            $('#map').data('mapQuery').commodities(data.results);
       });
    }
    
});
})(jQuery);
