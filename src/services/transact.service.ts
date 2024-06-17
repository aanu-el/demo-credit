import { v4 as uuidv4 } from 'uuid';

import db from '../config/db.config';
import { Transaction } from '../db/models/transactions.model';
import { User } from '../db/models/users.model';
import { Wallet } from '../db/models/wallets.model';
import { TransactionQueryDto, IntraFundsTransferDto, WithdrawFundsDto, FundWalletDto } from './dto/transact.dto';


/* Gets all transactions history */
export const getTransactionLogs = async (params: TransactionQueryDto): Promise<any> => {
    const { user_uuid, page = 1, limit = 10, startDate, endDate, type } = params;

    let query = db<Transaction>('transactions').where({ user_uuid });

    if (startDate) {
        query = query.andWhere('date', '>=', startDate);
    }

    if (endDate) {
        query = query.andWhere('date', '<=', endDate);
    }

    if (type) {
        query = query.andWhere('type', type);
    }

    const offset = (page - 1) * limit;

    const transactionLogs = await query
        .offset(offset)
        .limit(limit);

    const totalRecords: any = await db<Transaction>('transactions').where({ user_uuid }).count('* as count').first();

    return {
        data: transactionLogs,
        pagination: {
            total: totalRecords?.count || 0,
            page,
            limit
        }
    }
}

/* Transfer  funds to another LendSqr user */
export const transfer = async (params: IntraFundsTransferDto): Promise<any> => {
    const { fromUserUuid, toUserUuid, amount } = params;

    // Start a db transaction
    const txn = await db.transaction();

    try {
        const fromUser = await txn<Wallet>('wallets')
            .join('users', 'wallets.user_uuid', 'users.uuid')
            .select('wallets.*', 'users.first_name', 'users.last_name', 'users.email')
            .where({ 'wallets.user_uuid': fromUserUuid })
            .first();

        const toUser = await txn<Wallet>('wallets')
            .join('users', 'wallets.user_uuid', 'users.uuid')
            .select('wallets.*', 'users.first_name', 'users.last_name', 'users.email')
            .where({ 'wallets.user_uuid': toUserUuid })
            .first();

        if (!fromUser || !toUser) {
            throw new Error('User not found');
        }

        if (fromUser.account_balance < amount) {
            throw new Error('Insufficient balance');
        }

        // Deduct amount from sender
        await txn<Wallet>('wallets')
            .where({ user_uuid: fromUserUuid })
            .update({ account_balance: fromUser.account_balance - amount });

        // make a debit log
        const debitLog = {
            to: toUser.account_name,
            amount: amount,
            type: 'debit',
            previous_balance: fromUser.account_balance,
            current_balance: fromUser.account_balance - amount
        }

        // Add amount to receiver
        await txn<Wallet>('wallets')
            .where({ user_uuid: toUserUuid })
            .update({ account_balance: toUser.account_balance + amount });

        // make a credit log
        const creditLog = {
            from: fromUser.account_name,
            amount: amount,
            type: 'credit',
            previous_balance: toUser.account_balance,
            current_balance: toUser.account_balance + amount
        }

        // Record the debit transaction for the sender
        await txn<Transaction>('transactions').insert({
            user_uuid: fromUserUuid,
            txn_type: 'debit',
            account_balance: fromUser.account_balance - amount,
            logs: JSON.stringify(debitLog)
        });

        // Record the credit transaction for the receiver
        await txn<Transaction>('transactions').insert({
            user_uuid: toUserUuid,
            txn_ref: `LEND|${uuidv4()}`,
            txn_type: 'credit',
            account_balance: toUser.account_balance + amount,
            logs: JSON.stringify(creditLog)
        });

        // Commit transaction
        await txn.commit();

        return { message: 'Transfer successful' };
    } catch (error) {
        // Rollback transaction in case of error
        await txn.rollback();
        throw error;
    }
}


/* Transfer  funds to external banks */
export const withdraw = async (params: WithdrawFundsDto): Promise<any> => {
    const { user_uuid, recipient_account, recipient_bank, amount, description } = params;

    // Start a db transaction
    const txn = await db.transaction();

    try {
        // Check user's balance
        const user = await txn<Wallet>('wallets')
            .join('users', 'wallets.user_uuid', 'users.uuid')
            .select('wallets.*', 'users.first_name', 'users.last_name', 'users.email')
            .where({ 'wallets.user_uuid': user_uuid })
            .first();

        if (user.account_balance < amount) {
            throw new Error('Insufficient balance');
        }

        // Deduct amount from user's balance
        await txn<Wallet>('wallets')
            .where({ user_uuid: user_uuid })
            .update({
                account_balance: user.account_balance - amount
            });


        // make a debit log
        const debitLog = {
            to: recipient_account,
            recipient_bank: recipient_bank,
            amount: amount,
            type: 'debit',
            description: description,
            previous_balance: user.account_balance,
            current_balance: user.account_balance - amount
        }

        await txn<Transaction>('transactions').insert({
            user_uuid: user_uuid,
            txn_ref: `LEND|${uuidv4()}`,
            txn_type: 'debit',
            account_balance: user.account_balance - amount,
            logs: JSON.stringify(debitLog)
        });

        // Commit transaction
        await txn.commit();

        return { success: true, message: 'Transfer successful' };
    } catch (error) {
        // Rollback transaction in case of error
        await txn.rollback();
        throw error;
    }
}

/* Fund User wallet */
export const fundUserWallet = async (params: WithdrawFundsDto): Promise<any> => {
    const { user_uuid, amount, description } = params;

    // Start a db transaction
    const txn = await db.transaction();

    try {
        // Check user's balance
        const user = await txn<Wallet>('wallets')
            .join('users', 'wallets.user_uuid', 'users.uuid')
            .select('wallets.*', 'users.first_name', 'users.last_name', 'users.email')
            .where({ 'wallets.user_uuid': user_uuid })
            .first();

        // Add amount from user's balance
        await txn<Wallet>('wallets')
            .where({ user_uuid: user_uuid })
            .update({
                account_balance: user.account_balance + amount
            });


        // make a debit log
        const creditLog = {
            from: 'funding',
            amount: amount,
            type: 'credit',
            description: description,
            previous_balance: user.account_balance,
            current_balance: user.account_balance + amount
        }

        await txn<Transaction>('transactions').insert({
            user_uuid: user_uuid,
            txn_ref: `LEND|${uuidv4()}`,
            txn_type: 'credit',
            account_balance: user.account_balance + amount,
            logs: JSON.stringify(creditLog)
        });

        // Commit transaction
        await txn.commit();

        return { success: true, message: 'Funding successful' };
    } catch (error) {
        // Rollback transaction in case of error
        await txn.rollback();
        throw error;
    }
}