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
const transact_controller_1 = require("../../controllers/transact.controller");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const transactionService = __importStar(require("../../services/transact.service"));
jest.mock('../../services/transact.service');
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Mock authMiddleware to simulate authenticated requests
const mockAuthMiddleware = (req, res, next) => {
    const token = jsonwebtoken_1.default.sign({ id: 1, email: 'elle.say@gmail.com', user_uuid: 'abc123' }, 'your_jwt_secret');
    req.headers.authorization = `Bearer ${token}`;
    next();
};
app.get('/transfer/history', mockAuthMiddleware, transact_controller_1.getTransactionHistory);
app.post('/transfer', mockAuthMiddleware, transact_controller_1.intraTransfer);
app.post('/withdraw', mockAuthMiddleware, transact_controller_1.externalTransfer);
app.post('/fund-wallet', mockAuthMiddleware, transact_controller_1.fundWallet);
describe('TransactionController', () => {
    describe('getTransactionHistory', () => {
        it('should return transaction logs for a user', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mocked transaction logs
            const mockTransactionLogs = [
                { id: 1, user_uuid: 'abc123', amount: 100, type: 'credit', date: '2024-06-18' },
                { id: 2, user_uuid: 'abc123', amount: 50, type: 'debit', date: '2024-06-17' }
            ];
            // Mocked service function implementation
            const mockGetTransactionLogs = jest.spyOn(transactionService, 'getTransactionLogs');
            mockGetTransactionLogs.mockResolvedValue(mockTransactionLogs);
            // Make authenticated request using supertest
            const response = yield (0, supertest_1.default)(app).get('/transfer/history');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockTransactionLogs);
        }));
    });
    describe('intraTransfer', () => {
        it('should transfer funds to other LendSqr users', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mocked transfer data
            const transferData = {
                toUserUuid: 'def234',
                amount: 100
            };
            // Mocked service function implementation
            const mockTransferFunds = jest.spyOn(transactionService, 'transfer');
            mockTransferFunds.mockResolvedValue({ message: "Transfer Successful" });
            // Make authenticated request using supertest
            const response = yield (0, supertest_1.default)(app)
                .post('/transfer')
                .send(transferData);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "Transfer Successful" });
        }));
    });
    describe('externalTransfer', () => {
        it('should transfer funds to external accounts', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mocked transfer data
            const transferData = {
                recipient_account: "1234567890",
                recipient_bank: "Test Bank",
                amount: 1500,
                description: "Tips for work"
            };
            // Mocked service function implementation
            const mockTransferFunds = jest.spyOn(transactionService, 'withdraw');
            mockTransferFunds.mockResolvedValue({ success: true, message: "Transfer Successful" });
            // Make authenticated request using supertest
            const response = yield (0, supertest_1.default)(app)
                .post('/withdraw')
                .send(transferData);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true, message: "Transfer Successful" });
        }));
    });
    describe('fundWallet', () => {
        it('should fund personal wallet', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mocked transfer data
            const transferData = {
                amount: 1500
            };
            // Mocked service function implementation
            const mockTransferFunds = jest.spyOn(transactionService, 'fundUserWallet');
            mockTransferFunds.mockResolvedValue({ message: "Funding Successful" });
            // Make authenticated request using supertest
            const response = yield (0, supertest_1.default)(app)
                .post('/fund-wallet')
                .send(transferData);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "Funding Successful" });
        }));
    });
});
