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
exports.getProfileController = void 0;
const users_service_1 = require("../services/users.service");
const auth_util_1 = require("../utils/auth.util");
const getProfileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        //  get user_uuid from token
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        const user_uuid = yield (0, auth_util_1.getUserFromToken)(token).user_uuid;
        const user = yield (0, users_service_1.getUserProfile)(user_uuid);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getProfileController = getProfileController;
