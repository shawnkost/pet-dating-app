const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

const app = require('../app');
const config = require('../config/db');
jest.mock('../config/db');

describe('Basic GET request', () => {
    let connection;
    let db;
    const mockConnectDB = jest.spyOn(config, 'connectDB');

    beforeAll(async () => {
        db = await MongoMemoryServer.create();
        const uri = db.getUri();
        connection = await mongoose.connect(uri);

        mockConnectDB.mockImplementation(() => ({ connection }));
    });

    afterAll(async () => {
        await connection.disconnect();
        await db.stop();
    });

    test('It should return the GET method', () => {
        return request(app).get('/').expect(200);
    });
});
