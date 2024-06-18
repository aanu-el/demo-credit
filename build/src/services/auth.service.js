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
exports.signin = exports.signup = void 0;
const uuid_1 = require("uuid");
require('dotenv').config();
const db_config_1 = __importDefault(require("../config/db.config"));
const services_helper_util_1 = require("../utils/services_helper.util");
const auth_util_1 = require("../utils/auth.util");
const signup = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    //check if the user exists already by email
    const userLookup = yield (0, db_config_1.default)('users').where({ email: userData.email });
    if (userLookup.length > 0) {
        throw new Error('User exists! Please sign in');
    }
    // check if the user is on karma list
    const karmaList = yield (0, auth_util_1.checkKarmaList)(userData.email);
    if (karmaList.status === true) {
        throw new Error('User is blacklisted');
    }
    // generate user uuid
    const user_uuid = (0, uuid_1.v4)();
    // hash the user password
    const hashedPassword = yield (0, auth_util_1.hashPassword)(userData.password.trim());
    // assign the status of pending to the user
    const status = "active";
    // generate account number
    yield (0, services_helper_util_1.generateWallet)(userData, user_uuid);
    // save into db
    try {
        const [newUser] = yield (0, db_config_1.default)('users').insert(Object.assign(Object.assign({}, userData), { user_uuid: user_uuid, password: hashedPassword, status: status })).returning('*');
        return { status: "success", userId: newUser };
    }
    catch (error) {
        throw error;
    }
});
exports.signup = signup;
const signin = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, db_config_1.default)('users').where({ email }).first();
    if (!user) {
        throw new Error('Invalid email or password');
    }
    const isPasswordValid = yield (0, auth_util_1.comparePassword)(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }
    const token = yield (0, auth_util_1.generateToken)(user.id, user.email, user.user_uuid);
    return token;
});
exports.signin = signin;
