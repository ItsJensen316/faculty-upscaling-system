const mongoose = require('mongoose');

// Create Account Security Schema
const AccountSecuritySchema = new mongoose.Schema({
    // password: { 
    //     type: String,
    //     required: true
    // },
    userId:{
        type:String
    },
    security_question: {
        type: String,
        enum: ["What is your mother's maiden name?", "What was your first pet's name?", "What was the name of your first school?"],
        required: true
    },
    security_answer: {
        type: String,
        required: true
    }
});

const AccountSecurity = mongoose.model("AccountSecurity", AccountSecuritySchema);

module.exports = AccountSecurity;
