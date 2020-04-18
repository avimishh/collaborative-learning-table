const Joi = require('joi');
const bcrypt = require('bcrypt'); // Password Hash
const _ = require('lodash'); // Pick/Select values from object
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { User } = require('../models/user');

// HTTP Handling

// POST ['api/auth']       -   Login
router.post('/', async (req,res) => {
    // Validate client input
    const { error } = validate(req.body);
    // Assert validation
    if(error)
        return res.status(400).send(error.details[0].message);
    // Check if the user exist
    let user = await User.findOne({name: req.body.name});
    // Response 400 Bad Request if the user exist
    if(!user) return res.status(400).send("Invalid email or password.");
    // Validate password, bcypt.comare missing await
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Invalid email or password.");
    // Create JWT
    const token = user.generateAuthToken();
    // Send Response
    res.send(token);
});


// Essential functions
function validate(req){
    const schema = {
        name: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(req, schema);
}


// Module exports
module.exports = router;