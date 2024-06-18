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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fundWallet = exports.externalTransfer = exports.intraTransfer = exports.getTransactionHistory = void 0;
const auth_util_1 = require("../utils/auth.util");
const transact_service_1 = require("../services/transact.service");
const getTransactionHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { page, limit, startDate, endDate, type } = req.query;
    try {
        //  get user_uuid from token
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        const user_uuid = yield (0, auth_util_1.getUserFromToken)(token).user_uuid;
        const params = {
            user_uuid,
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            startDate: startDate,
            endDate: endDate,
            type: type
        };
        const all_transactions = yield (0, transact_service_1.getTransactionLogs)(params);
        res.status(200).json(all_transactions);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getTransactionHistory = getTransactionHistory;
/* Handles transfer logic between lendSqr users */
const intraTransfer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { toUserUuid, amount } = req.body;
    try {
        //  get user_uuid from token
        const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
        const fromUserUuid = yield (0, auth_util_1.getUserFromToken)(token).user_uuid;
        const result = yield (0, transact_service_1.transfer)({ fromUserUuid, toUserUuid, amount });
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.intraTransfer = intraTransfer;
/* Handles transfer logic to external banks */
const externalTransfer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { recipient_account, recipient_bank, amount, description } = req.body;
    try {
        //  get user_uuid from token
        const token = (_c = req.headers.authorization) === null || _c === void 0 ? void 0 : _c.split(' ')[1];
        const user_uuid = yield (0, auth_util_1.getUserFromToken)(token).user_uuid;
        const result = yield (0, transact_service_1.withdraw)({ user_uuid, recipient_account, recipient_bank, amount, description });
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.externalTransfer = externalTransfer;
const fundWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const { amount, description } = req.body;
    try {
        //  get user_uuid from token
        const token = (_d = req.headers.authorization) === null || _d === void 0 ? void 0 : _d.split(' ')[1];
        const user_uuid = yield (0, auth_util_1.getUserFromToken)(token).user_uuid;
        const result = yield (0, transact_service_1.fundUserWallet)({ user_uuid, amount, description });
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.fundWallet = fundWallet;
