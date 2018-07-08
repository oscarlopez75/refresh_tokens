var express = require('express');
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken')
var randtoken = require('rand-token')
var passport = require('passport')
var JwtStrategy = require('passport-jwt').Strategy
var ExtractJwt = require('passport-jwt').ExtractJwt

var connect = require('../modules/dbConnect');
var check_user = require('../modules/check_user');
var addRefresh = require('../modules/addRefresh');
var checkRefreshToken = require('../modules/check_refresh_token');
var deleteRefreshToken = require('../modules/delete_refresh_token');


var router = express.Router();
//var SECRET = process.env.JWT_SECRET;

router.use(passport.initialize())
router.use(passport.session())

passport.serializeUser(function (user, done) {
  done(null, user.login)
})

/*
passport.deserializeUser(function (username, done) {
  done(null, username)
})
*/
//******************************************************************************
var opts = {}

// Setup JWT options
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt")
opts.secretOrKey = process.env.JWT_SECRET

passport.use(new JwtStrategy(opts, function (jwtPayload, done) {
  //If the token has expiration, raise unauthorized
  // var expirationDate = new Date(jwtPayload.exp * 1000)
  // if(expirationDate < new Date()) {
  //   return done(null, false);
  // }
  var user = jwtPayload
  done(null, user)
}))

//******************************************************************************
//******************************************************************************



router.get('/', function(req, res){
  res.json(
    {
      message:"Welcome to the user validation api"
    });
});

router.post('/login', function (req, res, next) {
  connect.checkCon()
    .then(check_user.userok.bind(null, req.body.username, req.body.password, req.ip))
    .then(function(){
      var username = req.body.username
      var password = req.body.password
      var user = {
        'login': username,
        'message' : 'You can put whatever here'
      }
      checkRefreshToken.checkDuplicate(username)
        .then((refreshToken) => {
          var token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: 60 })
          res.json({token: 'JWT ' + token, refreshToken: refreshToken})
        })
        .catch(() => {
          var token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: 60 })
          var refreshToken = randtoken.uid(256);
          addRefresh.insert_refresh(username, refreshToken);
          res.json({token: 'JWT ' + token, refreshToken: refreshToken})
        })
    })
    .catch(function(err){
      //console.log("Error from router.js " + err);
      res.status(400).json({message: err});
    });



});

router.post('/token', function (req, res, next) {
  var username = req.body.username
  var refreshToken = req.body.refreshToken

  checkRefreshToken.checkReToken(username, refreshToken)
    .then(() => {
      var user = {
        'login': username,
        'message' : 'You can put whatever here'
      }
      var token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: 60 })
      res.json({token: 'JWT ' + token});
    })
    .catch(() => {
      res.json({message: 'Something wrong, no refresh token'});
    })
});

router.post('/token/reject', function (req, res, next) {
  var username = req.body.username
  deleteRefreshToken.deleteReToken(username)
  .then(()=>{
    res.json({message: 'refresh tokens deleted'})
  })
  .catch(() => {
    res.json({message: 'NO refresh tokens to be deleted'})
  })
})

router.get('/test_jwt', passport.authenticate('jwt'), function (req, res) {
  res.json({success: 'You are authenticated with JWT!', info: req.user})
})


module.exports = router;
