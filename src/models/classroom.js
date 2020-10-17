const Joi = require('joi');
const mongoose = require('mongoose');


const classroomSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    teachers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    }],
    children:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child'
    }],
});

// Model
const Classroom = mongoose.model('Classroom', classroomSchema);


// Validation
function validateClassroom(classroom) {
    const schema = {
        code: Joi.string().min(2).max(50).required()
    };
    return Joi.validate(classroom, schema);
}


// Module exports
exports.Classroom = Classroom;
exports.classroomSchema = classroomSchema;
exports.validateClassroom = validateClassroom;