const Joi = require('joi');
const mongoose = require('mongoose');
const {
    customError
} = require('./assets/customError.js');
const {
    noteSchema
} = require('./note');
const {
    Classroom
} = require('./classroom');
const {
    NAME_LEN,
    ID_LEN,
    GAMESPASSWORD_LEN,
    ADDRESS_LEN,
    PHONE_LEN,
    GENDER_ENUM
} = require('./assets/consts');


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
    // classroom: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Classroom',
    //     required: true
    // },
    gamesPassword: {
        type: String,
        required: true,
        minlength: GAMESPASSWORD_LEN[0],
        maxlength: GAMESPASSWORD_LEN[1]
    },
    notes: [{
        type: noteSchema
    }],
    stats: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stat'
        // required: true
    },
    parentsId: [{
        type: String
    }]
});


// Model
const Child = mongoose.model('Child', childSchema);


childSchema.methods.assignToClassroom = async function (classroomCode) {
    const classroom = await Classroom.findOneAndUpdate({
        code: classroomCode
    }, {
        "$push": {
            children: this._id
        }
    }, {
        new: true,
        useFindAndModify: false
    });
    if (!classroom)
        return null;
    return classroom._id;
}


// Essential functions
function validateChild(child) {
    const schema = Joi.object().keys({
        firstName: Joi.string().regex(/^[א-ת]+$/).min(NAME_LEN[0]).max(NAME_LEN[1]).required().error(errors => {
            return customError(errors, 'שם פרטי')
        }),
        lastName: Joi.string().regex(/[א-ת]{2,50}/).min(NAME_LEN[0]).max(NAME_LEN[1]).required().error(errors => {
            return customError(errors, 'שם משפחה')
        }),
        id: Joi.string().regex(/[0-9]{2,9}/).min(ID_LEN[0]).max(ID_LEN[1]).required().error(errors => {
            return customError(errors, 'תעודת זהות')
        }),
        birth: Joi.date().required(), // YYYY-MM-DD
        gender: Joi.string().valid(...GENDER_ENUM).error(errors => {
            return customError(errors, 'מין')
        }),
        address: Joi.string().allow(null, '').min(ADDRESS_LEN[0]).max(ADDRESS_LEN[1]).error(errors => {
            return customError(errors, 'כתובת')
        }),
        // .regex(/0[1-9][0-9]{7}|05[0-9]{8}/)
        phone: Joi.string().allow(null, '').min(PHONE_LEN[0]).max(PHONE_LEN[1]).error(errors => {
            return customError(errors, 'טלפון')
        }),
        gamesPassword: Joi.string().min(GAMESPASSWORD_LEN[0]).max(GAMESPASSWORD_LEN[1]).required().error(errors => {
            return customError(errors, 'סיסמת משחקים')
        })
    }).unknown(true);
    // return true;
    return Joi.validate(child, schema);
}


// Module exports
exports.Child = Child;
exports.validateChild = validateChild;