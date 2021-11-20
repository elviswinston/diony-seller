import { User } from "./index";

export interface UserLoginState {
  userInfo?: User;
  loading?: boolean;
  error?: any;
}

export enum UserLoginActionTypes {
  USER_LOGIN_REQUEST = "USER_LOGIN_REQUEST",
  USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS",
  USER_LOGIN_FAILURE = "USER_LOGIN_FAILURE",
  USER_LOGOUT = "USER_LOGOUT",
  SET_STATUS_SELLER = "SET_STATUS_SELLER",
}

export interface UserLoginRequestAction {
  type: UserLoginActionTypes.USER_LOGIN_REQUEST;
}

export interface UserLoginSuccessAction {
  type: UserLoginActionTypes.USER_LOGIN_SUCCESS;
  payload: User;
}

export interface UserLoginFailureAction {
  type: UserLoginActionTypes.USER_LOGIN_FAILURE;
  payload: any;
}

export interface UserLogoutAction {
  type: UserLoginActionTypes.USER_LOGOUT;
}

export interface SetStatusSellerAction {
  type: UserLoginActionTypes.SET_STATUS_SELLER;
  payload: User;
}

export type UserLoginAction =
  | UserLoginRequestAction
  | UserLoginSuccessAction
  | UserLoginFailureAction
  | UserLogoutAction
  | SetStatusSellerAction;
