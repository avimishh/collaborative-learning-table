// Field Of Studies

const Joi = require('joi');
const mongoose = require('mongoose');


// Model
const Field = mongoose.model('Field', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    description: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    }
}));


// Validation
function validateField(field) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        description: Joi.string().min(5).max(1024).required()
    };
    return Joi.validate(field, schema);
}


// Module exports
exports.Field = Field;
exports.validate = validateField;