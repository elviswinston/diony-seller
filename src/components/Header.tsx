import React from "react";
import { Link } from "react-router-dom";

import styled from "styled-components";

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 56px;
  max-height: 56px;
  z-index: 10;
  background-color: #fff;
  box-shadow: 0 1px 4px 0 rgb(74 74 78 / 12%);
`;

export const Content = styled.div`
  display: flex;
  min-height: 56px;
  max-height: 56px;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;

  h3 {
    font-weight: 400;
  }
`;

export const Logo = styled.div``;

export const Nav = styled.div``;

export const Header: React.FC = () => {
  return (
    <Container>
      <Content>
        <h3>Kênh Người Bán</h3>
        <Nav>
          <Link to={"/"}>Trang chủ</Link>
        </Nav>
      </Content>
    </Container>
  );
};
