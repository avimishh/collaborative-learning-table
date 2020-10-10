const debug = require('debug')('app:startup');
const morgan = require('morgan');

// const morganFormat = 'tiny';
const morganFormat = '[:date] [:method :status] [:response-time ms]  :url :res[content-length]';

module.exports = function(app){
    app.use(morgan(morganFormat));
    // app.use(morgan('dev', {
    //     skip: function (req, res) { return res.statusCode < 400 }
    //   }));
    debug('Morgan enabled...');
}