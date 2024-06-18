"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fundWalletSchema = exports.withdrawSchema = exports.transferSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.transferSchema = joi_1.default.object({
    toUserUuid: joi_1.default.string()
        .required()
        .messages({
        'string.empty': 'recipient user uuid is required'
    }),
    amount: joi_1.default.number().required()
});
exports.withdrawSchema = joi_1.default.object({
    recipient_account: joi_1.default.number().required(),
    recipient_bank: joi_1.default.string().required(),
    amount: joi_1.default.number().positive().required(),
    description: joi_1.default.string().optional()
});
exports.fundWalletSchema = joi_1.default.object({
    amount: joi_1.default.number().positive().required(),
    description: joi_1.default.string().optional()
});
