const express = require('express');
const app = express();

app.use(express.json());    // a piece of middleware

app.post('/api/users',(req,res) => {
    

})