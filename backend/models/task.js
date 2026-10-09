const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    title: {
        type: String,
        required: true
    },

    subject: {
        type: String,
        required: true
    },

    deadline: {
        type: Date,
        required: true
    },

    priority: {
        type: String,
        required: true
    },

    notificationsPerDay: {
        type: Number,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Task", taskSchema);