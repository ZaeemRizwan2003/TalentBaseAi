const express = require('express');
const router = express.Router();
const Updates = require('../models/updates.models');
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/auth');



// POST endpoint to send an announcement
router.post('/send',authMiddleware, async (req, res) => {
    const { messageContent, sentAt } = req.body;

    if (!messageContent || !sentAt) {
        return res.status(400).json({ message: 'Message content and timestamp are required' });
    }

    try {
        // Create a new announcement
        const newUpdate = new Updates({
            message: messageContent,
            sentAt: new Date(sentAt), // Ensure the timestamp is converted to a Date object
        });

        // Save the announcement to the database
        const savedUpdate = await newUpdate.save();

        res.status(201).json({ message: 'Announcement sent successfully', savedUpdate });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error sending announcement' });
    }
});

router.get('/review',authMiddleware, async (req, res) => {
    try {
        // Fetch all announcements from the Update collection
        const updates = await Updates.find();

        // Send a successful response with the announcements
        res.status(200).json(updates);
    } catch (err) {
        // Handle errors and send a response with a status code 500
        console.error(err);
        res.status(500).json({ message: "Error fetching announcements" });
    }
});


router.delete('/delete/:id',authMiddleware, async (req, res) => {
    const id = req.params.id;
    try {
        const deleteupdate = await Updates.findByIdAndDelete(id);

        if (!deleteupdate) {
            return res.status(404).json({ message: "Update not found.Try Again" });
        }
        res.status(200).json({ message: 'update successfully deleted', deleteupdate });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting update' });
    }
});



module.exports = router;