const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const learningPathSchema = new Schema({
  programSelection: {
    type: String,
    required: true,
  },
  streamSelection: {
    type: String,
    required: true,
  },
  courseContents: {
    type: [String],
    required: true,
  },
  onlineTest: {
    type: String,
    required: true,
  },
  certification: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const LearningPath = mongoose.model('LearningPath', learningPathSchema);
module.exports = LearningPath;
