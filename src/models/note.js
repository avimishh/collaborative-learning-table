const Joi = require('joi');
const mongoose = require('mongoose');
const {
    customError
} = require('./assets/customError.js');
const {
    teacherSchema
} = require('./teacher');
const {
    CONTENT_LEN,
    ID_LEN,
} = require('./assets/consts');


const noteSchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    // teacher: {
    //     type: teacherSchema,
    //     required: true
    // },
    date: {
        type: Date,
        default: Date.now()
    },
    content: {
        type: String,
        required: true,
        minlength: CONTENT_LEN[0],
        maxlength: CONTENT_LEN[1]
    }
});

// Model
const Note = mongoose.model('Note', noteSchema);


// Essential functions
function validateNote(note) {
    const schema = Joi.object().keys({
        // teacherId: Joi.string().min(ID_LEN[0]).max(ID_LEN[1]).required().error(errors => {return customError(errors, 'תעודת זהות מורה')}),
        // date: Joi.date().required(),      // YYYY-MM-DD
        content: Joi.string().min(CONTENT_LEN[0]).max(CONTENT_LEN[1]).required().error(errors => {
            return customError(errors, 'תוכן ההודעה')
        })
    }).unknown(true);
    return Joi.validate(note, schema);
}


// Module exports
exports.Note = Note;
exports.noteSchema = noteSchema;
exports.validate = validateNote;