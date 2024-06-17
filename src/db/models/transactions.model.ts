export type Transaction = {
    id?: number;
    user_uuid: string;
    txn_type: string;
    txn_ref: string;
    account_balance: number;
    logs: any;
};
