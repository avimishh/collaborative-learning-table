// Imports: Winston - Logging
//          debug
const debug = require('debug')('app:startup');
const winston = require('winston');

// Express App
const express = require('express');
const app = express();

// START UP
const logger = require('./startup/logging');
require('./startup/debug')(app);

require('./startup/routes')(app);
require('./startup/db')();
// require('./startup/config')();
require('./startup/validation')();

// Debug
// if(app.get('env') === 'development') {
//     require('./startup/debug')(app);
// }

// Server
const port = process.env.PORT || 3000;
// debug(`PORT:${process.env.PORT}`);
app.listen(port, () => logger.info(`Listening on port ${port}...`));