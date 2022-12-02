const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/User');

const registerUser = async (req, res) => {
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

                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
                await user.save();

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
        console.log(err);
        return res.status(500).send('Server error');
    }
};

const updateEmail = async (req, res) => {
    const errors = validationResult(req);
    const userId = req.params.user_id;
    const email = req.body.email;

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        User.countDocuments({ user: userId }, async (err, count) => {
            if (count > 0) {
                const user = await User.findOne({ user: userId }).select(
                    '-password'
                );

                user.email = email;
                await user.save();
                return res.json(user);
            } else {
                return res.status(404).send('User not found');
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
};

const updatePassword = async (req, res) => {
    const errors = validationResult(req);
    const userId = req.params.user_id;
    const password = req.body.password;

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        User.countDocuments({ user: userId }, async (err, count) => {
            if (count > 0) {
                const user = await User.findOne({ user: userId }).select(
                    '-password'
                );

                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
                await user.save();

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
            } else {
                return res.status(404).send('User not found');
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
};

const deleteUser = async (req, res) => {
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
};

module.exports = {
    registerUser,
    updateEmail,
    updatePassword,
    deleteUser,
};
