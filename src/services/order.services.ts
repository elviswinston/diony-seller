import axios from "axios";
import OrderSummaryResponse from "../types/Order";

const API_URL = "http://localhost:5000/api/Order/";

const getOrderSeller = (status: string, token: string) => {
  return axios.get(API_URL + "GetOrderSeller?status=" + status, {
    headers: { Authorization: "Bearer " + token },
  });
};

const prepareOrder = (orderId: string, token: string, prepareDate: string) => {
  return axios.post(
    API_URL + "PrepareOrder",
    { orderId, prepareDate },
    {
      headers: { Authorization: "Bearer " + token },
    }
  );
};

const getOrderSummary = (token: string) => {
  return axios.get<OrderSummaryResponse>(API_URL + "GetOrderSummary", {
    headers: { Authorization: "Bearer " + token },
  });
};

const OrderService = {
  getOrderSeller,
  prepareOrder,
  getOrderSummary,
};

export default OrderService;
