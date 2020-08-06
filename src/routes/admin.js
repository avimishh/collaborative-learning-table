const express = require('express');
const router = express.Router();
const { initDB } = require('../models/assets/models_driver');

router.get('/initdb', async (req, res) => {
    let notes = await initDB();
    let htmlString = '';
    notes.forEach(n => {
        htmlString = htmlString.concat(`<h2>${n}</h2>`);
    });
    res.set('Content-Type', 'text/html');
    res.status(200).send(htmlString);
});

module.exports = router;