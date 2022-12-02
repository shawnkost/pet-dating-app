const { validationResult } = require('express-validator');

const Profile = require('../models/Profile');
const User = require('../models/User');

const getProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find();
        return res.json(profiles);
    } catch (err) {
        console.log(err.message);
        return res.status(500).send('Server error');
    }
};

const getOneProfile = async (req, res) => {
    try {
        Profile.countDocuments(
            { user: req.params.user_id },
            async (err, count) => {
                if (count > 0) {
                    const profile = await Profile.findOne({
                        user: req.params.user_id,
                    }).populate('user', ['name', 'avatar']);

                    return res.json(profile);
                } else {
                    return res.status(400).json({ msg: 'Profile not found' });
                }
            }
        );
    } catch (err) {
        console.error(err.message);

        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }

        return res.status(500).send('Server error');
    }
};

const getUserProfile = async (req, res) => {
    try {
        Profile.countDocuments({ user: req.user.id }, async (err, count) => {
            if (count > 0) {
                const profile = await Profile.findOne({
                    user: req.user.id,
                }).populate('user', ['name', 'avatar']);

                return res.json({ profile });
            } else {
                return res
                    .status(400)
                    .json({ msg: 'There is no profile for this user' });
            }
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

const createOrUpdateProfile = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    const {
        ownerName,
        petName,
        type,
        gender,
        age,
        size,
        location,
        profilePhoto,
        breed,
        description,
        additionalPhotos,
    } = req.body;

    const profileFields = {};

    if (ownerName) profileFields.ownerName = ownerName;
    if (petName) profileFields.petName = petName;
    if (type) profileFields.type = type;
    if (gender) profileFields.gender = gender;
    if (age) profileFields.age = age;
    if (size) profileFields.size = size;
    if (location) profileFields.location = location;
    if (profilePhoto) profileFields.profilePhoto = profilePhoto;
    if (breed) profileFields.breed = breed;
    if (description) profileFields.description = description;
    if (additionalPhotos) profileFields.additionalPhotos = additionalPhotos;

    try {
        Profile.countDocuments({ user: req.user.id }, async (err, count) => {
            if (count > 0) {
                const profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );

                return res.json(profile);
            } else {
                const profile = new Profile(profileFields);

                await profile.save();
                return res.json(profile);
            }
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send(err.message);
    }
};

const deleteProfile = async (req, res) => {
    try {
        await Profile.findOneAndRemove({ user: req.user.id });
        await User.findOneAndRemove({ _id: req.user.id });

        return res.json({ msg: 'Profile and user deleted' });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

module.exports = {
    getProfiles,
    getOneProfile,
    getUserProfile,
    createOrUpdateProfile,
    deleteProfile,
};
