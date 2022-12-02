const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const auth = require('../middleware/auth');
const {
    registerUser,
    updateEmail,
    updatePassword,
    deleteUser,
} = require('../controllers/users');

/* @route  POST api/users
 * @desc   register user
 * @access public
 */
router.post(
    '/',
    [
        check('email', 'Please enter a valid email').isEmail(),
        check(
            'password',
            'Please enter a password with 6 or more characters'
        ).isLength({ min: 6 }),
    ],
    registerUser
);

/* @route  PUT api/users/:user_id/email
 * @desc   update user email
 * @access public
 */
router.put(
    '/:user_id/email',
    [auth, check('email', 'Email is required').isEmail()],
    updateEmail
);

/* @route  PUT api/users/:user_id/password
 * @desc   update user password
 * @access public
 */
router.put(
    '/:user_id/password',
    [
        auth,
        check(
            'password',
            'Please enter a password with 6 or more characters'
        ).isLength({ min: 6 }),
    ],
    updatePassword
);

/* @route  DELETE api/users/:user_id
 * @desc   update user email
 * @access public
 */
router.delete('/:user_id', auth, deleteUser);

module.exports = router;
