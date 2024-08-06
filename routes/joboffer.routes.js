const express = require('express');
const router = express.Router();
const JobOffer = require('../models/joboffer.models');

// Create a new job offer
router.post('/offer/:studentId', async (req, res) => {
    const { offerDetails } = req.body;
    const industryPersonId = req.session.userId; // Assuming the logged-in user's ID is stored in session
    const { studentId } = req.params;

    try {
        const newJobOffer = new JobOffer({
            industryPersonId,
            studentId,
            offerDetails
        });

        const savedJobOffer = await newJobOffer.save();
        res.status(201).json({
            message: 'Job offer sent successfully',
            data: savedJobOffer
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to send job offer',
            error: error.message
        });
    }
});

// Get all job offers for the logged-in student
router.get('/offers', async (req, res) => {
    const studentId = req.session.userId; // Assuming the logged-in user's ID is stored in session

    try {
        const jobOffers = await JobOffer.find({ studentId });

        if (jobOffers.length === 0) {
            return res.status(404).json({ message: 'No job offers found' });
        }

        res.status(200).json({
            message: 'Job offers retrieved successfully',
            data: jobOffers
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve job offers',
            error: error.message
        });
    }
});

// Get a job offer by ID
router.get('/offer/:offerId', async (req, res) => {
    const { offerId } = req.params;

    try {
        const jobOffer = await JobOffer.findById(offerId);

        if (!jobOffer) {
            return res.status(404).json({ message: 'Job offer not found' });
        }

        res.status(200).json({
            message: 'Job offer retrieved successfully',
            data: jobOffer
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve job offer',
            error: error.message
        });
    }
});

// Reply to a job offer
router.post('/reply/:offerId', async (req, res) => {
    const { reply } = req.body;
    const { offerId } = req.params;
    const studentId = req.session.userId; // Assuming the logged-in user's ID is stored in session

    try {
        const jobOffer = await JobOffer.findById(offerId);

        if (!jobOffer) {
            return res.status(404).json({ message: 'Job offer not found' });
        }

        if (jobOffer.studentId.toString() !== studentId) {
            return res.status(403).json({ message: 'You are not authorized to reply to this offer' });
        }

        jobOffer.reply = reply;
        jobOffer.updatedAt = Date.now();
        await jobOffer.save();

        res.status(200).json({
            message: 'Reply added successfully',
            data: jobOffer
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to add reply',
            error: error.message
        });
    }
});

module.exports = router;
