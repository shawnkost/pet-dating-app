const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const Chat = require('../../models/Chat');

/* @route  GET api/chats
 * @desc   test route
 * @access public
 */
router.get('/', (req, res) => console.log('Chats route'));

module.exports = router;
