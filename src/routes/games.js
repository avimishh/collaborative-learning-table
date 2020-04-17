// add get by field

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Game, validate } = require('../models/game');
const {Field} = require('../models/field');

// HTTP Handling


// GET ['api/customers']
router.get('/', async (req,res) => {
    const games = await game.find().sort('name');
    res.send(games);
});


// GET ['api/customers/:id']
router.get('/:id', async (req,res) => {
    // Find
    const game = await game.findById(req.params.id);
    // Check if exist
    if(!game) 
        return res.status(404).send(`Game ${req.params.id} was not found.`);
    // Send to client
    res.status(200).send(game);
});


// POST ['api/customers']
router.post('/', async (req,res) => {
    // Validate client input
    const { error } = validate(req.body);
    // Assert validation
    if(error)
        return res.status(400).send(error.details[0].message);
    // Validate field
    const field = await Field.findById(req.body.fieldId);
    if(!field) return res.status(400).send('Invalid field.');
    
    // Create new document
    const game = new Game( {
        title: req.body.title,
        field: {
            _id: field._id,
            name: field.name
        },
        numerInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    // Save to DataBase
    await game.save();
    // Send response to client
    res.status(200).send(game);
});


// PUT ['api/customers/:id']
router.put('/:id', async (req,res) => {
    // Validate client input
    const { error } = validate(req.body);
    // Assert validation
    if(error)
        return res.status(400).send(error.details[0].message);
    // Try to update the selected document
    try{
        const game = await Game.findByIdAndUpdate(req.params.id, {name: req.body.name}, {
            new: true, useFindAndModify: false
        });
        // Assert update completed successfully
        if(!game) 
            return res.status(404).send(`Customer ${req.params.id} was not found.`);
        // Send response to client
        res.status(200).send(game); 
    }catch(ex){
        return res.status(404).send(`Failed to update.`);
    }
});


// DELETE ['api/customers/:id']
router.delete('/:id', async (req,res) => {
    // Try to delete the selected document
    try{
        const game = await Game.findByIdAndRemove(req.params.id);
        // Assert delete completed successfully
        if(!game) 
            return res.status(404).send(`Customer ${req.params.id} was not found.`);

        // Send response to client
        res.send(game);
    }
    catch(ex){
        return res.status(404).send(`Faild to deleting.`); 
    }
});


// Module exports
module.exports = router;