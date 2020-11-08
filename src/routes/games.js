const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {errText, StringFormat} = require("../models/assets/dataError");
const validateObjectId = require('../middleware/validateObjectId');
const {
    Game,
    validateGame
} = require('../models/game');
const {
    Field
} = require('../models/field');


// GET ['api/games']
router.get('/', async (req, res) => {
    const games = await Game.find().sort('name');
    if (!games)
        return res.status(404).send(errText.gamesNotExist);

    res.status(200).send(games);
});


// GET ['api/games/:id']
router.get('/:id', validateObjectId, async (req, res) => {
    const game = await Game.findById(req.params.id);
    if (!game)
        return res.status(404).send(StringFormat(errText.gameByIdNotExist, req.params.id));

    res.status(200).send(game);
});


// GET ['api/games/:field'] - get games by field
router.get('/getByFieldName/:fieldName', async (req, res) => {
    const games = await Game.find({
        "field.name": req.params.fieldName
    });
    if (!games)
        return res.status(404).send(StringFormat(errText.gamesByFieldNotExist, req.params.fieldName));

    res.status(200).send(games);
});


// POST ['api/games']
router.post('/', async (req, res) => {
    const {
        error
    } = validateGame(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    // Validate field
    const field = await Field.findOne({
        name: req.body.fieldName
    }).select("_id name description nameEng");
    if (!field)
        return res.status(400).send(StringFormat(errText.fieldByNameNotExist, req.body.fieldName));

    // Check if the game exist
    let gameExist = await Game.findOne({
        title: req.body.title
    });
    if (gameExist)
        return res.status(400).send(StringFormat(errText.gameByNameAlreadyExist, req.body.title));


    let game = new Game({
        title: req.body.title,
        description: req.body.description,
        field,
        icon: req.body.icon,
        link: req.body.link
    });
    await game.save();

    res.status(200).send(game);
});


// PUT ['api/games/:id']
router.put('/:id', validateObjectId, async (req, res) => {
    const {
        error
    } = validateGame(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    var game;
    try {
        game = await Game.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            description: req.body.description,
            icon: req.body.icon,
            link: req.body.link
        }, {
            new: true
        });
    } catch (ex) {
        return res.status(400).send(errText.failedToUpdate);
    }
    if (!game)
        return res.status(404).send(StringFormat(errText.gameByIdNotExist, req.params.id));

    res.status(200).send(game);
});


// DELETE ['api/games/:id']
router.delete('/:id', validateObjectId, async (req, res) => {
    const game = await Game.findByIdAndRemove(req.params.id);
    if (!game)
        return res.status(404).send(StringFormat(errText.gameByIdNotExist, req.params.id));

    res.status(200).send(game);
});


// Module exports
module.exports = router;