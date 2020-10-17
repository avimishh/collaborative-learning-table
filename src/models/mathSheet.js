const Joi = require('joi');
const mongoose = require('mongoose');


// Schema
const mathSheetSchema = new mongoose.Schema({
    number_of_questions: {
        type: Number,
        // required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    questions: [{
        operator: {
            type: String,
            enum: ['plus', 'minus', 'multi'],
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
    }]
})


// Model
const MathSheet = mongoose.model('MathSheet', mathSheetSchema);


// Module exports
exports.mathSheetSchema = mathSheetSchema;
exports.MathSheet = MathSheet;