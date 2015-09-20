var express = require('express');
var router = express.Router();
var app = require('../app');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var passport = require('passport');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/podwithfriends');

var UserSchema = new mongoose.Schema({username: String, 
                    _id: String, //email
                    password: String});

UserSchema.methods.validPassword = function(pw){
    return bcrypt.compareSync(pw, this.password);
}
UserSchema.methods.encryptPassword = function(){
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
};

var User = mongoose.model('User', UserSchema);

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
