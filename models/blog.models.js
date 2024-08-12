const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: {
    type: String,
 
  },
  category: {
    type: String,
   
  },
  body: {
    type: String,
    
  },
  subHeadings: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  keywords: [{
    type: String
  }],
  authorId: {
    type:String,
    required:true
  },
  comments: [{
    type: [String],
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isActive:{
    type: String,
    default: 0
  }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
