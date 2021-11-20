import styled from "styled-components";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import useModal from "../hooks/useModal";
import AddAddressModal from "./AddAddressModal";
import { Address } from "../types/Address";
import { useDispatch, useSelector } from "react-redux";
import { ReduxState } from "../types/ReduxState";
import * as Yup from "yup";
import UserService from "../services/user.services";
import { AppDispatch } from "../store";
import { setStatusSeller } from "../actions/userActions";

const FormInput = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 20px;
  column-gap: 10px;

  label {
    flex: 1;
    text-align: right;
  }

  input[type="text"] {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 5px 10px;
    outline: none;
  }
`;

const InputWrap = styled.div`
  flex: 2;
  text-align: left;
`;

const ErrorSpan = styled.span`
  display: block;
  font-size: 14px;
  color: #ff4742;
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

const AddAddressButton = styled.button`
  outline: none;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  background-color: #d9d9d9;
`;

const AddressContainer = styled.div`
  display: flex;
`;

interface RegisterSeller {
  shopName: string;
}

const RegisterSchema = Yup.object().shape({
  shopName: Yup.string().required("Không được để trống"),
});

const SellerRegisterForm: React.FC = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const [addAddress, setAddAddress] = useState<Address>();
  const { userInfo } = useSelector((state: ReduxState) => state.userLogin);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      {isOpen && (
        <AddAddressModal
          closeModal={closeModal}
          setAddAddress={setAddAddress}
        />
      )}
      <Formik
        initialValues={{ shopName: "" }}
        onSubmit={(value: RegisterSeller) => {
          if (!addAddress) alert("Chưa chọn địa chỉ");
          else {
            userInfo &&
              UserService.registerSeller(
                addAddress,
                value.shopName,
                userInfo?.id!
              ).then(() => {
                dispatch(setStatusSeller({ ...userInfo, isSeller: true }));
                window.location.href = window.location.origin;
              });
          }
        }}
        validationSchema={RegisterSchema}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ errors }) => (
          <Form autoComplete="off">
            <FormInput>
              <label htmlFor="shopName">Tên Shop</label>
              <InputWrap>
                <Field type="text" name="shopName" />
                {errors.shopName && <ErrorSpan>{errors.shopName}</ErrorSpan>}
              </InputWrap>
            </FormInput>
            <FormInput>
              <label>Địa chi lấy hàng</label>
              <InputWrap>
                {addAddress ? (
                  <AddressContainer>
                    <div>
                      <p>{addAddress.customerName}</p>
                      <p>{addAddress.phoneNumber}</p>
                      <p>{addAddress.detail}</p>
                      <p>{addAddress.provinceName}</p>
                      <p>{addAddress.districtName}</p>
                      <p>{addAddress.wardName}</p>
                    </div>
                    <div>
                      <AddAddressButton type="button" onClick={openModal}>
                        Sửa
                      </AddAddressButton>
                    </div>
                  </AddressContainer>
                ) : (
                  <AddAddressButton type="button" onClick={openModal}>
                    Thêm
                  </AddAddressButton>
                )}
              </InputWrap>
            </FormInput>
            <FormInput>
              <label htmlFor="email">Email</label>
              <InputWrap>
                <Field
                  type="text"
                  name="email"
                  disabled
                  value={userInfo?.email}
                />
              </InputWrap>
            </FormInput>
            <FormInput>
              <label htmlFor="phone">Số điện thoại</label>
              <InputWrap>
                <Field
                  type="text"
                  name="phone"
                  disabled
                  value={userInfo?.phoneNumber}
                />
              </InputWrap>
            </FormInput>
            <RegisterButton type="submit">Đăng ký</RegisterButton>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SellerRegisterForm;
