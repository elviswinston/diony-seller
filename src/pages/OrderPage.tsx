import React, { useState } from "react";
import styled from "styled-components";
import { Box, Tabs, Tab } from "@mui/material";
import OrderTable from "../components/OrderTable";
import PrepareOrderPanel from "../components/PrepareOrderPanel";

const Container = styled.div`
  background-color: #f6f6f6;
  display: grid;
  place-items: center;
  padding: 20px 0;
`;

const BoxContainer = styled.div`
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 10%);
  margin-bottom: 20px;
  width: 80%;
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
      {value === index && <Box style={{ padding: 20 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const OrderPage: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Container>
        <BoxContainer>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={value} onChange={handleChange} aria-label="order tabs">
              <Tab label="Tất cả" {...a11yProps(0)} />
              <Tab label="Chờ xác nhận" {...a11yProps(1)} />
              <Tab label="Chờ lấy hàng" {...a11yProps(2)} />
              <Tab label="Đang giao" {...a11yProps(3)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <OrderTable status="ALL" />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <OrderTable status="PENDING_APPROVAL" />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <PrepareOrderPanel />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <OrderTable status="SHIPPING" />
          </TabPanel>
        </BoxContainer>
      </Container>
    </>
  );
};

export default OrderPage;
