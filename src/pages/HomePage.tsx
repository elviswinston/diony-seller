import React from "react";

import styled from "styled-components";
import Sidebar from "../components/Sidebar";
import { Header } from "../components/Header";
import { Route } from "react-router-dom";
import ProductListPage from "./ProductListPage";
import CategoryPage from "./CategoryPage";
import AddProductPage from "./AddProductPage";

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
      <Header />
      <Route path="/seller/product/category" component={CategoryPage} />
      <Route path="/seller/product/new" component={AddProductPage}/>
      <Content>
        <Sidebar />
        <PageContainer>
          <Route path="/seller/product/list/all" component={ProductListPage} />
        </PageContainer>
      </Content>
    </Container>
  );
};

export default HomePage;
