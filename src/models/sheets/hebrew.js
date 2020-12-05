const Joi = require('joi');
const mongoose = require('mongoose');


const dataColsName = ['תרגום מאנגלית לעברית'
                    , 'תרגום מעברית לאנגלית'
                    , 'התאמת מילים לתמונות'
                    ];

// Schema
const hebrewSheetSchema = new mongoose.Schema({
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
// const englishSheet = mongoose.model('englishSheet', hebrewSheetSchema);


// Module exports
exports.hebrewSheetSchema = hebrewhSheetSchema;
// exports.englishSheet = englishSheet;