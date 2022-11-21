const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const auth = require('../../middleware/auth');
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

                    const payload = {
                        user: {
                            id: user.id,
                        },
                    };

                    const salt = await bcrypt.genSalt(10);

                    user.password = await bcrypt.hash(user.password, salt);
                    await user.save();

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
            console.log(err);
            return res.status(500).send('Server error');
        }
    }
);

module.exports = router;
