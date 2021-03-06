import React, { useEffect, useState } from "react";
import ProductServices from "../services/product.services";
import { ProductResponse } from "../types/Product";

import * as Yup from "yup";
import config from "../config/config";
import styled from "styled-components";
import {
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import { Field, Form, Formik } from "formik";
import ImageUpload from "../components/ImageUpload";
import { Category, SelectProperty, TypingProperty } from "../types/Category";
import Select from "react-select";
import useLoading from "../hooks/useLoading";
import { useHistory } from "react-router-dom";
import FullscreenLoading from "../components/FullscreenLoading";
import CategoryServices from "../services/category.services";
import { Alert, AlertColor, Snackbar } from "@mui/material";
import { ReduxState } from "../types/ReduxState";
import { useSelector } from "react-redux";

const Container = styled.div`
  display: grid;
  grid-gap: 30px;
  place-items: center;
  padding: 86px 0 50px 0;
`;

const Box = styled.section`
  background-color: #fff;
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 10%);
  border-radius: 4px;
  padding: 25px 40px;
  width: 60%;
`;

const BoxHeader = styled.div`
  margin-bottom: 30px;
`;

const BoxContent = styled.div`
  p,
  label {
    font-size: 14px;
  }

  input[type="text"],
  input[type="number"],
  textarea {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px 10px;
    outline: none;
    width: 100%;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  textarea {
    resize: none;
    height: 150px;
  }
`;

const BasicGridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 5fr;
  row-gap: 40px;
  column-gap: 20px;

  label {
    text-align: right;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 40px;
`;

const EditRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-gap: 20px;
  align-items: center;

  label {
    text-align: right;
  }
`;

const SizeRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 10px;
  width: 50%;
`;

const UploadContainer = styled.div`
  display: flex;
  gap: 15px;
`;

const SaveButton = styled.button`
  outline: none;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  background-color: #ee4d2d;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  display: inline-block;
`;

const InputArea = styled.div`
  position: relative;
`;

const ErrorMessage = styled.div`
  position: absolute;
  top: -32px;
  left: 0;
  font-size: 12px;
  background-color: #ee4d2d;
  color: #fff;
  padding: 2px 10px;
  border-radius: 4px;

  &::after {
    border-color: #ee4d2d transparent transparent;
    border-width: 6px 8px;
    content: "";
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    top: 100%;
    left: 16px;
    bottom: 1px;
  }
`;

const AddVariantButton = styled.button`
  width: 70%;
  height: 40px;
  color: #1791f2;
  border: 1px dashed #1791f2;
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #ddf2ff;
  }

  span {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 10px;
  }
`;

const VariantPanel = styled.div`
  width: 70%;
  padding: 30px 15px;
  background-color: #fafafa;
  position: relative;
  border-radius: 4px;

  .close-button {
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;

    &:hover {
      fill: #ee4d2d;
    }
  }
`;

const VariantPanelAction = styled.div`
  svg {
    cursor: pointer;

    &:hover {
      fill: #000;
    }
  }
`;

const VariantPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 15px;
`;

const OptionContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr 0.5fr;
  column-gap: 10px;
  align-items: center;

  label {
    color: #999;
    text-align: left;
  }
`;

const Table = styled.div`
  width: 100%;

  input[type="text"],
  input[type="number"] {
    border: none;
    text-align: center;
    padding: 0;
    margin: 0;
    line-height: 18.5px;
  }
`;

const TableCell = styled.div`
  flex: 1;
  text-align: center;
  padding: 10px 0;
  border: 1px solid #ebebeb;
  border-right-width: 0;
  border-bottom-width: 0;
`;

const TableHeader = styled.div`
  display: flex;
  background-color: #fafafa;

  ${TableCell} {
    &:last-child {
      border-right-width: 1px;
    }
  }
`;

const TableContent = styled.div`
  display: flex;

  ${TableCell} {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const TableRow = styled.div`
  display: flex;

  &:last-child {
    ${TableCell} {
      border-bottom-width: 1px;
    }
  }
`;

const TableContentLeft = styled.div<{ hasSecondVariant: boolean }>`
  flex: ${(props) => (props.hasSecondVariant ? 2 : 1)};
`;

const TableContentRight = styled.div`
  flex: 3;

  ${TableRow} {
    ${TableCell} {
      &:last-child {
        border-right-width: 1px;
      }
    }
  }
`;

const CellGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 10px;
`;

const HideButton = styled.button`
  outline: none;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  background-color: #ccc;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  display: inline-block;
`;
const UnhideButton = styled.button`
  outline: none;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  background-color: #ccc;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  display: inline-block;
`;

interface PageProps {
  productId: number;
}

interface Variant {
  name?: string;
  options: string[];
}

interface InitialValues {
  productName: string;
  description: string;
  price?: number;
  stock?: number;
  weight: number;
  height: number;
  width: number;
  length: number;
  sku: string;
  firstVariant: Variant;
  secondVariant: Variant;
  combinations: { price: number; stock: number; sku: string }[];
  hasSecondVariant: boolean;
  typingProperties: ProductTyping[];
  selectProperties: ProductSelect[];
}

interface CategoryInfo {
  category: Category;
  cateLink: string;
}

interface ProductSelect {
  id: number;
  valueIDs: number[];
}

interface ProductTyping {
  id: number;
  value: string;
}

const UpdateProductPage: React.FC<PageProps> = ({ productId }) => {
  const [initialValues, setInitialValues] = useState<InitialValues>({
    productName: "",
    description: "",
    price: 0,
    stock: 0,
    weight: 0,
    height: 0,
    width: 0,
    length: 0,
    sku: "",
    firstVariant: { options: [] },
    secondVariant: { options: [] },
    combinations: [],
    hasSecondVariant: false,
    typingProperties: [],
    selectProperties: [],
  });

  const [hasVariant, setHasVariant] = useState(false);
  const [hasSecondVariant, setHasSecondVariant] = useState(false);
  const [images, setImages] = useState<{ id: number; file: File }[]>([]);
  const [selectProps, setSelectProps] = useState<SelectProperty[]>([]);
  const [typingProps, setTypingProps] = useState<TypingProperty[]>([]);
  const [cateLink, setCateLink] = useState("");
  const [product, setProduct] = useState<ProductResponse>();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<AlertColor>();

  const userInfo = useSelector((state: ReduxState) => state.userLogin.userInfo);

  useEffect(() => {
    const createImage = (url: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
        image.src = url;
      });

    async function toFile(imageSrc: string) {
      const image = await createImage(imageSrc);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      ctx?.drawImage(image, image.width, image.height);

      return new Promise<File>((resolve) => {
        canvas.toBlob((file) => {
          file && resolve(new File([file], imageSrc));
        }, "image/jpeg");
      });
    }

    const fetchValues = (productId: number) => {
      ProductServices.getValues(productId).then((response) => {
        if (response.status === 200) {
          setInitialValues((prev) => ({
            ...prev,
            selectProperties: response.data.selectValues,
            typingProperties: response.data.typingValues,
          }));
          fetchProductInfo();
        }
      });
    };

    const fetchProperties = (categoryId: number) => {
      CategoryServices.getSelectProperties(categoryId).then((response) => {
        setSelectProps(response.data);
      });

      CategoryServices.getTypingProperties(categoryId).then((response) => {
        setTypingProps(response.data);
      });
    };

    const fetchProductInfo = () => {
      ProductServices.getProductInfo(productId).then(async (response) => {
        const data: ProductResponse = response.data;
        setInitialValues((previous) => ({
          ...previous,
          productName: data.name,
          description: data.description,
          price: data.combinations.length > 0 ? 0 : data.price,
          stock: data.combinations.length > 0 ? 0 : data.stock,
          weight: data.weight,
          height: data.height,
          width: data.width,
          length: data.length,
          sku: data.sku,
          firstVariant:
            data.variants.length > 0
              ? {
                  name: data.variants[0].name,
                  options: data.variants[0].options.map((o) => o.name),
                }
              : {
                  options: [],
                },
          secondVariant:
            data.variants.length > 1
              ? {
                  name: data.variants[1].name,
                  options: data.variants[1].options.map((o) => o.name),
                }
              : { options: [] },
          combinations: data.combinations,
        }));
        if (data.variants.length > 0) {
          setHasVariant(true);
          if (data.variants.length === 2) {
            setHasSecondVariant(true);
          }
        }
        setProduct(data);
        var coverImage = await toFile(data.coverImage);
        setImages((previous) => [...previous, { id: 0, file: coverImage }]);
        fetchProperties(data.categoryId);
      });
    };

    const fetchCategoryInfo = () => {
      ProductServices.getCategoryInfo(productId).then((response) => {
        const data: CategoryInfo = response.data;
        setCateLink(data.cateLink);
      });
    };
    fetchValues(productId);

    fetchCategoryInfo();
  }, [productId]);

  let imgUpload: number[] = [];
  for (let index = 0; index < config.defaults.productImgNum; index++) {
    imgUpload.push(index);
  }

  const AddProductSchema =
    initialValues.productName &&
    Yup.object().shape({
      productName: Yup.string().required("Kh??ng ???????c ????? tr???ng ??"),
      description: Yup.string().required("Kh??ng ???????c ????? tr???ng ??"),
      price: Yup.number().when("hasVariant", {
        is: () => !hasVariant,
        then: Yup.number()
          .required("Kh??ng ???????c ????? tr???ng ??")
          .min(1000, "Gi?? tr??? ph???i ??t nh???t 1,000"),
      }),
      stock: Yup.number().when("hasVariant", {
        is: () => !hasVariant,
        then: Yup.number().required("Kh??ng ???????c ????? tr???ng ??"),
      }),
      weight: Yup.number()
        .required("Kh??ng ???????c ????? tr???ng ??")
        .min(1, "Vui l??ng nh???p v??o gi?? tr??? gi???a 0 v?? 1000000")
        .max(1000000, "Vui l??ng nh???p v??o gi?? tr??? gi???a 0 v?? 1000000"),
      firstVariant: Yup.object().shape({
        name: Yup.string().when("hasVariant", {
          is: () => hasVariant === true,
          then: Yup.string().required("Kh??ng ???????c ????? tr???ng ??"),
        }),
        options: Yup.array()
          .of(
            Yup.string().when("hasVariant", {
              is: () => hasVariant === true,
              then: Yup.string().required("Kh??ng ???????c ????? tr???ng ??"),
            })
          )
          .test("unique", "", function (list) {
            const set = new Set(list).size;
            if (set !== list?.length) {
              return this.createError({
                path: this.path + "." + set,
                message: "C??c ph??n lo???i h??ng ph???i kh??c nhau",
              });
            }
            return true;
          }),
      }),
      secondVariant: Yup.object().shape({
        name: Yup.string().when("hasSecondVariant", {
          is: () => hasSecondVariant === true,
          then: Yup.string().required("Kh??ng ???????c ????? tr???ng ??"),
        }),
        options: Yup.array()
          .of(
            Yup.string().when("hasVariant", {
              is: () => hasVariant === true,
              then: Yup.string().required("Kh??ng ???????c ????? tr???ng ??"),
            })
          )
          .test("unique", "", function (list) {
            const set = new Set(list).size;
            if (set !== list?.length) {
              return this.createError({
                path: this.path + "." + set,
                message: "C??c ph??n lo???i h??ng ph???i kh??c nhau",
              });
            }
            return true;
          }),
      }),
      selectProperties: Yup.array().of(
        Yup.object().shape({
          name: Yup.string(),
          isRequired: Yup.boolean(),
          valueIDs: Yup.array().when("isRequired", {
            is: true,
            then: Yup.array()
              .of(Yup.number())
              .test("length", "", function (value) {
                if (value?.length === 0)
                  return this.createError({
                    path: this.path,
                    message: "Vui l??ng ch???n " + this.parent.name,
                  });
                return true;
              }),
            otherwise: Yup.array().of(Yup.number()),
          }),
        })
      ),
    });

  const { isLoading, onLoading, offLoading } = useLoading();
  const history = useHistory();

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setShowToast(false);
  };

  const hideProduct = () => {
    onLoading();
    ProductServices.hideProduct(productId, userInfo!.token)
      .then((response) => {
        offLoading();

        if (response.status === 200) {
          setToastMessage("???n s???n ph???m th??nh c??ng");
          setToastSeverity("success");
          setShowToast(true);

          setTimeout(() => {
            history.push("/");
          }, 2000);
        } else {
          setToastMessage("???n s???n ph???m th???t b???i");
          setToastSeverity("error");
          setShowToast(true);
        }
      })
      .catch((error) => {
        offLoading();
        setToastMessage("???n s???n ph???m th???t b???i");
        setToastSeverity("error");
        setShowToast(true);
      });
  };

  const unhideProduct = () => {
    onLoading();
    ProductServices.unhideProduct(productId, userInfo!.token)
      .then((response) => {
        offLoading();

        if (response.status === 200) {
          setToastMessage("B??? ???n s???n ph???m th??nh c??ng");
          setToastSeverity("success");
          setShowToast(true);

          setTimeout(() => {
            history.push("/");
          }, 2000);
        } else {
          setToastMessage("B??? ???n s???n ph???m th???t b???i");
          setToastSeverity("error");
          setShowToast(true);
        }
      })
      .catch((error) => {
        offLoading();
        setToastMessage("B??? ???n s???n ph???m th???t b???i");
        setToastSeverity("error");
        setShowToast(true);
      });
  };

  return (
    <>
      <Snackbar
        open={showToast}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={toastSeverity}
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
      {isLoading && <FullscreenLoading Type="Overlay" />}
      {product && (
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            console.log(values);

            if (
              images.length === 0 ||
              images.findIndex((image) => image.id === 0) === -1
            )
              alert("Ch??a ch???n ???nh b??a");
            else {
              onLoading();
              let formData = new FormData();
              images.forEach((image) => {
                image.id === 0
                  ? formData.append("coverImage", image.file, image.file.name)
                  : formData.append(
                      "productImages",
                      image.file,
                      image.file.name
                    );
              });

              formData.append(
                "data",
                JSON.stringify({
                  ...values,
                  id: product.id,
                  name: values.productName,
                  firstVariant: hasVariant ? values.firstVariant : null,
                  secondVariant: hasSecondVariant ? values.secondVariant : null,
                })
              );

              ProductServices.updateProduct(formData)
                .then(() => {
                  offLoading();
                  setToastMessage("C???p nh???t s???n ph???m th??nh c??ng");
                  setToastSeverity("success");
                  setShowToast(true);

                  setTimeout(() => {
                    history.push("/");
                  }, 2000);
                })
                .catch(() => {
                  offLoading();
                  setToastMessage(
                    "C???p nh???t s???n ph???m th???t b???i, ???? c?? l???i x???y ra"
                  );
                  setToastSeverity("error");
                  setShowToast(true);
                });
            }
          }}
          validationSchema={AddProductSchema}
          validateOnChange={false}
          validateOnBlur={true}
        >
          {({
            errors,
            values,
            setValues,
            setErrors,
            touched,
            setFieldValue,
          }) => (
            <Form autoComplete="false">
              <Container>
                <Box>
                  <BoxHeader>
                    <h3>Th??ng tin c?? b???n</h3>
                  </BoxHeader>
                  <BoxContent>
                    <BasicGridContainer>
                      <label>H??nh ???nh s???n ph???m</label>
                      <UploadContainer>
                        {imgUpload.map((item, index) => (
                          <ImageUpload
                            key={item}
                            index={item}
                            explainText={
                              item === 0 ? "*???nh b??a" : "H??nh ???nh " + item
                            }
                            setImages={setImages}
                            imageUrl={index === 0 ? product?.coverImage : ""}
                          />
                        ))}
                      </UploadContainer>
                      <label>* T??n s???n ph???m</label>
                      <InputArea>
                        <Field
                          type="text"
                          name="productName"
                          placeholder="Nh???p v??o"
                        />
                        {errors.productName && touched.productName && (
                          <ErrorMessage>{errors.productName}</ErrorMessage>
                        )}
                      </InputArea>
                      <label>* M?? t??? s???n ph???m</label>
                      <InputArea>
                        <Field
                          as="textarea"
                          name="description"
                          placeholder="Nh???p v??o"
                        />
                        {errors.description && touched.description && (
                          <ErrorMessage>{errors.description}</ErrorMessage>
                        )}
                      </InputArea>
                      <label>* Danh m???c</label>
                      <p>{cateLink}</p>
                    </BasicGridContainer>
                  </BoxContent>
                </Box>
                <Box>
                  <BoxHeader>
                    <h3>Th??ng tin chi ti???t</h3>
                  </BoxHeader>
                  <BoxContent>
                    <GridContainer>
                      {selectProps.length > 0 &&
                        selectProps.map((item, index) => {
                          const error = errors.selectProperties;
                          const test: ProductSelect[] =
                            typeof error === "object" &&
                            JSON.parse(JSON.stringify(error));

                          return (
                            <EditRow key={item.id}>
                              <label>
                                {item.isRequired && "* "}
                                {item.name}
                              </label>
                              <InputArea>
                                {test[index] && (
                                  <ErrorMessage>
                                    {test[index].valueIDs}
                                  </ErrorMessage>
                                )}
                                {item.hasMultiValues ? (
                                  <Select
                                    options={item.values}
                                    placeholder="Vui l??ng ch???n"
                                    isMulti={true}
                                    onChange={(e) => {
                                      if (e) {
                                        var index =
                                          values.selectProperties.findIndex(
                                            (p) => p.id === item.id
                                          );
                                        if (index >= 0) {
                                          values.selectProperties[
                                            index
                                          ].valueIDs = e.map((v) => v.value);
                                          setValues(values);
                                        } else {
                                          values.selectProperties.push({
                                            id: item.id,
                                            valueIDs: e.map((v) => v.value),
                                          });
                                          setValues(values);
                                        }
                                      }
                                    }}
                                    value={item.values.filter((v) =>
                                      values.selectProperties
                                        .find((p) => p.id === item.id)
                                        ?.valueIDs.includes(v.value)
                                    )}
                                  ></Select>
                                ) : (
                                  <Select
                                    options={item.values}
                                    placeholder="Vui l??ng ch???n"
                                    onChange={(e) => {
                                      if (e) {
                                        var index =
                                          values.selectProperties.findIndex(
                                            (p) => p.id === item.id
                                          );
                                        if (index >= 0) {
                                          values.selectProperties[
                                            index
                                          ].valueIDs[0] = e.value;
                                          setValues(values);
                                        } else {
                                          values.selectProperties.push({
                                            id: item.id,
                                            valueIDs: [e.value],
                                          });
                                          setValues(values);
                                        }
                                      }
                                    }}
                                    value={item.values.filter(
                                      (v) =>
                                        v.value ===
                                        values.selectProperties.find(
                                          (p) => p.id === item.id
                                        )?.valueIDs[0]
                                    )}
                                  ></Select>
                                )}
                              </InputArea>
                            </EditRow>
                          );
                        })}
                      {typingProps.length > 0 &&
                        typingProps.map((item, index) => {
                          switch (item.type) {
                            case "text":
                              return (
                                <EditRow key={item.id}>
                                  <label>{item.name}</label>
                                  <Field
                                    type="text"
                                    placeholder="Nh???p v??o"
                                    name={`typingProperties.${index}.value`}
                                  />
                                </EditRow>
                              );
                            case "date":
                              return null;
                            default:
                              return null;
                          }
                        })}
                    </GridContainer>
                  </BoxContent>
                </Box>
                <Box>
                  <BoxHeader>
                    <h3>Th??ng tin b??n h??ng</h3>
                  </BoxHeader>
                  <BoxContent>
                    <BasicGridContainer>
                      {hasVariant ? (
                        <>
                          <label>Nh??m ph??n lo???i 1</label>
                          <VariantPanel>
                            <AiOutlineClose
                              color="#999"
                              onClick={() => {
                                setHasVariant(false);
                                setHasSecondVariant(false);
                                setValues({
                                  ...values,
                                  firstVariant: { name: "", options: [] },
                                  secondVariant: { name: "", options: [] },
                                  combinations: [],
                                  price: 0,
                                  stock: 0,
                                });
                                setErrors({
                                  ...errors,
                                  firstVariant: {},
                                  secondVariant: {},
                                });
                              }}
                              className="close-button"
                            />
                            <VariantPanelContainer>
                              <OptionContainer>
                                <label>T??n nh??m</label>
                                <InputArea>
                                  <Field
                                    type="text"
                                    name="firstVariant.name"
                                    placeholder="Nh???p t??n nh??m ph??n lo???i h??ng, v?? d???: m??u s???c, k??ch c???"
                                  />
                                  {errors.firstVariant?.name &&
                                    touched.firstVariant?.name && (
                                      <ErrorMessage>
                                        {errors.firstVariant.name}
                                      </ErrorMessage>
                                    )}
                                </InputArea>
                              </OptionContainer>
                              {values.firstVariant.options.map(
                                (item, index) => {
                                  const error: any =
                                    errors.firstVariant?.options?.length &&
                                    touched.firstVariant?.options &&
                                    errors.firstVariant.options[index];
                                  return (
                                    <OptionContainer key={index}>
                                      <label>
                                        {index > 0 ? "" : "Ph??n lo???i"}
                                      </label>
                                      <InputArea>
                                        <Field
                                          type="text"
                                          name={`firstVariant.options.${index}`}
                                          placeholder="Nh???p ph??n lo???i h??ng, v?? d???: tr???ng, ?????"
                                          values={item}
                                        />
                                        {error && (
                                          <ErrorMessage>{error}</ErrorMessage>
                                        )}
                                      </InputArea>
                                      <VariantPanelAction>
                                        {values.firstVariant.options.length >
                                          1 && (
                                          <AiOutlineDelete
                                            color="#999"
                                            onClick={() => {
                                              values.firstVariant.options.splice(
                                                index,
                                                1
                                              );
                                              hasSecondVariant
                                                ? values.secondVariant.options.forEach(
                                                    () =>
                                                      values.combinations.splice(
                                                        index *
                                                          values.secondVariant
                                                            .options.length,
                                                        1
                                                      )
                                                  )
                                                : values.combinations.splice(
                                                    index,
                                                    1
                                                  );

                                              setValues({
                                                ...values,
                                              });
                                            }}
                                          />
                                        )}
                                      </VariantPanelAction>
                                    </OptionContainer>
                                  );
                                }
                              )}
                              <OptionContainer>
                                <div></div>
                                <AddVariantButton
                                  type="button"
                                  style={{ width: "100%" }}
                                  onClick={() => {
                                    values.firstVariant.options.push("");
                                    if (hasSecondVariant) {
                                      values.secondVariant.options.forEach(() =>
                                        values.combinations.push({
                                          price: 0,
                                          stock: 0,
                                          sku: "",
                                        })
                                      );
                                    } else {
                                      values.combinations.push({
                                        price: 0,
                                        stock: 0,
                                        sku: "",
                                      });
                                    }
                                    setValues({ ...values });
                                  }}
                                >
                                  <span>
                                    <AiOutlinePlusCircle size="16px" />
                                    Th??m ph??n lo???i h??ng
                                  </span>
                                </AddVariantButton>
                              </OptionContainer>
                            </VariantPanelContainer>
                          </VariantPanel>
                          <label>Nh??m ph??n lo???i 2</label>
                          {hasSecondVariant ? (
                            <VariantPanel>
                              <AiOutlineClose
                                color="#999"
                                onClick={() => {
                                  const combinations = values.combinations;
                                  combinations.splice(0, combinations.length);
                                  values.firstVariant.options.forEach(() => {
                                    combinations.push({
                                      price: 0,
                                      stock: 0,
                                      sku: "",
                                    });
                                  });

                                  setHasSecondVariant(false);
                                  setValues({
                                    ...values,
                                    secondVariant: {
                                      name: "",
                                      options: [],
                                    },
                                    combinations: combinations,
                                  });
                                  setErrors({ ...errors, secondVariant: {} });
                                }}
                                className="close-button"
                              />
                              <VariantPanelContainer>
                                <OptionContainer>
                                  <label>T??n nh??m</label>
                                  <InputArea>
                                    <Field
                                      type="text"
                                      name="secondVariant.name"
                                      placeholder="Nh???p t??n nh??m ph??n lo???i h??ng, v?? d???: m??u s???c, k??ch c???"
                                    />
                                    {errors.secondVariant?.name &&
                                      touched.secondVariant?.name && (
                                        <ErrorMessage>
                                          {errors.secondVariant.name}
                                        </ErrorMessage>
                                      )}
                                  </InputArea>
                                </OptionContainer>
                                {values.secondVariant.options.map(
                                  (item, index) => {
                                    const error: any =
                                      errors.secondVariant?.options?.length &&
                                      touched.secondVariant?.options &&
                                      errors.secondVariant.options[index];
                                    return (
                                      <OptionContainer key={index}>
                                        <label>
                                          {index > 0 ? "" : "Ph??n lo???i"}
                                        </label>
                                        <InputArea>
                                          <Field
                                            type="text"
                                            name={`secondVariant.options.${index}`}
                                            placeholder="Nh???p ph??n lo???i h??ng, v?? d???: tr???ng, ?????"
                                            values={item}
                                          />
                                          {error && (
                                            <ErrorMessage>{error}</ErrorMessage>
                                          )}
                                        </InputArea>
                                        <VariantPanelAction>
                                          {values.secondVariant.options.length >
                                            1 && (
                                            <AiOutlineDelete
                                              color="#999"
                                              onClick={() => {
                                                const secondVariant =
                                                  values.secondVariant;
                                                const list = [
                                                  ...secondVariant.options,
                                                ];
                                                list.splice(index, 1);
                                                secondVariant.options = list;
                                                const combinations =
                                                  values.combinations;
                                                combinations.splice(
                                                  0,
                                                  combinations.length
                                                );
                                                values.firstVariant.options.forEach(
                                                  () => {
                                                    values.secondVariant.options.forEach(
                                                      () => {
                                                        combinations.push({
                                                          price: 0,
                                                          stock: 0,
                                                          sku: "",
                                                        });
                                                      }
                                                    );
                                                  }
                                                );
                                                setValues({
                                                  ...values,
                                                  secondVariant,
                                                  combinations,
                                                });
                                              }}
                                            />
                                          )}
                                        </VariantPanelAction>
                                      </OptionContainer>
                                    );
                                  }
                                )}
                                <OptionContainer>
                                  <div></div>
                                  <AddVariantButton
                                    type="button"
                                    style={{ width: "100%" }}
                                    onClick={() => {
                                      values.secondVariant.options.push("");
                                      values.combinations.splice(
                                        0,
                                        values.combinations.length
                                      );
                                      values.firstVariant.options.forEach(
                                        () => {
                                          values.secondVariant.options.forEach(
                                            () => {
                                              values.combinations.push({
                                                price: 0,
                                                stock: 0,
                                                sku: "",
                                              });
                                            }
                                          );
                                        }
                                      );

                                      setValues({ ...values });
                                    }}
                                  >
                                    <span>
                                      <AiOutlinePlusCircle size="16px" />
                                      Th??m ph??n lo???i h??ng
                                    </span>
                                  </AddVariantButton>
                                </OptionContainer>
                              </VariantPanelContainer>
                            </VariantPanel>
                          ) : (
                            <AddVariantButton
                              type="button"
                              onClick={() => {
                                setHasSecondVariant(true);
                                values.secondVariant = {
                                  name: "",
                                  options: [""],
                                };
                                setValues({ ...values });
                              }}
                            >
                              <span>
                                <AiOutlinePlusCircle size="16px" />
                                Th??m
                              </span>
                            </AddVariantButton>
                          )}
                          <label>Danh s??ch ph??n lo???i h??ng</label>
                          <Table>
                            <TableHeader>
                              <TableCell>
                                <p>{values.firstVariant.name || "T??n"}</p>
                              </TableCell>
                              {hasSecondVariant && (
                                <TableCell>
                                  <p>{values.secondVariant.name || "T??n"}</p>
                                </TableCell>
                              )}
                              <TableCell>
                                <p>Gi??</p>
                              </TableCell>
                              <TableCell>
                                <p>Kho h??ng</p>
                              </TableCell>
                              <TableCell>
                                <p>SKU ph??n lo???i</p>
                              </TableCell>
                            </TableHeader>
                            <TableContent>
                              <TableContentLeft
                                hasSecondVariant={hasSecondVariant}
                              >
                                {values.firstVariant.options.map(
                                  (item1, index1) => (
                                    <TableRow key={index1}>
                                      <TableCell>
                                        <p>{item1 || "Lo???i"}</p>
                                      </TableCell>
                                      {hasSecondVariant && (
                                        <CellGroup>
                                          {values.secondVariant.options.map(
                                            (item2, index) => (
                                              <TableCell key={index}>
                                                <p>{item2 || "Lo???i"}</p>
                                              </TableCell>
                                            )
                                          )}
                                        </CellGroup>
                                      )}
                                    </TableRow>
                                  )
                                )}
                              </TableContentLeft>
                              <TableContentRight>
                                {values.combinations.map((name, index) => (
                                  <TableRow key={index}>
                                    <TableCell>
                                      <Field
                                        type="number"
                                        name={`combinations.${index}.price`}
                                        placeholder="Nh???p v??o"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Field
                                        type="number"
                                        name={`combinations.${index}.stock`}
                                        placeholder="Nh???p v??o"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Field
                                        type="text"
                                        name={`combinations.${index}.sku`}
                                        placeholder="Nh???p v??o"
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableContentRight>
                            </TableContent>
                          </Table>
                        </>
                      ) : (
                        <>
                          <label>Ph??n lo???i h??ng</label>
                          <AddVariantButton
                            type="button"
                            onClick={() => {
                              setHasVariant(true);
                              setValues({
                                ...values,
                                stock: undefined,
                                price: undefined,
                                firstVariant: {
                                  name: "",
                                  options: [""],
                                },
                                combinations: [{ price: 0, stock: 0, sku: "" }],
                              });
                            }}
                          >
                            <span>
                              <AiOutlinePlusCircle size="16px" />
                              Th??m nh??m ph??n lo???i
                            </span>
                          </AddVariantButton>
                          <label>* Gi??</label>
                          <InputArea>
                            <Field
                              type="number"
                              name="price"
                              placeholder="Nh???p v??o"
                              style={{ width: "70%" }}
                            />
                            {errors.price && touched.price && (
                              <ErrorMessage>{errors.price}</ErrorMessage>
                            )}
                          </InputArea>
                          <label>* Kho h??ng</label>
                          <InputArea>
                            <Field
                              type="number"
                              name="stock"
                              placeholder="Nh???p v??o"
                              style={{ width: "70%" }}
                            />
                            {errors.stock && touched.stock && (
                              <ErrorMessage>{errors.stock}</ErrorMessage>
                            )}
                          </InputArea>
                        </>
                      )}
                    </BasicGridContainer>
                  </BoxContent>
                </Box>
                <Box>
                  <BoxHeader>
                    <h3>V???n chuy???n</h3>
                  </BoxHeader>
                  <BoxContent>
                    <BasicGridContainer>
                      <label>* C??n n???ng (Sau khi ????ng g??i)</label>
                      <InputArea>
                        <Field
                          type="number"
                          name="weight"
                          placeholder="Nh???p v??o"
                          style={{ width: "70%" }}
                        />
                        {errors.weight && touched.weight && (
                          <ErrorMessage>{errors.weight}</ErrorMessage>
                        )}
                      </InputArea>
                      <label>K??ch th?????c ????ng g??i</label>
                      <div>
                        <SizeRow>
                          <Field type="number" name="width" placeholder="R" />
                          <Field type="number" name="length" placeholder="D" />
                          <Field type="number" name="height" placeholder="C" />
                        </SizeRow>
                      </div>
                    </BasicGridContainer>
                  </BoxContent>
                </Box>
                <Box>
                  <BoxHeader>
                    <h3>Th??ng tin kh??c</h3>
                  </BoxHeader>
                  <BoxContent>
                    <BasicGridContainer>
                      <label>SKU s???n ph???m</label>
                      <Field
                        type="text"
                        name="sku"
                        style={{ width: "50%" }}
                        placeholder="-"
                      />
                    </BasicGridContainer>
                  </BoxContent>
                </Box>
                <ActionContainer>
                  <SaveButton type="submit">L??u s???n ph???m</SaveButton>
                  {product.isDeleted ? (
                    <UnhideButton type="button" onClick={() => unhideProduct()}>
                      B??? ???n s???n ph???m
                    </UnhideButton>
                  ) : (
                    <HideButton type="button" onClick={() => hideProduct()}>
                      ???n s???n ph???m
                    </HideButton>
                  )}
                </ActionContainer>
              </Container>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default UpdateProductPage;
