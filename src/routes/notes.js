const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Note } = require('../models/note');
const { Teacher } = require('../models/teacher');
const { Child } = require('../models/child');

// // GET ['api/notes']
// router.get('/', async (req, res) => {
//     const notes = await Note.find().sort('date');
//     res.send(notes);
// });


// GET ['api/notes/:child_id'] - id=child.id
router.get('/:child_id', async (req, res) => {
    // Find
    // const note = await Note.findById(req.params.id);
    // const note = await Note.find({child:req.params.id});
    // var notes = list();
    const child = await Child.findOne({ id: req.params.id }).populate('notes.teacher', '_id firstName lastName');
    // Check if exist
    if (!child)
        return res.status(404).send(`Child ${req.params.id} was not found.`);
    // parent.children.forEach(async (child_id) => {
    //     var newNotes = await Note.find({ child: child_id });
    //     notes.push(newNotes);
    // });
    const notes = child.notes;
    // Send to client
    res.status(200).send(notes);
});


// POST ['api/notes']
router.post('/', async (req, res) => {
    // Validate client input
    const { error } = validate(req.body);
    // Assert validation
    if (error)
        return res.status(400).send(error.details[0].message);
    // Validate teacher
    let teacher = await Teacher.findOne({ id: req.body.teacherId });
    if (!teacher) return res.status(400).send(`מורה בעל ת"ז ${req.body.teacherId} אינו קיים במערכת.`);
    // Create new document
    let newNote = new Note({
        teacher: teacher._id,
        date: Date.now(),
        message: req.body.message
    });

    try {
        let child = await Child.findOneAndUpdate({ id: req.body.childId },
            {
                $push: { notes: newNote }
            }, {
            new: true, useFindAndModify: false
        });
    } catch (ex) {
        return console.log(`Failed to add new note.`);
    }
    // Send response to client
    res.status(200).send(newNote);
});


// // PUT ['api/notes/:id']
// router.put('/:id', async (req, res) => {
//     // Validate client input
//     const { error } = validate(req.body);
//     // Assert validation
//     if (error)
//         return res.status(400).send(error.details[0].message);
//     // Try to update the selected document
//     try {
//         const note = await Note.findByIdAndUpdate(req.params.id, {
//             child: req.body.child,
//             teacher: req.body.teacher,
//             date: req.body.date,
//             message: req.body.message
//         }, {
//             new: true, useFindAndModify: false
//         });
//         // Assert update completed successfully
//         if (!note)
//             return res.status(404).send(`Note ${req.params.id} was not found.`);
//         // Send response to client
//         res.status(200).send(note);
//     } catch (ex) {
//         return res.status(404).send(`Failed to update.`);
//     }
// });


// // DELETE ['api/notes/:id']
// router.delete('/:id', async (req, res) => {
//     // Try to delete the selected document
//     try {
//         const note = await Note.findByIdAndRemove(req.params.id);
//         // Assert delete completed successfully
//         if (!note)
//             return res.status(404).send(`Note ${req.params.id} was not found.`);

//         // Send response to client
//         res.send(note);
//     }
//     catch (ex) {
//         return res.status(404).send(`Faild to deleting.`);
//     }
// });


// Module exports
module.exports = router;