import express, { Express, Request, Response } from "express";
import helmet from "helmet";
require('dotenv').config();

/* Import Routers */
import AuthRouter from "./src/routes/auth.route";
import UserRouter from "./src/routes/users.route";
import TransactRouter from "./src/routes/transact.route";

const PORT = process.env.PORT;
const app: Express = express();

app.use(express.json())
app.use(helmet());

/*  API Routes */
app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/user', UserRouter);
app.use('/api/v1/transact', TransactRouter);

app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Welcome to LendSqr Demo App'
    })
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));