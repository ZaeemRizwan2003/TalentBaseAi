const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const Student = require('../models/student.models');

const validating = (req, res, next) => {
  const { username, email, password, institution, degree } = req.body;
  if (username.length < 3) {
    return res.status(400).json({ message: 'the length of the names must be atleast 3 characters' });
  }
  if (!email.includes('@')) {
    return res.status(400).json({ message: 'Invalid Email Address. Try Again!' });
  }
  if (password.length < 5) {
    return res.status(400).json({ message: 'The length of the password must be atleast 5 characters' });
  }
  next();
}

//registering the user 
router.post('/register', validating, async (req, res) => {
  const { username, email, password, institution, degree } = req.body;

  try {
    // Create a new student instance based on the request body
    const hashed = await bcrypt.hash(password, 10);
    const newStudent = new Student({
      username,
      // profilepicture: req.body.profilepicture,
      email,
      password: hashed,
      institution,
      degree
    });
    // Save the student data to the database
    const savedStudent = await newStudent.save();

    // Respond with a success message
    res.status(201).json({ message: 'User Registration Successful', student: savedStudent });
  } catch (error) {
    // Handle errors
    console.error('Error registering student:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }
});



//setting the profile of the user
router.put('/profile/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedata = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      { _id: id },
      { $set: updatedata },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'User not found. Try Again' });
    }
    res.status(200).json(updatedStudent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// router.get('/search', async (req, res) => {
//   const word = req.query.q;
//   if (!keyword) {
//     return res.status(400).json({ message: 'Query parameter is required.' });
//   }

//   try {
//     const regex = new RegExp(word, 'gi');
//     const results = await Startup_listing.find({
//       $or: [

//       ]
//     })
//   }
// })
module.exports = router;
