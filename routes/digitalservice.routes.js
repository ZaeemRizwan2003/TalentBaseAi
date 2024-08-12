const express = require('express');
const router = express.Router();
const DigitalServiceRequest = require('../models/digitalservice.models'); // Adjust the path as necessary
const authMiddleware = require('../middleware/auth');

// POST request to create a new digital service request
router.post('/request',authMiddleware, async (req, res) => {
    try {
        const { request,serviceName } = req.body;

        // Ensure requestDetails is provided
        if (!request) {
            return res.status(400).json({ message: "Request details are required." });
        }

        // Get the email from the session
        const loggedInEmail = req.session.email; // Assuming email is stored in session
        const userId=req.session.userId;
        // Validate if the email is available in the session
        if (!loggedInEmail) {
            return res.status(403).json({ message: "Unauthorized. No email found in session." });
        }

        // Create a new digital service request
        const newRequest = new DigitalServiceRequest({
            userId:userId,
            email: loggedInEmail,
            serviceName: serviceName,
            request:request
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


 // get all requests 
 router.get('/requests', authMiddleware, async (req, res) => {
    try {
        const requests = await DigitalServiceRequest.find();
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error retrieving digital service requests:', error);
        res.status(500).json({ message: "Failed to retrieve requests" });
    }
});


router.get('/request/:id', authMiddleware, async (req, res) => {
    try {
        const request = await DigitalServiceRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        res.status(200).json(request);
    } catch (error) {
        console.error('Error retrieving digital service request by ID:', error);
        res.status(500).json({ message: "Failed to retrieve request" });
    }
});

module.exports = router;
