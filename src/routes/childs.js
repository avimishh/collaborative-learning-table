const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Child, validateChild } = require('../models/child');
const { Stat } = require('../models/stat');
// const admin = require('../middleware/admin');

// HTTP Handling

// GET ['api/childs'] - only DEV, auth, admin
router.get('/', async (req, res) => {
    // Find
    const childs = await Child.find().select('-notes -stats').sort('id');
    res.send(childs);
    // Check if not exist Children
    if (childs.length < 1 || childs == undefined) return res.status(404).send("לא קיימים ילדים במערכת.");
});


// GET ['api/childs/:id'] - auth
router.get('/:id', async (req, res) => {
    // Find
    const child = await Child.findOne({ id: req.params.id }).select('-notes');
    // Check if exist
    if (!child)
        return res.status(404).send(`ילד בעל ת"ז ${req.params.id} אינו קיים במערכת.`);
    // Send to client
    res.status(200).send(child);
});


// GET ['api/childs/:id/:password'] - Login
router.get('/:id/:password', async (req, res) => {
    // Find
    const child = await Child.findOne({ id: req.params.id }).select('-notes');;
    // Check if exist
    if (!child)
        return res.status(404).send(`ילד בעל ת"ז ${req.params.id} לא קיים במערכת`);
    // Check if password is correct
    if (child.gamesPassword !== req.params.password)
        return res.status(400).send(`סיסמת המשחקים ${req.params.password} אינה נכונה.`);

    // Send to client
    res.status(200).send(child);
});


// POST ['api/childs']
router.post('/', async (req, res) => {
    // Validate client input
    const { error } = validateChild(req.body);
    // Assert validation
    if (error)
        return res.status(400).send(error.details[0].message);
    let stat = await Stat.findOne({ child_id: req.body.id });
    if (!stat) {
        stat = new Stat({
            child_id: req.body.id,
            childName: `${req.body.firstName} ${req.body.lastName}`,
            sheets: {
                math: [],
                english: [],
                memory: [],
                colors: [],
            }
        });
        stat = await stat.save();
    }
    // Create new document
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
    // Save to DataBase
    child = await child.save();
    // Send response to client
    res.status(200).send(child);
});


// PUT ['api/childs/:id']
router.put('/:id', async (req, res) => {
    // Validate client input
    const { error } = validateChild(req.body);
    // Assert validation
    if (error)
        return res.status(400).send(error.details[0].message);
    // Try to update the selected document
    try {
        const child = await Child.findOneAndUpdate({ id: req.params.id }, {
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
            new: true, useFindAndModify: false
        });
        // Assert update completed successfully
        if (!child)
            return res.status(404).send(`Childs ${req.params.id} was not found.`);
        // Send response to client
        res.status(200).send(child);
    } catch (ex) {
        return res.status(404).send(`Failed to update.`);
    }
});


// DELETE ['api/childs/:id'] - admin, teacher
router.delete('/:id', async (req, res) => {
    // Try to delete the selected document
    try {
        const child = await Child.findOneAndRemove({ id: req.params.id });
        // Assert delete completed successfully
        if (!child)
            return res.status(404).send(`Childs ${req.params.id} was not found.`);

        // Send response to client
        res.send(child);
    }
    catch (ex) {
        return res.status(404).send(`Faild to deleting.`);
    }
});


// Module exports
module.exports = router;