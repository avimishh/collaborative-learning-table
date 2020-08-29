const Joi = require('joi');
const mongoose = require('mongoose');


const dataColsName = ['חיבור', 'חיסור', 'כפל'];

// Schema
const mathSheetSchema = new mongoose.Schema({
    // dataCols: [{
    operator: {
        type: String,
        enum: dataColsName,
        // required: true
    },
    asked: {
        type: Number,
        // required: true
    },
    correct: {
        type: Number,
        // required: true
    }
    // }]
})


// // Model
// const MathSheet = mongoose.model('MathSheet', mathSheetSchema);


// Module exports
exports.mathSheetSchema = mathSheetSchema;
// exports.MathSheet = MathSheet;