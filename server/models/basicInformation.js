const mongoose = require('mongoose');
// console.log(mongoose)
const BasicInformationSchema = new mongoose.Schema({
    userId:{
        type:String
    },
    full_name: {
        type: String,
        required: true
    },
    date_of_birth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: false
    },
    contact_number: {
        type: String,
        required: true
    },
    email_address: {
        type: String,
        required: true
    }
});

const BasicInformation = mongoose.model("BasicInformation", BasicInformationSchema);

module.exports = BasicInformation;
