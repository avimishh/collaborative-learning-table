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

// GET 'api/fields/:id/:field'
router.get('/:id/:field', async (req, res) => {
    let field = field_To_English(req.params.field);
    console.log(field);
    const stats = await Stat.findOne({ child_id: req.params.id }).populate({
        path: `sheets.${field}.game`,
        select: '-_id title icon',
    });

    if (!stats) return res.status(404).send(`Stat ${req.params.id} was not found.`);
    // console.log(stats.sheets[field]);
    res.send(stats.sheets[field]);
});


function field_To_English(fieldName) {
    let res = '';
    switch (fieldName) {
        case 'חשבון':
            res = 'math'
            break;
        case 'אנגלית':
            res = 'english'
            break;
        case 'צבעים':
            res = 'color'
            break;
        case 'זכרון':
            res = 'memory'
            break;
        default:
            res = 'general'
            break;
    }
    return res;
}

module.exports = router;