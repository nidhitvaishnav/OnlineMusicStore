const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');



mongoose.promise = global.Promise;

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

app.use(cors());
app.use(require('morgan')('dev'));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'passport-tutorial',
    cookie: {
        maxAge: 60000
    },
    resave: false,
    saveUninitialized: false
}));

if (!isProduction) {
    app.use(errorHandler());
}

// View Engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

//Configure Mongoose
mongoose.connect('mongodb://127.0.0.1/auth');
mongoose.set('debug', true);

// Models and Routes
require('./models/users');
require('./config/passport');
app.use(require('./routes'));
var musicRouter = require('./routes/music');
app.use('/api/music', musicRouter);



app.get('/', function(req, res, next) {
  res.render('index');
});

app.listen(8000, function() {
    console.log('Server running on http://localhost:8000/')
});
