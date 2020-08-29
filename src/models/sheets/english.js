const Joi = require('joi');
const mongoose = require('mongoose');


const dataColsName = ['תרגום מאנגלית לעברית'
                    , 'תרגום מעברית לאנגלית'
                    , 'התאמת תמונות למילים'
                    ];

// Schema
const englishSheetSchema = new mongoose.Schema({
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
// const englishSheet = mongoose.model('englishSheet', englishSheetSchema);


// Module exports
exports.englishSheetSchema = englishSheetSchema;
// exports.englishSheet = englishSheet;