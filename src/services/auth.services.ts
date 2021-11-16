import axios from "axios";

const API_URL = "http://localhost:5000/api/User/";

const login = (username: string, password: string) => {
  return axios.post(API_URL + "login", { username, password });
};

const isLogged = () => {
  const userInfo = getCurrentUser();
  if (userInfo !== null) return true;

  return false;
};

const getCurrentUser = () => {
  const userInfo = localStorage.getItem("userInfo");

  if (userInfo) return JSON.parse(userInfo);

  return null;
};

const isSeller = () => {
  const userInfo = getCurrentUser();
  if (userInfo?.isSeller) return true;

  return false;
};

const AuthService = {
  login,
  isLogged,
  isSeller,
};

export default AuthService;
