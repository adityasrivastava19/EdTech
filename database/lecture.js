const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ""
    },


    videourl: {
        type: String,
        required: true
    },

    public_id: {
        type: String,
        required: true
    },


    order: {
        type: Number,
        required: true
    },

    isPreview: {
        type: Boolean,
        default: false
    },

    duration: {
        type: Number, 
        default: 0
    },


    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Lecture", lectureSchema);
