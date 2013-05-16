/* Copyright (c) 2011 by MapQuery Contributors (see AUTHORS for
 * full list of contributors). Published under the MIT license.
 * See https://github.com/mapquery/mapquery/blob/master/LICENSE for the
 * full text of the license. */

(function($) {
$.template('mqGeocoder',
    '<div class="mq-geocoder  ui-helper-clearfix ">'+
    '<span class="ui-helper-clearfix ">'+
    '<form><input type="text" class="searchstring" size="${size}" value="">'+
    '<input type="submit" class="searchbutton" value="${search}"></form>'+
    '</span></div>');

$.widget("mapQuery.mqGeocoder", {
    options: {
        // The MapQuery instance
        map: undefined,

        url: 'http://maps.googleapis.com/maps/api/geocode/json?sensor=false&address=',
        
        proxy: '/cgi-bin/proxy.cgi?url=',
        //url: 'http://tinygeocoder.com/create-api.php?q=',
        size: 40,
        // the value of the search button
        search: 'Search'    

    },
    _create: function() {
        var map;
        var self = this;
        var element = this.element;

        //get the mapquery object
        map = $(this.options.map).data('mapQuery');


        $.tmpl('mqGeocoder',{
            size:self.options.size,
            search:$.i18n.prop('btn_search')
        }).appendTo(element);

        element.delegate('.searchbutton', 'click', function() {
            var searchterm = element.find('.searchstring').val();         
            self._search(searchterm,map);
            return false;
        });
    },
    _destroy: function() {
        this.element.removeClass(' ui-widget ui-helper-clearfix ' +
                                 'ui-corner-all')
            .empty();
    },
    _search: function(searchterm,map) {
        var element = this.element;
        searchterm = searchterm.replace(' ','+');
        var url = this.options.url + searchterm;
        var id = {id:element[0].id};
        if (url.match(/^https?:\/\//)!==null &&
                !$.MapQuery.util.sameOrigin(url)) {
                url = this.options.proxy + encodeURIComponent(url);
            }
        $.getJSON(url, 
        function(data) {
            if(data.status == 'OK') {
                //map.center({position:[data.results[0].geometry.location.lng,data.results[0].geometry.location.lat],zoom:8})
                var bounds = data.results[0].geometry.bounds;
                map.center({box:[bounds.southwest.lng,bounds.southwest.lat,bounds.northeast.lng,bounds.northeast.lat]})
                map.layers({type:'marker',position:[data.results[0].geometry.location.lng,data.results[0].geometry.location.lat]})
                /*$.each(data.results, function() {
                    alert(this.formatted_address); 
                });*/
            }
        });
        
        var i = -1;
    }
    
});
})(jQuery);
