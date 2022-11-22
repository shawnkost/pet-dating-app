const express = require('express');
const { connectDB } = require('./config/db');

const app = express();
connectDB();

app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API running'));

app.use('/api/auth', require('./routes/apis/auth'));
app.use('/api/users', require('./routes/apis/users'));
app.use('/api/profiles', require('./routes/apis/profiles'));
app.use('/api/chats', require('./routes/apis/chats'));

module.exports = app;
