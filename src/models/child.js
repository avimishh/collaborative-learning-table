const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');


// Schema
const childSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    id: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
        maxlength: 255
    },
    birth: {
        type: Date,
        default: Date.now,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    gender: Boolean,
    gamesPassword: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 1024
    },
    address: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    phone: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 12
    },
    level: {
        type: Number,
        required: true
    }
});

childSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}


// Model
const Child = mongoose.model('Child', childSchema);


// Essential functions
function validateChild(child){
    const schema = {
        // userId: Joi.string().min(3).max(50).required(),
        // email: Joi.string().min(3).max(255).required().email(),
        firstName: Joi.string().min(2).max(255).required()
        // password: Joi.string().min(5).max(255).required()
    };
    return true;
    // return Joi.validate(child, schema);
}


// Module exports
exports.Child = Child;
exports.validate = validateChild;