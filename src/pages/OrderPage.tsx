import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Box, Tabs, Tab, Badge } from "@mui/material";
import OrderTable from "../components/OrderTable";
import PrepareOrderPanel from "../components/PrepareOrderPanel";
import { useSelector } from "react-redux";
import { ReduxState } from "../types/ReduxState";
import OrderService from "../services/order.services";
import OrderSummaryResponse from "../types/Order";

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
  const [orderSummary, setOrderSummary] = useState<OrderSummaryResponse>();
  const { userInfo } = useSelector((state: ReduxState) => state.userLogin);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchData = (token: string) => {
      OrderService.getOrderSummary(token).then((response) => {
        if (response.status === 200) {
          setOrderSummary(response.data);
        }
      });
    };

    userInfo && fetchData(userInfo.token);
  }, [userInfo]);

  return (
    <>
      <Container>
        <BoxContainer>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="order tabs"
              variant="fullWidth"
            >
              <Tab label="Tất cả" {...a11yProps(0)} />
              <Tab
                label={
                  <p>
                    Chờ xác nhận
                    <Badge
                      badgeContent={orderSummary?.pendingApproval}
                      color="error"
                      style={{ transform: "translate(10px, -15px)" }}
                    ></Badge>
                  </p>
                }
                {...a11yProps(1)}
              />
              <Tab
                label={
                  <p>
                    Chờ lấy hàng
                    <Badge
                      badgeContent={orderSummary?.prepare}
                      color="error"
                      style={{ transform: "translate(10px, -15px)" }}
                    ></Badge>
                  </p>
                }
                {...a11yProps(2)}
              />
              <Tab
                label={
                  <p>
                    Đang giao
                    <Badge
                      badgeContent={orderSummary?.shipping}
                      color="error"
                      style={{ transform: "translate(10px, -15px)" }}
                    ></Badge>
                  </p>
                }
                {...a11yProps(3)}
              />
              <Tab
                label={
                  <p>
                    Đã giao
                    {/* <Badge
                      badgeContent={orderSummary?.shipped}
                      color="error"
                      style={{ transform: "translate(10px, -15px)" }}
                    ></Badge> */}
                  </p>
                }
                {...a11yProps(4)}
              />
              <Tab
                label={
                  <p>
                    Đơn huỷ
                    {/* <Badge
                      badgeContent={orderSummary?.cancelled}
                      color="error"
                      style={{ transform: "translate(10px, -15px)" }}
                    ></Badge> */}
                  </p>
                }
                {...a11yProps(5)}
              />
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
          <TabPanel value={value} index={4}>
            <OrderTable status="SHIPPED" />
          </TabPanel>
          <TabPanel value={value} index={5}>
            <OrderTable status="CANCELLED" />
          </TabPanel>
        </BoxContainer>
      </Container>
    </>
  );
};

export default OrderPage;
