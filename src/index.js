// Imports: Winston - Logging
//          debug
const debug = require('debug')('app:startup');
const winston = require('winston');

// Express App
const express = require('express');
const app = express();

// START UP
const logger = require('./startup/logging');

// moved to here for debug comfort. need to use it inside startup/routes
const publicPath = `${__dirname}/./../client/`;
app.use('/', express.static(publicPath));


// require('./startup/debug')(app);
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

// Debug
if (app.get('env') === 'development') {
    require('./startup/debug')(app);
}

// models Driver
// if (app.get('env') === 'development') {
//     require('./models/assets/models_driver');
// }

// app.get('/', async (req,res) =>{
//     res.sendFile(__dirname + '/home.html');
// });

// Server
const port = process.env.PORT || 3000;
// debug(`PORT:${process.env.PORT}`);
const server = app.listen(port, () => logger.info(`Listening on port ${port}...`));
// console.log(app.listen());
if (app.get('env') !== 'test') {
    require('./startup/socketio')(server, app);
}
// require('./public/server_math/server')(server, app);

module.exports = server;