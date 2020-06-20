const Joi = require('joi');
const mongoose = require('mongoose');
const {mathSheetSchema} = require('./mathSheet');
// const Field = require('./field').Field;


// Const Lengths [min_length, max_length]
const TITLE_LEN = [3, 50];
const DESCRIPTION_LEN = [5, 1024];


// Model
const MathStat = mongoose.model('MathStat', new mongoose.Schema({
    child_id: {
        type: String,
        required: true
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Child',
        // required: true
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    sheets: [{
        type: mathSheetSchema
    }]
    // date: {
    //     type: Date,
    //     default: Date.now()
    // },
    // level
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
exports.MathStat = MathStat;
// exports.validate = validateStat;