const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {errText, StringFormat} = require("../models/assets/dataError");
const {
    Child,
    validateChild
} = require('../models/child');
const {
    Stat
} = require('../models/stat');
// const admin = require('../middleware/admin');


// GET ['api/childs'] - only DEV, auth, admin
router.get('/', async (req, res) => {
    const childs = await Child.find().select('-notes -stats').sort('id');
    if (!childs)
        return res.status(404).send(errText.childsNotExist);

    res.status(200).send(childs);
});


// GET ['api/childs/:id'] - auth
router.get('/:id', async (req, res) => {
    const child = await Child.findOne({
        id: req.params.id
    }).select('-notes');
    if (!child)
        return res.status(404).send(StringFormat(errText.childByIdNotExist, req.params.id));

    res.status(200).send(child);
});


// POST ['api/childs/login'] - Login
router.post('/login', async (req, res) => {
    const child = await Child.findOne({
        id: req.body.id
    }).select('-notes');
    if (!child)
        return res.status(404).send(StringFormat(errText.childByIdNotExist, req.body.id));

    // Check if password is correct
    if (child.gamesPassword !== req.body.password)
        return res.status(400).send(errText.gamesPasswordNotMatch);

    res.status(200).send(child);
});


// POST ['api/childs']
router.post('/', async (req, res) => {
    const {
        error
    } = validateChild(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    let stat = await Stat.findOne({
        childId: req.body.id
    });
    if (!stat) {
        stat = new Stat({
            childId: req.body.id,
            childName: `${req.body.firstName} ${req.body.lastName}`,
            sheets: {
                math: [],
                english: [],
                memory: [],
                colors: [],
            }
        });
        await stat.save();
    }

    // Check if the child exist
    let childExist = await Child.findOne({
        id: req.body.id
    });
    if (childExist)
        return res.status(400).send(StringFormat(errText.childByIdAlreadyExist, req.body.id));


    let child = new Child({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        id: req.body.id,
        birth: req.body.birth,
        gender: req.body.gender,
        gamesPassword: req.body.gamesPassword,
        address: req.body.address,
        phone: req.body.phone,
        // classroom: child.assignToClassroom(req.body.classroom),
        stats: stat._id
    });

    await child.save();

    res.status(200).send(child);
});


// PUT ['api/childs/:id']
router.put('/:id', async (req, res) => {
    const { // Validate client input
        error
    } = validateChild(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    var child;
    try { // Try to update the selected document
        child = await Child.findOneAndUpdate({
            id: req.params.id
        }, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            id: req.body.id,
            birth: req.body.birth,
            gender: req.body.gender,
            gamesPassword: req.body.gamesPassword,
            address: req.body.address,
            phone: req.body.phone,
            level: req.body.level
        }, {
            new: true
        });
    } catch (ex) {
        return res.status(400).send(errText.failedToUpdate);
    }
    if (!child)
        return res.status(404).send(StringFormat(errText.childByIdNotExist, req.params.id));

    res.status(200).send(child);
});


// DELETE ['api/childs/:id'] - admin, teacher
router.delete('/:id', async (req, res) => {
    var child;
    try { // Try to delete the selected document
        child = await Child.findOneAndRemove({
            id: req.params.id
        });
    } catch (ex) {
        return res.status(400).send(errText.failedToUpdate);
    }
    if (!child)
        return res.status(404).send(StringFormat(errText.childByIdNotExist, req.params.id));

    res.status(200).send(true);
});


// Module exports
module.exports = router;