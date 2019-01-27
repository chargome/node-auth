const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');


/*
        # # # # LOCAL # # # # #
*/

// Setup for local strategy
const localOptions = {
  usernameField: 'email'
}

// Create LocalStrategy
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
  
  // verify email and pw
  // call done if correct
  // otherwise call done with false
  User.findOne({ email: email }, function(err, user) {

    if(err) { return done(err) };
    if(!user) { return done(null, false); }

    user.comparePassword(password, function(err, isMatch) {

      if(err) { return done(err) };
      if(!isMatch) {
        return done(null, false);
      }

      return done(null, user);
    })
  })
  
});

/*
        # # # # JWT # # # # #
*/


// Setup for Jwt strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JwtStrategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {

  User.findById(payload.sub, function(err, user) {
    if(err) { return done(err, false); }

    if(user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });

});

passport.use(jwtLogin);
passport.use(localLogin);