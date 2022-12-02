const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const auth = require('../middleware/auth');
const {
    getProfiles,
    getOneProfile,
    createOrUpdateProfile,
    deleteProfile,
    getUserProfile,
} = require('../controllers/profiles');

/* @route  GET api/profiles
 * @desc   get all profiles
 * @access public
 */
router.get('/', getProfiles);

/* @route  GET api/profiles/user
 * @desc   get profile by user id
 * @access public
 */
router.get('/user/:user_id', getOneProfile);

/* @route  GET api/profiles/me
 * @desc   get user's profile
 * @access private
 */
router.get('/me', auth, getUserProfile);

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
    createOrUpdateProfile
);

/* @route  DELETE api/profiles
 * @desc   delete profile, user, and posts
 * @access private
 */
router.delete('/', auth, deleteProfile);

module.exports = router;
