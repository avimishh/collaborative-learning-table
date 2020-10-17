const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Parent, validateParent } = require('../models/parent');
const { Child } = require('../models/child');
const auth = require('../middleware/auth'); // Authorization
const bcrypt = require('bcrypt'); // Password Hash
const _ = require('lodash'); // Pick/Select values from object
// const admin = require('../middleware/admin');

// HTTP Handling
// debug? permissions of admin or teacher.
// GET ['api/parents']
router.get('/', async (req, res) => {
    const parents = await Parent.find().select('-password').sort('id');
    res.send(parents);
    // Check if not exist Parents
    if (parents.length < 1 || parents == undefined) return res.status(404).send("לא קיימים הורים במערכת.");
});


// change from byId to findOne and by userId/name
// GET ['api/parents/me']
router.get('/me', auth, async (req, res) => {
    // Find
    const parent = await Parent.findById(req.user._id).populate({
        path: 'children',
        select: 'id firstName lastName',
    }).select('-password');
    // Check if exist? User exist beacuse was authorization at first
    // if(!user) 
    // return res.status(404).send(`User ${req.params.id} was not found.`);
    // Send to client
    res.status(200).send(parent);
});


// admin/teacher get parent by id?,
// parent want his details? maybe get it from user obj by using /me? 
// GET ['api/parents/:id']
router.get('/:id', async (req, res) => {
    // Find
    const parent = await Parent.findOne({ id: req.params.id }).populate('children', 'id firstName lastName').select('-password');
    // const parent = await Parent.findOne({id:req.params.id});
    // Check if exist
    if (!parent)
        return res.status(404).send(`parents ${req.params.id} was not found.`);
    // Send to client
    res.status(200).send(parent);
});


// POST ['api/parents'] -   Register
router.post('/', async (req, res) => {
    // Validate client input
    const { error } = validateParent(req.body);
    // Assert validation
    if (error)
        return res.status(400).send(error.details[0].message);
    // Check if the parent exist
    let parent = await Parent.findOne({ id: req.body.id });
    // Response 400 Bad Request if the parent exist
    if (parent) return res.status(400).send(`הורה בעל ת"ז ${req.body.id} כבר קיים במערכת.`);
    // Create new document
    parent = new Parent({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        id: req.body.id,
        password: req.body.password,
        phone: req.body.phone
    });
    // Password Hash
    const salt = await bcrypt.genSalt(10);
    parent.password = await bcrypt.hash(parent.password, salt);
    // Save to DataBase
    parent = await parent.save();
    // In order login the parent immidiately after registarion, use this
    // for creating token and send back to parent with the header of the response
    const token = parent.generateAuthToken();
    // Send response to client
    res.status(200).header('x-auth-token', token).send(_.pick(parent, ['firstName', 'lastName', 'id', 'phone', 'children']));
});


// PUT ['api/parents/:id']
router.put('/:id', auth, async (req, res) => {
    // Validate client input
    var { error } = validateParent(req.body);
    // console.log(error);
    // Assert validation
    if (error)
        return res.status(400).send(error.details[0].message);
    // Try to update the selected document
    try {
        // res.status(200).send(user);
        const parent = await Parent.findOneAndUpdate({ id: req.params.id }, {
            "$set": {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                id: req.body.id,
                // password: req.body.password,
                phone: req.body.phone
            },
            // "$push": { children: req.body.children }
        }, {
            new: true, useFindAndModify: false
        }).populate('children', 'id firstName lastName');
        // Password Hash
        // const salt = await bcrypt.genSalt(10);
        // parent.password = await bcrypt.hash(parent.password, salt);
        // await parent.save();
        // Assert update completed successfully
        if (!parent)
            return res.status(404).send(`Parents ${req.params.id} was not found.`);
        // Send response to client
        res.status(200).send(_.pick(parent, ['firstName', 'lastName', 'id', 'phone', 'children']));
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


// PUT ['api/parents/:id']
router.put('/addchild/:id', /*auth,*/ async (req, res) => {
    // // Validate client input
    // var { error } = validateParent(req.body);
    // // console.log(error);
    // // Assert validation
    // if (error)
    //     return res.status(400).send(error.details[0].message);
    const child = await Child.findOne({ id: req.body.childId });
    // Assert Child data
    if (!child)
        return res.status(404).send(`Child ${req.body.childId} was not found.`);
    // Try to update the selected document
    try {
        // res.status(200).send(user);
        const parent = await Parent.findOneAndUpdate({ id: req.params.id }, {
            "$push": { children: child._id }
        }, {
            new: true, useFindAndModify: false
        }).populate('children', 'id firstName lastName');
        // await parent.save();
        // Assert update completed successfully
        if (!parent)
            return res.status(404).send(`Parent ${req.params.id} was not found.`);
        // Send response to client
        res.status(200).send(_.pick(parent, ['firstName', 'lastName', 'id', 'phone', 'children']));
    } catch (ex) {
        return res.status(404).send(`Failed to update.`);
    }
});

async function addChild(parent, childId) {
    parent.children.push(childId);
    await parent.save();
}

// Module exports
module.exports = router;