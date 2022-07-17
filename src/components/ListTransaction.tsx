import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import WalletService from "../services/wallet.services";
import { ReduxState } from "../types/ReduxState";
import { ListTransactionResponse } from "../types/Transaction";
import TransactionItem from "./TransactionItem";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 30px;
`;

interface Props {
  type: string;
}

const ListTransaction: React.FC<Props> = ({ type }) => {
  const [list, setList] = useState<ListTransactionResponse>();
  const { userInfo } = useSelector((state: ReduxState) => state.userLogin);

  useEffect(() => {
    const fetchData = async (token: string, email: string) => {
      if (type === "RECEIVE") {
        var result = await WalletService.getTransactions(
          token,
          "PayForShop",
          email,
          50,
          0
        );
        setList(result);
      }

      if (type === "EXPENSE") {
        result = await WalletService.getTransactions(
          token,
          "ShopWithdrawMoneyToPaypal",
          email,
          50,
          0
        );
        setList(result);
      }
    };
    if (userInfo && !list) {
      fetchData(userInfo.token, userInfo.email);
    }
  }, [userInfo, type, list]);

  return (
    <Container>
      {list &&
        list.totalTransactions > 0 &&
        list.transactions.map((transaction) => (
          <TransactionItem type={type} transaction={transaction} />
        ))}
    </Container>
  );
};

export default ListTransaction;
