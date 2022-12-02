const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();

const auth = require('../middleware/auth');
const Chat = require('../models/Chat');

/* @route  GET api/chats
 * @desc   test route
 * @access public
 */
router.get('/', (req, res) => console.log('Chats route'));

/* @route  POST api/chats/:chat_id
 * @desc   send a chat message
 * @access private
 */
router.post(
    '/:chat_id',
    [
        auth,
        check('to', 'Recipient is required').not().isEmpty(),
        check('message', 'Message is required').not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        const { message, from, to, date } = req.body;

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    }
);

/* @route  GET api/chats/:chat_id
 * @desc   get chat messages based on id
 * @access private
 */
router.get('/:chat_id', auth, async (req, res) => {});

module.exports = router;
