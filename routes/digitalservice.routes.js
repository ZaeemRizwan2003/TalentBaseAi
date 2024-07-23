const express = require('express');
const router = express.Router();
const DigitalServiceRequest = require('../models/digitalservice.models'); 

// POST request to create a new digital service request
router.post('/request', async (req, res) => {
    try {
        const { studentEmail, requestDetails } = req.body;
        
        if (!studentEmail || !requestDetails) {
            return res.status(400).json({ message: "Student email and request details are required." });
        }
        
        const newRequest = new DigitalServiceRequest({
            studentEmail,
            requestDetails
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