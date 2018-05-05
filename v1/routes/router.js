var express = require('express');
var router = express.Router();
var User = require('../models/user');


// GET index
router.get('/', function (req, res, next) {
  //get rid of hard coded directory 
  return res.sendFile('/Users/meister.xyz/Documents/Coding/NodeJs/ur/v1/client/index.html');
});

// GET register
router.get('/register', function (req, res, next) {
  //get rid of hard coded directory 
  return res.sendFile('/Users/meister.xyz/Documents/Coding/NodeJs/ur/v1/client/register.html');
});

// GET login
router.get('/login', function (req, res, next) {
  //get rid of hard coded directory 
  return res.sendFile('/Users/meister.xyz/Documents/Coding/NodeJs/ur/v1/client/login.html');
});


//POST for login
router.post('/login', function (req, res, next) {
  console.log("post req kam rein");
  if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/lobby');
      }
    });
  }
});


//POST for Register
router.post('/register', function (req, res, next) {
  console.log("post req kam rein");
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    return next(err);
  }
  // validate that all fields were entered 
  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

    //create object
    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
    }

    //use scema for writing to mongodb
    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        console.log("write db was successful")
        req.session.userId = user._id;
        return res.redirect('/lobby');
      }
    });

  }
  else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
  
})


// GET route after registering = enter the lobby
router.get('/lobby', function (req, res, next) {
  console.log('get lobby req by user'+req.session.userId);
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          /*
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
          */
          return res.redirect('/login');
        } else {
          //return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
          //get rid of hard coded directory 
          return res.sendFile('/Users/meister.xyz/Documents/Coding/NodeJs/ur/v1/client/lobby.html');
        }
      }
    });
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});


module.exports = router;
