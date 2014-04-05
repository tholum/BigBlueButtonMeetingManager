module.exports = {
    init: function( app , database , config ){
        var passport = require('passport');
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
               var sql = "INSERT INTO tbl_user ( `first_name` , `last_name` ) VALUES( '" + profile.name.givenName + "' , '" + profile.name.familyName + "' )";
               database.query( sql , function(err2, rows2){
                    console.log( [ rows2 , err2] );
                    var sql2 = "INSERT INTO module_auth ( `module_name` , `module_id` , `user_id` ) VALUES ( 'facebook' , '" + profile.id + "' , '" + rows2.insertId+ "')";
                        database.query( sql2 , function( err3 , rows3 ){
                              console.log( rows2.insertId );
                              done( null , { user_id : rows2.insertId } );
                        });
                });
            } else {
               console.log( "Found:" + rows[0].user_id )
               done( null , { user_id : rows[0].user_id } );
            }
      });
          } 
        ));

        app.get('/app/userInfo' , function( req , res ){ res.send(req.user);}); 
        app.get('/app/auth/facebook', passport.authenticate('facebook'));
        app.get('/app/auth/facebook/callback', 
        passport.authenticate('facebook', { successRedirect: '/app/',
                                            failureRedirect: '/app/' }));
                passport.serializeUser(function(user, done) {
                done(null, user);
              });

        passport.deserializeUser(function(user, done) {
          done(null, user);
        });
        console.log('Init');
        this.passport = passport;
        this.FacebookStrategy = FacebookStrategy;
    },
    
}

