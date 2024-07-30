const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user.models');
const authMiddleware = require('../middleware/auth');
require('dotenv').config();


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

       
        req.session.userId = user._id;
        req.session.role = user.role;
        req.session.email= user.email;
        req.session.username = user.username;

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});


router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out', error: err.message });
        }
        res.clearCookie('connect.sid'); // Name of the session ID cookie
        res.status(200).json({ message: 'Logout successful' });
    });
});


router.get('/protected', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'This is a protected route' });
});

module.exports = router;
