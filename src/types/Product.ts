import { Category } from "./Category";

export interface Product {
  name: string;
  description: string;
  categoryId: number;
  weight: number;
  length: number;
  height: number;
  width: number;
  sku: string;
  selectProperties: SelectProperty[];
  typingProperties: TypingProperty[];
  firstVariant: Variant;
  secondVariant: Variant;
  combinations: Combination[];
}

interface Variant {
  name: string;
  options: string[];
}

interface Combination {
  price: number;
  stock: number;
  sku: string;
}

interface SelectProperty {
  id: number;
  valueIDs: number[];
}

interface TypingProperty {
  id: number;
  value: string;
}

export interface ProductState {
  selectedCategory: Category;
  cateLink: string;
}

export enum ProductActionTypes {
  SELECT_CATEGORY = "SELECT_CATEGORY",
  SET_CATEGORY_LINK = "SET_CATEGORY_LINK",
}

export interface ProductSelectCategoryAction {
  type: ProductActionTypes.SELECT_CATEGORY;
  payload: Category;
}

export interface ProductSetCategoryLink {
  type: ProductActionTypes.SET_CATEGORY_LINK;
  payload: string;
}

export type ProductAction =
  | ProductSelectCategoryAction
  | ProductSetCategoryLink;
