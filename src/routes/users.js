const auth = require('../middleware/auth'); // Authorization
const bcrypt = require('bcrypt'); // Password Hash
const _ = require('lodash'); // Pick/Select values from object
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { User, validateUser } = require('../models/user');
const { Parent, validateParent } = require('../models/parent');

// HTTP Handling

// need to remove or to give the permission only for admin
// GET ['api/users']
router.get('/', async (req, res) => {
    const users = await User.find().select('userId name').sort('name');
    res.send(users);
});

// change from byId to findOne and by userId/name
// GET ['api/users/me']
router.get('/me', auth, async (req, res) => {
    // Find
    const user = await User.findById(req.user._id).populate('parent teacher').select('-password');
    // Check if exist? User exist beacuse was authorization at first
    // if(!user) 
    // return res.status(404).send(`User ${req.params.id} was not found.`);
    // Send to client
    res.status(200).send(user);
});

// implementaion for user without teacher/parent
// POST ['api/users/parent']       -   Register
router.post('/parent', async (req, res) => {
    // Validate client input
    const { errorParent } = validateParent(req.body);
    // Assert validation
    if (errorParent)
        return res.status(400).send(errorParent.details[0].message);
    // Create new document
    let parent = new Parent({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        id: req.body.id,
        phone: req.body.phone
    });
    parent = await parent.save();
    // ValidateUser client input
    const { errorUser } = validateUser(req.body);
    // Assert validation
    if (errorUser)
        return res.status(400).send(errorUser.details[0].message);
    // Check if the user exist
    let user = await User.findOne({ userId: req.body.userId });
    // Response 400 Bad Request if the user exist
    if (user) return res.status(400).send("User already registered.");
    // Create new document
    // user = new User( _.pick(req.body, ['userId', 'password']));
    user = new User({
        userId: req.body.id,
        password: req.body.password,
        _parent: parent._id
        // _teacher: null,
    });
    // Password Hash
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // Save to DataBase
    await user.save();
    // assignParent(user._id, parent._id);
    // console.log(user._id);
    // console.log(parent._id);
    // In order login the user immidiately after registarion, use this
    // for crating token and send back to user with the header of the response
    const token = user.generateAuthToken();
    user = await User.findById(user._id).populate('_parent');
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'userId', '_parent']));
    // Send response to client
    // res.status(200).send(_.pick(user, ['_id', 'name', 'email']));
});

// change user details? need auth middleware? parent add child? 
// PUT ['api/users/:id']
router.put('/:id', async (req, res) => {
    // Validate client input
    const { error } = validateUser(req.body);
    // Assert validation
    if (error)
        return res.status(400).send(error.details[0].message);
    // Try to update the selected document
    try {
        const user = await User.findOneAndUpdate({userId:req.params.id}, { name: req.body.name, password: req.body.password }, {
            new: true, useFindAndModify: false
        });
        // Assert update completed successfully
        if (!user)
            return res.status(404).send(`User ${req.params.id} was not found.`);
        // Send response to client
        res.status(200).send(user);
    } catch (ex) {
        return res.status(404).send(`Failed to update.`);
    }
});

// auth? permission admin?
// DELETE ['api/users/:id']
router.delete('/:id', async (req, res) => {
    // Try to delete the selected document
    try {
        const user = await User.findByIdAndRemove(req.params.id);
        // Assert delete completed successfully
        if (!user)
            return res.status(404).send(`User ${req.params.id} was not found.`);

        // Send response to client
        res.send(user);
    }
    catch (ex) {
        return res.status(404).send(`Faild to deleting.`);
    }
});

async function assignParent(_userId, _parentObjectId) {
    try {
        await User.findByIdAndUpdate(_userId,
            { _parent: _parentObjectId }, {
            new: true, useFindAndModify: false
        });
    } catch (error) {
        throw new Error(`Failed to update User.`);
    }
}

// Module exports
module.exports = router;