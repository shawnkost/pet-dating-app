const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const hashPassword = require('../../utils/hashPassword');
const User = require('../../models/User');

/* @route  POST api/users
 * @desc   register user
 * @access public
 */
router.post(
    '/',
    [
        auth,
        check('email', 'Please enter a valid email').not().isEmpty(),
        check(
            'password',
            'Please enter a password with 6 or more characters'
        ).isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        const { email, password } = req.body;

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            User.countDocuments({ email }, async (err, count) => {
                if (count > 0) {
                    return res.status(400).send('User already exists');
                } else {
                    const user = new User({
                        email,
                        password,
                    });

                    await hashPassword(user, user.password);
                }
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send('Server error');
        }
    }
);

/* @route  PUT api/users/:user_id/email
 * @desc   update user email
 * @access public
 */
router.put(
    '/:user_id/email',
    [auth, check('email', 'Email is required').not().isEmpty()],
    async (req, res) => {
        const errors = validationResult(req);
        const userId = req.params.user_id;

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            User.countDocuments({ user: userId }, async (err, count) => {
                if (count > 0) {
                    const user = await User.findOne({ user: userId });

                    await hashPassword(user, user.password);
                } else {
                    return res.status(404).send('User not found');
                }
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send('Server error');
        }
    }
);

/* @route  PUT api/users/:user_id/password
 * @desc   update user password
 * @access public
 */
router.put(
    '/:user_id/email',
    [auth, check('password', 'Password is required').not().isEmpty()],
    async (req, res) => {
        const errors = validationResult(req);
        const userId = req.params.user_id;

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            User.countDocuments({ user: userId }, async (err, count) => {
                if (count > 0) {
                    const user = await User.findOne({ user: userId });
                } else {
                    return res.status(404).send('User not found');
                }
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send('Server error');
        }
    }
);

/* @route  DELETE api/users/:user_id
 * @desc   update user email
 * @access public
 */
router.delete('/:user_id', auth, async (req, res) => {
    const errors = validationResult(req);
    const userId = req.params.user_id;

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        User.countDocuments({ user: userId }, async (err, count) => {
            if (count > 0) {
                await User.deleteOne({ user: userId });
                return res.json({ msg: 'User deleted' });
            } else {
                return res.status(404).send('User not found');
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
});

module.exports = router;
