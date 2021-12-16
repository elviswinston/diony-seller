import { Action, applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk, { ThunkAction, ThunkDispatch } from "redux-thunk";
import { productReducer } from "./reducers/productReducers";
import { userLoginReducer } from "./reducers/userReducers";
import { ReduxState } from "./types/ReduxState";

export type AppDispatch = ThunkDispatch<ReduxState, unknown, Action<string>>;

export type AppThunk = ThunkAction<
  Promise<void>,
  ReduxState,
  unknown,
  Action<string>
>;

const middleware = [thunk];

const reducer = combineReducers<ReduxState>({
  userLogin: userLoginReducer,
  product: productReducer
});

const userInfo = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo")!)
  : undefined;

const initialState = {
  userLogin: { userInfo: userInfo },
};

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
