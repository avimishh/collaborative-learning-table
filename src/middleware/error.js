// Handle Errors
const logger = require('../startup/logging');

module.exports = function(err, req, res, next){
    // Log the exception
    // logger.error(err.message, err);

    // error
    // warn
    // info
    // verbose
    // debug
    // silly
    console.log(err);
    res.status(500).send('Something failed.');
}