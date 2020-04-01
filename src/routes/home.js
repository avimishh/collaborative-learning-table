const express = require('express');
const router = express.Router();


// GET [/]
router.get('/', (req,res) => {
    console.log('inside "/"');      // DEBUG
    res.send('Hello World');
});

module.exports = router;