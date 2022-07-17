export interface TransactionResponse {
  id: number;
  transactionDate: string;
  totalMoney: number;
  totalMoneyUSD: number;
  type: string;
  shopEmail: string;
  paypalWithdrawerEmail: string;
  paypalTransactionId: string;
}

export interface ListTransactionResponse {
  transactions: TransactionResponse[];
  totalTransactions: number;
}
