import AuthService from "../services/auth.services";
import { AppThunk } from "../store";
import { User, UserLoginActionTypes } from "../types";
import { errorHandler } from "./errorHandler";

interface Response {
  data: any;
  status: number;
  message: string;
  innerExeption: string;
}

export const login =
  (email: string, password: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch({
        type: UserLoginActionTypes.USER_LOGIN_REQUEST,
      });

      const { data }: { data: Response } = await AuthService.login(
        email,
        password
      );

      dispatch({
        type: UserLoginActionTypes.USER_LOGIN_SUCCESS,
        payload: data,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: UserLoginActionTypes.USER_LOGIN_FAILURE,
        payload: errorHandler(error),
      });
    }
  };

export const setStatusSeller =
  (userInfo: User): AppThunk =>
  async (dispatch) => {
    try {
      dispatch({
        type: UserLoginActionTypes.SET_STATUS_SELLER,
        payload: userInfo,
      });
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    } catch (error) {}
  };
