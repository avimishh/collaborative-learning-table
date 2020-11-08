// const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {errText, StringFormat} = require("../models/assets/dataError");
const {
    Field,
    validateField
} = require('../models/field');


// GET ['api/fields']
router.get('/', async (req, res, next) => {
    const fields = await Field.find().select('-__v').sort('name');
    res.status(200).send(fields);
});


// GET ['api/fields/:id']
router.get('/:id', validateObjectId, async (req, res) => {
    const field = await Field.findById(req.params.id);
    if (!field)
        return res.status(404).send(StringFormat(errText.fieldByIdNotExist, req.params.id));

    res.status(200).send(field);
});


// POST
// router.post('/', [auth,admin], async (req,res) => {
router.post('/', auth, async (req, res) => {
    const {
        error
    } = validateField(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    // Check if the field exist
    let fieldExist = await Field.findOne({
        name: req.body.name
    });
    if (fieldExist)
        return res.status(400).send(StringFormat(errText.fieldByNameAlreadyExist, req.body.name));

    let field = new Field({
        name: req.body.name,
        description: req.body.description,
        nameEng: req.body.nameEng
    });
    field = await field.save();

    res.status(200).send(field);
});


// PUT
router.put('/:id', validateObjectId, async (req, res) => {
    const {
        error
    } = validateField(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    var field;
    try { // Try to update the selected document
        field = await Field.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            description: req.body.description,
            nameEng: req.body.nameEng
        }, {
            new: true
        });
    } catch (ex) {
        return res.status(404).send(errText.failedToUpdate);
    }
    if (!field)
        return res.status(404).send(StringFormat(errText.fieldByIdNotExist, req.params.id));

    res.status(200).send(field);
});


// DELETE
router.delete('/:id', validateObjectId, [auth, admin], async (req, res) => {
    const field = await Field.findByIdAndRemove(req.params.id);
    if (!field)
        return res.status(404).send(StringFormat(errText.fieldByIdNotExist, req.params.id));

    res.status(200).send(field);
});


module.exports = router;