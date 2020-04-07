const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Customer, validate } = require('../models/customer');

// HTTP Handling

// GET ['api/customers']
router.get('/', async (req,res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});


// GET ['api/customers/:id']
router.get('/:id', async (req,res) => {
    // Find
    const customer = await Customer.findById(req.params.id);
    // Check if exist
    if(!customer) 
        return res.status(404).send(`Customer ${req.params.id} was not found.`);
    // Send to client
    res.status(200).send(customer);
});


// POST ['api/customers']
router.post('/', async (req,res) => {
    // Validate client input
    const { error } = validate(req.body);
    // Assert validation
    if(error)
        return res.status(400).send(error.details[0].message);
    // Create new document
    let customer = new Customer( {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    // Save to DataBase
    customer = await customer.save();
    // Send response to client
    res.status(200).send(customer);
});


// PUT ['api/customers/:id']
router.put('/:id', async (req,res) => {
    // Validate client input
    const { error } = validate(req.body);
    // Assert validation
    if(error)
        return res.status(400).send(error.details[0].message);
    // Try to update the selected document
    try{
        const customer = await Customer.findByIdAndUpdate(req.params.id, {name: req.body.name}, {
            new: true, useFindAndModify: false
        });
        // Assert update completed successfully
        if(!customer) 
            return res.status(404).send(`Customer ${req.params.id} was not found.`);
        // Send response to client
        res.status(200).send(customer); 
    }catch(ex){
        return res.status(404).send(`Failed to update.`);
    }
});


// DELETE ['api/customers/:id']
router.delete('/:id', async (req,res) => {
    // Try to delete the selected document
    try{
        const customer = await Customer.findByIdAndRemove(req.params.id);
        // Assert delete completed successfully
        if(!customer) 
            return res.status(404).send(`Customer ${req.params.id} was not found.`);

        // Send response to client
        res.send(customer);
    }
    catch(ex){
        return res.status(404).send(`Faild to deleting.`); 
    }
});


// Module exports
module.exports = router;