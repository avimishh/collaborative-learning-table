const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {errText, StringFormat} = require("../models/assets/dataError");
const validateObjectId = require('../middleware/validateObjectId');
const {
    Note,
    validate
} = require('../models/note');
const {
    Teacher
} = require('../models/teacher');
const {
    Child
} = require('../models/child');


// // GET ['api/notes']
// router.get('/', async (req, res) => {
//     const notes = await Note.find().sort('date');
//     res.send(notes);
// });


// GET ['api/notes/:childId'] - id=child.id
router.get('/:childId', async (req, res) => {
    const child = await Child.findOne({
        id: req.params.childId
    }).populate('notes.teacher', '_id firstName lastName');
    if (!child)
        return res.status(404).send(StringFormat(errText.childByIdNotExist, req.params.childId));

    // parent.children.forEach(async (childId) => {
    //     var newNotes = await Note.find({ child: childId });
    //     notes.push(newNotes);
    // });

    res.status(200).send(child.notes);
});


// POST ['api/notes/:childId']
router.post('/:childId', async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    // Validate teacher
    let teacher = await Teacher.findOne({
        id: req.body.teacherId
    });
    if (!teacher)
        return res.status(404).send(StringFormat(errText.teacherByIdNotExist, req.body.teacherId));

    let newNote = new Note({ // Create new document
        teacher: teacher._id,
        content: req.body.content
    });

    var child;
    try {
        child = await Child.findOneAndUpdate({
            id: req.params.childId
        }, {
            $push: {
                notes: newNote
            }
        }, {
            new: true
        });
    } catch (ex) {
        return res.status(400).send(errText.failedToUpdate);
    }
    if (!child)
        return res.status(404).send(StringFormat(errText.childByIdNotExist, req.params.childId));

    res.status(200).send(newNote);
});


// DELETE ['api/notes/:id']
router.delete('/:id', validateObjectId, async (req, res) => {
    try {
        const note = await Note.findByIdAndRemove(req.params.id);
        if (!note)
            return res.status(404).send(StringFormat(errText.noteByIdNotExist, req.params.id));
    }
    catch (ex) {
        return res.status(400).send(errText.failedToUpdate);
    }

    res.status(200).send(note);
});


// Module exports
module.exports = router;