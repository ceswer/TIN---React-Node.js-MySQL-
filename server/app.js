const dotenv = require('dotenv')
dotenv.config();

const users = require('./routes/API/user');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var prescriptionRouter = require('./routes/prescriptions');
var doctorRouter = require('./routes/doctors');
var patientsRouter = require('./routes/patients');
var drugsRouter = require('./routes/drugs');

var docAPIRouter = require('./routes/API/doctor');
var drugAPIRouter = require('./routes/API/drug');
var patientAPIRouter = require('./routes/API/patient');
var prescAPIRouter = require('./routes/API/prescription')
var oprouter = require('./routes/API/opinion');
var app = express();


var cors = require('cors');
app.locals.moment = require('moment');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/prescriptions', prescriptionRouter);
app.use('/doctors', doctorRouter);
app.use('/patients', patientsRouter);
app.use('/drugs', drugsRouter);

app.use(cors());
app.use('/api/auth', users)
app.use('/api/doctors', docAPIRouter);
app.use('/api/drugs', drugAPIRouter);
app.use('/api/patients', patientAPIRouter);
app.use('/api/prescriptions', prescAPIRouter);
app.use('/api/opinions', oprouter);




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
});

const sequelizeInit = require('./config/sequelize/init');
sequelizeInit().catch(err => {
  console.log(err);
});

module.exports = app;