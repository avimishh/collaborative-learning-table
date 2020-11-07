const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {
    Teacher,
    validateTeacher
} = require('../models/teacher');
const auth = require('../middleware/auth'); // Authorization
const bcrypt = require('bcrypt'); // Password Hash
const _ = require('lodash'); // Pick/Select values from object
// const admin = require('../middleware/admin');

const errText = {
    failedToUpdate: "העדכון נכשל.",
    passwordInvalid: "הסיסמה חייבת להכיל לפחות 5 תווים.",
    parentsNotExist: "לא קיימים מורים במערכת.",
    parentByIdNotExist: "מורה בעל ת.ז. {0} לא קיים במערכת.",
    parentByIdAlreadyExist: "מורה בעל ת.ז. {0} כבר קיים במערכת.",
    childByIdNotExist: "ילד בעל ת.ז. {0} לא קיים במערכת.",
}
const StringFormat = (str, ...args) =>
    str.replace(/{(\d+)}/g, (match, index) => args[index] || '')


//@@@@permissions of admin or teacher.
// GET ['api/teachers']
router.get('/', async (req, res) => {
    const teachers = await Teacher.find().select('-password').sort('id');
    if (!teachers)
        return res.status(404).send(errText.teachersNotExist);

    res.status(200).send(teachers);
});

// change from byId to findOne and by userId/name
// GET ['api/teachers/me']
router.get('/me', auth, async (req, res) => {
    const teacher = await Teacher.findById(req.user._id).select('-password');
    // Check if exist? User exist beacuse he authorizied at first
    res.status(200).send(teacher);
});


//@@@@permissions of admin or teacher.
// GET ['api/teachers/:id']
router.get('/:id', async (req, res) => {
    const teacher = await Teacher.findOne({
        id: req.params.id
    }).select('-password');
    if (!teacher)
        return res.status(404).send(`teachers ${req.params.id} was not found.`);

    res.status(200).send(teacher);
});


// POST ['api/teachers'] -   Register
router.post('/', async (req, res) => {
    const {
        error
    } = validateTeacher(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // Check if the teacher exist
    let teacherExist = await Teacher.findOne({
        id: req.body.id
    });
    if (teacherExist)
        return res.status(400).send(StringFormat(errText.parentByIdAlreadyExist, req.body.id));


    let teacher = new Teacher({ // Create new document
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        id: req.body.id,
        password: req.body.password,
        phone: req.body.phone
    });
    // teacher.assignToClassroom(req.body.classroomCode);

    // Password Hash
    const salt = await bcrypt.genSalt(10);
    teacher.password = await bcrypt.hash(teacher.password, salt);

    teacher = await teacher.save();
    // In order login the teacher immidiately after registarion, use this
    // for creating token and send back to teacher with the header of the response
    const token = teacher.generateAuthToken();

    res.status(200).header('x-auth-token', token).send(_.pick(teacher, ['firstName', 'lastName', 'id', 'phone']));
});


// PUT ['api/teachers/:id']
router.put('/:id', auth, async (req, res) => {
    var { // Validate client input
        error
    } = validateTeacher(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    var teacher;
    try { // Try to update the selected document
        teacher = await Teacher.findOneAndUpdate({
            id: req.params.id
        }, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            id: req.body.id,
            phone: req.body.phone
        }, {
            new: true
        });
    } catch (ex) {
        return res.status(400).send(errText.failedToUpdate);
    }
    if (!teacher)
        return res.status(404).send(StringFormat(errText.parentByIdNotExist, req.params.id));

    res.status(200).send(_.pick(teacher, ['firstName', 'lastName', 'id', 'phone', 'children']));
});


// PUT ['api/teachers/changePassword/:id']
router.put('/changePassword/:id', auth, async (req, res) => {
    if (req.body.newPassword === null || req.body.newPassword.length < 5)
        return res.status(400).send(errText.passwordInvalid);

    // Password Hash
    let newPassword = await bcrypt.hash(req.body.newPassword, await bcrypt.genSalt(10));

    var teacher;
    try {
        teacher = await Teacher.findOneAndUpdate({
            id: req.params.id
        }, {
            password: newPassword
        }, {
            new: true
        });
    } catch (ex) {
        return res.status(400).send(errText.failedToUpdate);
    }
    if (!teacher)
        return res.status(404).send(StringFormat(errText.parentByIdNotExist, req.params.id));

    res.status(200).send(_.pick(teacher, ['firstName', 'lastName', 'id', 'phone', 'children']));
});


// admin permission?
// DELETE ['api/teachers/:id']
router.delete('/:id', async (req, res) => {
    var teacher;
    try { // Try to delete the selected document
        teacher = await Teacher.findOneAndRemove({
            id: req.params.id
        });
    } catch (ex) {
        return res.status(400).send(errText.failedToUpdate);
    }
    if (!teacher)
        return res.status(404).send(StringFormat(errText.parentByIdNotExist, req.params.id));

    res.status(200).send(true);
});


// Module exports
module.exports = router;