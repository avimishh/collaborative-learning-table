const Joi = require('joi');
const mongoose = require('mongoose');
const Field = require('./field').Field;


// Model
const Game = mongoose.model('Game', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
        },
    field: {
        type: Field.schema,
        required: true
    },
    description: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    }
}));


// Essential functions
function validateGame(game){
    const schema = {
        title: Joi.string().min(3).required(),
        fieldId: Joi.objectId().required(),
        description: Joi.string().min(5).required(),
    };
    return Joi.validate(game, schema);
}


// Module exports
exports.Game = Game;
exports.validate = validateGame;