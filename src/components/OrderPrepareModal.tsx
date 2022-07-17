import React, { useState } from "react";
import ReactDOM from "react-dom";
import { AiOutlineClose } from "react-icons/ai";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import OrderService from "../services/order.services";

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  z-index: 10000;
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  display: grid;
  place-items: center;
  top: 0;
  left: 0;
`;

const Container = styled.div``;

const Box = styled.div`
  background-color: #fff;
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 10%);
  border-radius: 4px;
  padding: 20px;
  width: 500px;
`;

const BoxHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    font-weight: 400;
  }

  svg {
    cursor: pointer;
  }
`;

const BoxContent = styled.div`
  max-height: 80vh;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  row-gap: 20px;

  &::-webkit-scrollbar {
    display: none;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const Button = styled.button`
  margin-top: 10px;
  outline: none;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  background-color: #ee4d2d;
  color: #fff;
  cursor: pointer;
`;

interface Props {
  closeModal: any;
  orderId: string;
  token?: string;
}

const OrderPrepareModal: React.FC<Props> = ({ closeModal, orderId, token }) => {
  const [prepareDate, setPrepareDate] = useState<Date>(new Date());

  const modal = (
    <Overlay>
      <Container>
        <Box>
          <BoxHeader>
            <h3>Chọn thời gian lấy hàng</h3>
            <AiOutlineClose onClick={() => closeModal()} />
          </BoxHeader>
          <BoxContent>
            <div>
              <DatePicker
                selected={prepareDate}
                onChange={(date: Date) => setPrepareDate(date)}
              />
            </div>
            <div>
              <Button
                onClick={() => {
                  if (prepareDate < new Date()) {
                    alert("Ngày chuẩn bị phải lớn hơn ngày hiện tại");
                  } else {
                    token &&
                      OrderService.prepareOrder(
                        orderId,
                        token,
                        prepareDate.toLocaleDateString("en-US", { day: 'numeric' })+ "-"+ prepareDate.toLocaleDateString("en-US", { month: 'short' })+ "-" + prepareDate.toLocaleDateString("en-US", { year: 'numeric' })
                      ).then((response) => {
                        if (response.status === 200) {
                          alert("Chuẩn bị hàng thành công");
                          closeModal();
                        }
                      });
                  }
                }}
              >
                Xác nhận
              </Button>
            </div>
          </BoxContent>
        </Box>
      </Container>
    </Overlay>
  );

  return ReactDOM.createPortal(modal, document.body);
};

export default OrderPrepareModal;
