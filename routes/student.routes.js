const express = require('express');
const router = express.Router();
const User = require('../models/user.models');
const Student = require('../models/student.models');
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/auth');

router.post('/profile',authMiddleware, async (req, res) => {
    const userId = req.session.userId;

    console.log('Session ID:', userId); // Debugging line

    if (!userId) {
        return res.status(403).json({ message: 'Unauthorized. No user ID found in session.' });
    }

    const studentData = req.body;

    try {
        let studentProfile = await Student.findOne({ user: userId });

        if (studentProfile) {
            // Update existing profile
            studentProfile = await Student.findByIdAndUpdate(
                studentProfile._id,
                { $set: studentData },
                { new: true, runValidators: true }
            );
        } else {
            // Create new profile
            const newStudentProfile = new Student({ user: userId, ...studentData });
            studentProfile = await newStudentProfile.save();
        }

        res.status(200).json({
            message: 'Profile saved successfully',
            data: studentProfile
        });
    } catch (error) {
        console.error('Error saving profile:', error);
        res.status(500).json({
            message: 'Failed to save profile',
            error: error.message
        });
    }
});

// Get student profile
router.get('/profile/:userId',authMiddleware, async (req, res) => {
    const { userId } = req.params;

    try {
        const studentProfile = await Student.findOne({ user: userId });

        if (!studentProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

    }
    catch(err)

{
    console.log(err);
}
}
);

router.put('/profile/:userId',authMiddleware, async (req, res) => {
    const { userId } = req.params;
    const studentData = req.body;

    try {
        const updatedStudentProfile = await Student.findOneAndUpdate(
            { user: userId },
            { $set: studentData },
            { new: true, upsert: true }
        );

        if (!updatedStudentProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json({
            message: 'Profile updated successfully',
            data: updatedStudentProfile
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update profile',
            error: error.message
        });
    }
});

module.exports = router;
