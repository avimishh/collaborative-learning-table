const Joi = require('joi');
const mongoose = require('mongoose');
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
        type: fieldSchema,
        // ref: 'Field',
        required: true
    },
    link: {
        type: String,
        required: true,
        minlength: LINK_LEN[0],
        maxlength: LINK_LEN[1]
    }
    // level, link, picture of game
}));


// Essential functions
function validateGame(game) {
    const schema = {
        title: Joi.string().min(TITLE_LEN[0]).max(TITLE_LEN[1]).required().error(errors => { return customError(errors, 'שם המשחק') }),
        description: Joi.string().min(DESCRIPTION_LEN[0]).max(DESCRIPTION_LEN[1]).required().error(errors => { return customError(errors, 'תיאור המשחק') }),
        // field: Joi.objectId().required(),
        link: Joi.string().min(LINK_LEN[0]).max(LINK_LEN[1]).required()
    };
    return Joi.validate(game, schema);
}


function customError(errors, key) {
    errors.forEach(err => {
        // console.log(err);
        // console.log(key);
        // console.log(err.context.key);
        switch (err.type) {
            case 'any.empty':
                err.message = `'${key}' לא יכול להיות ריק`;
                break;
            case 'any.required':
                err.message = `'${key}' נדרש`;
                break;
            case 'string.min':
                err.message = `'${key}' נדרש להכיל יותר מ-${err.context.limit} תוים`;
                break;
            case 'string.max':
                err.message = `'${key}' נדרש להכיל פחות מ-${err.context.limit} תוים`;
                break;
            case 'string.regex.base':
                err.message = 'נדרש שם המכיל אותיות בשפה העברית';
                break;
            default:
                break;
        }
    });
    return errors;
}

// Module exports
exports.Game = Game;
exports.validate = validateGame;