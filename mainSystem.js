var lessMiddleware = require('less-middleware');
var express = require('express');
var app = express();
var bbb = require('bigbluebutton');
var config = require('./config.js');
var crypto = require('crypto');
var shasum = crypto.createHash('sha1');
var sites = {};
var database = require('./class/database.js');
database.init(config);
var passport = require('passport') , 
FacebookStrategy = require('passport-facebook').Strategy;
passport.use(new FacebookStrategy({
    clientID: config.auth.facebook.appId,
    clientSecret: config.auth.facebook.appSecret,
    callbackURL: "http://bigblue.slimcrm.com/app/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
   console.log( profile );
   done( null , profile );
/*
    User.findOrCreate(..., function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
*/
  } 
));
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get('/app/testMysql', function( req , res){
    database.query("show tables" , function(err, rows, fields){
        res.send(rows);
    })
});

app.use(passport.initialize());
app.get('/app/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/app/auth/facebook/callback', 
  passport.authenticate('facebook', { successRedirect: '/app/',
                                      failureRedirect: '/app/' }));

for( site in config.sites ){
   bbb.salt = config.sites[site].salt;
   bbb.url = config.sites[site].url; 
}
app.use(config.appUrl + '/css' , lessMiddleware(__dirname + '/www/css'));
app.use(config.appUrl + '/css' , express.static(__dirname + '/www/css'));
app.use(config.appUrl + '/' , express.static(__dirname + '/www'));

app.get(config.appUrl + "/getMeetings" , function( req , res ){
      bbb.request( { action: 'getMeetings' } , function(error , data){
         res.send(data);
      });
});

app.get( config.appUrl + '/join' , function( req , res ){
   if( req.query.name == '' ){
      name = 'Guest';
   } else {
      name = req.query.name;
   }
   bbb.request( { action: 'getMeetings' } , function(error , meetings){
      var meetingObject = JSON.parse(meetings);
      var attendeePW = '';
      var moderatorPW = '';
      console.log( meetings );
      for( meeting in meetingObject.response.meetings ){
         console.log( meetingObject.response.meetings[meeting].meetingID + "  " + req.query.meetingId );
         if(meetingObject.response.meetings[meeting].meetingID == req.query.meetingId ){
            attendeePW = meetingObject.response.meetings[meeting].attendeePW;
            moderatorPW = meetingObject.response.meetings[meeting].moderatorPW
         }
      }
      data = {
         action: 'join',
         params: {
            meetingID: req.query.meetingId,
            fullName: name,
            password: moderatorPW
         }
      }
      bbb.link(data,function(er,link){
         res.send(link);
      });
      //key = shasum.update( 'join' + p.toUrl( data.params ) + bbb.salt ); 
      //res.send(bbb.url + '/join?'+ p.toUrl( data.params ) + '&checksum=' + key.digest('hex') );
   });
});
app.get( config.appUrl + "/create" , function( req , res ){
   
   data = {
   action: 'create',
      params: { 
         meetingID: req.query.meetingId,
         meetingName: req.query.meetingName
      },
      body: {
         modules: {
            module: [
               {
               name:'presentation',
               document:{url:'http://www.saronicferries.gr/content/pdfFiles/sample.pdf'}
               }
            ]
         }
      }
   }
  bbb.request(data , function( error , data ){ res.send(data); console.log( error );} ); 
});

app.listen(8098);
