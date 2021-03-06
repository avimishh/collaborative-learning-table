// Express Import
const express = require('express');
const cors = require('cors');

// Routes Import
const admin = require('../routes/admin');
const home = require('../routes/home');
const fields = require('../routes/fields');
const games = require('../routes/games');
const auth = require('../routes/auth');
const childs = require('../routes/childs');
const parents = require('../routes/parents');
const teachers = require('../routes/teachers');
const stats = require('../routes/stats');
const notes = require('../routes/notes');

// Error Middleware Import
const error = require('../middleware/error');

// const publicPath = `${__dirname}/../public`;
// const publicPath = `${__dirname}/../../client/`;


// Main function
module.exports = function(app) {
    app.use(cors({
        exposedHeaders: ['x-auth-token']
    }));
    app.use(express.json());
    // console.log(publicPath);
    app.use('/', home);
    // app.use('/', express.static(publicPath))
    app.use('/admin', admin);
    app.use('/api/fields', fields);
    app.use('/api/games', games);
    app.use('/api/auth', auth);
    app.use('/api/childs', childs);
    app.use('/api/parents', parents);
    app.use('/api/teachers', teachers);
    app.use('/api/stats', stats);
    app.use('/api/notes', notes);
    app.use(error);
}