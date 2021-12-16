import React from "react";
import { useParams } from "react-router";
import AddProductPage from "./AddProductPage";
import UpdateProductPage from "./UpdateProductPage";

interface ParamTypes {
  productId: string;
}

const ProductPage: React.FC = () => {
  const { productId } = useParams<ParamTypes>();

  return isNaN(parseInt(productId)) ? (
    <AddProductPage />
  ) : (
    <UpdateProductPage productId={parseInt(productId)} />
  );
};

export default ProductPage;
