export interface TransactionQueryDto {
    user_uuid: string;
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    type?: 'debit' | 'credit';
}

export interface IntraFundsTransferDto {
    fromUserUuid: string;
    toUserUuid: string;
    amount: number;
}

export interface WithdrawFundsDto {
    user_uuid: string;
    recipient_account?: string;
    recipient_bank?: string;
    amount: number;
    description?: string;
}
export interface FundWalletDto {
    user_uuid: string;
    amount: number;
    description?: string;
}