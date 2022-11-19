const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    ownerName: {
        type: String,
        required: true,
    },
    petName: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    profilePhoto: {
        type: String,
        required: true,
    },
    breed: {
        type: String,
    },
    description: {
        type: String,
    },
    additionalPhotos: [
        {
            type: String,
        },
    ],
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
