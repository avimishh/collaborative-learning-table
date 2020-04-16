const mongoose = require('mongoose');
const logger = require('./logging');


// Main Export
module.exports = function() {
    // Connect DB
    // hard coding connection string
    mongoose.connect('mongodb://localhost/collearn', {
        useNewUrlParser: true,
        useUnifiedTopology:true
        })
        .then(() => logger.info('Connected to MongoDB...'))
        .catch(err => console.err('Could not connect to MongoDB...', err));
}