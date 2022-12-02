const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        return res.json(user);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

const authenticateUser = async (req, res) => {
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
                const isMatch = await bcrypt.compare(password, user.password);

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
};

module.exports = {
    getUser,
    authenticateUser,
};
