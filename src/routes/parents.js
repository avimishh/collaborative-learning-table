const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {errText, StringFormat} = require("../models/assets/dataError");
const {
    Parent,
    validateParent
} = require('../models/parent');
const {
    Child
} = require('../models/child');
const auth = require('../middleware/auth'); // Authorization
const bcrypt = require('bcrypt'); // Password Hash
const _ = require('lodash'); // Pick/Select values from object
// const admin = require('../middleware/admin');

//@@@@permissions of admin or teacher.
// GET ['api/parents']
router.get('/', async (req, res) => {
    const parents = await Parent.find().select('-password').sort('id');
    if (!parents)
        return res.status(404).send(errText.parentsNotExist);

    res.status(200).send(parents);
});


// change from byId to findOne and by userId/name
// GET ['api/parents/me']
router.get('/me', auth, async (req, res) => {
    const parent = await Parent.findById(req.user._id).populate({
        path: 'children',
        select: 'id firstName lastName',
    }).select('-password');
    // Check if exist? User exist beacuse he authorizied at first
    res.status(200).send(parent);
});


//@@@@permissions of admin or teacher.
// GET ['api/parents/:id']
router.get('/:id', async (req, res) => {
    const parent = await Parent.findOne({
        id: req.params.id
    }).populate('children', 'id firstName lastName').select('-password');
    if (!parent)
        return res.status(404).send(StringFormat(errText.parentByIdNotExist, req.params.id));

    res.status(200).send(parent);
});


// POST ['api/parents'] -   Register
router.post('/', async (req, res) => {
    const {
        error
    } = validateParent(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    // Check if the parent exist
    let parentExist = await Parent.findOne({
        id: req.body.id
    });
    if (parentExist)
        return res.status(400).send(StringFormat(errText.parentByIdAlreadyExist, req.body.id));

    // Find children
    let children = await getChildrenOfParent(req.body.id);
    let childrenId = [];
    (children).forEach(child => {
        childrenId.push(child._id);
    });

    let parent = new Parent({ // Create new document
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        id: req.body.id,
        password: req.body.password,
        phone: req.body.phone,
        children: childrenId
    }).populate({
        path: 'children',
        select: 'id firstName lastName',
    });
    console.log(parent);
    // Password Hash
    const salt = await bcrypt.genSalt(10);
    parent.password = await bcrypt.hash(parent.password, salt);

    parent = await parent.save();
    parent = await Parent.findOne({
        id: req.body.id
    }).populate({
        path: 'children',
        select: 'id firstName lastName',
    });
    // In order to login the parent immidiately after registarion, use this
    // for creating token and send back to parent with the header of the response
    const token = parent.generateAuthToken();

    res.status(200).header('x-auth-token', token).send(_.pick(parent, ['firstName', 'lastName', 'id', 'phone', 'children']));
});


// PUT ['api/parents/:id']
router.put('/:id', auth, async (req, res) => {
    const { // Validate client input
        error
    } = validateParent(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    var parent;
    try { // Try to update the selected document
        parent = await Parent.findOneAndUpdate({
            id: req.params.id
        }, {
            "$set": {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                id: req.body.id,
                phone: req.body.phone
            },
            // "$push": { children: req.body.children }
        }, {
            new: true
        }).populate('children', 'id firstName lastName');
    } catch (ex) {
        return res.status(400).send(errText.failedToUpdate);
    }
    if (!parent)
        return res.status(404).send(StringFormat(errText.parentByIdNotExist, req.params.id));

    res.status(200).send(_.pick(parent, ['firstName', 'lastName', 'id', 'phone', 'children']));
});


// PUT ['api/parents/changePassword/:id']
router.put('/changePassword/:id', auth, async (req, res) => {
    if (req.body.newPassword === null || req.body.newPassword.length < 2)
        return res.status(400).send(errText.passwordInvalid);

    // Password Hash
    let newPassword = await bcrypt.hash(req.body.newPassword, await bcrypt.genSalt(10));

    var parent;
    try {
        parent = await Parent.findOneAndUpdate({
            id: req.params.id
        }, {
            password: newPassword
        }, {
            new: true
        }).populate('children', 'id firstName lastName');
    } catch (ex) {
        return res.status(400).send(errText.failedToUpdate);
    }
    if (!parent)
        return res.status(404).send(StringFormat(errText.parentByIdNotExist, req.params.id));

    res.status(200).send(_.pick(parent, ['firstName', 'lastName', 'id', 'phone', 'children']));
});


// admin permission?
// DELETE ['api/parents/:id']
router.delete('/:id', async (req, res) => {
    var parent;
    try { // Try to delete the selected document
        parent = await Parent.findOneAndRemove({
            id: req.params.id
        });
    } catch (ex) {
        return res.status(400).send(errText.failedToUpdate);
    }
    if (!parent)
        return res.status(404).send(StringFormat(errText.parentByIdNotExist, req.params.id));

    res.status(200).send(true);
});


// PUT ['api/parents/:id']
router.put('/addchild/:id', /*auth,*/ async (req, res) => {
    const child = await Child.findOne({
        id: req.body.childId
    });
    if (!child)
        return res.status(404).send(StringFormat(errText.childByIdNotExist, req.body.childId));

    var parent;
    try { // Try to update the selected document
        parent = await Parent.findOneAndUpdate({
            id: req.params.id
        }, {
            "$push": {
                children: child._id
            }
        }, {
            new: true
        }).populate('children', 'id firstName lastName');
    } catch (ex) {
        return res.status(404).send(errText.failedToUpdate);
    }
    if (!parent)
        return res.status(404).send(StringFormat(errText.parentByIdNotExist, req.params.id));

    res.status(200).send(_.pick(parent, ['firstName', 'lastName', 'id', 'phone', 'children']));
});


async function getChildrenOfParent(parentId){
    let children = await Child.find({parentsId: parentId});
    return children;
}


// Module exports
module.exports = router;