import axios from "axios";

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

const OrderService = {
  getOrderSeller,
  prepareOrder,
};

export default OrderService;
