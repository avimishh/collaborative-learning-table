// const asyncMiddleware = require('../middleware/async');
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Classroom, validateClassroom } = require("../models/classroom");

// GET 'api/classrooms'
router.get("/", async (req, res, next) => {
  const classrooms = await Classroom.find().select("-__v").sort("name");
  res.send(classrooms);
});

// GET 'api/classrooms/:id'
router.get("/:id", validateObjectId, async (req, res) => {
  const classroom = await Classroom.findById(req.params.id);
  if (!classroom)
    return res.status(404).send(`Classroom ${req.params.id} was not found.`);

  res.send(classroom);
});

// POST
// router.post('/', [auth,admin], async (req,res) => {
router.post("/", auth, async (req, res) => {
  // validate input
  const { error } = validateClassroom(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let classroom = new Classroom({
    code: req.body.code,
    teachers: req.body.teachers,
    children: req.body.children,
  });

  classroom = await classroom.save();
  res.status(200).send(classroom);
});


// PUT
router.put("/:id", async (req, res) => {
  const { error } = validateClassroom(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const classroom = await Classroom.findByIdAndUpdate(
      req.params.id,
      {
        code: req.body.code,
        teachers: req.body.teachers,
        children: req.body.children
      },
      {
        new: true,
        usefindAndModify: false,
      }
    );

    if (!classroom)
      return res.status(404).send(`Classroom ${req.params.id} was not found.`);
  } catch (ex) {
    return res.status(404).send(`Failed to update.`);
  }

  res.status(200).send(classroom);
});

// DELETE
router.delete("/:id", [auth, admin], async (req, res) => {
  const classroom = await Classroom.findByIdAndRemove(req.params.id);

  if (!classroom)
    return res.status(404).send(`Classroom ${req.params.id} was not found.`);

  res.send(classroom);
});

module.exports = router;
