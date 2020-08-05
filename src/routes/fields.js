// const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Field, validateField } = require('../models/field');


// GET 'api/fields'
router.get('/', async (req, res, next) => {
    // DEBUG
    // throw new Error('Could not get the fields.');

    const fields = await Field.find().select('-__v').sort('name');
    res.send(fields);
});


// GET 'api/fields/:id'
router.get('/:id', validateObjectId, async (req, res) => {
    const field = await Field.findById(req.params.id);
    if (!field) return res.status(404).send(`Field ${req.params.id} was not found.`);

    res.send(field);
});


// POST
// router.post('/', [auth,admin], async (req,res) => {
router.post('/', auth, async (req, res) => {
    // validate input
    const { error } = validateField(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let field = new Field({
        name: req.body.name,
        description: req.body.description
    });

    field = await field.save();
    res.status(200).send(field);
});


// PUT
router.put('/:id', async (req, res) => {
    const { error } = validateField(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    try {
        const field = await Field.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            description: req.body.description
        },
            {
                new: true,
                usefindAndModify: false
            });

        if (!field)
            return res.status(404).send(`Field ${req.params.id} was not found.`);

    } catch (ex) {
        return res.status(404).send(`Failed to update.`);
    }

    res.status(200).send(field);

});


// DELETE
router.delete('/:id', [auth, admin], async (req, res) => {
    const field = await Field.findByIdAndRemove(req.params.id);

    if (!field)
        return res.status(404).send(`Field ${req.params.id} was not found.`);

    res.send(field);
});


module.exports = router;