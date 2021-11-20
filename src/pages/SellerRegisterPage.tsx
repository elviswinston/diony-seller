import React from "react";
import IPage from "../types/IPage";

import styled from "styled-components";
import SellerRegisterForm from "../components/SellerRegisterForm";
import AuthService from "../services/auth.services";
import { Redirect } from "react-router-dom";

const Container = styled.div`
  height: 100%;
  position: relative;
  background-color: #f6f6f6;
  display: grid;
  place-items: center;
`;

const Box = styled.div`
  width: 50%;
  background-color: #fff;
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 10%);
  border-radius: 4px;
  display: grid;
  place-items: center;
  padding: 40px 0;

  form {
    margin-top: 10px;
    width: 50%;
    text-align: center;
  }
`;

const BoxInfo = styled.div`
  text-align: center;

  h3 {
    font-weight: 500;
    margin-bottom: 1rem;
  }
`;

const SellerRegisterPage: React.FC<IPage> = () => {
  const isSeller = AuthService.isSeller();

  return isSeller ? (
    <Redirect to="/" />
  ) : (
    <Container>
      <Box>
        <BoxInfo>
          <h3>Chào mừng đến Diony!</h3>
          <p>
            Để đăng ký bán hàng trên Diony, bạn cần cung cấp một số thông tin cơ
            bản
          </p>
        </BoxInfo>
        <SellerRegisterForm />
      </Box>
    </Container>
  );
};

export default SellerRegisterPage;
