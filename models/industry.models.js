const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const industrySchema = new Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserInfo',
    required: true
  },
  company: {
    type: String,
  },
 
  fullname: {
    type: String,
  },
  profilepicture: {
    type: String,
    default: 'profilepictures/pp.png'
  },
  phone: {
    type: String
  },
 
  linkedin: {
    type: String,
  },
  companywebsite: {
    type: String
  },
  companylocation: {
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    headoffice: {
      type: String,
    }
  },
  designation: {
    type: String,
  },

  
});

const Industry = mongoose.model('Industry', industrySchema);
module.exports = Industry;
