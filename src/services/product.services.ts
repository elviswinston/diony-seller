import axios from "axios";

const API_URL = "http://localhost:5000/api/Product/";

const addProduct = (formData: FormData) => {
  return axios.post(API_URL, formData, {
    headers: { "content-type": "multipart/form-data" },
  });
};

const addProducImages = (formData: FormData) => {
  return axios.post(API_URL + "AddImages", formData, {
    headers: { "content-type": "multipart/form-data" },
  });
};

const ProductServices = {
  addProducImages,
  addProduct,
};

export default ProductServices;
