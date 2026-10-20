const mongoose = require('mongoose');

// Create Optional Questions Schema
const OptionalQuestionsSchema = new mongoose.Schema({
    userId:{
        type:String
    },
    social_media_links: {
        type: String,
        required: false
    },
    research_interests: {
        type: String,
        required: false
    },
    publications: {
        type: String,
        required: false
    }
});

const OptionalQuestions = mongoose.model("OptionalQuestions", OptionalQuestionsSchema);

module.exports = OptionalQuestions;
