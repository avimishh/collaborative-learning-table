// const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { MathStat } = require('../models/mathStat');


// GET 'api/fields'
router.get('/', async (req, res, next) => {
    // DEBUG
    // throw new Error('Could not get the fields.');

    const mathStats = await MathStat.find();//.sort('name');
    res.send(mathStats);
});


// GET 'api/fields/:id'
router.get('/:id', async (req, res) => {
    const mathStats = await MathStat.find({ child: req.params.id });

    if (!mathStats) return res.status(404).send(`Field ${req.params.id} was not found.`);

    res.send(mathStats);
});


module.exports = router;