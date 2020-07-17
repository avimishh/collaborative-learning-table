const Joi = require('joi');
const mongoose = require('mongoose');


// Const Lengths [min_length, max_length]
const MESSAGE_LEN = [2, 1024];

const noteSchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    message: {
        type: String,
        required: true,
        minlength: MESSAGE_LEN[0],
        maxlength: MESSAGE_LEN[1]
    }
});

// Model
const Note = mongoose.model('Note', noteSchema);


// Essential functions
function validateNote(note) {
    const schema = {
        teacher: Joi.objectId().required(),
        date: Joi.date().required(),      // YYYY-MM-DD
        message: Joi.string().min(MESSAGE_LEN[0]).max(MESSAGE_LEN[1]).required().error(errors => { return customError(errors, 'תוכן המשוב') }),,
    };
    return Joi.validate(note, schema);
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
exports.Note = Note;
exports.noteSchema = noteSchema;
exports.validate = validateNote;