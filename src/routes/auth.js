const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash'); // Pick/Select values from object
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {errText, StringFormat} = require("../models/assets/dataError");
const {
    Parent
} = require('../models/parent');
const {
    Teacher
} = require('../models/teacher');
const {
    customError
} = require('../models/assets/customError');


// Const Lengths [min_length, max_length]
const ID_LEN = [2, 9];
const PASSWORD_LEN = [2, 20];

// POST ['api/auth/parent']       -   Login
router.post('/parent', async (req, res) => {
    const {
        error
    } = validateUserClaims(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    const parent = await Parent.findOne({
        id: req.body.id
    }).populate({
        path: 'children',
        select: 'id firstName lastName',
    });
    if (!parent) // Response 404 Not Found if the user not exist
        return res.status(404).send(StringFormat(errText.parentByIdNotExist, req.body.id));

    const isPasswordMatch = await bcrypt.compare(req.body.password, parent.password);
    if (!isPasswordMatch)
        return res.status(400).send(errText.passwordNotMatch);

    // Create JWT
    res.header('x-auth-token', parent.generateAuthToken());
    res.send(_.pick(parent, ['firstName', 'lastName', 'id', 'phone', 'children']));
});


// POST ['api/auth/teacher']       -   Login
router.post('/teacher', async (req, res) => {
    const {
        error
    } = validateUserClaims(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    const teacher = await Teacher.findOne({
        id: req.body.id
    });

    if (!teacher) // Response 404 Not Found if the user not exist
        return res.status(404).send(StringFormat(errText.teacherByIdNotExist, req.body.id));

    const isPasswordMatch = await bcrypt.compare(req.body.password, teacher.password);
    if (!isPasswordMatch)
        return res.status(400).send(errText.passwordNotMatch);

    // Create JWT
    res.header('x-auth-token', teacher.generateAuthToken());
    res.send(_.pick(teacher, ['firstName', 'lastName', 'id', 'phone']));
});


// Essential functions
function validateUserClaims(req) {
    const schema = {
        id: Joi.string().min(ID_LEN[0]).max(ID_LEN[1]).required().error(errors => {
            return customError(errors, 'תעודת זהות')
        }),
        password: Joi.string().min(PASSWORD_LEN[0]).max(PASSWORD_LEN[1]).required().error(errors => {
            return customError(errors, 'סיסמה')
        })
    };
    return Joi.validate(req, schema);
}


// Module exports
module.exports = router;