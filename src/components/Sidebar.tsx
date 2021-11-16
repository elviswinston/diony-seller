import React from "react";
import styled from "styled-components";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";

const Nav = styled.div`
  background-color: #fff;
  position: fixed;
  height: 100%;
  width: 200px;
  padding: 16px;
  font-size: 14px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  color: #000;
`;

const Sidebar: React.FC = () => {
  return (
    <Nav>
      <Wrapper>
        {SidebarData.map((item, index) => {
          return <SubMenu item={item} key={index} />;
        })}
      </Wrapper>
    </Nav>
  );
};

export default Sidebar;
