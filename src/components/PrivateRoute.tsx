import React from "react";
import { Redirect, Route } from "react-router-dom";
import AuthService from "../services/auth.services";

const PrivateRoute: React.FunctionComponent<{
  component: any;
  path: string;
  exact: boolean;
}> = (props) => {
  const isLogged = AuthService.isLogged();
  const isSeller = AuthService.isSeller();
  const pathName = window.location.pathname;

  return isLogged ? (
    isSeller || pathName === "/account/register-seller" ? (
      <Route path={props.path} exact={props.exact} render={props.component} />
    ) : (
      <Redirect to="/account/register-seller" />
    )
  ) : (
    <Redirect to="/account/login" />
  );
};

export default PrivateRoute;
