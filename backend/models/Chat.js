const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    messages: [
        {
            message: {
                type: String,
                required: true,
            },
            from: {
                type: String,
                required: true,
            },
            to: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});

module.exports = Chat = mongoose.model('chat', ChatSchema);
