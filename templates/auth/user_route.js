const {User, validate} = require('../models/user');
const mogoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const users = await users.find().sort('name');
    res.send(users);

});

module.exports = router;