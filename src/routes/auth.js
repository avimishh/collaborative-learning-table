const Joi = require('joi');
const bcrypt = require('bcrypt'); // Password Hash
const _ = require('lodash'); // Pick/Select values from object
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const { User } = require('../models/user');
const { Parent } = require('../models/parent');
const { Teacher } = require('../models/teacher');


// Const Lengths [min_length, max_length]
const ID_LEN = [2, 9];
const PASSWORD_LEN = [5, 1024];

// HTTP Handling
// POST ['api/auth/parent']       -   Login
router.post('/parent', async (req, res) => {
    // Validate client input
    const { error } = validate(req.body);
    // Assert validation
    if (error) return res.status(400).send(error.details[0].message);
    // Check if the user exist
    let parent = await Parent.findOne({ id: req.body.id }).populate({
        path: 'children',
        select: 'id firstName lastName',
    });
    // Response 400 Bad Request if the user not exist
    if (!parent) return res.status(400).send(`לא קיים במערכת הורה בעל תעודת הזהות ${req.body.id}.`);
    // Validate password
    const validPassword = await bcrypt.compare(req.body.password, parent.password);
    if (!validPassword) return res.status(400).send("סיסמה שגויה.");
    // Create JWT
    const token = parent.generateAuthToken();
    // Send Response
    res.header('x-auth-token', token);
    res.send(_.pick(parent, ['firstName', 'lastName', 'id', 'phone', 'children']));
});


// POST ['api/auth/teacher']       -   Login
router.post('/teacher', async (req, res) => {
    // Validate client input
    const { error } = validate(req.body);
    // Assert validation
    if (error) return res.status(400).send(error.details[0].message);
    // Check if the user exist
    let teacher = await Teacher.findOne({ id: req.body.id });
    // .populate({
    //     path: 'children',
    //     select: 'id firstName lastName',
    // });
    // Response 400 Bad Request if the user not exist
    if (!teacher) return res.status(400).send(`לא קיים במערכת מורה בעל תעודת הזהות ${req.body.id}.`);
    // Validate password
    const validPassword = await bcrypt.compare(req.body.password, teacher.password);
    if (!validPassword) return res.status(400).send("סיסמה שגויה.");
    // Create JWT
    const token = teacher.generateAuthToken();
    // Send Response
    res.header('x-auth-token', token);
    res.send(_.pick(teacher, ['firstName', 'lastName', 'id', 'phone']));
});


// Essential functions
function validate(req) {
    const schema = {
        id: Joi.string().min(ID_LEN[0]).max(ID_LEN[1]).required().error(errors => { return customError(errors, 'תעודת זהות') }),
        password: Joi.string().min(PASSWORD_LEN[0]).max(PASSWORD_LEN[1]).required().error(errors => { return customError(errors, 'סיסמה') })
    };
    return Joi.validate(req, schema);
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
module.exports = router;



// // POST ['api/auth']       -   Login
// router.post('/', async (req, res) => {
//     // Validate client input
//     // const { error } = validate(req.body);
//     // Assert validation
//     // if(error)
//     //     return res.status(400).send(error.details[0].message);
//     // Check if the user exist
//     let user = await User.findOne({ userId: req.body.userId }).populate({
//         path: '_parent',
//         populate: {
//             path: 'children',
//             select: '_id id firstName lastName'
//         }
//     });
//     // Response 400 Bad Request if the user exist
//     if (!user) return res.status(400).send("Invalid id or password.");
//     // Validate password, bcypt.comare missing await
//     const validPassword = await bcrypt.compare(req.body.password, user.password);
//     if (!validPassword) return res.status(400).send("Invalid id or password.");
//     // Create JWT
//     const token = user.generateAuthToken();
//     // Send Response
//     res.header('x-auth-token', token);
//     res.send(_.pick(user, ['_id', 'userId', '_parent']));
// });