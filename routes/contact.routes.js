const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Contact = require('../models/contactus_model');

router.post('/:id', async (req, res) => {
    const { subject, message } = req.body;
    const id = req.params.id;
    try {
        const newcontact = new Contact({
            subject, message,
            postedby: id
        });
        await newcontact.save();
        res.status(201).json({ message: 'Contact message saved succesfully', data: newcontact });
    } catch (error) {
        console.error('Error saving contact message:', error);
        res.status(500).json({ message: 'Failed to save contact message' });
    }
});

module.exports = router;

