const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobOfferSchema = new Schema({
    industryPersonId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserInfo', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserInfo', required: true },
    offerDetails: { type: String, required: true },
    reply: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const JobOffer = mongoose.model('JobOffer', jobOfferSchema);
module.exports = JobOffer;
