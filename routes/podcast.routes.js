const express = require('express');
const router = express.Router();
const PodcastServiceRequest = require('../models/podcast.models'); 
const authMiddleware = require('../middleware/auth');

// POST request to create a new podcast service request
router.post('/request', authMiddleware,async (req, res) => {
    try {
        const { request } = req.body;

        // Ensure requestDetails is provided
        if (!request) {
            return res.status(400).json({ message: "Request details are required." });
        }

        // Get the email from the session
        const loggedInEmail = req.session.email; // Assuming email is stored in session

        // Validate if the email is available in the session
        if (!loggedInEmail) {
            return res.status(403).json({ message: "Unauthorized. No email found in session." });
        }

        // Create a new digital service request
        const newRequest = new PodcastServiceRequest({
            email: loggedInEmail,
            request: request
        });

        await newRequest.save();

        res.status(201).json({
            message: "Request created successfully!",
            request: newRequest
        });
    } catch (error) {
        console.error('Error creating digital service request:', error);
        res.status(500).json({ message: "Failed to create request" });
    }
});


module.exports = router;
