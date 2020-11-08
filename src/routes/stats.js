// const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {errText, StringFormat} = require("../models/assets/dataError");
const {
    Stat
} = require('../models/stat');


// GET ['api/fields']
router.get('/', async (req, res, next) => {
    const stats = await Stat.find();
    res.send(stats);
});


// GET ['api/fields/:childId']
router.get('/:childId', async (req, res) => {
    const stats = await Stat.find({
        childId: req.params.childId
    });
    if (!stats)
        return res.status(404).send(StringFormat(errText.statByChildIdNotExist, req.params.childId));

    res.send(stats);
});

// GET ['api/fields/:id/:field']
router.get('/:childId/:fieldName', async (req, res) => {
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

    res.send(stats.sheets[field]);
});


module.exports = router;