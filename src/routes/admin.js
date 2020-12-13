const express = require('express');
const router = express.Router();
const path = require('path');
const {
    check,
    initDB,
    belongChildrenToParent,
    addStats
} = require('../models/assets/models_driver');

router.get('/', async (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../../client/admin.html'));
});

router.get('/check', async (req, res) => {
    let notes = await check();
    res.status(200).send();
});

router.get('/initdb', async (req, res) => {
    let notes = await initDB();
    let htmlString = '';
    notes.forEach(n => {
        htmlString = htmlString.concat(`<h4>${n}</h4>`);
    });
    res.set('Content-Type', 'text/html');
    res.status(200).send(htmlString);
});

router.get('/belongChildrenToParent', async (req, res) => {
    let notes = await belongChildrenToParent();
    let htmlString = '';
    notes.forEach(n => {
        htmlString = htmlString.concat(`<h4>${n}</h4>`);
    });
    res.set('Content-Type', 'text/html');
    res.status(200).send(htmlString);
});

router.get('/addstats', async (req, res) => {
    let notes = await addStats();
    let htmlString = '';
    notes.forEach(n => {
        htmlString = htmlString.concat(`<h4>${n}</h4>`);
    });
    res.set('Content-Type', 'text/html');
    res.status(200).send(htmlString);
});

module.exports = router;