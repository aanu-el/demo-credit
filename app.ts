import express, { Express, Request, Response } from "express";
require('dotenv').config();


const PORT = process.env.PORT;
const app: Express = express();

app.use(express.json())

app.get('/', (req:Request, res:Response) => { 
    res.json({
        message: 'Welcome to LendSqr Demo App'
    })
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));