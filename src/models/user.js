const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
// const passwordComplexity = require('joi-password-complexity');


// Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
        },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: Boolean,
    // roles: [],
    // operations: []
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}


// Model
const User = mongoose.model('User', userSchema);


// Essential functions
function validateUser(user){
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    // let passwordValidation = passwordComplexity().validate(user.password);
    // if(passwordValidation.details) return passwordValidation;
    return Joi.validate(user, schema);
}


// Module exports
exports.User = User;
exports.validate = validateUser;