const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

const auth = require('../../middleware/auth');
const User = require('../../models/User');

/* @route  GET api/auth
 * @desc   get user token
 * @access public
 */
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        return res.json(user);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
});

/* @route  POST api/auth
 * @desc   authenticate user and get token
 * @access public
 */
router.post(
    '/',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        const { email, password } = req.body;

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            User.countDocuments({ email }, async (err, count) => {
                if (count < 1) {
                    return res.status(400).json({
                        errors: [{ msg: 'Invalid credentials' }],
                    });
                } else {
                    let user = await User.findOne({ email });
                    const isMatch = await bcrypt.compare(
                        password,
                        user.password
                    );

                    if (!isMatch) {
                        return res
                            .status(400)
                            .json({ errors: [{ msg: 'Invalid credentials' }] });
                    }

                    const payload = {
                        user: {
                            id: user.id,
                        },
                    };

                    jwt.sign(
                        payload,
                        config.get('jwtSecret'),
                        { expiresIn: 36000 },
                        (err, token) => {
                            if (err) throw err;
                            return res.status(200).json({ token });
                        }
                    );
                }
            });
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server error');
        }
    }
);

module.exports = router;
