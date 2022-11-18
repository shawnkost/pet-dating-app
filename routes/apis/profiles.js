const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');

/* @route  GET api/profiles
 * @desc   test route
 * @access public
 */
router.get('/', (req, res) => console.log('Profiles route'));

module.exports = router;
