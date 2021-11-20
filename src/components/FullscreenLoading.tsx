import React from "react";
import styled from "styled-components";

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

const FullscreenLoading = () => {
  return <Container>Loading</Container>;
};

export default FullscreenLoading;
