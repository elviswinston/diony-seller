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

const ProductServices = {
  addProducImages,
  addProduct,
  getProductSeller,
  getCategoryInfo,
  getProductInfo,
  updateProduct,
};

export default ProductServices;
