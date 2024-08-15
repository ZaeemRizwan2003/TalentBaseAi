const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// LearningCourse schema
const learningCourseSchema = new Schema({
    name: { type: String, required: true },
    category: {type: String, required: true},
    paymentRequired:{type: String, required: true},
    preRequisites: [{ type: Schema.Types.ObjectId, ref: 'LearningCourse' }], // List of course IDs that are pre-requisites
    students: [{
        studentId: { type: Schema.Types.ObjectId, ref: 'User' },
        completed: { type: Boolean, default: false },
        paid: { type: Boolean, default: false },
        score: { type: Number, default: 0 }
    }],
    stream: { type: Schema.Types.ObjectId, ref: 'Stream', required: true }
});

// Stream schema
const streamSchema = new Schema({
    name: { type: String, required: true },
    courses: [{ type: Schema.Types.ObjectId, ref: 'LearningCourse' }], // List of courses in the stream
    students: [{
        studentId: { type: Schema.Types.ObjectId, ref: 'User' },
        streamCompleted: { type: Boolean, default: false }
    }]
});

const LearningCourse = mongoose.model('LearningCourse', learningCourseSchema);
const Stream = mongoose.model('Stream', streamSchema);

module.exports = { LearningCourse, Stream };
