const Joi = require('joi');
const mongoose = require('mongoose');
const { sheetSchema } = require('./sheet');


// Model
const Stat = mongoose.model('Stat', new mongoose.Schema({
    childId: {
        type: String,
        required: true
    },
    childName: {
        type: String
        // required: true
    },
    sheets: {
        math:[{type: sheetSchema}],
        english:[{type: sheetSchema}],
        memory:[{type: sheetSchema}],
        colors:[{type: sheetSchema}],
        hebrew:[{type: sheetSchema}],
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