const Joi = require('joi');
const mongoose = require('mongoose');
const { noteSchema } = require('./note');


// Const Lengths [min_length, max_length]
const NAME_LEN = [2, 50];
const ID_LEN = [2, 9];
const PASSWORD_LEN = [2, 10];
const ADDRESS_LEN = [3, 255];
const PHONE_LEN = [9, 10];
const LEVEL_ENUM = ['א', 'ב', 'ג'];
const GENDER_ENUM = ['זכר', 'נקבה'];

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
        required: true
    },
    gender: {
        type: String,
        enum: GENDER_ENUM,
        required: true
        // type: Boolean,
        // default: true
    },
    address: {
        type: String,
        // required: true,
        // minlength: ADDRESS_LEN[0],
        maxlength: ADDRESS_LEN[1]
    },
    phone: {
        type: String,
        // required: true,
        // minlength: PHONE_LEN[0],
        maxlength: PHONE_LEN[1]
    },
    level: {
        type: String,
        enum: LEVEL_ENUM,
        // required: true,
        default: LEVEL_ENUM[0]
    },
    gamesPassword: {
        type: String,
        required: true,
        minlength: PASSWORD_LEN[0],
        maxlength: PASSWORD_LEN[1]
    },
    notes: [{
        type: noteSchema
    }],
    stats: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stat'
        // required: true
    }
});


// Model
const Child = mongoose.model('Child', childSchema);


// Essential functions
function validateChild(child) {
    const schema = {
        firstName: Joi.string().regex(/^[א-ת]+$/).min(NAME_LEN[0]).max(NAME_LEN[1]).required().error(errors => { return customError(errors, 'שם פרטי') }),
        lastName: Joi.string().regex(/[א-ת]{2,50}/).min(NAME_LEN[0]).max(NAME_LEN[1]).required().error(errors => { return customError(errors, 'שם משפחה') }),
        id: Joi.string().regex(/[0-9]{2,9}/).min(ID_LEN[0]).max(ID_LEN[1]).required().error(errors => { return customError(errors, 'תעודת זהות') }),
        birth: Joi.date().required(),      // YYYY-MM-DD
        gender: Joi.string().valid(...GENDER_ENUM).error(errors => { return customError(errors, 'מין') }),
        address: Joi.string().allow(null,'').min(ADDRESS_LEN[0]).max(ADDRESS_LEN[1]).error(errors => { return customError(errors, 'כתובת') }),
        phone: Joi.string().allow(null,'').min(PHONE_LEN[0]).max(PHONE_LEN[1]).regex(/0[1-9][0-9]{7}|05[0-9]{8}/).error(errors => { return customError(errors, 'טלפון') }),
        // level: Joi.string().valid(...LEVEL_ENUM).error(errors => { return customError(errors, 'רמה') }),
        gamesPassword: Joi.string().min(PASSWORD_LEN[0]).max(PASSWORD_LEN[1]).required().error(errors => { return customError(errors, 'סיסמת משחקים') })
    };
    // return true;
    return Joi.validate(child, schema);
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
                err.message = `'${key}' נדרש להכיל לפחות ${err.context.limit} תוים`;
                break;
            case 'string.max':
                err.message = `'${key}' נדרש להכיל עד${err.context.limit} תוים`;
                break;
            case 'string.regex.base':
                err.message = `${key}: ` + 'נדרש שם המכיל אותיות בשפה העברית';
                break;
            default:
                break;
        }
    });
    return errors;
}


// Module exports
exports.Child = Child;
exports.validateChild = validateChild;