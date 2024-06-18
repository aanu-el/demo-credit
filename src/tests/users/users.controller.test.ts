import express from 'express';
import request from 'supertest';
import { getProfileController } from '../../controllers/users.controller';
import * as userService from '../../services/users.service';

import jwt from 'jsonwebtoken';

jest.mock('../../services/users.service');

const app = express();
app.use(express.json());

// Mock authMiddleware to simulate authenticated requests
const mockAuthMiddleware = (req: any, res: any, next: any) => {
    const token = jwt.sign({ id: 1, email: 'elle.say@gmail.com', user_uuid: 'abc123' }, 'your_jwt_secret');
    req.headers.authorization = `Bearer ${token}`;
    next();
};

app.get('/me', mockAuthMiddleware, getProfileController);

describe('UserController', () => {
    describe('getProfileController', () => {
        it('should return the profile of current user', async () => {

            // Mocked transaction logs
            const mockUserProfile = {
                id: 1,
                user_uuid: "abc123",
                first_name: "el",
                last_name: "ann",
                phone_number: "08107447817",
                bvn: "123456789",
                email: "elle.savvy@gmail.com",
                password: "$2a$10$p7hxJ8vj7X",
                status: "active",
                created_at: "2024-06-17T21:15:08.000Z",
                updated_at: "2024-06-17T21:15:08.000Z"
            }

            // Mocked service function implementation
            const mockGetTransactionLogs = jest.spyOn(userService, 'getUserProfile');
            mockGetTransactionLogs.mockResolvedValue(mockUserProfile);

            // Make authenticated request using supertest
            const response = await request(app).get('/me');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUserProfile);
        });
    });
})
