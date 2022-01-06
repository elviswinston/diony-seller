import React from "react";

import styled from "styled-components";
import Sidebar from "../components/Sidebar";
import { Header } from "../components/Header";
import { Route } from "react-router-dom";
import ProductListPage from "./ProductListPage";
import CategoryPage from "./CategoryPage";
import ProductPage from "./ProductPage";
import AddressPage from "./AddressPage";
import OrderPage from "./OrderPage";

const Container = styled.div`
  background-color: #f6f6f6;
  width: 100%;
  height: 100%;
  position: relative;
`;

const Content = styled.div`
  margin-top: 56px;
`;

const PageContainer = styled.div`
  margin-left: 220px;
`;

const HomePage: React.FC = () => {
  return (
    <Container>
      <Header PageName="Home" />
      <Route path="/seller/category" component={CategoryPage} />
      <Route exact path="/seller/product/:productId" component={ProductPage} />
      <Content>
        <Sidebar />
        <PageContainer>
          <Route
            exact
            path="/seller/product/list/all"
            component={ProductListPage}
          />
          <Route exact path="/seller/setting/address" component={AddressPage} />
          <Route exact path="/seller/order" component={OrderPage} />
        </PageContainer>
      </Content>
    </Container>
  );
};

export default HomePage;
