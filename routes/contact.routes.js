const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Contact = require('../models/contactus_model');



// POST request to create a new contact message
router.post('/:id', async (req, res) => {
    const { subject, message } = req.body;
   

    try {
        // Retrieve user ID from session
        const userId = req.session.userId; // Assuming userId is stored in session

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized. User not logged in.' });
        }

        if (!subject || !message) {
            return res.status(400).json({ message: 'Subject and message are required.' });
        }

        // Create a new contact message
        const newContact = new Contact({
            subject,
            message,
            postedby: userId // Use userId from session
        });

        await newContact.save();

        res.status(201).json({ message: 'Contact message saved successfully', data: newContact });
    } catch (error) {
        console.error('Error saving contact message:', error);
        res.status(500).json({ message: 'Failed to save contact message' });
    }
});

module.exports = router;

