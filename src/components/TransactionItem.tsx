import React from "react";
import styled from "styled-components";

import { ImArrowDown, ImArrowUp } from "react-icons/im";
import { TransactionResponse } from "../types/Transaction";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoContainer = styled.div`
  display: flex;
  column-gap: 8px;
  align-items: center;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 4px;
`;

const DateText = styled.span`
  color: #999;
  font-size: 12px;
`;

const SourceText = styled.span`
  font-size: 18px;
  font-weight: 600;
`;

const MoneyText = styled.span<Props>`
  font-weight: 600;
  color: ${(props) => (props.type === "EXPENSE" ? "#ff7474" : "#3a89ff")};
`;

interface Props {
  type: String;
  transaction: TransactionResponse;
}

const TransactionItem: React.FC<Props> = ({ type, transaction }) => {
  const formatDate = (date: string) => {
    var d = new Date(date);

    return d.toLocaleDateString("vi-VN") + " " + d.toLocaleTimeString("vi-VN");
  };

  return (
    <Container>
      <InfoContainer>
        {type === "EXPENSE" && (
          <ImArrowDown style={{ color: "#ff7474" }} size="25" />
        )}
        {type === "RECEIVE" && (
          <ImArrowUp style={{ color: "#3a89ff" }} size="25" />
        )}
        <TextContainer>
          <DateText>{formatDate(transaction.transactionDate)}</DateText>
          <SourceText>Paypal</SourceText>
        </TextContainer>
      </InfoContainer>
      <MoneyText type={type} transaction={transaction}>
        {transaction.totalMoney.toLocaleString() + " VNĐ"}
      </MoneyText>
    </Container>
  );
};

export default TransactionItem;
