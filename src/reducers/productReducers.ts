import {
  ProductAction,
  ProductActionTypes,
  ProductState,
} from "../types/Product";

const initalProductState: ProductState = {
  selectedCategory: { id: 0, name: "" },
  cateLink: "",
};

export const productReducer = (
  state: ProductState = initalProductState,
  action: ProductAction
) => {
  switch (action.type) {
    case ProductActionTypes.SELECT_CATEGORY:
      return { ...state, selectedCategory: action.payload };
    case ProductActionTypes.SET_CATEGORY_LINK:
      return { ...state, cateLink: action.payload };
    default:
      return state;
  }
};
