const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    subject: {
        type: String

    },
    message: {
        type: String
    },
    postedby: {
        // type: Schema.Types.ObjectId,
        // ref: 'students'+\
        type: String
    }
});

const Contact = mongoose.model('User_Issue', contactSchema);
module.exports = Contact;
