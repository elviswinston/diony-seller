import axios from "axios";

const API_URL = "http://localhost:5000/api/Product";

const addProduct = (formData: FormData) => {
  return axios.post(API_URL, formData, {
    headers: { "content-type": "multipart/form-data" },
  });
};

const addProducImages = (formData: FormData) => {
  return axios.post(API_URL + "/AddImages", formData, {
    headers: { "content-type": "multipart/form-data" },
  });
};

const getProductSeller = (token: string) => {
  return axios.get(API_URL + "/GetProductSeller", {
    headers: { Authorization: "Bearer " + token },
  });
};

const getHideProductSeller = (token: string) => {
  return axios.get(API_URL + "/GetHideProductSeller", {
    headers: { Authorization: "Bearer " + token },
  });
};

const getCategoryInfo = (productId: number) => {
  return axios.get(API_URL + "/GetCateLink/" + productId);
};

const getProductInfo = (productId: number) => {
  return axios.get(API_URL + "/" + productId);
};

const updateProduct = (formData: FormData) => {
  return axios.put(API_URL, formData, {
    headers: { "content-type": "multipart/form-data" },
  });
};

const getValues = (productId: number) => {
  return axios.get(API_URL + "/GetValues/" + productId);
};

const hideProduct = (productId: number, token: string) => {
  return axios.post(API_URL + "/Hide/" + productId, null, {
    headers: { Authorization: "Bearer " + token },
  });
};

const unhideProduct = (productId: number, token: string) => {
  return axios.post(API_URL + "/Unhide/" + productId, null, {
    headers: { Authorization: "Bearer " + token },
  });
};

const ProductServices = {
  addProducImages,
  addProduct,
  getProductSeller,
  getHideProductSeller,
  getCategoryInfo,
  getProductInfo,
  updateProduct,
  getValues,
  hideProduct,
  unhideProduct,
};

export default ProductServices;
