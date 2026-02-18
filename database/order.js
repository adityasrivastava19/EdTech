const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
        required: true
    },
    payment: {
        type: String,
        required: true,
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);