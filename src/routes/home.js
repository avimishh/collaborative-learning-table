const express = require('express');
const router = express.Router();
const path = require('path');


router.get('/', async (req,res) => {
    res.sendFile(path.resolve(__dirname + '/../../client/home.html'));
});


// Module exports
module.exports = router;