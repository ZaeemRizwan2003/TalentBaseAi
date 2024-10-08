const express = require('express');
const router = express.Router();
const Certification = require('../models/certification.models');
const authMiddleware = require('../middleware/auth');

// Create a new certification
router.post('/create',authMiddleware, async (req, res) => {
  const { certificationName } = req.body;

  try {
    const newCertification = new Certification({ certificationName });
    const savedCertification = await newCertification.save();
    res.status(201).json({
      message: 'Certification created successfully',
      data: savedCertification
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create certification',
      error: error.message
    });
  }
});

// Delete a certification
router.delete('/delete/:id',authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCertification = await Certification.findByIdAndDelete(id);

    if (!deletedCertification) {
      return res.status(404).json({ message: 'Certification not found' });
    }

    res.status(200).json({ message: 'Certification deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete certification',
      error: error.message
    });
  }
});

// Update a certification
router.put('/update/:id',authMiddleware, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedCertification = await Certification.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedCertification) {
      return res.status(404).json({ message: 'Certification not found' });
    }

    res.status(200).json({
      message: 'Certification updated successfully',
      data: updatedCertification
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update certification',
      error: error.message
    });
  }
});

// Get a certification
router.get('/get/:id',authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const certification = await Certification.findById(id);

    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }

    res.status(200).json({
      message: 'Certification retrieved successfully',
      data: certification
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve certification',
      error: error.message
    });
  }
});

// Get all certifications
router.get('/all',authMiddleware, async (req, res) => {
  try {
    const certifications = await Certification.find({});
    res.status(200).json({
      message: 'Certifications retrieved successfully',
      data: certifications
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve certifications',
      error: error.message
    });
  }
});

router.post('/enroll', authMiddleware,async (req, res) => {
  const { certificationId } = req.body;

  try {
      
      const userId = req.session.userId;

      if (!userId) {
          return res.status(401).json({ message: 'Unauthorized. User not logged in.' });
      }

      if (!certificationId) {
          return res.status(400).json({ message: 'Certification ID is required.' });
      }

      const certification = await Certification.findById(certificationId);

      if (!certification) {
          return res.status(404).json({ message: 'Certification not found' });
      }

      
      if (certification.enrolledStudents.includes(userId)) {
          return res.status(400).json({ message: 'Already registered' });
      }

      
      certification.enrolledStudents.push(userId);
      await certification.save();

      res.status(200).json({ message: 'Enrolled successfully', data: certification });
  } catch (error) {
      console.error('Error enrolling in certification:', error);
      res.status(500).json({
          message: 'Failed to enroll in certification',
          error: error.message
      });
  }
});

module.exports = router;
