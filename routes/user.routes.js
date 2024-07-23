const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user.models');
require('dotenv').config();

// Register endpoint
router.post('/register', async (req, res) => {
    const { username, email, profilepicture, role, password } = req.body;

    try {
        const hashed = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            profilepicture,
            email,
            password: hashed,
            role
        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: 'User Registration Successful' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to register user', error: error.message });
    }
});

// Add PUT endpoint to change profile picture
router.put('/profilepicture/:id', async (req, res) => {
    const userId = req.params.id;
    const { profilepicture } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilepicture },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'Profile picture updated successfully',
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update profile picture', error: error.message });
    }
});

// Add PUT endpoint to change password
router.put('/changepassword/:id', async (req, res) => {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to change password', error: error.message });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '2d' });

        return res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

module.exports = router;
