module.exports = {
    passport: null,
    init: function( app , database , passport ){
        var FacebookStrategy = require('passport-facebook').Strategy;
        passport.use(new FacebookStrategy({
            clientID: config.auth.facebook.appId,
            clientSecret: config.auth.facebook.appSecret,
            callbackURL: "http://bigblue.slimcrm.com/app/auth/facebook/callback"
          },
          function(accessToken, refreshToken, profile, done) {
              database.query("SELECT * FROM module_auth WHERE module_name = '' AND module_id = '" + profile.id + "'",
              function(err, rows, fields){
                  if( rows.length == 0 ){
                       console.log( profile.name.givenName );
                       var sql = "INSERT INTO tbl_user ( `first_name` , `last_name` , `user_name` ) VALUES( '" + provile.name.givenName + "' , ''" + provile.name.familyName + "' , '' )";
                        done( null , profile );
                       /*database.query("INSERT INTO tbl_user SET ?" , { first_name: profile.name.givenName , last_name: profile.name.familyName , user_name: 'facebook' + profile.id  }, function(err2, rows2){
                            console.log( [ rows2 , err2] );

                            done( null , profile );
                        });*/
                    }
              });
          } 
        ));

        passport.serializeUser(function(user, done) {
          done(null, user);
        });

        passport.deserializeUser(function(user, done) {
          done(null, user);
        });
        this.passport = passport;
        return passport;
    },
    getPassport: function(){ return this.passport; }
    
}

