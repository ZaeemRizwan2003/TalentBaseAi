const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 
const { LearningCourse, Stream } = require('../models/learningpath.models');
const authMiddleware = require('../middleware/auth'); // Assuming you have an auth middleware

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
    const { name, streamId, preRequisites, category } = req.body;

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

        // Set paymentRequired based on category
        let paymentRequired;
        if (category === 'basic') {
            paymentRequired = '0';
        } else if (category === 'advanced') {
            paymentRequired = '5';
        } else if (category === 'expert') {
            paymentRequired = '10';
        } else {
            return res.status(400).json({ message: 'Invalid category' });
        }

        const newCourse = new LearningCourse({
            name,
            stream: streamId,
            preRequisites,
            category,
            paymentRequired
        });

        await newCourse.save();

        // Add course to stream's course list
        stream.courses.push(newCourse._id);
        await stream.save();

        res.status(201).json(newCourse);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create course', error: error.message });
    }
});


router.post('/course/:courseId/score', authMiddleware, async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.session.userId; // Get studentId from session
    const { score } = req.body; // The new score submitted

    try {
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Invalid course ID or student ID' });
        }

        // Find the course by ID
        const course = await LearningCourse.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        // Find the student entry in the course
        const studentCourse = course.students.find(s => s.studentId.toString() === studentId);
        if (!studentCourse) return res.status(404).json({ message: 'Student not enrolled in this course' });

        // Update score if the new score is higher than the previous one
        if (!studentCourse.score || score > studentCourse.score) {
            studentCourse.score = score;
        }

        // Update course completion status based on score
        if (studentCourse.score >= 80) {
            studentCourse.completed = true;
        }

        await course.save();

        // Return the stream ID to be used for the next API call
        res.status(200).json({
            message: 'Score and course completion status updated',
            streamId: course.stream
        });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ message: 'Failed to update score or course completion', error: error.message });
    }
});

router.post('/stream/:streamId/complete', authMiddleware, async (req, res) => {
    const { streamId } = req.params;
    const studentId = req.session.userId; // Get studentId from session

    try {
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(streamId) || !mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Invalid stream ID or student ID' });
        }

        // Find the stream by ID and populate courses
        const stream = await Stream.findById(streamId).populate('courses');
        if (!stream) return res.status(404).json({ message: 'Stream not found' });

        // Find the student's entry in the stream
        const studentStream = stream.students.find(s => s.studentId.toString() === studentId);
        if (!studentStream) return res.status(404).json({ message: 'Student not enrolled in this stream' });

        // Check if the student has completed all courses in the stream
        const allCoursesCompleted = await Promise.all(stream.courses.map(async (course) => {
            const courseDetails = await LearningCourse.findById(course._id).lean();
            if (!courseDetails) {
                console.warn(`Course ${course._id} not found.`);
                return false;
            }
            // Find the student entry in the course's students array
            const studentEnrollment = courseDetails.students.find(s => s.studentId.toString() === studentId);
            if (!studentEnrollment) {
                console.warn(`Student ${studentId} not found in course ${course._id}.`);
                return false;
            }
            return studentEnrollment.completed;
        }));

        // Log the completion statuses
        console.log('Course Completion Statuses:', allCoursesCompleted);

        // Determine if all courses are completed
        const isStreamCompleted = allCoursesCompleted.every(status => status);

        if (isStreamCompleted) {
            studentStream.streamCompleted = true;
            await stream.save();
            return res.status(200).json({ message: 'Stream completion status updated for the student' });
        } else {
            return res.status(200).json({ message: 'Not all courses are completed by the student' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ message: 'Failed to check stream completion', error: error.message });
    }
});


// Enroll a student in a stream and add them to all courses in the stream
router.post('/stream/:streamId/enroll', authMiddleware, async (req, res) => {
    const { streamId } = req.params;
    const studentId = req.session.userId;

    try {
        // Find the stream by ID
        const stream = await Stream.findById(streamId).populate('courses');
        if (!stream) return res.status(404).json({ message: 'Stream not found' });

        // Check if the student is already enrolled in the stream
        if (stream.students.some(s => s.studentId.toString() === studentId)) {
            return res.status(400).json({ message: 'Student already enrolled' });
        }

        // Add the student to the stream
        stream.students.push({ studentId });

        // Add the student to each course in the stream
        for (const course of stream.courses) {
            if (!course.students.some(s => s.studentId.toString() === studentId)) {
                course.students.push({ studentId });
                await course.save(); // Save each course after adding the student
            }
        }

        // Save the stream with the newly added student
        await stream.save();

        res.status(200).json({ message: 'Student enrolled in stream and added to all courses' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to enroll student', error: error.message });
    }
});


router.post('/course/:courseId/pay', authMiddleware, async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.session.userId; // Pick studentId from session

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

// Get all streams
router.get('/streams', authMiddleware, async (req, res) => {
    try {
        // Retrieve all streams from the database
        const streams = await Stream.find();
        
        // Return the list of streams
        res.status(200).json(streams);
    } catch (error) {
        console.error('Error occurred:', error); // Added logging
        res.status(500).json({ message: 'Failed to fetch streams', error: error.message });
    }
});


module.exports = router;
