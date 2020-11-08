const Joi = require('joi');
const mongoose = require('mongoose');
const {
    customError
} = require('./assets/customError.js');
const jwt = require('jsonwebtoken');
const config = require('config');
const {
    NAME_LEN,
    ID_LEN,
    PHONE_LEN,
    PASSWORD_LEN
} = require('./assets/consts');


// Schema
const parentSchema = new mongoose.Schema({
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
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child'
    }]
    // children: [{
    //     type: String
    // }]
});


parentSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({
        _id: this._id
    }, config.get('jwtPrivateKey'));
    return token;
}

// parentSchema.methods.assignParent = async function(userId, _parentObjectId) {
// try {
//     await User.findByIdAndUpdate({ id: userId },
//         {_parent: _parentObjectId}, {
//        new: true, useFindAndModify: false
//    }); 
// } catch (error) {
//     return res.status(404).send(`Failed to update User.`);
// }
// }

// Model
const Parent = mongoose.model('Parent', parentSchema);


// Essential functions
function validateParent(parent) {
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
        // password: Joi.string().min(PASSWORD_LEN[0]).max(PASSWORD_LEN[1]).required().error(errors => { return customError(errors, 'סיסמה') }),
        phone: Joi.string().min(PHONE_LEN[0]).max(PHONE_LEN[1]).required().error(errors => {
            return customError(errors, 'טלפון')
        })
    }).unknown(true);

    return Joi.validate(parent, schema);
}

// Module exports
exports.Parent = Parent;
exports.parentSchema = parentSchema;
exports.validateParent = validateParent;