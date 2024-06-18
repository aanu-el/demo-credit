import { aleaRNGFactory } from "number-generator";


import { Wallet } from "../db/models/wallets.model";
import db from "../config/db.config";

export const generateWallet = async (userData: any, user_uuid: string): Promise<any> => {

    //generate account number
    const { uInt32 } = aleaRNGFactory(10);
    const account_number: any = uInt32()

    //generate account name
    const account_name = `${userData.first_name} ${userData.last_name}`

    //generate wallet
    const wallet = {
        user_uuid: user_uuid,
        account_name: account_name,
        account_number: account_number,
        status: "active",
        account_balance: 0
    }
    const [newWallet] = await db<Wallet>('wallets').insert(wallet).returning("*");
    return newWallet
}
