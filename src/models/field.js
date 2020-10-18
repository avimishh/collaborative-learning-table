const Joi = require('joi');
const mongoose = require('mongoose');


const fieldSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    description: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 1024
    },
    nameEng:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20 
    }
});

// Model
const Field = mongoose.model('Field', fieldSchema);


// Validation
function validateField(field) {
    const schema = {
        name: Joi.string().min(2).max(50).required(),
        nameEng: Joi.string().min(2).max(50).required(),
        description: Joi.string().min(2).max(1024).required()
    };
    return Joi.validate(field, schema);
}


async function createField(name, description, nameEng) {
    // validate input
    const { error } = validateField({ name, description, nameEng });
    if (error) 
        return error.details[0].message;
    // Check if the child exist
    if (await Field.findOne({ name }))
        return `תחום בשם "${name}" כבר קיים במערכת.`;
    let field = new Field({
        name,
        description,
        nameEng
    });
    return await field.save();
}

// Module exports
exports.Field = Field;
exports.createField = createField;
exports.fieldSchema = fieldSchema;
exports.validateField = validateField;