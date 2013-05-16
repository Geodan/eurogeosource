var myLayout; 
$(document).ready(function () {
        myLayout = $('body').layout({defaults: {        
            }
            ,north: {
            closable: false
            ,resizable: false
            ,spacing_open: 0
            
            }
            ,south: {
            closable: false
            ,resizable: false
            ,spacing_open: 0
            ,size: 18
            }
            ,west:{
            spacing_open: 0
            ,spacing_closed: 0
            ,resizable: false
            ,slidable: false
            ,size: 250
            }
            ,east: {
            spacing_open: 0
            ,spacing_closed: 0
            ,resizable: false
            ,slidable: false
            ,size: 250
            }
        });
        
    });
    
function ClosePanel(panel) {
    myLayout.close(panel);
    if (panel=='west') {
        
        $(".h-b-west").animate({width: 0},200 , function(){$(".h-b-west").hide()});
        $("#close-west").animate({left: 0}, 200, function(){$("#open-west").show();$("#close-west").hide()});
    }
    if (panel=='east') {
        
        $(".h-b-east").animate({width: 0},200 , function(){$(".h-b-east").hide()});
        $("#close-east").animate({right: 0}, 200, function(){$("#open-east").show();$("#close-east").hide()});
        $(".h-b-middle").animate({right: 30},200 , function(){});
    }
}
function OpenPanel(panel) {
    myLayout.open(panel);
    if (panel=='west') {
        $("#close-west").show();
        $("#open-west").hide();
        $(".h-b-west").show();
        $(".h-b-west").animate({width: 249},200 , function(){});
        $("#close-west").animate({left: 250}, 200, function(){});
    }
    if (panel=='east') {
        $("#close-east").show();
        $("#open-east").hide();
        $(".h-b-east").show();
        $(".h-b-middle").animate({right: 280},200 , function(){});
        $(".h-b-east").animate({width: 249},200 , function(){});
        $("#close-east").animate({right: 250}, 200, function(){});
    }
}
    