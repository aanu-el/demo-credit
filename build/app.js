"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
require('dotenv').config();
/* Import Routers */
const auth_route_1 = __importDefault(require("./src/routes/auth.route"));
const users_route_1 = __importDefault(require("./src/routes/users.route"));
const transact_route_1 = __importDefault(require("./src/routes/transact.route"));
const PORT = process.env.PORT;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
/*  API Routes */
app.use('/api/v1/auth', auth_route_1.default);
app.use('/api/v1/user', users_route_1.default);
app.use('/api/v1/transact', transact_route_1.default);
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to LendSqr Demo App'
    });
});
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
