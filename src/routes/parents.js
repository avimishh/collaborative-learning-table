const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Parent, validateParent } = require('../models/parent');
const auth = require('../middleware/auth'); // Authorization
const { User, validateUser } = require('../models/user');
const bcrypt = require('bcrypt'); // Password Hash
// const admin = require('../middleware/admin');

// HTTP Handling
// debug? permissions of admin or teacher.
// GET ['api/parents']
router.get('/', async (req, res) => {
    const parents = await Parent.find().sort('firstName');
    res.send(parents);
});

// admin/teacher get parent by id?,
// parent want his details? maybe get it from user obj by using /me? 
// GET ['api/parents/:id']
router.get('/:id', async (req, res) => {
    // Find
    const parent = await Parent.findById(req.params.id).populate('children', '_id id firstName lastName');
    // const parent = await Parent.findOne({id:req.params.id});
    // Check if exist
    if (!parent)
        return res.status(404).send(`parents ${req.params.id} was not found.`);
    // Send to client
    res.status(200).send(parent);
});

// create new parent, after register user, keep _parent field clean,
// then user will asked to enter details, send it to server, server generate new object,
// need to assign ref objectId to user object
// to do: Assign parent to his user.
// POST ['api/parents']
router.post('/', auth, async (req, res) => {
    // Validate client input
    const { error } = validate(req.body);
    // Assert validation
    if (error)
        return res.status(400).send(error.details[0].message);
    // Create new document
    let parent = new Parent({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        id: req.body.id,
        phone: req.body.phone
    });
    // Save to DataBase
    parent = await parent.save();

    assignParent(req.user._id, parent._id);
    // Send response to client
    res.status(200).send(parent);
});


// PUT ['api/parents/:id']
router.put('/:id', auth, async (req, res) => {
    // Validate client input
    const { errorParent } = validateParent(req.body);
    // Assert validation
    if (errorParent)
        return res.status(400).send(errorParent.details[0].message);
    // Validate client input
    const { errorUser } = validateUser(req.body);
    // Assert validation
    if (errorUser)
        return res.status(400).send(errorUser.details[0].message);
    // Try to update the selected document
    try {
        let user = await User.findOneAndUpdate({ userId: req.params.id }, {
            name: req.body.name,
            password: req.body.password
        }, {
            new: true, useFindAndModify: false
        });
        // Assert update completed successfully
        if (!user)
            return res.status(404).send(`User ${req.params.id} was not found.`);
        // Send response to client
        // Password Hash
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        // res.status(200).send(user);
        const parent = await Parent.findOneAndUpdate({ id: req.params.id }, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            id: req.body.id,
            phone: req.body.phone
        }, {
            new: true, useFindAndModify: false
        }).populate('children', '_id id firstName lastName');
        // Assert update completed successfully
        if (!parent)
            return res.status(404).send(`Parents ${req.params.id} was not found.`);
        // Send response to client
        res.status(200).send(parent);
    } catch (ex) {
        return res.status(404).send(`Failed to update.`);
    }
});

// admin permission?
// DELETE ['api/parents/:id']
router.delete('/:id', async (req, res) => {
    // Try to delete the selected document
    try {
        const parent = await Parent.findOneAndRemove({ id: req.params.id });
        // Assert delete completed successfully
        if (!parent)
            return res.status(404).send(`Parents ${req.params.id} was not found.`);

        // Send response to client
        res.send(parent);
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