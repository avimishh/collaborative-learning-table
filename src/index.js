// packages
const debug = require('debug')('app:startup');
const config = require('config');
const morgan = require('morgan');
const Joi = require('joi');
// Routes
const courses = require('./routes/courses');
const home = require('./routes/home');
// Express
const express = require('express');
const app = express(); // The server object

// const logger = require('./logger');


// Enviroment
console.log(`Application Name: ${config.get('name')}`);

// console.log(`NODE_ENV: ${app.get('env')}`);  // 'development' by default


// Middlewares use
app.use(express.json());    // a piece of middleware
// app.use(logger);


if(app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debug('Morgan enabled...');
}

// custom middleware
app.use(function(req, res, next){
    console.log('Authenticating...');
    next();
});


// Routes use
app.use('/', home);
app.use('/api/courses', courses);


// Server
const port = process.env.PORT || 3000;
debug(`PORT:${process.env.PORT}`);
app.listen(port, () => console.log(`Listening on port ${port}...`));