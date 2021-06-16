var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var morgan = require('morgan');
var app = express();
var router = express.Router();
var jade = require('jade');
const winston = require('./middlewares/logger_service');
var index = require('./superadmin/controller/index');
var register = require('./superadmin/controller/registration');
var forgotpassword = require('./superadmin/controller/forgotpassword');
var validateotp = require('./superadmin/controller/validateotp');
var changepassword = require('./superadmin/controller/changepassword');
var personaldetails = require('./superadmin/controller/personaldetails');
var profile = require('./superadmin/controller/profile');
var decrypt = require('./superadmin/controller/decrypt');
var main = require('./superadmin/controller/main');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

app.engine('jade', require('jade').renderFile);
app.set('view engine', 'jade');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/register', register);
app.use('/forgotpassword', forgotpassword);
app.use('/validateotp', validateotp);
app.use('/changepassword', changepassword);
app.use('/index', index);
app.use('/main', main);
app.use('/profile', profile);
app.use('/personaldetails', personaldetails);
app.use('/decrypt', decrypt);
app.use(morgan('combined', { stream: winston.stream }));
app.use(function (req, res, next) {
    next(createError(404));
  });
  app.get('/', (req, res) => {
    return res.send('welcome to besttimber tool');
  });
  // error handler 
 app.use(function errorHandler (err, req, res, next) {
    res.status(500)
    res.render('error', { error: err })
    winston.error(err);
  });

  app.listen(4003);
  module.exports = app;