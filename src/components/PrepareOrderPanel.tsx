import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import OrderTable from "./OrderTable";
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

const PrepareOrderPanel: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Tất cả" {...a11yProps(0)} />
          <Tab label="Chưa xử lý" {...a11yProps(1)} />
          <Tab label="Đã xử lý" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <OrderTable status="TO_PREPARE_PICKUP" />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <OrderTable status="TO_PREPARE" />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <OrderTable status="TO_PICKUP" />
      </TabPanel>
    </Box>
  );
};

export default PrepareOrderPanel;
