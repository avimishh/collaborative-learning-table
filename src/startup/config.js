const config = require('config');

// Main Export
module.exports = function() {
    if (!config.get('jwtPrivateKey')){
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    }
}