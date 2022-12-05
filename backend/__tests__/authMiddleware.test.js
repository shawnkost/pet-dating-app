const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');
jest.mock('jsonwebtoken');

describe('Auth middleware route', () => {
    let connection;
    let db;
    let mockRequest;
    const mockResponse = {
        status: function (s) {
            this.statusCode = s;
            return this;
        },
        json: (d) => {
            this.jsonMsg = d;
            console.log('\n : ' + JSON.stringify(d));
            return this;
        },
    };
    const mockNext = jest.fn();
    const mockVerify = jest.spyOn(jwt, 'verify');

    beforeAll(async () => {
        db = await MongoMemoryServer.create();
        const uri = db.getUri();
        connection = await mongoose.connect(uri);
    });

    afterAll(async () => {
        await connection.disconnect();
        await db.stop();
    });

    beforeEach(() => {
        mockVerify.mockImplementation(() => ({
            verified: 'true',
            user: 'bar',
        }));
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('Authorize a valid token', () => {
        mockRequest = {
            header: () => {
                return 'foo';
            },
        };

        auth(mockRequest, mockResponse, mockNext);

        expect(mockVerify.mock.calls.length).toBe(1);
        expect(mockNext.mock.calls.length).toBe(1);
    });

    test('Do not authorize an empty token', () => {
        mockRequest = {
            header: () => {
                return null;
            },
        };

        auth(mockRequest, mockResponse, mockNext);

        expect(mockVerify.mock.calls.length).toBe(0);
        expect(mockNext.mock.calls.length).toBe(0);
        expect(mockResponse.statusCode).toBe(401);
    });

    test('Do not authorize an invalid token', () => {
        mockRequest = {
            header: () => {
                return 'foo';
            },
        };

        mockVerify.mockImplementation(() => {
            throw new Error();
        });

        auth(mockRequest, mockResponse, mockNext);

        expect(mockVerify.mock.calls.length).toBe(1);
        expect(mockNext.mock.calls.length).toBe(0);
        expect(mockResponse.statusCode).toBe(401);
    });
});
