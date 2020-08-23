// const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Stat } = require('../models/stat');


// GET 'api/fields'
router.get('/', async (req, res, next) => {
    // DEBUG
    // throw new Error('Could not get the fields.');

    const stats = await Stat.find();//.sort('name');
    res.send(stats);
});


// GET 'api/fields/:id'
router.get('/:id', async (req, res) => {
    const stats = await Stat.find({ child_id: req.params.id });

    if (!stats) return res.status(404).send(`Stat ${req.params.id} was not found.`);

    res.send(stats);
});


module.exports = router;