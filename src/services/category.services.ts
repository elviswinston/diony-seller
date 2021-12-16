import axios from "axios";
import { Category, SelectProperty, TypingProperty } from "../types/Category";

const API_URL = "http://localhost:5000/api/Category/";
const API_URL_SELECT_PROPERTY = "http://localhost:5000/api/SelectProperty/";
const API_URL_TYPING_PROPERTY = "http://localhost:5000/api/TypingProperty/";

interface MenuResponse {
  categories: Category[];
  maxDepth: number;
}

const getMenu = () => {
  return axios.get<MenuResponse>(API_URL + "GetMenu");
};

const getSelectProperties = (cateId: number) => {
  return axios.get<SelectProperty[]>(
    API_URL_SELECT_PROPERTY + "GetCateProp/" + cateId
  );
};

const getTypingProperties = (cateId: number) => {
  return axios.get<TypingProperty[]>(
    API_URL_TYPING_PROPERTY + "GetCateProp/" + cateId
  );
};

const CategoryServices = { getMenu, getSelectProperties, getTypingProperties };

export default CategoryServices;
