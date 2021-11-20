import { UserLoginState } from "./index";
import { ProductState } from "./Product";

export interface ReduxState {
  userLogin: UserLoginState;
  product: ProductState;
}
