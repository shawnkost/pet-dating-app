const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('./db');
const { getUser, authenticateUser } = require('../controllers/auth');
const User = require('../models/User');

jest.mock('../config/db');
jest.mock('../middleware/auth', () => jest.fn((req, res, next) => next()));
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth route', () => {
    let mockRequest;
    const mockResponse = {
        send: function (msg) {
            this.sendMsg = msg;
            return this;
        },
        status: function (s) {
            this.statusCode = s;
            return this;
        },
        json: function (msg) {
            this.jsonMsg = msg;
            return this;
        },
    };
    let mockUser;
    const mockCompare = jest.spyOn(bcrypt, 'compare');
    const mockSign = jest.spyOn(jwt, 'sign');

    beforeAll(async () => {
        mockUser = new User({
            _id: '636abd39f615edb2f07441e0',
            email: 'foo@gmail.com',
            password: 'bar',
        });

        await db.connect();
        await mockUser.save();
    });

    afterAll(async () => {
        await db.close();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('Get user by user id', async () => {
        mockRequest = {
            user: {
                id: '636abd39f615edb2f07441e0',
            },
        };

        await getUser(mockRequest, mockResponse);

        expect(mockResponse.jsonMsg).toMatchObject(
            expect.objectContaining({
                id: '636abd39f615edb2f07441e0',
                email: 'foo@gmail.com',
            })
        );
        expect(mockResponse.jsonMsg).not.toMatchObject(
            expect.objectContaining({
                password: expect.anything(),
            })
        );
    });

    test('Do not get user for a user not found', async () => {
        mockRequest = {
            user: {
                id: '636abd39f615edb2f07441e5',
            },
        };

        await getUser(mockRequest, mockResponse);

        expect(mockResponse.jsonMsg).toBe(null);
    });

    test('Authenticate a user and get auth token', async () => {
        mockRequest = {
            body: {
                email: 'foo@gmail.com',
                password: 'bar',
            },
        };

        mockCompare.mockImplementation(() => {
            return true;
        });

        mockSign.mockImplementation(() => {
            return mockResponse.status(200).json('foo');
        });

        await authenticateUser(mockRequest, mockResponse);

        expect(mockCompare.mock.calls.length).toBe(1);
        expect(mockSign.mock.calls.length).toBe(1);
        expect(mockResponse.statusCode).toBe(200);
        expect(mockResponse.jsonMsg).toBe('foo');
    });

    test('Do not authenticate a user not found', async () => {
        mockRequest = {
            body: {
                email: 'bar@gmail.com',
                password: 'bar',
            },
        };

        await authenticateUser(mockRequest, mockResponse);

        expect(mockCompare.mock.calls.length).toBe(0);
        expect(mockSign.mock.calls.length).toBe(0);
        expect(mockResponse.statusCode).toBe(401);
        expect(mockResponse.jsonMsg).toEqual({
            errors: [{ msg: 'User not found' }],
        });
    });

    test('Do not authenticate user with wrong password', async () => {
        mockRequest = {
            body: {
                email: 'foo@gmail.com',
                password: 'baz',
            },
        };

        mockCompare.mockImplementation(() => {
            return false;
        });

        await authenticateUser(mockRequest, mockResponse);

        expect(mockCompare.mock.calls.length).toBe(1);
        expect(mockSign.mock.calls.length).toBe(0);
        expect(mockResponse.statusCode).toBe(400);
        expect(mockResponse.jsonMsg).toEqual({
            errors: [{ msg: 'Invalid credentials' }],
        });
    });
});
