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
// function validateStat(stat) {
//     const schema = {
//         title: Joi.string().min(TITLE_LEN[0]).max(TITLE_LEN[1]).required(),
//         fieldId: Joi.objectId().required(),
//         description: Joi.string().min(DESCRIPTION_LEN[0]).max(DESCRIPTION_LEN[1]).required(),
//     };
//     return Joi.validate(stat, schema);
// }


// Module exports
exports.Note = Note;
exports.noteSchema = noteSchema;
// exports.validate = validateStat;