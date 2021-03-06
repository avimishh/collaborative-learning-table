const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const {
    customError
} = require('./assets/customError.js');
const {
    Classroom
} = require('./classroom');
const {
    NAME_LEN,
    ID_LEN,
    PHONE_LEN,
    PASSWORD_LEN
} = require('./assets/consts');


// Schema
const teacherSchema = new mongoose.Schema({
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
    password: {
        type: String,
        required: true,
        minlength: PASSWORD_LEN[0],
        maxlength: PASSWORD_LEN[1]
    },
    phone: {
        type: String,
        required: true,
        minlength: PHONE_LEN[0],
        maxlength: PHONE_LEN[1]
    }
});


teacherSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({
        _id: this._id
    }, config.get('jwtPrivateKey'));
    return token;
}

teacherSchema.methods.assignToClassroom = async function (classroomCode) {
    const classroom = await Classroom.findOneAndUpdate({
        code: classroomCode
    }, {
        "$push": {
            teachers: this._id
        }
    }, {
        new: true,
        useFindAndModify: false
    });
    if (!classroom)
        return null;
    return classroom._id;
}


// Model
const Teacher = mongoose.model('Teacher', teacherSchema);


// Essential functions
function validateTeacher(teacher) {
    const schema = Joi.object().keys({
        firstName: Joi.string().min(NAME_LEN[0]).max(NAME_LEN[1]).required().error(errors => {
            return customError(errors, 'שם פרטי')
        }),
        lastName: Joi.string().min(NAME_LEN[0]).max(NAME_LEN[1]).required().error(errors => {
            return customError(errors, 'שם משפחה')
        }),
        id: Joi.string().min(ID_LEN[0]).max(ID_LEN[1]).required().error(errors => {
            return customError(errors, 'תעודת זהות')
        }),
        // password: Joi.string().min(PASSWORD_LEN[0]).max(PASSWORD_LEN[1]).required().error(errors => {
        //     return customError(errors, 'סיסמה')
        // }),
        phone: Joi.string().min(PHONE_LEN[0]).max(PHONE_LEN[1]).required().error(errors => {
            return customError(errors, 'טלפון')
        })
    }).unknown(true);

    return Joi.validate(teacher, schema);
}


// Module exports
exports.Teacher = Teacher;
exports.teacherSchema = teacherSchema;
exports.validateTeacher = validateTeacher;