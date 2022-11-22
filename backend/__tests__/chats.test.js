const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

const chats = require('../routes/apis/chats');

describe('Chats route', () => {
    let connection;
    let db;

    beforeAll(async () => {
        db = await MongoMemoryServer.create();
        const uri = db.getUri();
        connection = await mongoose.connect(uri);
    });

    afterAll(async () => {
        await connection.disconnect();
        await db.stop();
    });

    test('Get auth token by user id', async () => {});
});
