const express = require('express');
const router = express.Router();
const { LearningCourse, Stream } = require('../models/learningpath.models');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have an auth middleware

// Create a new stream
router.post('/stream', authMiddleware, async (req, res) => {
    const { name } = req.body;
    try {
        const newStream = new Stream({ name });
        await newStream.save();
        res.status(201).json(newStream);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create stream', error: error.message });
    }
});

// Create a new course within a stream
router.post('/course', authMiddleware, async (req, res) => {
    const { name, streamId, preRequisites } = req.body;

    try {
        // Ensure pre-requisites belong to the same stream
        const stream = await Stream.findById(streamId);
        if (!stream) return res.status(404).json({ message: 'Stream not found' });

        const invalidPreReq = await LearningCourse.find({
            _id: { $in: preRequisites },
            stream: { $ne: streamId }
        });

        if (invalidPreReq.length > 0) {
            return res.status(400).json({ message: 'Invalid pre-requisites detected' });
        }

        const newCourse = new LearningCourse({ name, stream: streamId, preRequisites });
        await newCourse.save();

        // Add course to stream's course list
        stream.courses.push(newCourse._id);
        await stream.save();

        res.status(201).json(newCourse);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create course', error: error.message });
    }
});

// Update course completion status for a student
router.post('/course/:courseId/complete', authMiddleware, async (req, res) => {
    const { courseId } = req.params;
    const { studentId } = req.body;

    try {
        const course = await LearningCourse.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const studentCourse = course.students.find(s => s.studentId.toString() === studentId);
        if (!studentCourse) return res.status(404).json({ message: 'Student not enrolled in this course' });

        studentCourse.completed = true;
        await course.save();

        res.status(200).json({ message: 'Course completion updated' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update course completion', error: error.message });
    }
});

// Enroll a student in a stream
router.post('/stream/:streamId/enroll', authMiddleware, async (req, res) => {
    const { streamId } = req.params;
    const studentId = req.session.userId;

    try {
        const stream = await Stream.findById(streamId);
        if (!stream) return res.status(404).json({ message: 'Stream not found' });

        if (stream.students.some(s => s.studentId.toString() === studentId)) {
            return res.status(400).json({ message: 'Student already enrolled' });
        }

        stream.students.push({ studentId });
        await stream.save();

        res.status(200).json({ message: 'Student enrolled in stream' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to enroll student', error: error.message });
    }
});

// Update course payment status
router.post('/course/:courseId/pay', authMiddleware, async (req, res) => {
    const { courseId } = req.params;
    const { studentId } = req.body;

    try {
        const course = await LearningCourse.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const studentCourse = course.students.find(s => s.studentId.toString() === studentId);
        if (!studentCourse) return res.status(404).json({ message: 'Student not enrolled in this course' });

        studentCourse.paid = true;
        await course.save();

        res.status(200).json({ message: 'Course payment updated' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update course payment', error: error.message });
    }
});

// Get a course, checking pre-requisites and payment
router.get('/course/:courseId', authMiddleware, async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.session.userId;

    try {
        const course = await LearningCourse.findById(courseId).populate('preRequisites');
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const studentCourse = course.students.find(s => s.studentId.toString() === studentId);
        if (!studentCourse) return res.status(403).json({ message: 'Student not enrolled' });

        for (const preReq of course.preRequisites) {
            const preReqStudent = preReq.students.find(s => s.studentId.toString() === studentId);
            if (!preReqStudent || !preReqStudent.completed) {
                return res.status(403).json({ message: 'Pre-requisite course(s) not completed' });
            }
        }

        if (course.preRequisites.length > 0 && !studentCourse.paid) {
            return res.status(403).json({ message: 'Payment required' });
        }

        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch course', error: error.message });
    }
});

// Get all courses for a stream
router.get('/stream/:streamId/courses', authMiddleware, async (req, res) => {
    try {
        const courses = await LearningCourse.find({ stream: req.params.streamId });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
    }
});

module.exports = router;
