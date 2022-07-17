import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import styled from "styled-components";
import ProductServices from "../services/product.services";
import { ReduxState } from "../types/ReduxState";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Container = styled.div`
  width: 100%;

  .MuiDataGrid-virtualScrollerContent {
    height: auto !important;
  }

  .MuiDataGrid-virtualScrollerRenderZone {
    position: relative !important;
  }

  .MuiDataGrid-row {
    max-height: fit-content !important;
    min-height: fit-content !important;
    height: fit-content !important;
  }

  .MuiDataGrid-cell {
    max-height: none !important;
    min-height: auto !important;
    height: auto !important;
  }

  .MuiDataGrid-root .MuiDataGrid-window {
    position: relative !important;
  }

  .Muidatagrid-root .muidatagrid-viewport {
    max-height: none !important;
  }

  .MuiDataGrid-root {
    height: auto !important;
  }

  p {
    line-height: 3;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;

  margin: 10px 0;
`;

const ImageBox = styled.div`
  width: 56px;
  height: 56px;
  min-width: 56px;
  margin-right: 10px;

  img {
    max-width: 100%;
    max-height: 100%;
  }
`;

const InfoBox = styled.div`
  max-width: 200px;
  span {
    font-weight: 700;
    font-size: 14px;
    margin: 0;
    text-overflow: ellipsis;
    display: -webkit-box;
    white-space: initial;
  }

  span,
  p {
    line-height: 20px;
  }

  p {
    font-size: 12px;
    color: #999;
  }
`;

const columns: GridColDef[] = [
  {
    field: "info",
    headerName: "Tên sản phẩm",
    width: 250,
    editable: false,
    filterable: false,
    sortable: false,
    renderCell: (params: GridRenderCellParams<any, any, any>) => {
      return (
        <InfoContainer>
          <ImageBox>
            <img alt={params.value.name} src={params.value.image} />
          </ImageBox>
          <InfoBox>
            <span>{params.value.name}</span>
            <p>SKU sản phẩm: {params.value.sku ? params.value.sku : "-"}</p>
          </InfoBox>
        </InfoContainer>
      );
    },
  },
  {
    field: "skuVariant",
    headerName: "SKU phân loại",
    width: 130,
    editable: false,
    filterable: false,
    sortable: false,
    align: "left",
    headerAlign: "left",
    renderCell: (params: GridRenderCellParams<any, any, any>) => {
      return (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {params.value.map((item: string, index: number) => (
            <p key={index}>{item ? item : "-"}</p>
          ))}
        </div>
      );
    },
  },
  {
    field: "variants",
    headerName: "Phân loại hàng",
    width: 130,
    editable: false,
    filterable: false,
    sortable: false,
    align: "left",
    headerAlign: "left",
    renderCell: (params: GridRenderCellParams<any, any, any>) => {
      const firstOptions = params.value[0]?.options;
      const secondOptions = params.value[1]?.options;
      return (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {params.value.length > 0 ? (
            firstOptions?.length > 0 && secondOptions?.length > 0 ? (
              firstOptions.map((firstOption: any) =>
                secondOptions.map((secondOption: any, index: number) => (
                  <p key={index}>
                    {firstOption.name + "," + secondOption.name}
                  </p>
                ))
              )
            ) : (
              firstOptions.map((option: any, index: number) => (
                <p key={index}>{option.name}</p>
              ))
            )
          ) : (
            <p>-</p>
          )}
        </div>
      );
    },
  },
  {
    field: "price",
    headerName: "Giá",
    type: "number",
    width: 100,
    sortable: true,
    editable: false,
    filterable: false,
    align: "left",
    headerAlign: "left",
    renderCell: (params: GridRenderCellParams<any, any, any>) => {
      return (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {params.value.map((item: number, index: number) => (
            <p key={index}>{item.toLocaleString()}</p>
          ))}
        </div>
      );
    },
  },
  {
    field: "stock",
    headerName: "Kho hàng",
    type: "number",
    width: 130,
    sortable: true,
    editable: false,
    filterable: false,
    align: "left",
    headerAlign: "left",
    renderCell: (params: GridRenderCellParams<any, any, any>) => {
      return (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {params.value.map((item: number, index: number) =>
            item > 0 ? (
              <p key={index}>{item}</p>
            ) : (
              <p key={index} style={{ color: "#ee4d2d" }}>
                Hết hàng
              </p>
            )
          )}
        </div>
      );
    },
  },
  // {
  //   field: "sold",
  //   headerName: "Đã bán",
  //   type: "number",
  //   sortable: true,
  //   editable: false,
  //   filterable: false,
  //   align: "left",
  //   headerAlign: "left",
  //   renderCell: (params: GridRenderCellParams<any, any, any>) => {
  //     return (
  //       <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
  //         {params.value.map((item: number, index: number) => (
  //           <p key={index}>
  //             {item}
  //           </p>
  //         ))}
  //       </div>
  //     );
  //   },
  // },
  {
    field: "action",
    headerName: "",
    sortable: false,
    editable: false,
    filterable: false,
    flex: 1,
    renderCell: (params: GridRenderCellParams<any, any, any>) => {
      return (
        <Link to={"/seller/product/" + params.id} style={{ color: "#1976d2" }}>
          Sửa
        </Link>
      );
    },
    align: "center",
  },
];

interface ProductInfo {
  name: string;
  image: string;
  sku: string;
}

interface Option {
  id: number;
  name: string;
}

interface Variant {
  id: number;
  name: string;
  options: Option[];
}

interface Product {
  id: number;
  info: ProductInfo;
  skuVariant: string[];
  price: number[];
  stock: number[];
  variants: Variant[];
}

interface Props {
  type: string;
}

const ProductTable: React.FC<Props> = ({ type }) => {
  const { userInfo } = useSelector((state: ReduxState) => state.userLogin);
  const [productList, setProductList] = useState<Product[]>([]);
  useEffect(() => {
    const fetchData = (token: string) => {
      if (type === "HIDE") {
        ProductServices.getHideProductSeller(token).then((response) => {
          if (response.status === 200) setProductList(response.data);
        });
      } else {
        ProductServices.getProductSeller(token).then((response) => {
          if (response.status === 200) setProductList(response.data);
        });
      }
    };

    userInfo && fetchData(userInfo.token);
  }, [userInfo, type]);

  return (
    <Container>
      {productList && productList.length > 0 ? (
        <DataGrid
          rows={productList}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          disableColumnMenu
          autoHeight
        />
      ) : null}
    </Container>
  );
};

export default ProductTable;
