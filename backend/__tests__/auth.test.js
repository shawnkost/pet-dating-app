const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

const auth = require('../routes/apis/auth');

describe('Auth route', () => {
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

    test('Do not get auth token for a user not found', async () => {});

    test('Authenticate a user and get auth token', async () => {});

    test('Do not authenticate a user not found', async () => {});
});
