const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const auth = require('../middleware/auth');
const { getUser, authenticateUser } = require('../controllers/auth');

/* @route  GET api/auth
 * @desc   get user
 * @access private
 */
router.get('/', auth, getUser);

/* @route  POST api/auth
 * @desc   authenticate user and get auth token
 * @access public
 */
router.post(
    '/',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    authenticateUser
);

module.exports = router;
