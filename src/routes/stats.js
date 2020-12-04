// const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {
    errText,
    StringFormat
} = require("../models/assets/dataError");
const {
    Stat
} = require('../models/stat');

const {
    Field
} = require('../models/field');

// GET ['api/']
router.get('/', async (req, res, next) => {
    const stats = await Stat.find();
    res.send(stats);
});


// GET ['api/:childId']
router.get('/:childId', async (req, res) => {
    const stats = await Stat.find({
        childId: req.params.childId
    });
    if (!stats)
        return res.status(404).send(StringFormat(errText.statByChildIdNotExist, req.params.childId));

    res.send(stats);
});

// GET ['api/:id/:field']
router.get('/:childId/:fieldName', async (req, res) => {
    // console.log(req.params);
    const field = await Field.findOne({
        name: req.params.fieldName
    });
    if (!field)
        return res.status(404).send(StringFormat(errText.fieldByNameNotExist, req.params.fieldName));

    const stats = await Stat.findOne({
        childId: req.params.childId
    }).populate({
        path: `sheets.${field.nameEng}.game`,
        select: '-_id title icon',
    });

    if (!stats)
        return res.status(404).send(StringFormat(errText.statByChildIdNotExist, req.params.childId));
    // console.log(stats.sheets[field.nameEng]);

    res.send(stats.sheets[field.nameEng]);
});


module.exports = router;