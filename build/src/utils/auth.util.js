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
exports.checkKarmaList = exports.getUserFromToken = exports.generateToken = exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcryptjs_1.default.hash(password, 10);
});
exports.hashPassword = hashPassword;
const comparePassword = (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcryptjs_1.default.compare(password, hashedPassword);
});
exports.comparePassword = comparePassword;
const generateToken = (id, email, user_uuid) => {
    return jsonwebtoken_1.default.sign({ id, email, user_uuid }, SECRET_KEY, { expiresIn: '0.5h' });
};
exports.generateToken = generateToken;
const getUserFromToken = (token) => {
    const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return decoded;
};
exports.getUserFromToken = getUserFromToken;
const checkKarmaList = (param) => __awaiter(void 0, void 0, void 0, function* () {
    let API_URL;
    if (param) {
        API_URL = `https://adjutor.lendsqr.com/v2/verification/karma/${param}`;
    }
    else {
        API_URL = "https://adjutor.lendsqr.com/v2/verification/karma/0zspgifzbo.ga";
    }
    const ADJUTOR_API_TOKEN = process.env.ADJUTOR_API_TOKEN;
    const resolveUrl = yield fetch(API_URL, {
        method: 'GET',
        headers: { "Authorization": `Bearer ${ADJUTOR_API_TOKEN}` }
    });
    const response = yield resolveUrl.json();
    if (response.status === 200) {
        return { status: true, "message": "User Blacklisted" };
    }
    else {
        return { status: false, "message": "User is not blacklisted" };
    }
});
exports.checkKarmaList = checkKarmaList;
