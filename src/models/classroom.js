const Joi = require('joi');
const mongoose = require('mongoose');


const classroomSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    teachers:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    children:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child'
    }],
});

// Model
const Classroom = mongoose.model('Classroom', classroomSchema);


async function createClassroom(code) {
    // validate input
    const { error } = validateClassroom({ code });
    if (error) 
        return error.details[0].message;
    // Check if the child exist
    let classroom = await Classroom.findOne({ code });
    // Response 400 Bad Request if the child exist
    if (classroom) 
        return `כיתה בשם "${code}" כבר קיים במערכת.`;
    classroom = new Classroom({
        code
    });

    classroom = await classroom.save();
    return `כיתה "${name}" נוצר בDB.`;
}



// Validation
function validateClassroom(classroom) {
    const schema = {
        code: Joi.string().min(2).max(50).required()
    };
    return Joi.validate(classroom, schema);
}


// Module exports
createClassroom
exports.Classroom = Classroom;
exports.createClassroom = createClassroom;
exports.classroomSchema = classroomSchema;
exports.validateClassroom = validateClassroom;