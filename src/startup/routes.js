// Express Import
const express = require('express');
const cors = require('cors');

// Routes Import
const fields = require('../routes/fields');
const games = require('../routes/games');
const users = require('../routes/users');
const auth = require('../routes/auth');
const childs = require('../routes/childs');
const parents = require('../routes/parents');


// Error Middleware Import
const error = require('../middleware/error');

const publicPath = `${__dirname}/../public`

// Main function
module.exports = function(app) {
    app.use(cors({
        exposedHeaders: ['x-auth-token']
    }));
    app.use(express.json());
    console.log(publicPath);
    app.use('/static', express.static(publicPath))
    app.use('/api/fields', fields);
    app.use('/api/games', games);
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/api/childs', childs);
    app.use('/api/parents', parents);
    app.use(error);
}