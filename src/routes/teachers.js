const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Teacher, validateTeacher } = require('../models/teacher');
const auth = require('../middleware/auth'); // Authorization
// const admin = require('../middleware/admin');

// HTTP Handling
// debug? permissions of admin or teacher.
// GET ['api/teachers']
router.get('/', async (req, res) => {
    const teachers = await Teacher.find().select('-password').sort('firstName');
    res.send(teachers);
});

// change from byId to findOne and by userId/name
// GET ['api/teachers/me']
router.get('/me', auth, async (req, res) => {
    // Find
    const teacher = await Teacher.findById(req.user._id).select('-password');
    // Send to client
    res.status(200).send(teacher);
});


// admin/teacher get teacher by id?,
// teacher want his details? maybe get it from user obj by using /me? 
// GET ['api/teachers/:id']
router.get('/:id', async (req, res) => {
    // Find
    const teacher = await Teacher.findOne({ id: req.params.id }).select('-password');
    // const teacher = await teacher.findOne({id:req.params.id});
    // Check if exist
    if (!teacher)
        return res.status(404).send(`teachers ${req.params.id} was not found.`);
    // Send to client
    res.status(200).send(teacher);
});



// POST ['api/teachers'] -   Register
router.post('/', async (req, res) => {
    // Validate client input
    const { error } = validateTeacher(req.body);
    // Assert validation
    if (error)
        return res.status(400).send(error.details[0].message);
    // Check if the teacher exist
    let teacher = await Teacher.findOne({ id: req.body.id });
    // Response 400 Bad Request if the teacher exist
    if (teacher) return res.status(400).send(`הורה בעל ת"ז ${req.body.id} כבר קיים במערכת.`);
    // Create new document
    teacher = new teacher({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        id: req.body.id,
        password: req.body.password,
        phone: req.body.phone
    });
    // Password Hash
    const salt = await bcrypt.genSalt(10);
    teacher.password = await bcrypt.hash(teacher.password, salt);
    // Save to DataBase
    teacher = await teacher.save();
    // In order login the teacher immidiately after registarion, use this
    // for creating token and send back to teacher with the header of the response
    const token = teacher.generateAuthToken();
    // Send response to client
    res.status(200).header('x-auth-token', token).send(_.pick(teacher, ['firstName', 'lastName', 'id', 'phone']));
});

// PUT ['api/teachers/:id']
router.put('/:id', auth, async (req, res) => {
    // Validate client input
    var { error } = validateTeacher(req.body);
    // console.log(error);
    // Assert validation
    if (error)
        return res.status(400).send(error.details[0].message);
    // Try to update the selected document
    try {
        // res.status(200).send(user);
        const teacher = await teachers.findOneAndUpdate({ id: req.params.id }, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            id: req.body.id,
            password: req.body.password,
            phone: req.body.phone
        }, {
            new: true, useFindAndModify: false
        }).populate('children', 'id firstName lastName');
        // Password Hash
        const salt = await bcrypt.genSalt(10);
        teacher.password = await bcrypt.hash(teacher.password, salt);
        await teacher.save();
        // Assert update completed successfully
        if (!teacher)
            return res.status(404).send(`teacher ${req.params.id} was not found.`);
        // Send response to client
        res.status(200).send(_.pick(teacher, ['firstName', 'lastName', 'id', 'phone', 'children']));
    } catch (ex) {
        return res.status(404).send(`Failed to update.`);
    }
});


// admin permission?
// DELETE ['api/teachers/:id']
router.delete('/:id', async (req, res) => {
    // Try to delete the selected document
    try {
        const teacher = await Teacher.findOneAndRemove({ id: req.params.id });
        // Assert delete completed successfully
        if (!teacher)
            return res.status(404).send(`Teachers ${req.params.id} was not found.`);

        // Send response to client
        res.send(teacher);
    }
    catch (ex) {
        return res.status(404).send(`Faild to deleting.`);
    }
});


// Module exports
module.exports = router;