const random = require('random')

import { Wallet } from "../db/models/wallets.model";
import db from "../config/db.config";

export const generateWallet = async (userData: any): Promise<Wallet> => {
    //generate account number
    const account_number = random.int(10, 10);
    //generate account name
    const account_name = `${userData.first_name} ${userData.last_name}`
    //generate wallet
    const wallet = {
        user_uuid: userData.user_uuid,
        account_name: account_name,
        account_number: account_number,
        status: "active",
        account_balance: "0"
    }
    const [newWallet] = await db<Wallet>('wallets').insert(wallet).returning('*');
    return newWallet;
}