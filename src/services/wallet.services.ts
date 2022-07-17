import axios from "axios";
import { ListTransactionResponse } from "../types/Transaction";

const API_URL = "http://localhost:5000/api/Wallet/";

const getWallet = async (token: string) => {
  var { data } = await axios.get<number>(API_URL + "GetWallet", {
    headers: { Authorization: "Bearer " + token },
  });
  return data;
};

const payout = async (token: string, money: number, code: string) => {
  var response = await axios.post(
    API_URL + "Payout",
    {
      money,
      code,
    },
    {
      headers: { Authorization: "Bearer " + token },
    }
  );

  if (response.status === 200) {
    return true;
  }

  return false;
};

const checkPayoutMoney = async (money: number, token: string) => {
  var { data } = await axios.get<boolean>(
    API_URL + "CheckPayoutMoney?money=" + money,
    {
      headers: { Authorization: "Bearer " + token },
    }
  );
  return data;
};

const getTransactions = async (
  token: string,
  type: string,
  shopEmail: string,
  pageSize: number,
  pageNumber: number
) => {
  var { data } = await axios.get<ListTransactionResponse>(
    API_URL +
      `GetFilteredTransactions?transactionType=${type}&shopEmail=${encodeURIComponent(
        shopEmail
      )}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
    {
      headers: { Authorization: "Bearer " + token },
    }
  );

  return data;
};

const WalletService = {
  getWallet,
  payout,
  checkPayoutMoney,
  getTransactions,
};

export default WalletService;
