// add get by field

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Game, validateGame } = require('../models/game');
const { Field } = require('../models/field');

// HTTP Handling

// GET ['api/games']
router.get('/', async (req, res) => {
    const games = await Game.find().sort('name');
    res.send(games);
});


// GET ['api/games/:id']
router.get('/:id', async (req, res) => {
    // Find
    const game = await Game.findById(req.params.id);
    // Check if exist
    if (!game)
        return res.status(404).send(`Game ${req.params.id} was not found.`);
    // Send to client
    res.status(200).send(game);
});


// GET ['api/games/:field'] - get games by field
router.get('/:field', async (req, res) => {
    // Find
    const games = await Game.find({ field: req.params.field });
    // Check if exist
    if (!games)
        return res.status(404).send(`Games with the field ${req.params.field} was not found.`);
    // Send to client
    res.status(200).send(game);
});


// POST ['api/games']
router.post('/', async (req, res) => {
    // Validate client input
    const { error } = validateGame(req.body);
    // Assert validation
    if (error)
        return res.status(400).send(error.details[0].message);
    // Validate field
    const field = await Field.findOne({ name: req.body.field });
    if (!field) return res.status(400).send(`תחום הלימודים ${req.body.field} אינו קיים במערכת.`);
    // Create new document
    let game = new Game({
        title: req.body.title,
        description: req.body.description,
        field: {
            _id: field._id,
            name: field.name
        },
        link: req.body.link
    });
    // Save to DataBase
    await game.save();
    // Send response to client
    res.status(200).send(game);
});


// PUT ['api/games/:id']
router.put('/:id', async (req, res) => {
    // Validate client input
    const { error } = validateGame(req.body);
    // Assert validation
    if (error)
        return res.status(400).send(error.details[0].message);
    // Validate field
    const field = await Field.findOne({ name: req.body.field });
    if (!field) return res.status(400).send(`תחום הלימודים ${req.body.field} אינו קיים במערכת.`);
    // Try to update the selected document
    try {
        const game = await Game.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            description: req.body.description,
            field: {
                _id: field._id,
                name: field.name
            },
            link: req.body.link
        }, {
            new: true, useFindAndModify: false
        });
        // Assert update completed successfully
        if (!game)
            return res.status(404).send(`Game ${req.params.id} was not found.`);
        // Send response to client
        res.status(200).send(game);
    } catch (ex) {
        return res.status(404).send(`Failed to update.`);
    }
});


// DELETE ['api/games/:id']
router.delete('/:id', async (req, res) => {
    // Try to delete the selected document
    try {
        const game = await Game.findByIdAndRemove(req.params.id);
        // Assert delete completed successfully
        if (!game)
            return res.status(404).send(`Game ${req.params.id} was not found.`);

        // Send response to client
        res.send(game);
    }
    catch (ex) {
        return res.status(404).send(`Faild to deleting.`);
    }
});


// Module exports
module.exports = router;