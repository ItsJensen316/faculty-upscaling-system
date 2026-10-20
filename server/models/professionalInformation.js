const mongoose = require('mongoose');

// Create Professional Information Schema
const ProfessionalInformationSchema = new mongoose.Schema({
    // employee_code: {
    //     type: String,
    //     required: true
    // },
    userId:{
        type:String
    },
    designation: {
        type: String,
        enum: ["Professor", "Assistant Professor", "Associate Professor", "Lecturer"],
        required: true
    },
    department: {
        type: String,
        required: true
    },
    date_of_joining: {
        type: Date,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: false
    }
});

const ProfessionalInformation = mongoose.model("ProfessionalInformation", ProfessionalInformationSchema);

module.exports = ProfessionalInformation;
