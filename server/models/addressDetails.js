const mongoose = require('mongoose');

// Create Address Details Schema
const AddressDetailsSchema = new mongoose.Schema({
    userId:{
        type:String
    },
    residential_address: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
});

const AddressDetails = mongoose.model("AddressDetails", AddressDetailsSchema);

module.exports = AddressDetails;
