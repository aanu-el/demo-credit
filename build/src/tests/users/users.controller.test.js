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
const supertest_1 = __importDefault(require("supertest"));
const users_controller_1 = require("../../controllers/users.controller");
const userService = __importStar(require("../../services/users.service"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
jest.mock('../../services/users.service');
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Mock authMiddleware to simulate authenticated requests
const mockAuthMiddleware = (req, res, next) => {
    const token = jsonwebtoken_1.default.sign({ id: 1, email: 'elle.say@gmail.com', user_uuid: 'abc123' }, 'your_jwt_secret');
    req.headers.authorization = `Bearer ${token}`;
    next();
};
app.get('/me', mockAuthMiddleware, users_controller_1.getProfileController);
describe('UserController', () => {
    describe('getProfileController', () => {
        it('should return the profile of current user', () => __awaiter(void 0, void 0, void 0, function* () {
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
            };
            // Mocked service function implementation
            const mockGetTransactionLogs = jest.spyOn(userService, 'getUserProfile');
            mockGetTransactionLogs.mockResolvedValue(mockUserProfile);
            // Make authenticated request using supertest
            const response = yield (0, supertest_1.default)(app).get('/me');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUserProfile);
        }));
    });
});
