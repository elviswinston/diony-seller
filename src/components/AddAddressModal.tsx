import { Field, Form, Formik } from "formik";
import React from "react";
import Select from "react-select";

import styled from "styled-components";
import useLocationForm from "../hooks/useLocationForm";

import * as Yup from "yup";
import ReactDOM from "react-dom";
import { AiOutlineClose } from "react-icons/ai";
import { Address } from "../types/Address";

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

interface Props {
  closeModal: any;
  setAddAddress: any;
}

const intialValues: Address = {
  customerName: "",
  phoneNumber: "",
  provinceId: 0,
  districtId: 0,
  wardCode: "",
  provinceName: "",
  districtName: "",
  wardName: "",
  detail: "",
  isDefault: true,
};

const AddressSchema = Yup.object().shape({
  customerName: Yup.string().required("Kh??ng ???????c ????? tr???ng"),
  phoneNumber: Yup.string().required("Kh??ng ???????c ????? tr???ng"),
  provinceName: Yup.string().required("Kh??ng ???????c ????? tr???ng"),
  districtName: Yup.string().required("Kh??ng ???????c ????? tr???ng"),
  wardName: Yup.string().required("Kh??ng ???????c ????? tr???ng"),
  detail: Yup.string().required("Kh??ng ???????c ????? tr???ng"),
});

const AddAddressModal: React.FC<Props> = ({ closeModal, setAddAddress }) => {
  const { state, fetchDistrict, fetchWard, onSelectDistrict, onSelectWard } =
    useLocationForm();

  const {
    ProvinceOptions,
    DistrictOptions,
    WardOptions,
    SelectedDistrict,
    SelectedWard,
  } = state;
  const modal = (
    <Overlay>
      <Container>
        <Box>
          <BoxHeader>
            <h3>Th??m ?????a ch??? m???i</h3>
            <AiOutlineClose onClick={closeModal} />
          </BoxHeader>
          <BoxContent>
            <Formik
              initialValues={intialValues}
              onSubmit={(value) => {
                setAddAddress(value);
                closeModal();
              }}
              validationSchema={AddressSchema}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({ errors, setFieldValue }) => (
                <Form autoComplete="off">
                  <FormInput>
                    <label htmlFor="customerName">H??? v?? t??n</label>
                    <Field
                      type="text"
                      name="customerName"
                      placeholder="Nh???p v??o"
                    />
                    {errors.customerName && (
                      <ErrorSpan>{errors.customerName}</ErrorSpan>
                    )}
                  </FormInput>
                  <FormInput>
                    <label htmlFor="phoneNumber">S??? ??i???n tho???i</label>
                    <Field
                      type="number"
                      pattern="[0,9]*"
                      name="phoneNumber"
                      placeholder="Nh???p v??o"
                    />
                    {errors.phoneNumber && (
                      <ErrorSpan>{errors.phoneNumber}</ErrorSpan>
                    )}
                  </FormInput>
                  <AddressLabel>?????a ch???</AddressLabel>
                  <FormInput>
                    <Select
                      name="province"
                      options={ProvinceOptions}
                      isDisabled={ProvinceOptions.length === 0}
                      placeholder="T???nh/Th??nh ph???"
                      onChange={(e) => {
                        fetchDistrict(e?.value!);
                        setFieldValue("provinceId", e?.value);
                        setFieldValue("provinceName", e?.label);
                      }}
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
                      placeholder="Qu???n/Huy???n"
                      onChange={(e) => {
                        fetchWard(e?.value!);
                        onSelectDistrict(e?.value!);
                        setFieldValue("districtId", e?.value);
                        setFieldValue("districtName", e?.label);
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
                      placeholder="Ph?????ng/X??"
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
                    <label htmlFor="detail">?????a ch??? chi ti???t</label>
                    <Field as="textarea" name="detail" />
                    {errors.detail && <ErrorSpan>{errors.detail}</ErrorSpan>}
                  </FormInput>
                  <div style={{ textAlign: "center" }}>
                    <AddButton type="submit">Th??m</AddButton>
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

export default AddAddressModal;
