const express = require('express');
const router = express.Router();
const Course = require('../models/course.models');

// Create a new course
router.post('/create', async (req, res) => {
  const { courseName } = req.body;

  try {
    const newCourse = new Course({ courseName });
    const savedCourse = await newCourse.save();
    res.status(201).json({
      message: 'Course created successfully',
      data: savedCourse
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create course',
      error: error.message
    });
  }
});

// Delete a course
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete course',
      error: error.message
    });
  }
});

// Update a course
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedCourse = await Course.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      message: 'Course updated successfully',
      data: updatedCourse
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update course',
      error: error.message
    });
  }
});

// Get a course
router.get('/get/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      message: 'Course retrieved successfully',
      data: course
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve course',
      error: error.message
    });
  }
});

// Get all courses
router.get('/all', async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json({
      message: 'Courses retrieved successfully',
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve courses',
      error: error.message
    });
  }
});

// POST request to enroll in a course
router.post('/enroll', async (req, res) => {
  const { courseId } = req.body;

  try {
      // Retrieve user ID from session
      const userId = req.session.userId; // Assuming userId is stored in session

      if (!userId) {
          return res.status(401).json({ message: 'Unauthorized. User not logged in.' });
      }

      if (!courseId) {
          return res.status(400).json({ message: 'Course ID is required.' });
      }

      // Find the course
      const course = await Course.findById(courseId);

      if (!course) {
          return res.status(404).json({ message: 'Course not found' });
      }

      // Check if user is already enrolled
      if (course.enrolledStudents.includes(userId)) {
          return res.status(400).json({ message: 'Already registered' });
      }

      // Enroll user in the course
      course.enrolledStudents.push(userId);
      await course.save();

      res.status(200).json({ message: 'Enrolled successfully', data: course });
  } catch (error) {
      console.error('Error enrolling in course:', error);
      res.status(500).json({
          message: 'Failed to enroll in course',
          error: error.message
      });
  }
});

module.exports = router;
