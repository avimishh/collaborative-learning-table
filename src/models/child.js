const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');


// Const Lengths [min_length, max_length]
const NAME_LEN = [2, 50];
const ID_LEN = [2, 9];
const PASSWORD_LEN = [3, 1024];
const ADDRESS_LEN = [3, 255];
const PHONE_LEN = [3, 12];
const LEVEL_ENUM = ['1', '2', '3']


// Schema
const childSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: NAME_LEN[0],
        maxlength: NAME_LEN[1]
    },
    lastName: {
        type: String,
        required: true,
        minlength: NAME_LEN[0],
        maxlength: NAME_LEN[1]
    },
    id: {
        type: String,
        required: true,
        unique: true,
        minlength: ID_LEN[0],
        maxlength: ID_LEN[1]
    },
    birth: {
        type: Date,
        default: new Date(Date.now()),
        // required: true
    },
    gender: {
        type: Boolean,
        default: true
    },
    gamesPassword: {
        type: String,
        required: true,
        minlength: PASSWORD_LEN[0],
        maxlength: PASSWORD_LEN[1]
    },
    address: {
        type: String,
        // required: true,
        minlength: ADDRESS_LEN[0],
        maxlength: ADDRESS_LEN[1]
    },
    phone: {
        type: String,
        required: true,
        minlength: PHONE_LEN[0],
        maxlength: PHONE_LEN[1]
    },
    level: {
        type: String,
        enum: LEVEL_ENUM,
        // required: true,
        default: LEVEL_ENUM[0]
    }
});


// Model
const Child = mongoose.model('Child', childSchema);


// Essential functions
function validateChild(child){
    const schema = {
        firstName: Joi.string().min(NAME_LEN[0]).max(NAME_LEN[1]).required().error(errors => {return customError(errors, 'שם פרטי')}),
        lastName: Joi.string().min(NAME_LEN[0]).max(NAME_LEN[1]).required().error(errors => {return customError(errors, 'שם משפחה')}),
        id: Joi.string().min(ID_LEN[0]).max(ID_LEN[1]).required().error(errors => {return customError(errors, 'תעודת זהות')}),
        birth: Joi.date(),      // YYYY-MM-DD
        gender: Joi.bool(),
        gamesPassword: Joi.string().min(PASSWORD_LEN[0]).max(PASSWORD_LEN[1]).required().error(errors => {return customError(errors, 'סיסמת משחקים')}),
        address: Joi.string().min(ADDRESS_LEN[0]).max(ADDRESS_LEN[1]).error(errors => {return customError(errors, 'כתובת')}),
        phone: Joi.string().min(PHONE_LEN[0]).max(PHONE_LEN[1]).required().error(errors => {return customError(errors, 'טלפון')}),
        level: Joi.string().valid(...LEVEL_ENUM).error(errors => {return customError(errors, 'רמה')})
    };
    // return true;
    return Joi.validate(child, schema);
}


function customError(errors, key){
    errors.forEach(err => {
        switch (err.type){
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
                err.message = `'${key}' נדרש להכיל יותר מ-${err.context.limit} תוים`;
                break;
            default:
                break;
        }
    });
    return errors;
}


// Module exports
exports.Child = Child;
exports.validate = validateChild;