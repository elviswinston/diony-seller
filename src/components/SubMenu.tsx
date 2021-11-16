import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { SidebarItem } from "../types/SidebarItem";

type SidebarLinkProps = {
  item: SidebarItem;
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
  margin: 10px 0;
  font-weight: 500;

  &:hover .caret {
    color: #ff5722;
  }
`;

const Label = styled.span`
  margin-left: 5px;
`;

const DropdownLink = styled(Link)`
  padding-left: 14px;
  margin-bottom: 10px;

  &:hover {
    color: #ff5722;
  }
`;

const SubMenu: React.FC<SidebarLinkProps> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(true);
  const open = () => setIsOpen(!isOpen);

  return (
    <>
      <Container onClick={open}>
        <div>
          {item.icon}
          <Label>{item.title}</Label>
        </div>
        <div className="caret">
          {item?.subnav && isOpen ? item?.iconOpened : item?.iconClosed}
        </div>
      </Container>
      {isOpen &&
        item?.subnav?.map((item, index) => (
          <DropdownLink to={item.path} key={index}>
            {item.icon}
            <Label>{item.title}</Label>
          </DropdownLink>
        ))}
    </>
  );
};

export default SubMenu;
