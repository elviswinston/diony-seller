import axios from "axios";
import {
  Address,
  AddressAddRequest,
  AddressUpdateRequest,
} from "../types/Address";

const API_URL = "http://localhost:5000/api/User/";

const addAddress = (address: Address) => {
  return axios.post(API_URL + "AddAddress", address);
};

const getAddress = (token: string) => {
  return axios.get(API_URL + "GetAddresses", {
    headers: { Authorization: "Bearer " + token },
  });
};

const registerSeller = (address: Address, shopName: string, userId: string) => {
  return axios.post(API_URL + "RegisterSeller", { userId, shopName, address });
};

const updateAddressSeller = (request: AddressUpdateRequest, token: string) => {
  return axios.put(API_URL + "UpdateAddressSeller", request, {
    headers: { Authorization: "Bearer " + token },
  });
};

const addAddressSeller = (request: AddressAddRequest, token: string) => {
  return axios.post(API_URL + "AddAddressSeller", request, {
    headers: { Authorization: "Bearer " + token },
  });
};

const deleteAddress = (addressId: number, token: string) => {
  return axios.delete(API_URL + "DeleteAddress/" + addressId, {
    headers: { Authorization: "Bearer " + token },
  });
};

const UserService = {
  addAddress,
  registerSeller,
  getAddress,
  updateAddressSeller,
  addAddressSeller,
  deleteAddress,
};

export default UserService;
