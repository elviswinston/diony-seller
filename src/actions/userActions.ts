import AuthService from "../services/auth.services";
import { AppThunk } from "../store";
import { UserLoginActionTypes } from "../types";
import { errorHandler } from "./errorHandler";

interface Response {
  data: any;
  status: number;
  message: string;
  innerExeption: string;
}

export const login =
  (username: string, password: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch({
        type: UserLoginActionTypes.USER_LOGIN_REQUEST,
      });

      const { data }: { data: Response } = await AuthService.login(
        username,
        password
      );

      if (data.status === 0) {
        dispatch({
          type: UserLoginActionTypes.USER_LOGIN_SUCCESS,
          payload: data.data,
        });

        localStorage.setItem("userInfo", JSON.stringify(data.data));
      } else {
        dispatch({
          type: UserLoginActionTypes.USER_LOGIN_FAILURE,
          payload: data.message,
        });
      }
    } catch (error) {
      dispatch({
        type: UserLoginActionTypes.USER_LOGIN_FAILURE,
        payload: errorHandler(error),
      });
    }
  };
