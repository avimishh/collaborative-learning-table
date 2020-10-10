const mongoose = require('mongoose');
const logger = require('./logging');
const config = require('config');

// Main Export
module.exports = function() {
    // Connect DB
    const db = config.get('db');
    mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology:true,
        useCreateIndex: true
        })
        .then(() => logger.info(`Connected to ${db}...`))
        .catch(err => console.log('Could not connect to MongoDB...', err));
        // .catch(() => logger.info(`Connected to ${db}...`));
            // err => console.log('Could not connect to MongoDB...', err));
}