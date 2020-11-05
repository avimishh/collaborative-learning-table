const Joi = require('joi');
const mongoose = require('mongoose');
const { customError } = require('./assets/customError.js');
const { Field, fieldSchema } = require('./field');


// Const Lengths [min_length, max_length]
const TITLE_LEN = [3, 50];
const DESCRIPTION_LEN = [5, 1024];
const LINK_LEN = [5, 1024];

// Model
const Game = mongoose.model('Game', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        // trim: true,
        minlength: TITLE_LEN[0],
        maxlength: TITLE_LEN[1]
    },
    description: {
        type: String,
        required: true,
        minlength: DESCRIPTION_LEN[0],
        maxlength: DESCRIPTION_LEN[1]
    },
    field: {
        type: fieldSchema
        // ref: 'Field',
        // required: true
    },
    link: {
        type: String,
        required: true,
        minlength: LINK_LEN[0],
        maxlength: LINK_LEN[1]
    },
    icon: {
        type: String,
        required: true,
        minlength: LINK_LEN[0],
        maxlength: LINK_LEN[1]
    }
    // level, link, picture of game
}));


// Essential functions
function validateGame(game) {
    const schema = Joi.object().keys({
        title: Joi.string().min(TITLE_LEN[0]).max(TITLE_LEN[1]).required().error(errors => { return customError(errors, 'שם המשחק') }),
        description: Joi.string().min(DESCRIPTION_LEN[0]).max(DESCRIPTION_LEN[1]).required().error(errors => { return customError(errors, 'תיאור המשחק') }),
        // field: Joi.,
        icon: Joi.string().min(LINK_LEN[0]).max(LINK_LEN[1]).required(),
        link: Joi.string().min(LINK_LEN[0]).max(LINK_LEN[1]).required()
    }).unknown(true);
    return Joi.validate(game, schema);
}


// Module exports
exports.Game = Game;
exports.validateGame = validateGame;