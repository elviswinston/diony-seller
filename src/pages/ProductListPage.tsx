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
      <ProductBox>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="product tabs">
            <Tab label="Tất cả" {...a11yProps(0)} />
            <Tab label="Đã ẩn" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <ProductTable type="ALL" />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ProductTable type="HIDE" />
        </TabPanel>
      </ProductBox>
    </Container>
  );
};

export default ProductListPage;
