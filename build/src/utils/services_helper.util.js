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
exports.generateWallet = void 0;
const number_generator_1 = require("number-generator");
const db_config_1 = __importDefault(require("../config/db.config"));
const generateWallet = (userData, user_uuid) => __awaiter(void 0, void 0, void 0, function* () {
    //generate account number
    const { uInt32 } = (0, number_generator_1.aleaRNGFactory)(10);
    const account_number = uInt32();
    //generate account name
    const account_name = `${userData.first_name} ${userData.last_name}`;
    //generate wallet
    const wallet = {
        user_uuid: user_uuid,
        account_name: account_name,
        account_number: account_number,
        status: "active",
        account_balance: 0
    };
    const [newWallet] = yield (0, db_config_1.default)('wallets').insert(wallet).returning("*");
    return newWallet;
});
exports.generateWallet = generateWallet;
