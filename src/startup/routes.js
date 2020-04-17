// Express Import
const express = require('express');
// Routes Import
const fields = require('../routes/fields');
const games = require('../routes/games');
const users = require('../routes/users');
const auth = require('../routes/auth');
// Error Middleware Import
const error = require('../middleware/error');


// Main function
module.exports = function(app) {
    app.use(express.json());
    app.use('/api/fields', fields);
    app.use('/api/games', games);
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use(error);
}