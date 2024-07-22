const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    
  },
  password: {
    type: String,
    
  },
  institution: {
    type: String,
  },
  degree: {
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
  personalwebsite: {
    type: String
  },
  location: {
    country: {
      type: String,
      
    },
    city: {
      type: String,
      
    }
  },
  Currentposition: {
    type: String,
    
  },
  previousexperience: {
    type: String,
  },
  educationalbackground: [
    {
      degree: {
        type: String,
        
      },
      institution: {
        type: String,
        
      },
      graduationYear: {
        type: String,
        
      }
    }
  ],
  skills: {
    type: [String]
  },
  achievements: {
    type: [String]
  },
  awards: {
    type: [String]
  },
  Advisors: [
    {
      Name: {
        type: String,
      },
      linkedinprofile: {
        type: String
      }
    }
  ],
  articles: {
    type: [String]
  },
  interviews: {
    type: [String]
  },
  biography: {
    type: String,
    
  },
  vision_goals: {
    type: [String]
  }
});

const Student = mongoose.model('Student', studentSchema);
module.exports=Student;
