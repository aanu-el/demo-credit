import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { getTransactionHistory, fundWallet, intraTransfer, externalTransfer } from '../controllers/transact.controller';

const TransactRouter: Router = Router();

TransactRouter.get('/transfer/history', authMiddleware, getTransactionHistory);
TransactRouter.post('/withdraw', authMiddleware, externalTransfer);
TransactRouter.post('/transfer', authMiddleware, intraTransfer);
TransactRouter.post('/fund-wallet', authMiddleware, fundWallet);

export default TransactRouter;
