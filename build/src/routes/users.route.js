"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const UserRouter = (0, express_1.Router)();
UserRouter.get('/me', auth_middleware_1.authMiddleware, users_controller_1.getProfileController);
exports.default = UserRouter;
