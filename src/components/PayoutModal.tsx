import React, { useEffect } from "react";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";
import ReactDOM from "react-dom";

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
  height: 400px;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const MoneyInput = styled.input`
  outline: none;
  border-radius: 4px;
  border: 1px solid #ccc;
  padding: 4px 8px;
`;

interface Props {
  closeModal: any;
}

const PayoutModal: React.FC<Props> = ({ closeModal }) => {
  const markup = `<span id="lippButton"></span>`;

  // useEffect(() => {
  //   const script = document.createElement("script");
  //   const paypalScript = document.createElement("script");

  //   script.src = "https://www.paypalobjects.com/js/external/api.js";
  //   script.async = false;

  //   paypalScript.src = "../templates/paypal.js";
  //   paypalScript.async = false;

  //   document.body.appendChild(script);
  //   document.body.appendChild(paypalScript);

  //   return () => {
  //     document.body.removeChild(script);
  //     document.body.removeChild(paypalScript);
  //   };
  // }, []);

  const modal = (
    <Overlay>
      <Container>
        <Box>
          <BoxHeader>
            <h3>Rút tiền</h3>
            <AiOutlineClose onClick={closeModal} />
          </BoxHeader>
          <BoxContent>
            <a href="/paypal.html" target="_blank">
              Đăng nhập với Paypal
            </a>
          </BoxContent>
        </Box>
      </Container>
    </Overlay>
  );

  return ReactDOM.createPortal(modal, document.body);
};

export default PayoutModal;
