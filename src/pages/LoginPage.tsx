import React from "react";
import IPage from "../types/IPage";

import styled from "styled-components";
import { Header } from "../components/Header";
import { LoginForm } from "../components/LoginForm";

const Container = styled.div`
  background-color: #f6f6f6;
  width: 100%;
  height: 100%;
  position: relative;
  display: grid;
  place-items: center;
`;

const Content = styled.div`
  display: flex;
  height: 55%;
  width: 70%;
  margin: auto;
  justify-content: center;
`;

const LoginPage: React.FunctionComponent<IPage> = (props) => {
  return (
    <Container>
      <Header />
      <Content>
        <LoginForm></LoginForm>
      </Content>
    </Container>
  );
};

export default LoginPage;
