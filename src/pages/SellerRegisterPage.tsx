import React from "react";
import IPage from "../types/IPage";

import styled from "styled-components";
import { Field, Form, Formik } from "formik";
import AddAddressModal from "../components/AddAddressModal";

const Container = styled.div`
  height: 100%;
  position: relative;
  background-color: #f6f6f6;
  display: grid;
  place-items: center;
`;

const Box = styled.div`
  width: 50%;
  background-color: #fff;
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 10%);
  border-radius: 4px;
  display: grid;
  place-items: center;
  padding: 40px 0;

  form {
    margin-top: 10px;
    width: 50%;
    text-align: center;
  }
`;

const BoxInfo = styled.div`
  text-align: center;

  h3 {
    font-weight: 500;
    margin-bottom: 1rem;
  }
`;

const FormInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;

  label {
    flex: 1;
    text-align: right;
    margin-right: 10px;
  }

  input[type="text"] {
    flex: 2;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 5px 10px;
    outline: none;
  }
`;

const RegisterButton = styled.button`
  margin-top: 20px;
  outline: none;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  background-color: #ee4d2d;
  color: #fff;
  cursor: pointer;
`;

interface RegisterSeller {
  shopName: string;
}

const SellerRegisterPage: React.FC<IPage> = (props) => {
  return (
    <Container>
      <AddAddressModal />
      <Box>
        <BoxInfo>
          <h3>Chào mừng đến Diony!</h3>
          <p>
            Để đăng ký bán hàng trên Diony, bạn cần cung cấp một số thông tin cơ
            bản
          </p>
        </BoxInfo>
        <Formik
          initialValues={{ shopName: "" }}
          onSubmit={(value: RegisterSeller) => {
            console.log("asd");
          }}
        >
          <Form autoComplete="off">
            <FormInput>
              <label htmlFor="shopname">Tên Shop</label>
              <Field type="text" name="shopname" />
            </FormInput>
            <FormInput>
              <label>Địa chi lấy hàng</label>
            </FormInput>
            <FormInput>
              <label htmlFor="email">Email</label>
              <Field type="text" name="email" disabled />
            </FormInput>
            <FormInput>
              <label htmlFor="phone">Số điện thoại</label>
              <Field type="text" name="phone" disabled />
            </FormInput>
            <RegisterButton>Đăng ký</RegisterButton>
          </Form>
        </Formik>
      </Box>
    </Container>
  );
};

export default SellerRegisterPage;
