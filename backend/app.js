const express = require('express');

const { connectDB } = require('./config/db');
const { authRouter } = require('./routes/auth');

const app = express();
connectDB();

app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API running'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/chats', require('./routes/chats'));

module.exports = app;
