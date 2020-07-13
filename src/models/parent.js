const Joi = require('joi');
const mongoose = require('mongoose');


// Const Lengths [min_length, max_length]
const NAME_LEN = [2, 50];
const ID_LEN = [2, 9];
const PHONE_LEN = [3, 12];


// Schema
const parentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: NAME_LEN[0],
        maxlength: NAME_LEN[1]
    },
    lastName: {
        type: String,
        required: true,
        minlength: NAME_LEN[0],
        maxlength: NAME_LEN[1]
    },
    id: {
        type: String,
        required: true,
        unique: true,
        minlength: ID_LEN[0],
        maxlength: ID_LEN[1]
    },
    phone: {
        type: String,
        required: true,
        minlength: PHONE_LEN[0],
        maxlength: PHONE_LEN[1]
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child'
    }]
    // children: [{
    //     type: String
    // }]
});


// parentSchema.methods.assignParent = async function(userId, _parentObjectId) {
//     try {
//         await User.findByIdAndUpdate({ id: userId },
//             {_parent: _parentObjectId}, {
//            new: true, useFindAndModify: false
//        }); 
//     } catch (error) {
//         return res.status(404).send(`Failed to update User.`);
//     }
// }

// Model
const Parent = mongoose.model('Parent', parentSchema);


// Essential functions
function validateParent(parent) {
    const schema = Joi.object().keys({
        firstName: Joi.string().min(NAME_LEN[0]).max(NAME_LEN[1]).required().error(errors => { return customError(errors, 'שם פרטי') }),
        lastName: Joi.string().min(NAME_LEN[0]).max(NAME_LEN[1]).required().error(errors => { return customError(errors, 'שם משפחה') }),
        id: Joi.string().min(ID_LEN[0]).max(ID_LEN[1]).required().error(errors => { return customError(errors, 'תעודת זהות') }),
        phone: Joi.string().min(PHONE_LEN[0]).max(PHONE_LEN[1]).required().error(errors => { return customError(errors, 'טלפון') })
    }).unknown(true);

    // return true;
    return Joi.validate(parent, schema);
}


function customError(errors, key) {
    errors.forEach(err => {
        switch (err.type) {
            case 'any.empty':
                err.message = `'${key}' לא יכול להיות ריק`;
                break;
            case 'any.required':
                err.message = `'${key}' נדרש`;
                break;
            case 'string.min':
                err.message = `'${key}' נדרש להכיל יותר מ-${err.context.limit} תוים`;
                break;
            case 'string.max':
                err.message = `'${key}' נדרש להכיל פחות מ-${err.context.limit} תוים`;
                break;
            default:
                break;
        }
    });
    return errors;
}


// Module exports
exports.Parent = Parent;
exports.validateParent = validateParent;