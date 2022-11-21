const express = require('express');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3001;
const app = express();
connectDB();

// init middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API running'));

app.use('/api/auth', require('./routes/apis/auth'));
app.use('/api/users', require('./routes/apis/users'));
app.use('/api/profiles', require('./routes/apis/profiles'));
app.use('/api/chats', require('./routes/apis/chats'));

app.listen(PORT, () => {
    `Server started on port ${PORT}`;
});
