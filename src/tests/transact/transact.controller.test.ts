import express from 'express';
import request from 'supertest';
import { getTransactionHistory, intraTransfer, externalTransfer, fundWallet } from '../../controllers/transact.controller';
import jwt from 'jsonwebtoken';

import * as transactionService from '../../services/transact.service';

jest.mock('../../services/transact.service');

const app = express();
app.use(express.json());

// Mock authMiddleware to simulate authenticated requests
const mockAuthMiddleware = (req: any, res: any, next: any) => {
    const token = jwt.sign({ id: 1, email: 'elle.say@gmail.com', user_uuid: 'abc123' }, 'your_jwt_secret');
    req.headers.authorization = `Bearer ${token}`;
    next();
};

app.get('/transfer/history', mockAuthMiddleware, getTransactionHistory);
app.post('/transfer', mockAuthMiddleware, intraTransfer);
app.post('/withdraw', mockAuthMiddleware, externalTransfer);
app.post('/fund-wallet', mockAuthMiddleware, fundWallet);

describe('TransactionController', () => {
    describe('getTransactionHistory', () => {
        it('should return transaction logs for a user', async () => {

            // Mocked transaction logs
            const mockTransactionLogs = [
                { id: 1, user_uuid: 'abc123', amount: 100, type: 'credit', date: '2024-06-18' },
                { id: 2, user_uuid: 'abc123', amount: 50, type: 'debit', date: '2024-06-17' }
            ];

            // Mocked service function implementation
            const mockGetTransactionLogs = jest.spyOn(transactionService, 'getTransactionLogs');
            mockGetTransactionLogs.mockResolvedValue(mockTransactionLogs);

            // Make authenticated request using supertest
            const response = await request(app).get('/transfer/history');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockTransactionLogs);
        });
    });

    describe('intraTransfer', () => {
        it('should transfer funds to other LendSqr users', async () => {

            // Mocked transfer data
            const transferData = {
                toUserUuid: 'def234',
                amount: 100
            }

            // Mocked service function implementation
            const mockTransferFunds = jest.spyOn(transactionService, 'transfer');
            mockTransferFunds.mockResolvedValue({ message: "Transfer Successful" });

            // Make authenticated request using supertest
            const response = await request(app)
                .post('/transfer')
                .send(transferData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "Transfer Successful" });
        });
    });

    describe('externalTransfer', () => {
        it('should transfer funds to external accounts', async () => {

            // Mocked transfer data
            const transferData = {
                recipient_account: "1234567890",
                recipient_bank: "Test Bank",
                amount: 1500,
                description: "Tips for work"
            }

            // Mocked service function implementation
            const mockTransferFunds = jest.spyOn(transactionService, 'withdraw');
            mockTransferFunds.mockResolvedValue({ success: true, message: "Transfer Successful" });

            // Make authenticated request using supertest
            const response = await request(app)
                .post('/withdraw')
                .send(transferData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true, message: "Transfer Successful" });
        });
    });

    describe('fundWallet', () => {
        it('should fund personal wallet', async () => {

            // Mocked transfer data
            const transferData = {
                amount: 1500
            }

            // Mocked service function implementation
            const mockTransferFunds = jest.spyOn(transactionService, 'fundUserWallet');
            mockTransferFunds.mockResolvedValue({ message: "Funding Successful" });

            // Make authenticated request using supertest
            const response = await request(app)
                .post('/fund-wallet')
                .send(transferData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "Funding Successful" });
        });
    });
})
