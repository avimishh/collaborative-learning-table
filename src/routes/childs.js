const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Child, validate } = require('../models/child');
// const admin = require('../middleware/admin');

// HTTP Handling

// GET ['api/childs']
router.get('/', async (req,res) => {
    const childs = await Child.find().sort('name');
    res.send(childs);
});


// GET ['api/childs/:id']
router.get('/:id', async (req,res) => {
    // Find
    const child = await Child.findById(req.params.id);
    // Check if exist
    if(!child) 
        return res.status(404).send(`childs ${req.params.id} was not found.`);
    // Send to client
    res.status(200).send(child);
});


// POST ['api/childs']
router.post('/', async (req,res) => {
    // Validate client input
    const { error } = validate(req.body);
    // Assert validation
    if(error)
        return res.status(400).send(error.details[0].message);
    // Create new document
    let child = new Child( {
        name: req.body.name,
        id: req.body.id,
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
router.put('/:id', async (req,res) => {
    // Validate client input
    const { error } = validate(req.body);
    // Assert validation
    if(error)
        return res.status(400).send(error.details[0].message);
    // Try to update the selected document
    try{
        const child = await Child.findByIdAndUpdate(req.params.id, {name: req.body.name}, {
            new: true, useFindAndModify: false
        });
        // Assert update completed successfully
        if(!child) 
            return res.status(404).send(`Childs ${req.params.id} was not found.`);
        // Send response to client
        res.status(200).send(child); 
    }catch(ex){
        return res.status(404).send(`Failed to update.`);
    }
});


// DELETE ['api/childs/:id']
router.delete('/:id', async (req,res) => {
    // Try to delete the selected document
    try{
        const child = await Child.findByIdAndRemove(req.params.id);
        // Assert delete completed successfully
        if(!child) 
            return res.status(404).send(`Childs ${req.params.id} was not found.`);

        // Send response to client
        res.send(child);
    }
    catch(ex){
        return res.status(404).send(`Faild to deleting.`); 
    }
});


// Module exports
module.exports = router;