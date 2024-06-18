"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../../controllers/auth.controller");
const authService = __importStar(require("../../services/auth.service"));
jest.mock('../../services/auth.service');
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/signup', auth_controller_1.signupController);
app.post('/signin', auth_controller_1.signinController);
describe('AuthController', () => {
    describe('signupController', () => {
        it('should sign up a user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
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
            yield (0, auth_controller_1.signupController)(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ user: mockUser, token: 'jwtToken' });
            expect(mockSignup).toHaveBeenCalledWith(userData);
        }));
        it('should return error if signup fails', () => __awaiter(void 0, void 0, void 0, function* () {
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
            yield (0, auth_controller_1.signupController)(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
        }));
    });
    describe('signinController', () => {
        it('should sign in a user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
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
            yield (0, auth_controller_1.signinController)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        }));
        it('should return error if signin fails', () => __awaiter(void 0, void 0, void 0, function* () {
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
            yield (0, auth_controller_1.signinController)(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
        }));
    });
});
