var express = require('express');
var router = express.Router();
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var User = require('../models/user');

//Passport fun
passport.serializeUser(function(user, done) {
      done(null, user._id);
});

passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
              done(err, user);
                });
});



passport.use('login', new LocalStrategy(
  function(username, password, done) {
    User.findOne({ _id: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));
passport.use('signup', new LocalStrategy(
            {usernameField:'_id',
                passReqToCallback: true,
            },
    function(req, username, password, done) {
        var u = new User(req.body);
        u.encryptPassword();
        console.log(u);
        u.save(function(err){
            done(null, err?false:u);
        });
    }));


router.get('/create', function(req, res, next){
    res.render('create');
});

router.post('/create', passport.authenticate('signup', {successRedirect:'/',
            failureRedirect:'/users/create',}));

router.get('/login', function(req, res, next){
    res.render('login');
});

router.post('/login',
        passport.authenticate('login',
            { successRedirect: '/',
                failureRedirect: '/users/login' }));

router.get('/logout',
        function(req, res, next){
        req.logout();
        res.redirect('/');
        });


module.exports = router;
