const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const hashPassword = async (user, password) => {
    const payload = {
        user: {
            id: user.id,
        },
    };

    const salt = await bcrypt.genSalt(10);

    password = await bcrypt.hash(password, salt);
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
};

module.exports = {
    hashPassword,
};
