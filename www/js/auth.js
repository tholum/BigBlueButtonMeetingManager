var auth = {
    loggedIn: false,
    userInfo: null,
    runOnLogin: [],
    logonMethods: {
        'facebook': { class : 'facebookLogin' , url :"auth/facebook" }
        },
    init: function(){
        auth.checkUserInfo();
    } ,
    checkUserInfo: function(){
      $.getJSON('userInfo', function( data ){
          if( data.loggedIn == true ){
              auth.loggedIn = true;
              auth.userInfo = data.userInfo;
              $('[data-page_id="login"]').html(auth.userInfo.first_name  + " " + auth.userInfo.last_name);
              $.each(runOnLogin , function(key,val){ val();});
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
        var button;
        $.each( auth.loginMethods , function( key , val ){
           button = $($('#loginButtonTemplate').html());
           button.children('a').attr('href',val.url);
           button.children('a').addClass(val.class);
           popup.append(button);
        });
        $('body').append(popup);
    }
}
$(auth.init);