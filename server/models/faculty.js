const mongoose = require("mongoose");
// console.log(mongoose)

// Create Schema
const Loginschema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  basicInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BasicInformation",
  },
  professionalInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProfessionalInformation",
  },
  addressInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AddressDetails",
  },
  accountSecurityInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AccountSecurity",
  },
  optionalQuestionsInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OptionalQuestions",
  },
});

Loginschema.index({username: 1}, {unique: true});
const collection = mongoose.model("faculties", Loginschema);

module.exports = collection;
