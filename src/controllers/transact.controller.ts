import { Request, Response } from 'express';
import { getUserFromToken } from '../utils/auth.util';
import { getTransactionLogs, transfer, withdraw, fundUserWallet } from '../services/transact.service';

export const getTransactionHistory = async (req: Request, res: Response) => {
    const { page, limit, startDate, endDate, type } = req.query;
    try {
        //  get user_uuid from token
        const token = req.headers.authorization?.split(' ')[1];
        const user_uuid = await getUserFromToken(token).user_uuid;

        const params = {
            user_uuid,
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            startDate: startDate as string,
            endDate: endDate as string,
            type: type as 'debit' | 'credit'
        };

        const all_transactions = await getTransactionLogs(params);
        res.status(200).json(all_transactions);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

/* Handles transfer logic between lendSqr users */
export const intraTransfer = async (req: Request, res: Response) => {
    const { toUserUuid, amount } = req.body;
    
    try {
        //  get user_uuid from token
        const token = req.headers.authorization?.split(' ')[1];
        const fromUserUuid = await getUserFromToken(token).user_uuid;

        const result = await transfer({ fromUserUuid, toUserUuid, amount });
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

/* Handles transfer logic to external banks */
export const externalTransfer = async (req: Request, res: Response) => {
    const { recipient_account, recipient_bank, amount, description } = req.body;
    try {
        //  get user_uuid from token
        const token = req.headers.authorization?.split(' ')[1];
        const user_uuid = await getUserFromToken(token).user_uuid;

        const result = await withdraw({ user_uuid, recipient_account, recipient_bank, amount, description });
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const fundWallet = async (req: Request, res: Response) => {
    const { amount, description } = req.body;
    try {
        //  get user_uuid from token
        const token = req.headers.authorization?.split(' ')[1];
        const user_uuid = await getUserFromToken(token).user_uuid;

        const result = await fundUserWallet({ user_uuid, amount, description });
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};



