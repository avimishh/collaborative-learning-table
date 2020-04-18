const auth = require('../middleware/auth'); // Authorization
const bcrypt = require('bcrypt'); // Password Hash
const _ = require('lodash'); // Pick/Select values from object
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { User, validate } = require('../models/user');

// HTTP Handling

// GET ['api/users']
router.get('/', async (req,res) => {
    const users = await User.find().select('userId name').sort('name');
    res.send(users);
});


// GET ['api/users/me']
router.get('/me', auth, async (req,res) => {
    // Find
    const user = await User.findById(req.user._id).select('-password');
    // Check if exist? User exist beacuse was authorization at first
    // if(!user) 
        // return res.status(404).send(`User ${req.params.id} was not found.`);
    // Send to client
    res.status(200).send(user);
});


// POST ['api/users']       -   Register
router.post('/', async (req,res) => {
    // Validate client input
    const { error } = validate(req.body);
    // Assert validation
    if(error)
        return res.status(400).send(error.details[0].message);
    // Check if the user exist
    let user = await User.findOne({name: req.body.name});
    // Response 400 Bad Request if the user exist
    if(user) return res.status(400).send("User already registered.");
    // Create new document
    user = new User( _.pick(req.body, ['userId', 'name', 'password']));
    // Password Hash
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // Save to DataBase
    await user.save();

    // In order login the user immidiately after registarion, use this
    // for crating token and send back to user with the header of the response
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'userId', 'name']));
    // Send response to client
    // res.status(200).send(_.pick(user, ['_id', 'name', 'email']));
});


// PUT ['api/users/:id']
router.put('/:id', async (req,res) => {
    // Validate client input
    const { error } = validate(req.body);
    // Assert validation
    if(error)
        return res.status(400).send(error.details[0].message);
    // Try to update the selected document
    try{
        const user = await User.findByIdAndUpdate(req.params.id, {name: req.body.name, email: req.body.email, password: req.body.password}, {
            new: true, useFindAndModify: false
        });
        // Assert update completed successfully
        if(!user) 
            return res.status(404).send(`User ${req.params.id} was not found.`);
        // Send response to client
        res.status(200).send(user); 
    }catch(ex){
        return res.status(404).send(`Failed to update.`);
    }
});


// DELETE ['api/users/:id']
router.delete('/:id', async (req,res) => {
    // Try to delete the selected document
    try{
        const user = await User.findByIdAndRemove(req.params.id);
        // Assert delete completed successfully
        if(!user) 
            return res.status(404).send(`User ${req.params.id} was not found.`);

        // Send response to client
        res.send(user);
    }
    catch(ex){
        return res.status(404).send(`Faild to deleting.`); 
    }
});


// Module exports
module.exports = router;