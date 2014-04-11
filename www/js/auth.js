var auth = {
    loggedIn: false,
    userInfo: null,
    init: function(){
        auth.checkUserInfo();
    } ,
    checkUserInfo: function(){
      $.getJSON('userInfo', function( data ){
          if( data.loggedIn == true ){
              auth.loggedIn = true;
              auth.userInfo = data.userInfo;
              $('[data-page_id="login"]').html(auth.userInfo.first_name  + " " + auth.userInfo.last_name);
          }
      });  
    },
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
$(auth.init);