/* Copyright (c) 2011 by Steven M. Ottens */

(function($) {
$.template('wgtLanguagePicker',
    '<div class="wgt-language-picker ui-widget ui-helper-clearfix ">'+
   '<dl class="dropdown">'+
    '<dt><a href="#"><span>${lang}</span></a></dt>'+
    '<dd>'+
        '<ul>'+
     	'{{each(i, lang) group}}'+
    	 	 '<li><a href="#">${lang.title}<img class="flag flagvisibility" src="${lang.flag}" alt="" /><span class="value">${lang.value}</span></a></li>'+               
        '{{/each}}'+
        '</ul>'+
    '</dd>'+
    '</dl>'+
    '</div>');

$.widget("mapQuery.languagePicker", {
    options: {
       
        

    },
    _create: function() {
        var self = this;
        var element = this.element;
        var lang = $.i18n.prop('txt_lang');
		var group = [
		{'title':'Български','flag':'css/images/bg.png','value':'BG'},
		{'title':'Dansk','flag':'css/images/dk.png','value':'DK'},
		{'title':'Deutsch','flag':'css/images/de.png','value':'DE'},
		{'title':'Eesti','flag':'css/images/et.png','value':'ET'},
		{'title':'English','flag':'css/images/gb.png','value':'EN'},
		{'title':'Français','flag':'css/images/fr.png','value':'FR'},
		{'title':'Magyar','flag':'css/images/hu.png','value':'HU'},
		{'title':'Nederlands','flag':'css/images/nl.png','value':'NL'},
		{'title':'Polski','flag':'css/images/pl.png','value':'PL'},
		{'title':'Português','flag':'css/images/pt.png','value':'PT'},
		{'title':'Română','flag':'css/images/ro.png','value':'RO'},
		{'title':'Slovenščina','flag':'css/images/sl.png','value':'SL'}
		];
        $.tmpl('wgtLanguagePicker',{
        	lang: lang,
            group: group
        }).appendTo(element);

		element.delegate('.dropdown dd ul li a','click',function(){ 
				var text = $(this).html();
        	    $(".dropdown dt a span").html(text);
    	        $(".dropdown dd ul").hide();
    	        var lang = $(this).children('span').text();
	            var url = '?lang='+lang;
	            
	            window.location.href=url;
            });
		element.delegate('.dropdown dt a','click',function(){ 
				$(".dropdown dd ul").toggle();
			});
                
                
    },
    _setLanguage: function() {
    	
    }
});
})(jQuery);