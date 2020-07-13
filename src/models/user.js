const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
// const passwordComplexity = require('joi-password-complexity');


// Schema
const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    _teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    _parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parent'
    }
    // name: {
    //     type: String,
    //     required: true,
    //     unique: true,
    //     minlength: 3,
    //     maxlength: 255
    // },
    // email: {
    //     type: String,
    //     required: true,
    //     unique: true,
    //     minlength: 3,
    //     maxlength: 255
    // },

    // isTeacher: Boolean,
    // roles: ['Admin', 'Parent', 'Teacher'],
    // operations: []
});

//, isAdmin: this.isAdmin
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
    return token;
}

// Assign _parent objectId
// userSchema.methods.assignParent = async function(userId, _parentObjectId) {
//     try {
//         await User.findByIdAndUpdate({ id: userId },
//             {_parent: _parentObjectId}, {
//            new: true, useFindAndModify: false
//        }); 
//     } catch (error) {
//         return res.status(404).send(`Failed to update User.`);
//     }
// }


// Model
const User = mongoose.model('User', userSchema);


// Essential functions
function validateUser(user){
    const schema = Joi.object().keys({
        userId: Joi.string().min(3).max(50).required(),
        // email: Joi.string().min(3).max(255).required().email(),
        // name: Joi.string().min(3).max(255).required(),
        password: Joi.string().min(5).max(255).required()
    }).unknown(true);
    // let passwordValidation = passwordComplexity().validate(user.password);
    // if(passwordValidation.details) return passwordValidation;
    return Joi.validate(user, schema);
}


// Module exports
exports.User = User;
exports.validateUser = validateUser;