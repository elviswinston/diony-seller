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

export interface ProductResponse {
  name: string;
  description: string;
  categoryId: number;
  weight: number;
  length: number;
  height: number;
  width: number;
  sku: string;
  price?: number;
  stock?: number;
  variants: VariantResponse[];
  combinations: CombinationResponse[];
  coverImage: string;
}

interface VariantResponse {
  id: number;
  name: string;
  options: OptionResponse[];
}

interface OptionResponse {
  id: number;
  name: string;
}

interface CombinationResponse {
  id: number;
  firstOptionId: number;
  secondOptionId: number;
  price: number;
  stock: number;
  sku: string;
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
  SET_UPDATE_PRODUCT = "SET_UPDATE_PRODUCT"
}

export interface ProductSelectCategoryAction {
  type: ProductActionTypes.SELECT_CATEGORY;
  payload: Category;
}

export interface ProductSetCategoryLink {
  type: ProductActionTypes.SET_CATEGORY_LINK;
  payload: string;
}

export interface ProductSetUpdate {
  type: ProductActionTypes.SET_UPDATE_PRODUCT,
  payload: ProductResponse
}

export type ProductAction =
  | ProductSelectCategoryAction
  | ProductSetCategoryLink
  | ProductSetUpdate;
