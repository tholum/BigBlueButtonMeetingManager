var auth = {
    init: function(){
        
    } , 
    loginPress: function(object){
        
        var popup = $( $('#loginPopupTemplate').html() );
        var bottom = $(object).position().top+$(object).outerHeight(true)
        popup.css('position', 'fixed');
        popup.css('right', '0');
        popup.css('top' , bottom + 'px');
        console.log( bottom );
        $('body').append(popup);
    }
}