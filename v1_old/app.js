//general
var express = require('express');
var app = express();
//parsing site elements
var bodyParser = require('body-parser');
//db
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
//socket
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');

//connect to MongoDB
//mongoose.connect('mongodb://localhost/urlocv1');
mongoose.connect('mongodb://localhost/urlocv1', { useMongoClient: true })
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parse incoming requests - enable to pare body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from template
//app.use(express.static('__dirname + '/client''));
//app.use(express.static(path.join(__dirname, 'client')));


// include routes from routes file
var routes = require('./routes/router');
//apply routes
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


//socket
io.on('connect', (socket) => {

  console.log('A user connected!'); // We'll replace this with our own events
  
});



// listen on port 8000
app.listen(8000, function () {
  console.log('Express app listening on port 8000');
});