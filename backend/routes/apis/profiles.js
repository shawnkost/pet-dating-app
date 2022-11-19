const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const config = require('config');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

/* @route  GET api/profiles
 * @desc   get all profiles
 * @access public
 */
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find();
        return res.json(profiles);
    } catch (err) {
        console.log(err.message);
        return res.status(500).send('Server error');
    }
});

/* @route  GET api/profiles/user
 * @desc   get profile by user id
 * @access public
 */
router.get('/user/:user_id', async (req, res) => {
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
});

/* @route  GET api/profiles/me
 * @desc   get user's profile
 * @access private
 */
router.get('/me', auth, async (req, res) => {
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
});

/* @route  POST api/profiles
 * @desc   create or update a user profile
 * @access private
 */
router.put(
    '/',
    [
        auth,
        check('ownerName', 'Owner name is required').not().isEmpty(),
        check('petName', 'Pet name is required').not().isEmpty(),
        check('type', 'Type is required').not().isEmpty(),
        check('gender', 'Gender is required').not().isEmpty(),
        check('age', 'Age is required').not().isEmpty(),
        check('size', 'Size is required').not().isEmpty(),
        check('location', 'Location is required').not().isEmpty(),
        check('profilePhoto', 'Profile photo is required').not().isEmpty(),
    ],
    async (req, res) => {
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
            Profile.countDocuments(
                { user: req.user.id },
                async (err, count) => {
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
                }
            );
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }
);

/* @route  PUT api/profiles/breed
 * @desc   add breed to profile
 * @access private
 */
router.put(
    '/breed',
    [auth, check('breed', 'Breed is required').not().isEmpty()],
    async (req, res) => {}
);

/* @route  PUT api/profiles/description
 * @desc   add description to profile
 * @access private
 */
router.put(
    '/description',
    [auth, check('description', 'Description is required').not().isEmpty()],
    async (req, res) => {}
);

/* @route  PUT api/profiles/additionalPhotos
 * @desc   add additional photos to profile
 * @access private
 */
router.put(
    '/additionalPhotos',
    [
        auth,
        check('additionalPhotos', 'additionalPhotos is required')
            .not()
            .isEmpty(),
    ],
    async (req, res) => {}
);

/* @route  DELETE api/profiles
 * @desc   delete profile, user, and posts
 * @access private
 */
router.delete('/', auth, async (req, res) => {
    try {
        await Profile.findOneAndRemove({ user: req.user.id });
        await User.findOneAndRemove({ _id: req.user.id });

        return res.json({ msg: 'Profile and user deleted' });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
});

module.exports = router;
