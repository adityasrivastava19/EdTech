const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({

    title: {              
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    thumbnail: {           
        type: String,
        default: ""
    },

    thumbnail_public_id: {
        type: String,
        default: ""
    },

    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",      
        required: true
    },

    totalLectures: {        
        type: Number,
        default: 0
    },

    isPublished: {          
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
