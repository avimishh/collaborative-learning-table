const Joi = require('joi');
const mongoose = require('mongoose');
// const Field = require('./field').Field;


// Const Lengths [min_length, max_length]
const TITLE_LEN = [3, 50];
const DESCRIPTION_LEN = [5, 1024];


// Model
const Game = mongoose.model('Game', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        // trim: true,
        minlength: TITLE_LEN[0],
        maxlength: TITLE_LEN[1]
    },
    // field: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Field',
    //     required: true
    // },
    description: {
        type: String,
        required: true,
        minlength: DESCRIPTION_LEN[0],
        maxlength: DESCRIPTION_LEN[1]
    },
    link: {
        type: String,
        required: true
    }
    // level, link, picture of game
}));


// Essential functions
function validateGame(game) {
    const schema = {
        title: Joi.string().min(TITLE_LEN[0]).max(TITLE_LEN[1]).required(),
        // fieldId: Joi.objectId().required(),
        description: Joi.string().min(DESCRIPTION_LEN[0]).max(DESCRIPTION_LEN[1]).required(),
        link: Joi.string().required()
    };
    return Joi.validate(game, schema);
}


// Module exports
exports.Game = Game;
exports.validate = validateGame;