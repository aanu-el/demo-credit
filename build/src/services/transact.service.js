"use strict";
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
exports.fundUserWallet = exports.withdraw = exports.transfer = exports.getTransactionLogs = void 0;
const uuid_1 = require("uuid");
const db_config_1 = __importDefault(require("../config/db.config"));
/* Gets all transactions history */
const getTransactionLogs = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_uuid, page = 1, limit = 10, startDate, endDate, type } = params;
    let query = (0, db_config_1.default)('transactions').where({ user_uuid });
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
    const transactionLogs = yield query
        .offset(offset)
        .limit(limit);
    const totalRecords = yield (0, db_config_1.default)('transactions').where({ user_uuid }).count('* as count').first();
    return {
        data: transactionLogs,
        pagination: {
            total: (totalRecords === null || totalRecords === void 0 ? void 0 : totalRecords.count) || 0,
            page,
            limit
        }
    };
});
exports.getTransactionLogs = getTransactionLogs;
/* Transfer  funds to another LendSqr user */
const transfer = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { fromUserUuid, toUserUuid, amount } = params;
    // Start a db transaction
    const txn = yield db_config_1.default.transaction();
    try {
        const fromUser = yield txn('wallets')
            .join('users', 'wallets.user_uuid', 'users.user_uuid')
            .select('wallets.*', 'users.first_name', 'users.last_name', 'users.email')
            .where({ 'wallets.user_uuid': fromUserUuid })
            .first();
        const toUser = yield txn('wallets')
            .join('users', 'wallets.user_uuid', 'users.user_uuid')
            .select('wallets.*', 'users.first_name', 'users.last_name', 'users.email')
            .where({ 'wallets.user_uuid': toUserUuid })
            .first();
        if (!fromUser || !toUser) {
            throw new Error('User not found');
        }
        fromUser.account_balance = Number(fromUser.account_balance);
        toUser.account_balance = Number(toUser.account_balance);
        if (fromUser.account_balance < amount) {
            throw new Error('Insufficient balance');
        }
        // Deduct amount from sender
        yield txn('wallets')
            .where({ user_uuid: fromUserUuid })
            .update({ account_balance: fromUser.account_balance - amount });
        // make a debit log
        const debitLog = {
            to: toUser.account_name,
            amount: amount,
            type: 'debit',
            previous_balance: fromUser.account_balance,
            current_balance: fromUser.account_balance - amount
        };
        // Add amount to receiver
        yield txn('wallets')
            .where({ user_uuid: toUserUuid })
            .update({ account_balance: toUser.account_balance + amount });
        // make a credit log
        const creditLog = {
            from: fromUser.account_name,
            amount: amount,
            type: 'credit',
            previous_balance: toUser.account_balance,
            current_balance: toUser.account_balance + amount
        };
        const txn_ref = `LEND|${(0, uuid_1.v4)()}`;
        // Record the debit transaction for the sender
        yield txn('transactions').insert({
            user_uuid: fromUserUuid,
            txn_ref: txn_ref,
            txn_type: 'debit',
            account_balance: fromUser.account_balance - amount,
            logs: JSON.stringify(debitLog)
        });
        // Record the credit transaction for the receiver
        yield txn('transactions').insert({
            user_uuid: toUserUuid,
            txn_ref: txn_ref,
            txn_type: 'credit',
            account_balance: toUser.account_balance + amount,
            logs: JSON.stringify(creditLog)
        });
        // Commit transaction
        yield txn.commit();
        return { message: 'Transfer successful' };
    }
    catch (error) {
        // Rollback transaction in case of error
        yield txn.rollback();
        throw error;
    }
});
exports.transfer = transfer;
/* Transfer  funds to external banks */
const withdraw = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_uuid, recipient_account, recipient_bank, amount, description } = params;
    // Start a db transaction
    const txn = yield db_config_1.default.transaction();
    try {
        // Check user's balance
        const user = yield txn('wallets')
            .join('users', 'wallets.user_uuid', 'users.user_uuid')
            .select('wallets.*', 'users.first_name', 'users.last_name', 'users.email')
            .where({ 'wallets.user_uuid': user_uuid })
            .first();
        user.account_balance = Number(user.account_balance);
        if (user.account_balance < amount) {
            throw new Error('Insufficient balance');
        }
        // Deduct amount from user's balance
        yield txn('wallets')
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
        };
        yield txn('transactions').insert({
            user_uuid: user_uuid,
            txn_ref: `LEND|${(0, uuid_1.v4)()}`,
            txn_type: 'debit',
            account_balance: user.account_balance - amount,
            logs: JSON.stringify(debitLog)
        });
        // Commit transaction
        yield txn.commit();
        return { success: true, message: 'Transfer successful' };
    }
    catch (error) {
        // Rollback transaction in case of error
        yield txn.rollback();
        throw error;
    }
});
exports.withdraw = withdraw;
/* Fund User wallet */
const fundUserWallet = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_uuid, amount, description } = params;
    // Start a db transaction
    const txn = yield db_config_1.default.transaction();
    try {
        // Check user's balance
        const user = yield txn('wallets')
            .join('users', 'wallets.user_uuid', 'users.user_uuid')
            .select('wallets.*', 'users.first_name', 'users.last_name', 'users.email')
            .where({ 'wallets.user_uuid': user_uuid })
            .first();
        // Add amount from user's balance
        user.account_balance = Number(user.account_balance);
        yield txn('wallets')
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
        };
        yield txn('transactions').insert({
            user_uuid: user_uuid,
            txn_ref: `LEND|${(0, uuid_1.v4)()}`,
            txn_type: 'credit',
            account_balance: user.account_balance + amount,
            logs: JSON.stringify(creditLog)
        });
        // Commit transaction
        yield txn.commit();
        return { success: true, message: 'Funding successful' };
    }
    catch (error) {
        // Rollback transaction in case of error
        yield txn.rollback();
        throw error;
    }
});
exports.fundUserWallet = fundUserWallet;
