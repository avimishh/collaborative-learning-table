const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Teacher, validate } = require('../models/teacher');
const auth = require('../middleware/auth'); // Authorization
const { User } = require('../models/user');
// const admin = require('../middleware/admin');

// HTTP Handling
// debug? permissions of admin or teacher.
// GET ['api/teachers']
router.get('/', async (req,res) => {
    const teachers = await Teacher.find().sort('firstName');
    res.send(teachers);
});

// admin/teacher get teacher by id?,
// teacher want his details? maybe get it from user obj by using /me? 
// GET ['api/teachers/:id']
router.get('/:id', async (req,res) => {
    // Find
    const teacher = await Teacher.findById(req.params.id);
    // const teacher = await teacher.findOne({id:req.params.id});
    // Check if exist
    if(!teacher) 
        return res.status(404).send(`teachers ${req.params.id} was not found.`);
    // Send to client
    res.status(200).send(teacher);
});

// create new teacher, after register user, keep _teacher field clean,
// then user will asked to enter details, send it to server, server generate new object,
// need to assign ref objectId to user object
// to do: Assign teacher to his user.
// POST ['api/teachers']
router.post('/', auth, async (req,res) => {
    // Validate client input
    const { error } = validate(req.body);
    // Assert validation
    if(error)
        return res.status(400).send(error.details[0].message);
    // Create new document
    let teacher = new Teacher( {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        id: req.body.id,
        phone: req.body.phone
    });
    // Save to DataBase
    teacher = await teacher.save();

    assignTeacher(req.user._id, teacher._id);
    // Send response to client
    res.status(200).send(teacher);
});


// PUT ['api/teachers/:id']
router.put('/:id', auth, async (req,res) => {
    // Validate client input
    const { error } = validate(req.body);
    // Assert validation
    if(error)
        return res.status(400).send(error.details[0].message);
    // Try to update the selected document
    try{
        const teacher = await Teacher.findByIdAndUpdate(req.params.id, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            id: req.body.id,
            phone: req.body.phone
        }, {
            new: true, useFindAndModify: false
        });
        // Assert update completed successfully
        if(!teacher) 
            return res.status(404).send(`Teachers ${req.params.id} was not found.`);
        // Send response to client
        res.status(200).send(teacher); 
    }catch(ex){
        return res.status(404).send(`Failed to update.`);
    }
});

// admin permission?
// DELETE ['api/teachers/:id']
router.delete('/:id', async (req,res) => {
    // Try to delete the selected document
    try{
        const teacher = await Teacher.findOneAndRemove({ id: req.params.id });
        // Assert delete completed successfully
        if(!teacher) 
            return res.status(404).send(`Teachers ${req.params.id} was not found.`);

        // Send response to client
        res.send(teacher);
    }
    catch(ex){
        return res.status(404).send(`Faild to deleting.`); 
    }
});


async function assignTeacher(_userId, _teacherObjectId) {
    try {
        await User.findByIdAndUpdate(_userId,
            {_teacher: _teacherObjectId}, {
           new: true, useFindAndModify: false
       }); 
    } catch (error) {
        throw new Error(`Failed to update User.`);
    }
}



// Module exports
module.exports = router;