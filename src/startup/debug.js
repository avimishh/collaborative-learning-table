const debug = require('debug')('app:startup');
const morgan = require('morgan');

// const morganFormat = 'tiny';
const morganFormat = ':date :method :url :status :res[content-length] - :response-time ms';

module.exports = function(app){
    app.use(morgan(morganFormat));
    debug('Morgan enabled...');
}