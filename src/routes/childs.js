const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Child, validate } = require('../models/child');
// const admin = require('../middleware/admin');

// HTTP Handling

// GET ['api/childs']
router.get('/', async (req, res) => {
    const childs = await Child.find().sort('firstName');
    res.send(childs);
});


// GET ['api/childs/:id']
router.get('/:id', async (req, res) => {
    // Find
    const child = await Child.findOne({ id: req.params.id });
    // Check if exist
    if (!child)
        return res.status(404).send(`childs ${req.params.id} was not found.`);
    // Send to client
    res.status(200).send(child);
});


// GET ['api/childs/:id/:password']
router.get('/:id/:password', async (req, res) => {
    // Find
    const child = await Child.findOne({ id: req.params.id });
    // Check if password is correct
    if (child.gamesPassword !== req.params.password)
        return res.status(400).send(`childs ${req.params.password} is incorrect.`);
    // Check if exist
    if (!child)
        return res.status(404).send(`childs ${req.params.id} was not found.`);
    // Send to client
    res.status(200).send(child);
});


// POST ['api/childs']
router.post('/', async (req, res) => {
    // Validate client input
    const { error } = validate(req.body);
    // Assert validation
    if (error)
        return res.status(400).send(error.details[0].message);
    // Create new document
    let child = new Child({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        id: req.body.id,
        birth: req.body.birth,
        gender: req.body.gender,
        gamesPassword: req.body.gamesPassword,
        address: req.body.address,
        phone: req.body.phone,
        level: req.body.level
    });
    // Save to DataBase
    child = await child.save();
    // Send response to client
    res.status(200).send(child);
});


// PUT ['api/childs/:id']
router.put('/:id', async (req, res) => {
    // Validate client input
    const { error } = validate(req.body);
    // Assert validation
    if (error)
        return res.status(400).send(error.details[0].message);
    // Try to update the selected document
    try {
        const child = await Child.findOneAndUpdate({ id: req.params.id }, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            id: req.body.id,
            birth: req.body.birth,
            gender: req.body.gender,
            gamesPassword: req.body.gamesPassword,
            address: req.body.address,
            phone: req.body.phone,
            level: req.body.level
        }, {
            new: true, useFindAndModify: false
        });
        // Assert update completed successfully
        if (!child)
            return res.status(404).send(`Childs ${req.params.id} was not found.`);
        // Send response to client
        res.status(200).send(child);
    } catch (ex) {
        return res.status(404).send(`Failed to update.`);
    }
});


// DELETE ['api/childs/:id']
router.delete('/:id', async (req, res) => {
    // Try to delete the selected document
    try {
        const child = await Child.findOneAndRemove({ id: req.params.id });
        // Assert delete completed successfully
        if (!child)
            return res.status(404).send(`Childs ${req.params.id} was not found.`);

        // Send response to client
        res.send(child);
    }
    catch (ex) {
        return res.status(404).send(`Faild to deleting.`);
    }
});


// Module exports
module.exports = router;