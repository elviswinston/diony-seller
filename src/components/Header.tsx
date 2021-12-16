import { Breadcrumbs } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components";
import breadcrums from "../config/breadcrums";
import { ReduxState } from "../types/ReduxState";

import { MdOutlineNavigateNext } from "react-icons/md"

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 56px;
  max-height: 56px;
  z-index: 10;
  background-color: #fff;
  box-shadow: 0 1px 4px 0 rgb(74 74 78 / 12%);
`;

const Content = styled.div`
  display: flex;
  min-height: 56px;
  max-height: 56px;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;

  h3 {
    font-weight: 400;
  }
`;

//const Logo = styled.div``;

const Nav = styled.div``;

const Breadcrum = styled.div`
  display: flex;
  align-items: center;

  a {
    font-size: 18px;
  }
`;

const AccountDropdown = styled.div`
  position: absolute;
  background-color: #fff;
  width: 100%;
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 10%);
  border-radius: 4px;
  display: none;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    padding: 5px 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;

    &:hover {
      background-color: rgb(0, 0, 0, 0.1);
    }
  }
`;

const Account = styled.div`
  position: relative;

  &:hover ${AccountDropdown} {
    display: block;
  }
`;

const AccountBox = styled.div`
  padding: 10px 20px;
  border-radius: 50px;
  cursor: pointer;

  p {
    font-size: 14px;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

interface Props {
  PageName: string;
}

export const Header: React.FC<Props> = ({ PageName }) => {
  const history = useHistory();
  const pathname = history.location.pathname;
  const user = useSelector((state: ReduxState) => state.userLogin.userInfo);

  return (
    <Container>
      <Content>
        <Breadcrum>
          <Breadcrumbs separator={<MdOutlineNavigateNext fontSize="24px"/>} aria-label="breadcrumb">
            {PageName === "Home" || PageName === "Login" ? (
              <Link to={"/"}>Kênh người bán</Link>
            ) : (
              <Link to={"/"}>Trang chủ</Link>
            )}
            {(pathname === "/seller/category" ||
              pathname.includes("product")) && (
              <Link to={"/seller/product/list/all"}>Sản phẩm</Link>
            )}
            {/\d/.test(pathname) && pathname.includes("product") && (
              <Link to={pathname}>Chi tiết sản phẩm</Link>
            )}
            {breadcrums
              .filter((item) => item.path === pathname)
              .map((item, index) => (
                <Link key={index} to={item.path}>
                  {item.name}
                </Link>
              ))}
          </Breadcrumbs>
        </Breadcrum>
        <Nav>
          {PageName === "Home" && (
            <Account>
              <AccountBox>
                <p>{user?.username}</p>
              </AccountBox>
              <AccountDropdown>
                <ul>
                  <li>
                    <Link to="/seller/settings/shop/profile">Hồ sơ shop</Link>
                  </li>
                  <li>
                    <span
                      onClick={() => {
                        localStorage.removeItem("userInfo");
                        history.push("/account/login");
                      }}
                    >
                      Đăng xuất
                    </span>
                  </li>
                </ul>
              </AccountDropdown>
            </Account>
          )}
        </Nav>
      </Content>
    </Container>
  );
};
