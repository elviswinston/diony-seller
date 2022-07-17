import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Box, Tabs, Tab, Snackbar, Alert, AlertColor } from "@mui/material";
import ListTransaction from "../components/ListTransaction";
import { useSelector } from "react-redux";
import { ReduxState } from "../types/ReduxState";
import WalletService from "../services/wallet.services";

const Container = styled.div`
  background-color: #f6f6f6;
  display: grid;
  place-items: center;
  padding: 20px 0;

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const BoxContainer = styled.div`
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 10%);
  margin-bottom: 20px;
  width: 80%;
`;

const BoxHeader = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
`;

const Title = styled.div`
  span {
    font-size: 14px;
    color: #999;
  }
`;

const PayoutButton = styled.button`
  color: #fff;
  background-color: #ee4d2d;
  border: none;
  outline: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
`;

const BoxContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  row-gap: 40px;
`;

const MoneyInput = styled.input`
  outline: none;
  border-radius: 4px;
  border: 1px solid #ccc;
  padding: 4px 8px;
  margin-right: 4px;
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

const WalletPage: React.FC = () => {
  const [value, setValue] = useState(0);
  const [money, setMoney] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<AlertColor>();

  const userInfo = useSelector((state: ReduxState) => state.userLogin.userInfo);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setShowToast(false);
  };

  const payout = async () => {
    if (userInfo) {
      const isValidMoney = await WalletService.checkPayoutMoney(
        money,
        userInfo.token
      );

      if (!isValidMoney) {
        setToastMessage("Số tiền không hợp lệ");
        setToastSeverity("error");
        setShowToast(true);
      }

      if (money < 100000) {
        setToastMessage("Số tiền rút ít nhất phải là 100,000 VNĐ");
        setToastSeverity("error");
        setShowToast(true);
      }

      if (isValidMoney && money >= 100000) {
        window.location.href = "http://127.0.0.1:3000/paypal.html";
        localStorage.setItem("moneyPayout", money.toString());
      }
    }
  };

  useEffect(() => {
    const fetchData = async (token: string) => {
      const wallet = await WalletService.getWallet(token);
      if (wallet) {
        setWallet(wallet);
      }
    };

    if (userInfo) {
      fetchData(userInfo.token);
    }

    const payout = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const code = queryParams.get("code");

      const moneyPayout: number = parseFloat(
        localStorage.getItem("moneyPayout") || "0"
      );
      if (moneyPayout > 0 && code && userInfo) {
        var result = await WalletService.payout(
          userInfo.token,
          moneyPayout,
          code
        );
        if (result) {
          setToastMessage("Rút tiền thành công");
          setToastSeverity("success");
          setShowToast(true);

          fetchData(userInfo.token);
          localStorage.removeItem("moneyPayout");
        } else {
          setToastMessage("Rút tiền thất bại");
          setToastSeverity("error");
          setShowToast(true);
        }
      }
    };

    payout();
  }, [userInfo]);

  return (
    <>
      <Snackbar
        open={showToast}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={toastSeverity}
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
      <Container>
        <BoxContainer>
          <BoxHeader>
            <Title>
              <h2>Ví tiền</h2>
              <span>
                Số dư ví: <b>{wallet.toLocaleString() + " VNĐ"}</b>
              </span>
            </Title>
            <div>
              <MoneyInput
                placeholder="Nhập số tiền muốn rút"
                type="number"
                onChange={(e) => setMoney(parseFloat(e.target.value))}
              />
              <PayoutButton onClick={() => payout()}>Rút tiền</PayoutButton>
            </div>
          </BoxHeader>
          <BoxContent>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="product tabs"
              >
                <Tab label="Tiền vào" {...a11yProps(0)} />
                <Tab label="Tiền ra" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <ListTransaction type="RECEIVE" />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <ListTransaction type="EXPENSE" />
            </TabPanel>
          </BoxContent>
        </BoxContainer>
      </Container>
    </>
  );
};

export default WalletPage;
