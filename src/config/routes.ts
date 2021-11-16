import IRoute from "../types/IRoute";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SellerRegisterPage from "../pages/SellerRegisterPage";

const routes: IRoute[] = [
  {
    path: "/seller",
    name: "Home Page",
    component: HomePage,
    exact: false,
    isPrivate: true,
  },
  {
    path: "/",
    name: "Home Page",
    component: HomePage,
    exact: true,
    isPrivate: true,
  },
  {
    path: "/account/login",
    name: "Login Page",
    component: LoginPage,
    exact: true,
    isPrivate: false,
  },
  {
    path: "/account/register-seller",
    name: "Register Page",
    component: SellerRegisterPage,
    exact: true,
    isPrivate: true,
  }
];

export default routes;
