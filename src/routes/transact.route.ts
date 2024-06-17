import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { getTransactionHistory, fundWallet, intraTransfer, externalTransfer } from '../controllers/transact.controller';

import { transferSchema, withdrawSchema, fundWalletSchema } from '../validations/transact.validation';
import { validate } from '../middleware/validations.middleware';

const TransactRouter: Router = Router();

TransactRouter.get('/transfer/history', authMiddleware, getTransactionHistory);
TransactRouter.post('/transfer', authMiddleware, validate(transferSchema), intraTransfer);
TransactRouter.post('/withdraw', authMiddleware, validate(withdrawSchema), externalTransfer);
TransactRouter.post('/fund-wallet', authMiddleware, validate(fundWalletSchema), fundWallet);

export default TransactRouter;
