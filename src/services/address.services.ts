import axios from "axios";

const API_URL = "https://online-gateway.ghn.vn/shiip/public-api/master-data/";
const token = "91a0ee54-3e00-11ec-9054-0a1729325323";

const getProvice = () => {
  return axios.get(API_URL + "province", { headers: { token: token } });
};

const getDistrict = (provinceId: number) => {
  return axios.get(API_URL + "district?province_id=" + provinceId, {
    headers: { token: token },
  });
};

const getWard = (districtId: number) => {
  return axios.get(API_URL + "ward?district_id=" + districtId, {
    headers: { token: token },
  });
};

const AddressService = {
  getProvice,
  getDistrict,
  getWard,
};

export default AddressService;
