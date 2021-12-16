import { Box, Tabs, Tab } from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";
import ProductTable from "../components/ProductTable";

const Container = styled.div`
  background-color: #f6f6f6;
  display: grid;
  place-items: center;
  padding: 20px 0;
`;

const FilterBox = styled.div`
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 10%);
  padding: 20px;
  margin-bottom: 20px;
  width: 80%;
`;

const FilterForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
`;

const FilterAction = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 10px;

  button {
    padding: 5px 20px;
    outline: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }
`;

const FilterButton = styled.button`
  color: #fff;
  background-color: #ee4d2d;
  border: none;

  &:hover {
    background-color: #d64c31;
  }
`;

const RefreshButton = styled.button`
  color: #000;
  background-color: #fff;
  border: 1px solid #e5e5e5;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const FormItem = styled.div`
  display: flex;
  align-items: center;
  column-gap: 20px;
  font-size: 14px;

  label {
    flex: 1;
    text-align: right;
  }
`;

const InputArea = styled.div`
  flex: 3;
  display: flex;
  column-gap: 5px;

  input {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 5px 10px;
    outline: none;
    width: 100%;
  }
`;

const ProductBox = styled.div`
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 10%);
  padding: 20px;
  margin-bottom: 20px;
  width: 80%;
  height: fit-content;
`;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box style={{ marginTop: 20 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ProductListPage: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container>
      <FilterBox>
        <FilterForm>
          <FormItem>
            <label htmlFor="productName">Tên sản phẩm</label>
            <InputArea>
              <input type="text" name="productName" />
            </InputArea>
          </FormItem>
          <FormItem>
            <label htmlFor="productName">Danh mục</label>
            <InputArea>
              <input type="text" name="productName" />
            </InputArea>
          </FormItem>
          <FormItem>
            <label htmlFor="productName">Kho hàng</label>
            <InputArea>
              <input type="text" name="productName" />
              <span>-</span>
              <input type="text" name="productName" />
            </InputArea>
          </FormItem>
          <FormItem>
            <label htmlFor="productName">Đã bán</label>
            <InputArea>
              <input type="text" name="productName" />
              <span>-</span>
              <input type="text" name="productName" />
            </InputArea>
          </FormItem>
        </FilterForm>
        <FilterAction>
          <FilterButton>Tìm</FilterButton>
          <RefreshButton>Nhập lại</RefreshButton>
        </FilterAction>
      </FilterBox>
      <ProductBox>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="product tabs">
            <Tab label="Tất cả" {...a11yProps(0)} />
            <Tab label="Đang hoạt động" {...a11yProps(1)} />
            <Tab label="Hết hàng" {...a11yProps(2)} />
            <Tab label="Vi phạm" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <ProductTable />
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
        <TabPanel value={value} index={3}>
          Item Three
        </TabPanel>
      </ProductBox>
    </Container>
  );
};

export default ProductListPage;
