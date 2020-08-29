const Joi = require('joi');
const mongoose = require('mongoose');
const { Game, gameSchema } = require('./game');


// Schema
const sheetSchema = new mongoose.Schema({
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    numOfQuestions: {
        type: Number,
        // required: true
    },
    numOfCorrectAnswers: {
        type: Number,
        // required: true
    },
    additionalInfo: [{}]
})


// Model
const Sheet = mongoose.model('Sheet', sheetSchema);


// Module exports
exports.sheetSchema = sheetSchema;
exports.Sheet = Sheet;