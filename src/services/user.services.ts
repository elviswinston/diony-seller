import axios from "axios";
import { Address } from "../types/Address";

const API_URL = "http://localhost:5000/api/User/";

const addAddress = (address: Address) => {
  return axios.post(API_URL + "AddAddress", address);
};

const registerSeller = (address: Address, shopName: string, userId: string) => {
  return axios.post(API_URL + "RegisterSeller", { userId, shopName, address });
};

const UserService = {
  addAddress,
  registerSeller,
};

export default UserService;
