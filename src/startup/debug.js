const debug = require('debug')('app:startup');
const morgan = require('morgan');

// const morganFormat = 'tiny';
const morganFormat = '[:date] [:method :status] [:response-time ms]  :url :res[content-length]';

module.exports = function(app){
    app.use(morgan(morganFormat, {
        skip: function (req, res) { 
            if(res.statusCode === 304){
                if(req.originalUrl.startsWith("/lib/") || req.originalUrl.startsWith("/images/"))
                    return true;
            }
            return false; }
    }));
    debug('Morgan enabled...');
}