import { AppThunk } from "../store";
import { Category } from "../types/Category";
import { ProductActionTypes } from "../types/Product";

export const selectCategory =
  (category: Category): AppThunk =>
  async (dispatch) => {
    dispatch({
      type: ProductActionTypes.SELECT_CATEGORY,
      payload: category,
    });
  };

export const setCategoryLink =
  (cateLink: string): AppThunk =>
  async (dispatch) => {
    dispatch({
      type: ProductActionTypes.SET_CATEGORY_LINK,
      payload: cateLink,
    });
  };