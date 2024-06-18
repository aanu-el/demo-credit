import express from 'express';
import { signupController, signinController } from '../../controllers/auth.controller';
import * as authService from '../../services/auth.service';

jest.mock('../../services/auth.service');

const app = express();
app.use(express.json());

app.post('/signup', signupController);
app.post('/signin', signinController);

describe('AuthController', () => {
    describe('signupController', () => {
        it('should sign up a user successfully', async () => {
            // Mocked user input
            const userData = {
                first_name: "eleos",
                last_name: "ann",
                phone_number: "08107447817",
                bvn: "1234567009",
                email: "elle.say@gmail.com",
                password: "1234"
            };

            // Mocked user response
            const mockUser = {
                status: "success",
                user: 1
            };

            // Mocked service function implementation
            const mockSignup = jest.spyOn(authService, 'signup');
            mockSignup.mockResolvedValue({ user: mockUser, token: 'jwtToken' });

            // Mocked request object
            const req = { body: userData };

            // Mocked response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await signupController(req as any, res as any);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ user: mockUser, token: 'jwtToken' });
            expect(mockSignup).toHaveBeenCalledWith(userData);
        });

        it('should return error if signup fails', async () => {
            // Mocked user input
            const userData = {
                first_name: "eleos",
                last_name: "ann",
                phone_number: "08107447817",
                bvn: "1234567009",
                email: "elle.say@gmail.com",
                password: "1234"
            };

            // Mocked service function implementation to throw an error
            const mockSignup = jest.spyOn(authService, 'signup');
            mockSignup.mockRejectedValue(new Error('User already exists'));

            // Mocked request object
            const req = { body: userData };

            // Mocked response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await signupController(req as any, res as any);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
        });
    });

    describe('signinController', () => {
        it('should sign in a user successfully', async () => {
            // Mocked user input
            const userData = {
                email: "elle.say@gmail.com",
                password: "1234"
            };

            // Mocked user response
            const mockUser = {
                token: "jwtToken"
            };

            // Mocked service function implementation
            const mockSignin = jest.spyOn(authService, 'signin');
            mockSignin.mockResolvedValue({ user: mockUser, token: 'jwtToken' });

            // Mocked request object
            const req = { body: userData };

            // Mocked response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await signinController(req as any, res as any);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return error if signin fails', async () => {
            // Mocked user input
            const userData = {
                email: "elle.say@gmail.com",
                password: "1234"
            };

            // Mocked service function implementation to throw an error
            const mockSignin = jest.spyOn(authService, 'signin');
            mockSignin.mockRejectedValue(new Error('Invalid email or password'));

            // Mocked request object
            const req = { body: userData };

            // Mocked response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await signinController(req as any, res as any);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
        });
    });
})
