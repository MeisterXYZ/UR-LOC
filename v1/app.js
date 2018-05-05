//express
var express = require('express');
var app =  express();
var http = require('http').Server(app);
//socket io
var io = require('socket.io')(http);
//parsing site elements
var bodyParser = require('body-parser');
//db
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var User = require('./models/user');

//connect to MongoDB
//mongoose.connect('mongodb://localhost/urlocv1');
mongoose.connect('mongodb://localhost/urlocv1')
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log("we're connected!");
});

//use sessions for tracking logins
//use mongodb for sessin middleware
var sessionMiddleware = session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
  });
//enable sessions for socket io
io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});
//apply session middleware
app.use(sessionMiddleware);



// parse incoming requests - enable to pare body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from template
app.use(express.static(__dirname + '/client'));

// include routes from routes file
var routes = require('./routes/router');
//apply routes
app.use('/', routes);


//The business logic for lobby
var noOfClients = 0;

io.on('connection', function(socket){
  socket.on('disconnect', function () {
    noOfClients--;
    socket.broadcast.emit('hello', { info: 'user.username + , you are beautiful. <3 - online: '+ noOfClients});
  });
  noOfClients++;
  console.log('a user connected');
  console.log(socket.request.session.userId);
  if(socket.request.session.userId){
    User.findOne({ _id: socket.request.session.userId })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      console.log(user);
      console.log("online: "+noOfClients);
      io.sockets.emit('hello', { info: user.username + ', you are beautiful. <3 - online: '+  noOfClients});
    });
  }
});


http.listen(8000, function(){
  console.log('listening on *:8000');
});
    