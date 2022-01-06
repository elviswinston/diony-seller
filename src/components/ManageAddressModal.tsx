import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { AiOutlineClose } from "react-icons/ai";
import styled from "styled-components";
import useLocationForm from "../hooks/useLocationForm";
import Select from "react-select";
import * as Yup from "yup";
import {
  AddressAddRequest,
  AddressResponse,
  AddressUpdateRequest,
} from "../types/Address";
import UserService from "../services/user.services";
import { useSelector } from "react-redux";
import { ReduxState } from "../types/ReduxState";

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

  &::-webkit-scrollbar {
    display: none;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const FormInput = styled.div`
  margin-top: 10px;

  label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
  }

  input,
  textarea {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px 10px;
    outline: none;
    width: 100%;
  }

  textarea {
    max-width: 100%;
    min-width: 100%;
    max-height: 200px;
    min-height: 100px;
  }
`;

const ErrorSpan = styled.span`
  font-size: 14px;
  color: #ff4742;
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

const AddressLabel = styled.div`
  margin-top: 10px;
  font-size: 14px;
`;

const Checkbox = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;

  label {
    margin-left: 5px;
    cursor: pointer;
  }
`;

interface Props {
  closeModal: any;
  address?: AddressResponse;
  setAddress: any;
  setAddresses: any;
}

const intialValues = {
  customerName: "",
  phoneNumber: "",
  provinceId: 0,
  districtId: 0,
  wardCode: "",
  provinceName: "",
  districtName: "",
  wardName: "",
  detail: "",
  isDefault: false,
  isPickup: false,
  isReturn: false,
};

const AddressSchema = Yup.object().shape({
  customerName: Yup.string().required("Không được để trống"),
  phoneNumber: Yup.string().required("Không được để trống"),
  provinceName: Yup.string().required("Không được để trống"),
  districtName: Yup.string().required("Không được để trống"),
  wardName: Yup.string().required("Không được để trống"),
  detail: Yup.string().required("Không được để trống"),
});

const ManageAddressModal: React.FC<Props> = ({
  closeModal,
  address,
  setAddress,
  setAddresses,
}) => {
  const {
    state,
    fetchDistrict,
    fetchWard,
    onSelectProvince,
    onSelectDistrict,
    onSelectWard,
    updateAddress,
  } = useLocationForm();
  const {
    ProvinceOptions,
    DistrictOptions,
    WardOptions,
    SelectedProvince,
    SelectedDistrict,
    SelectedWard,
  } = state;
  const [isLoaded, setIsLoaded] = useState(false);
  const userInfo = useSelector((state: ReduxState) => state.userLogin.userInfo);

  useEffect(() => {
    if (address && !isLoaded) {
      intialValues.customerName = address.customerName;
      intialValues.phoneNumber = address.phoneNumber;
      intialValues.districtId = address.districtId;
      intialValues.provinceId = address.provinceId;
      intialValues.wardCode = address.wardCode;
      intialValues.districtName = address.districtName;
      intialValues.provinceName = address.provinceName;
      intialValues.wardName = address.wardName;
      intialValues.detail = address.detail;
      intialValues.isDefault = address.isDefault;
      intialValues.isPickup = address.isPickup;
      intialValues.isReturn = address.isReturn;

      updateAddress(address.provinceId, address.districtId, address.wardCode);
      setIsLoaded(true);
    }
  }, [address, isLoaded, updateAddress]);

  const modal = (
    <Overlay>
      <Container>
        <Box>
          <BoxHeader>
            {address ? <h3>Sửa địa chỉ</h3> : <h3>Thêm địa chỉ mới</h3>}
            <AiOutlineClose
              onClick={() => {
                setAddress(null);
                intialValues.customerName = "";
                intialValues.phoneNumber = "";
                intialValues.detail = "";
                intialValues.isDefault = false;
                intialValues.isPickup = false;
                intialValues.isReturn = false;
                closeModal();
              }}
            />
          </BoxHeader>
          <BoxContent>
            <Formik
              initialValues={intialValues}
              onSubmit={(value) => {
                if (address) {
                  const request: AddressUpdateRequest = {
                    ...value,
                    id: address.id,
                  };
                  userInfo &&
                    UserService.updateAddressSeller(
                      request,
                      userInfo.token
                    ).then((response) => {
                      if (response.status === 200) {
                        UserService.getAddress(userInfo.token).then(
                          (response) => {
                            setAddresses(response.data);
                            closeModal();
                          }
                        );
                      }
                    });
                } else {
                  const request: AddressAddRequest = value;
                  userInfo &&
                    UserService.addAddressSeller(request, userInfo.token).then(
                      (response) => {
                        if (response.status === 200) {
                          UserService.getAddress(userInfo.token).then(
                            (response) => {
                              setAddresses(response.data);
                              closeModal();
                            }
                          );
                        }
                      }
                    );
                }
              }}
              validationSchema={AddressSchema}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({ errors, setFieldValue, values }) => (
                <Form autoComplete="off">
                  <FormInput>
                    <label htmlFor="customerName">Họ và tên</label>
                    <Field
                      type="text"
                      name="customerName"
                      placeholder="Nhập vào"
                    />
                    {errors.customerName && (
                      <ErrorSpan>{errors.customerName}</ErrorSpan>
                    )}
                  </FormInput>
                  <FormInput>
                    <label htmlFor="phoneNumber">Số điện thoại</label>
                    <Field
                      type="text"
                      name="phoneNumber"
                      placeholder="Nhập vào"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        e.preventDefault();
                        const regex = /^[0-9\b]+$/;
                        if (regex.test(e.target.value.toString())) {
                          setFieldValue("phoneNumber", e.target.value);
                        }
                      }}
                    />
                    {errors.phoneNumber && (
                      <ErrorSpan>{errors.phoneNumber}</ErrorSpan>
                    )}
                  </FormInput>
                  <AddressLabel>Địa chỉ</AddressLabel>
                  <FormInput>
                    <Select
                      name="province"
                      options={ProvinceOptions}
                      isDisabled={ProvinceOptions.length === 0}
                      placeholder="Tỉnh/Thành phố"
                      onChange={(e) => {
                        fetchDistrict(e?.value!);
                        onSelectProvince(e?.value!);
                        setFieldValue("provinceId", e?.value);
                        setFieldValue("provinceName", e?.label);
                        setFieldValue("districtName", "");
                        setFieldValue("wardName", "");
                      }}
                      value={SelectedProvince ? SelectedProvince : null}
                    />
                    {errors.provinceName && (
                      <ErrorSpan>{errors.provinceName}</ErrorSpan>
                    )}
                  </FormInput>
                  <FormInput>
                    <Select
                      name="district"
                      options={DistrictOptions}
                      isDisabled={DistrictOptions.length === 0}
                      placeholder="Quận/Huyện"
                      onChange={(e) => {
                        fetchWard(e?.value!);
                        onSelectDistrict(e?.value!);
                        setFieldValue("districtId", e?.value);
                        setFieldValue("districtName", e?.label);
                        setFieldValue("wardName", "");
                      }}
                      value={SelectedDistrict ? SelectedDistrict : null}
                    />
                    {errors.districtName && (
                      <ErrorSpan>{errors.districtName}</ErrorSpan>
                    )}
                  </FormInput>
                  <FormInput>
                    <Select
                      name="ward"
                      options={WardOptions}
                      isDisabled={WardOptions.length === 0}
                      placeholder="Phường/Xã"
                      onChange={(e) => {
                        onSelectWard(e?.value!);
                        setFieldValue("wardCode", e?.value);
                        setFieldValue("wardName", e?.label);
                      }}
                      value={SelectedWard ? SelectedWard : null}
                    />
                    {errors.wardName && (
                      <ErrorSpan>{errors.wardName}</ErrorSpan>
                    )}
                  </FormInput>
                  <FormInput>
                    <label htmlFor="detail">Địa chỉ chi tiết</label>
                    <Field as="textarea" name="detail" />
                    {errors.detail && <ErrorSpan>{errors.detail}</ErrorSpan>}
                  </FormInput>
                  <Checkbox>
                    <Field
                      type="checkbox"
                      name="isDefault"
                      id="default"
                      disabled={address ? address.isDefault : false}
                      checked={values.isDefault}
                    />
                    <label htmlFor="default">Đặt làm địa chỉ mặc định</label>
                  </Checkbox>
                  <Checkbox>
                    <Field
                      type="checkbox"
                      name="isPickup"
                      id="pickup"
                      disabled={address ? address.isPickup : false}
                      checked={values.isPickup}
                    />
                    <label htmlFor="pickup">Đặt làm địa chỉ lấy hàng</label>
                  </Checkbox>
                  <Checkbox>
                    <Field
                      type="checkbox"
                      name="isReturn"
                      id="return"
                      disabled={address ? address.isReturn : false}
                      checked={values.isReturn}
                    />
                    <label htmlFor="return">Đặt làm địa chỉ trả hàng</label>
                  </Checkbox>
                  <div style={{ textAlign: "center" }}>
                    <Button type="submit">{address ? "Lưu" : "Thêm"}</Button>
                  </div>
                </Form>
              )}
            </Formik>
          </BoxContent>
        </Box>
      </Container>
    </Overlay>
  );

  return ReactDOM.createPortal(modal, document.body);
};

export default ManageAddressModal;
