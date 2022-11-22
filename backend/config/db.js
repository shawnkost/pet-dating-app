const mongoose = require('mongoose');

const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db);
        console.log('MongoDB connected');
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
};

module.exports = {
    connectDB,
    disconnectDB,
};
