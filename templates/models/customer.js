const Joi = require('joi');
const mongoose = require('mongoose');


// Model
const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
        },
    phone: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },
    isGold: {
        type: Boolean,
        default: false
    }
}));


// Essential functions
function validateCustomer(customer){
    const schema = {
        name: Joi.string().min(3).required(),
        phone: Joi.string().min(3).required(),
        isGold: Joi.bool()

    };
    return Joi.validate(customer, schema);
}


// Module exports
exports.Customer = Customer;
exports.validate = validateCustomer;