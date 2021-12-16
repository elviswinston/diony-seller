import { CircularProgress } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  top: 0;
  left: 0;
  z-index: 999;
  display: grid;
  place-items: center;
`;

const Container = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #fff;
  top: 0;
  left: 0;
  z-index: 999;
  display: grid;
  place-items: center;
`;

interface Props {
  Type: string;
}

const FullscreenLoading: React.FC<Props> = ({ Type }) => {
  const loading =
    Type === "Overlay" ? (
      <Overlay>
        <CircularProgress />
      </Overlay>
    ) : (
      <Container>Loading</Container>
    );
  return ReactDOM.createPortal(loading, document.body);
};

export default FullscreenLoading;
