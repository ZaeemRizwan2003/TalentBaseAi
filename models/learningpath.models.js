const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const learningPathSchema = new Schema({
  programSelection: {
    type: String,
   
  },
  streamSelection: {
    type: String,
    
  },
  courseContents: {
    type: [String],
    
  },
  onlineTest: {
    type: String,
    
  },
  certification: {
    type: String,
    
  }
}, { timestamps: true });

const LearningPath = mongoose.model('LearningPath', learningPathSchema);
module.exports = LearningPath;
