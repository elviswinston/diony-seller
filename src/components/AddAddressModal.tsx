import { Field, Form, Formik } from "formik";
import React from "react";
import Select from "react-select";

import styled from "styled-components";
import useLocationForm from "../hooks/useLocationForm";

import * as Yup from "yup";

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  z-index: 10000;
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  display: grid;
  place-items: center;
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
  h3 {
    font-weight: 400;
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
`;

const FormInput = styled.div`
  margin-top: 10px;

  label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
  }

  input[type="text"],
  select,
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

const AddressLabel = styled.div`
  margin-top: 10px;
  font-size: 14px;
`;

const AddButton = styled.button`
  margin-top: 10px;
  outline: none;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  background-color: #ee4d2d;
  color: #fff;
  cursor: pointer;
`;

const ErrorSpan = styled.span`
  font-size: 14px;
  color: #ff4742;
`;

const AddressSchema = Yup.object().shape({
  name: Yup.string().required("Không được để trống"),
  phone: Yup.string().required("Không được để trống"),
  addressDetail: Yup.string().required("Không được để trống"),
  provinceName: Yup.string().required("Không được để trống"),
  districtName: Yup.string().required("Không được để trống"),
  wardName: Yup.string().required("Không được để trống"),
});

const AddAddressModal: React.FC = () => {
  const { state, fetchDistrict, fetchWard, onSelectDistrict, onSelectWard } =
    useLocationForm();
  const {
    ProvinceOptions,
    DistrictOptions,
    WardOptions,
    SelectedDistrict,
    SelectedWard,
  } = state;

  return (
    <Overlay>
      <Container>
        <Box>
          <BoxHeader>
            <h3>Thêm địa chỉ mới</h3>
          </BoxHeader>
          <BoxContent>
            <Formik
              initialValues={{
                name: "",
                phone: "",
                provinceId: "",
                districtId: "",
                wardCode: "",
                provinceName: "",
                districtName: "",
                wardName: "",
                addressDetail: "",
              }}
              onSubmit={(value) => {
                console.log(value);
              }}
              validationSchema={AddressSchema}
            >
              {({ errors, setFieldValue }) => (
                <Form autoComplete="off">
                  <FormInput>
                    <label htmlFor="name">Họ và tên</label>
                    <Field type="text" name="name" placeholder="Nhập vào" />
                    {errors.name && <ErrorSpan>{errors.name}</ErrorSpan>}
                  </FormInput>
                  <FormInput>
                    <label htmlFor="phone">Số điện thoại</label>
                    <Field type="text" name="phone" placeholder="Nhập vào" />
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
                        setFieldValue("provinceId", e?.value);
                        setFieldValue("provinceName", e?.label);
                      }}
                    />
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
                      }}
                      value={SelectedDistrict ? SelectedDistrict : null}
                    />
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
                        setFieldValue("WardName", e?.label);
                      }}
                      value={SelectedWard ? SelectedWard : null}
                    />
                  </FormInput>
                  <FormInput>
                    <label htmlFor="addressDetail">Địa chỉ chi tiết</label>
                    <Field as="textarea" name="addressDetail" />
                  </FormInput>
                  <div style={{ textAlign: "center" }}>
                    <AddButton type="submit">Thêm</AddButton>
                  </div>
                </Form>
              )}
            </Formik>
          </BoxContent>
        </Box>
      </Container>
    </Overlay>
  );
};

export default AddAddressModal;
