const express = require('express');
const router = express.Router();
const User = require('../models/user.models');
const Industry = require('../models/industry.models');
const mongoose = require('mongoose');

router.post('/profile/:userId', async (req, res) => {
    const { userId } = req.params;
    const industryData = req.body;

    try {
        // Validate if userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid userId format' });
        }

        // Convert userId to ObjectId
        const userObjectId = new mongoose.Types.ObjectId(userId);

        let industryProfile = await Industry.findOne({ user: userObjectId });

        if (industryProfile) {
            // Update existing profile
            industryProfile = await Industry.findByIdAndUpdate(
                industryProfile._id,
                { $set: industryData },
                { new: true, runValidators: true }
            );
        } else {
            // Create new profile
            const newIndustryProfile = new Industry({ user: userObjectId, ...industryData });
            industryProfile = await newIndustryProfile.save();
        }

        res.status(200).json({
            message: 'Profile saved successfully',
            data: industryProfile
        });
    } catch (error) {
        console.error('Error saving profile:', error); // Log error details
        res.status(500).json({
            message: 'Failed to save profile',
            error: error.message
        });
    }
});


// Get student profile
router.get('/profile/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const industryProfile = await Industry.findOne({ user: userId });

        if (!industryProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

    }
    catch(err)
    {
        console.log(err)
    }
});

// Update industry profile
router.put('/profile/:userId', async (req, res) => {
    const { userId } = req.params;
    const industryData = req.body;

    try {
        // Validate if userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid userId format' });
        }

        // Convert userId to ObjectId
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Update the industry profile
        const updatedIndustryProfile = await Industry.findOneAndUpdate(
            { user: userObjectId },
            { $set: industryData },
            { new: true, runValidators: true }
        );

        if (!updatedIndustryProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json({
            message: 'Profile updated successfully',
            data: updatedIndustryProfile
        });
    } catch (error) {
        console.error('Error updating profile:', error); // Log error details
        res.status(500).json({
            message: 'Failed to update profile',
            error: error.message
        });
    }
});
module.exports = router;
