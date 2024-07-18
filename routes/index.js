const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { StudentSchema } = require('../models/register_model');
const { profileSchema } = require('../models/profile_model');
const { startuplisting } = require('../models/startuplisting_model');
const Student = mongoose.model('Student', StudentSchema);
const profile = mongoose.model('Profile', profileSchema);
const startup = mongoose.model('StartupListing', startuplisting);

//setting validations for the user register form
const validating = (req, res, next) => {
  const { firstname, lastname, email, password, phone } = req.body;
  if (firstname.length < 3 || lastname.length < 3) {
    return res.status(400).json({ message: 'the length of the names must be atleast 3 characters' });
  }
  if (!email.includes('@')) {
    return res.status(400).json({ message: 'Invalid Email Address. Try Again!' });
  }
  if (password.length < 5) {
    return res.status(400).json({ message: 'The length of the password must be atleast 5 characters' });
  }
  const phonetest = /^\d{11}$/;
  if (!phonetest.test(phone)) {
    return res.status(400).json({ message: 'Invalid phone number. Try again!' });
  }
  next();
}

//registering the user 
router.post('/register', validating, async (req, res) => {
  const { firstname, lastname, email, password, phone } = req.body;

  try {
    // Create a new student instance based on the request body
    const hashed = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      firstname,
      lastname,
      profilepicture: req.body.profilepicture,
      email,
      password: hashed,
      phone
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

router.post('/liststartups/:id', async (req, res) => {
  const id = req.params.id;
  const values = req.body;
  try {
    const lists = new startup({
      ...values,
      createdBy: id
    });
    await lists.save();

    res.status(201).json({
      message: 'Startup listing created successfully',
      data: lists
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating the listing for your startup!',
      error: error.message
    });
  }


});

//setting the profile of the user
router.put('/profile/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedata = req.body;

    const updatedStudent = await profile.findByIdAndUpdate(
      { _id: id },
      { $set: updatedata },
      { new: true }
    );

    if (!updatedStudent) {
      res.status(404).json({ message: 'User not found. Try Again' });
    }
    res.status(200).json(updatedStudent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;
