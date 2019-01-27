const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function createTokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signup = function(req, res, next) {

  const email = req.body.email;
  const password = req.body.password;


  // see if a user with a given email exists
  User.findOne({ email: email }, function(err, existingUser) {
    
    if(err) { return next(err); }

    // todo: more checks
    if(!email || !password) {
      return res.status(422).send({ error: "Please provide email and password" });
    }
  
    // if yes --> error
    if(existingUser) {
      return res.status(422).send({ error: 'User with this email already exists' });
    }

    // if not --> create user
    const user = new User({
      email: email,
      password: password
    });

    user.save( function(err) {
      if(err) { return next(err); }
    });

    //const token = createTokenForUser(user);
    // respond to request with information
    return res.status(200).send({ 
      success: true,
      token: createTokenForUser(user) 
    }); 
  });

}

exports.signin = function(req, res, next) {
  // user is already authenticated through passport middleware
  
  const user = req.user;

  res.status(200).send({
    success: true,
    token: createTokenForUser(user)
  });
}