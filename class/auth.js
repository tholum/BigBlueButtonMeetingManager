module.exports = {
    expressRoutes: function( app , config , passport , database ){
        app.get('/app/logout', function(req, res){  req.logout(); res.redirect('/app/');});
        app.get('/app/userInfo' , function( req , res ){ 
            var send = { loggedIn : false , userInfo : req.user }
            if( req.hasOwnProperty('user') ){
                if( req.user.hasOwnProperty('user_id') ){
                    send.loggedIn = true;
                }
            }
            res.send(send);
        }); 
        app.get('/app/auth/facebook', passport.authenticate('facebook'));
        app.get('/app/auth/facebook/callback', 
        passport.authenticate('facebook', { successRedirect: '/app/',
                                            failureRedirect: '/app/' }));
                
        
    },
    getUserInfo: function( user_id , done ){
        database.query("SELECT * FROM tbl_user WHERE user_id = '" + user_id + "'" , function(err, rows){
            done( null , rows[0]);
        });
    },
    init: function( app , express , database , config  ){
        var authObject = this;
        var passport = require('passport');
        var FacebookStrategy = require('passport-facebook').Strategy;
        passport.use(new FacebookStrategy({
            clientID: config.auth.facebook.appId,
            clientSecret: config.auth.facebook.appSecret,
            callbackURL: "http://bigblue.slimcrm.com/app/auth/facebook/callback"
          },
          function(accessToken, refreshToken, profile, done) {
              database.query("SELECT * FROM module_auth WHERE module_name = 'facebook' AND module_id = '" + profile.id + "'",
              function(err, rows, fields){
          if( rows.length == 0 ){
               console.log( profile.name.givenName );
               var sql = "INSERT INTO tbl_user ( `first_name` , `last_name` ) VALUES( '" + profile.name.givenName + "' , '" + profile.name.familyName + "' )";
               database.query( sql , function(err2, rows2){
                    console.log( [ rows2 , err2] );
                    var sql2 = "INSERT INTO module_auth ( `module_name` , `module_id` , `user_id` ) VALUES ( 'facebook' , '" + profile.id + "' , '" + rows2.insertId+ "')";
                        database.query( sql2 , function( err3 , rows3 ){
                              console.log( rows2.insertId );
                              authObject.getUserInfo( rows2.insertId , done );
                        });
                });
            } else {
               console.log( "Found:" + rows[0].user_id )
               authObject.getUserInfo(  rows[0].user_id , done );
            }
      });
          } 
        ));
        app.configure(function() {
            app.use(express.static('public'));
            app.use(express.cookieParser());
            app.use(express.bodyParser());
            app.use(express.session({ secret: 'Sdfja9Er0343243' }));
            app.use(passport.initialize());
            app.use(passport.session());
            app.use(app.router);
          });

        this.expressRoutes( app , config , passport , database );

        passport.deserializeUser(function(user, done) {
          done(null, user);
        });
        passport.serializeUser(function(user, done) {
                done(null, user);
              });
        console.log('Init');
        this.passport = passport;
        this.FacebookStrategy = FacebookStrategy;
    },
    
}

