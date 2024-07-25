const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
  certificationName: { type: String },
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

const Certification = mongoose.model('Certification', CertificationSchema);

module.exports = Certification;
