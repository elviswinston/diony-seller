import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridOverlay,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import styled from "styled-components";
import { ReduxState } from "../types/ReduxState";
import { useSelector } from "react-redux";
import OrderService from "../services/order.services";
import { Box } from "@mui/material";
import useModal from "../hooks/useModal";
import OrderPrepareModal from "./OrderPrepareModal";

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

const ProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
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

const Button = styled.button`
  color: #2673dd;
  background-color: transparent;
  border-color: transparent;
  height: unset;
  min-width: unset;
  padding: 0;
  font-weight: 400;
  line-height: 24px;
  cursor: pointer;
`;

interface Item {
  name: string;
  variant: string;
  image: string;
}

interface Order {
  id: string;
  items: Item[];
  status: string;
  total: number;
}

interface Props {
  status: string;
}

function CustomNoRowsOverlay() {
  return (
    <GridOverlay>
      <Box sx={{ mt: 4 }}>Không có đơn hàng</Box>
    </GridOverlay>
  );
}

const OrderTable: React.FC<Props> = ({ status }) => {
  const { userInfo } = useSelector((state: ReduxState) => state.userLogin);
  const [orderList, setOrderList] = useState<Order[]>([]);
  const { isOpen, openModal, closeModal } = useModal();
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    if (userInfo) {
      if (status === "TO_PREPARE_PICKUP") {
        OrderService.getOrderSeller("TO_PREPARE", userInfo.token).then(
          (response) => {
            if (response.status === 200) {
              setOrderList((previous) => previous.concat(response.data));
            }
          }
        );
        OrderService.getOrderSeller("TO_PICKUP", userInfo.token).then(
          (response) => {
            if (response.status === 200) {
              setOrderList((previous) => previous.concat(response.data));
            }
          }
        );
      } else {
        OrderService.getOrderSeller(status, userInfo.token).then((response) => {
          if (response.status === 200) {
            setOrderList(response.data);
          }
        });
      }
    }
  }, [userInfo, status]);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Mã đơn hàng",
      width: 150,
      editable: false,
      filterable: false,
      sortable: false,
      renderCell: (params: GridRenderCellParams<any, any, any>) => {
        return <p>{params.value}</p>;
      },
    },
    {
      field: "items",
      headerName: "Sản phẩm",
      width: 250,
      editable: false,
      filterable: false,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Item[], any, any>) => {
        return (
          <ProductContainer>
            {params.value.map((item, index) => (
              <InfoContainer key={index}>
                <ImageBox>
                  <img alt={item.image} src={item.image} />
                </ImageBox>
                <InfoBox>
                  <span>{item.name}</span>
                  <p>{item.variant}</p>
                </InfoBox>
              </InfoContainer>
            ))}
          </ProductContainer>
        );
      },
    },
    {
      field: "total",
      headerName: "Tổng cộng",
      width: 150,
      editable: false,
      filterable: false,
      sortable: false,
      renderCell: (params: GridRenderCellParams<number, any, any>) => {
        return <p>{params.value.toLocaleString()}</p>;
      },
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      editable: false,
      filterable: false,
      sortable: false,
      renderCell: (params: GridRenderCellParams<string, any, any>) => {
        switch (params.value) {
          case "PENDING_APPROVAL":
            return <p>Chờ xác nhận</p>;
          case "TO_PREPARE":
            return <p>Chuẩn bị hàng</p>;
          case "TO_PICKUP":
            return <p>Chờ lấy hàng</p>;
          default:
            break;
        }
      },
    },
    {
      field: "action",
      headerName: "Thao tác",
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      renderCell: (params: GridRenderCellParams<any, Order, any>) => {
        switch (params.row.status) {
          case "PENDING_APPROVAL":
            return;
          case "TO_PREPARE":
            return (
              <Button
                onClick={() => {
                  openModal();
                  setOrderId(params.row.id);
                }}
              >
                Chuẩn bị hàng
              </Button>
            );
          default:
            return;
        }
      },
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <>
      {isOpen && (
        <OrderPrepareModal
          closeModal={closeModal}
          orderId={orderId}
          token={userInfo?.token}
        />
      )}
      <Container>
        <DataGrid
          rows={orderList}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          disableColumnMenu
          autoHeight
          components={{
            NoRowsOverlay: CustomNoRowsOverlay,
          }}
        />
      </Container>
    </>
  );
};
export default OrderTable;
