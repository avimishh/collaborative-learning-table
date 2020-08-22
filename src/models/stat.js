const Joi = require('joi');
const mongoose = require('mongoose');
const { sheetSchema } = require('./sheet');
// const Field = require('./field').Field;


// Const Lengths [min_length, max_length]
const TITLE_LEN = [3, 50];
const DESCRIPTION_LEN = [5, 1024];


// Model
const Stat = mongoose.model('Stat', new mongoose.Schema({
    child_id: {
        type: String,
        required: true
    },
    sheets: {
        math:[{type: sheetSchema}],
        english:[{type: sheetSchema}],
        memory:[{type: sheetSchema}],
        color:[{type: sheetSchema}],
    }
}));


// Essential functions
// function validateStat(stat) {
//     const schema = {
//         title: Joi.string().min(TITLE_LEN[0]).max(TITLE_LEN[1]).required(),
//         fieldId: Joi.objectId().required(),
//         description: Joi.string().min(DESCRIPTION_LEN[0]).max(DESCRIPTION_LEN[1]).required(),
//     };
//     return Joi.validate(stat, schema);
// }


// Module exports
exports.Stat = Stat;
// exports.validate = validateStat;