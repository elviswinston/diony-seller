import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router";
import styled from "styled-components";
import ImageUpload from "../components/ImageUpload";
import CategoryServices from "../services/category.services";
import { SelectProperty, TypingProperty } from "../types/Category";
import { ReduxState } from "../types/ReduxState";
import Select from "react-select";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import {
  AiOutlinePlusCircle,
  AiOutlineClose,
  AiOutlineDelete,
} from "react-icons/ai";
import config from "../config/config";
import useLoading from "../hooks/useLoading";
import FullscreenLoading from "../components/FullscreenLoading";
import ProductServices from "../services/product.services";

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

interface SelectProp {
  id: number;
  valueIDs: number[];
  isRequired: boolean;
  name: string;
}

interface TypingProp {
  id: number;
  value: string;
  name: string;
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
  firstVariant: {
    name?: string;
    options: string[];
  };
  secondVariant: {
    name?: string;
    options: string[];
  };
  combinations: { price: number; stock: number; sku: string }[];
  hasSecondVariant: boolean;
  typingProperties: TypingProp[];
  selectProperties: SelectProp[];
}

const AddProductPage: React.FC = () => {
  const { cateLink, selectedCategory } = useSelector(
    (state: ReduxState) => state.product
  );
  const { userInfo } = useSelector((state: ReduxState) => state.userLogin);
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
    firstVariant: {
      name: "",
      options: [""],
    },
    secondVariant: {
      name: "",
      options: [""],
    },
    combinations: [],
    hasSecondVariant: false,
    typingProperties: [],
    selectProperties: [],
  });

  const [selectProps, setSelectProps] = useState<SelectProperty[]>([]);
  const [typingProps, setTypingProps] = useState<TypingProperty[]>([]);
  const [hasVariant, setHasVariant] = useState(false);
  const [hasSecondVariant, setHasSecondVariant] = useState(false);
  const [images, setImages] = useState<{ id: number; file: File }[]>([]);
  const history = useHistory();
  const { isLoading, onLoading, offLoading } = useLoading();

  useEffect(() => {
    const fetchProperties = (categoryId: number) => {
      CategoryServices.getSelectProperties(categoryId).then((response) => {
        setSelectProps(response.data);
        const props = response.data.map((item) => ({
          id: item.id,
          valueIDs: [],
          isRequired: item.isRequired,
          name: item.name,
        }));
        setInitialValues((previous) => ({
          ...previous,
          selectProperties: props,
        }));
      });

      CategoryServices.getTypingProperties(categoryId).then((response) => {
        setTypingProps(response.data);
        const props = response.data.map((item) => ({
          id: item.id,
          value: "",
          name: item.name,
        }));
        setInitialValues((previous) => ({
          ...previous,
          typingProperties: props,
        }));
      });
    };

    fetchProperties(selectedCategory.id);
  }, [selectedCategory]);

  let imgUpload: number[] = [];
  for (let index = 0; index < config.defaults.productImgNum; index++) {
    imgUpload.push(index);
  }

  const AddProductSchema = Yup.object().shape({
    productName: Yup.string().required("Không được để trống ô"),
    description: Yup.string().required("Không được để trống ô"),
    price: Yup.number().when("hasVariant", {
      is: () => !hasVariant,
      then: Yup.number()
        .required("Không được để trống ô")
        .min(1000, "Giá trị phải ít nhất 1,000"),
    }),
    stock: Yup.number().when("hasVariant", {
      is: () => !hasVariant,
      then: Yup.number().required("Không được để trống ô"),
    }),
    weight: Yup.number()
      .required("Không được để trống ô")
      .min(1, "Vui lòng nhập vào giá trị giữa 0 và 1000000")
      .max(1000000, "Vui lòng nhập vào giá trị giữa 0 và 1000000"),
    firstVariant: Yup.object().shape({
      name: Yup.string().when("hasVariant", {
        is: () => hasVariant === true,
        then: Yup.string().required("Không được để trống ô"),
      }),
      options: Yup.array()
        .of(
          Yup.string().when("hasVariant", {
            is: () => hasVariant === true,
            then: Yup.string().required("Không được để trống ô"),
          })
        )
        .test("unique", "", function (list) {
          const set = new Set(list).size;
          if (set !== list?.length) {
            return this.createError({
              path: this.path + "." + set,
              message: "Các phân loại hàng phải khác nhau",
            });
          }
          return true;
        }),
    }),
    secondVariant: Yup.object().shape({
      name: Yup.string().when("hasSecondVariant", {
        is: () => hasSecondVariant === true,
        then: Yup.string().required("Không được để trống ô"),
      }),
      options: Yup.array()
        .of(
          Yup.string().when("hasSecondVariant", {
            is: () => hasSecondVariant === true,
            then: Yup.string().required("Không được để trống ô"),
          })
        )
        .test("unique", "", function (list) {
          const set = new Set(list).size;
          if (set !== list?.length) {
            return this.createError({
              path: this.path + "." + set,
              message: "Các phân loại hàng phải khác nhau",
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
                  message: "Vui lòng chọn " + this.parent.name,
                });
              return true;
            }),
          otherwise: Yup.array().of(Yup.number()),
        }),
      })
    ),
  });

  return selectedCategory.id !== 0 ? (
    <>
      {isLoading && <FullscreenLoading Type="Overlay" />}
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          onLoading();
          if (
            images.length === 0 ||
            images.findIndex((image) => image.id === 0) === -1
          )
            alert("Chưa chọn ảnh bìa");
          else {
            let formData = new FormData();
            images.forEach((image) => {
              image.id === 0
                ? formData.append("coverImage", image.file, image.file.name)
                : formData.append("productImages", image.file, image.file.name);
            });

            formData.append(
              "data",
              JSON.stringify({
                ...values,
                name: values.productName,
                hasVariant,
                hasSecondVariant,
                categoryId: selectedCategory.id,
                userId: userInfo?.id,
                firstVariant: values.firstVariant.name
                  ? values.firstVariant
                  : null,
                secondVariant: values.secondVariant.name
                  ? values.secondVariant
                  : null,
              })
            );

            ProductServices.addProduct(formData)
              .then(() => {
                offLoading();
                history.push("/");
              })
              .catch(() => {
                offLoading();
                alert("Lỗi api rùi");
              });
          }
        }}
        validationSchema={AddProductSchema}
        validateOnChange={false}
        validateOnBlur={true}
        enableReinitialize
      >
        {({ errors, values, setValues, setErrors, touched, setFieldValue }) => (
          <Form autoComplete="false">
            <Container>
              <Box>
                <BoxHeader>
                  <h3>Thông tin cơ bản</h3>
                </BoxHeader>
                <BoxContent>
                  <BasicGridContainer>
                    <label>Hình ảnh sản phẩm</label>
                    <UploadContainer>
                      {imgUpload.map((item) => (
                        <ImageUpload
                          key={item}
                          index={item}
                          explainText={
                            item === 0 ? "*Ảnh bìa" : "Hình ảnh " + item
                          }
                          setImages={setImages}
                        />
                      ))}
                    </UploadContainer>
                    <label>* Tên sản phẩm</label>
                    <InputArea>
                      <Field
                        type="text"
                        name="productName"
                        placeholder="Nhập vào"
                      />
                      {errors.productName && touched.productName && (
                        <ErrorMessage>{errors.productName}</ErrorMessage>
                      )}
                    </InputArea>
                    <label>* Mô tả sản phẩm</label>
                    <InputArea>
                      <Field
                        as="textarea"
                        name="description"
                        placeholder="Nhập vào"
                      />
                      {errors.description && touched.description && (
                        <ErrorMessage>{errors.description}</ErrorMessage>
                      )}
                    </InputArea>
                    <label>* Danh mục</label>
                    <p>{cateLink}</p>
                  </BasicGridContainer>
                </BoxContent>
              </Box>
              <Box>
                <BoxHeader>
                  <h3>Thông tin chi tiết</h3>
                </BoxHeader>
                <BoxContent>
                  <GridContainer>
                    {selectProps.length > 0 &&
                      selectProps.map((item, index) => {
                        const error = errors.selectProperties;
                        const test: SelectProp[] =
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
                                  placeholder="Vui lòng chọn"
                                  isMulti={true}
                                  onChange={(e) => {
                                    setFieldValue(
                                      `selectProperties[${index}].valueIDs`,
                                      e.map((item) => item.value)
                                    );
                                  }}
                                ></Select>
                              ) : (
                                <Select
                                  options={item.values}
                                  placeholder="Vui lòng chọn"
                                  onChange={(e) => {
                                    setFieldValue(
                                      `selectProperties[${index}].valueIDs[0]`,
                                      e?.value
                                    );
                                  }}
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
                                  placeholder="Nhập vào"
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
                  <h3>Thông tin bán hàng</h3>
                </BoxHeader>
                <BoxContent>
                  <BasicGridContainer>
                    {hasVariant ? (
                      <>
                        <label>Nhóm phân loại 1</label>
                        <VariantPanel>
                          <AiOutlineClose
                            color="#999"
                            onClick={() => {
                              setHasVariant(false);
                              setHasSecondVariant(false);
                              setValues({
                                ...values,
                                firstVariant: {
                                  name: undefined,
                                  options: [],
                                },
                                secondVariant: {
                                  name: undefined,
                                  options: [],
                                },
                                combinations: [],
                                price: 0,
                                stock: 0,
                              });
                              setErrors({ ...errors, firstVariant: {} });
                            }}
                            className="close-button"
                          />
                          <VariantPanelContainer>
                            <OptionContainer>
                              <label>Tên nhóm</label>
                              <InputArea>
                                <Field
                                  type="text"
                                  name="firstVariant.name"
                                  placeholder="Nhập tên nhóm phân loại hàng, ví dụ: màu sắc, kích cỡ"
                                />
                                {errors.firstVariant?.name &&
                                  touched.firstVariant?.name && (
                                    <ErrorMessage>
                                      {errors.firstVariant.name}
                                    </ErrorMessage>
                                  )}
                              </InputArea>
                            </OptionContainer>
                            {values.firstVariant.options.map((item, index) => {
                              const error =
                                errors.firstVariant?.options?.length &&
                                touched.secondVariant?.options &&
                                errors.firstVariant.options[index];
                              return (
                                <OptionContainer key={index}>
                                  <label>{index > 0 ? "" : "Phân loại"}</label>
                                  <InputArea>
                                    <Field
                                      type="text"
                                      name={`firstVariant.options.${index}`}
                                      placeholder="Nhập phân loại hàng, ví dụ: trắng, đỏ"
                                      values={item}
                                    />
                                    {error && (
                                      <ErrorMessage>{error}</ErrorMessage>
                                    )}
                                  </InputArea>
                                  <VariantPanelAction>
                                    {values.firstVariant.options.length > 1 && (
                                      <AiOutlineDelete
                                        color="#999"
                                        onClick={() => {
                                          const firstVariant =
                                            values.firstVariant;
                                          const list = [
                                            ...firstVariant.options,
                                          ];
                                          const combinations =
                                            values.combinations;
                                          combinations.splice(
                                            0,
                                            combinations.length
                                          );
                                          list.splice(index, 1);
                                          list.forEach(() => {
                                            values.secondVariant.options.forEach(
                                              () => {
                                                combinations.push({
                                                  price: 0,
                                                  stock: 0,
                                                  sku: "",
                                                });
                                              }
                                            );
                                          });
                                          firstVariant.options = list;
                                          setValues({
                                            ...values,
                                            firstVariant,
                                            combinations,
                                          });
                                        }}
                                      />
                                    )}
                                  </VariantPanelAction>
                                </OptionContainer>
                              );
                            })}
                            <OptionContainer>
                              <div></div>
                              <AddVariantButton
                                type="button"
                                style={{ width: "100%" }}
                                onClick={() => {
                                  const firstVariant = values.firstVariant;
                                  firstVariant.options.push("");
                                  const combinations = values.combinations;
                                  combinations.splice(0, combinations.length);
                                  values.firstVariant.options.forEach(() => {
                                    values.secondVariant.options.forEach(() => {
                                      combinations.push({
                                        price: 0,
                                        stock: 0,
                                        sku: "",
                                      });
                                    });
                                  });
                                  setValues({
                                    ...values,
                                    firstVariant,
                                    combinations,
                                  });
                                }}
                              >
                                <span>
                                  <AiOutlinePlusCircle size="16px" />
                                  Thêm phân loại hàng
                                </span>
                              </AddVariantButton>
                            </OptionContainer>
                          </VariantPanelContainer>
                        </VariantPanel>
                        <label>Nhóm phân loại 2</label>
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
                                    options: [""],
                                  },
                                  combinations: combinations,
                                });
                                setErrors({ ...errors, secondVariant: {} });
                              }}
                              className="close-button"
                            />
                            <VariantPanelContainer>
                              <OptionContainer>
                                <label>Tên nhóm</label>
                                <InputArea>
                                  <Field
                                    type="text"
                                    name="secondVariant.name"
                                    placeholder="Nhập tên nhóm phân loại hàng, ví dụ: màu sắc, kích cỡ"
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
                                  const error =
                                    errors.secondVariant?.options?.length &&
                                    touched.secondVariant?.options &&
                                    errors.secondVariant.options[index];
                                  return (
                                    <OptionContainer key={index}>
                                      <label>
                                        {index > 0 ? "" : "Phân loại"}
                                      </label>
                                      <InputArea>
                                        <Field
                                          type="text"
                                          name={`secondVariant.options.${index}`}
                                          placeholder="Nhập phân loại hàng, ví dụ: trắng, đỏ"
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
                                    const secondVariant = values.secondVariant;
                                    secondVariant.options.push("");
                                    const combinations = values.combinations;
                                    combinations.splice(0, combinations.length);
                                    values.firstVariant.options.forEach(() => {
                                      values.secondVariant.options.forEach(
                                        () => {
                                          combinations.push({
                                            price: 0,
                                            stock: 0,
                                            sku: "",
                                          });
                                        }
                                      );
                                    });
                                    setValues({
                                      ...values,
                                      secondVariant,
                                      combinations,
                                    });
                                  }}
                                >
                                  <span>
                                    <AiOutlinePlusCircle size="16px" />
                                    Thêm phân loại hàng
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
                            }}
                          >
                            <span>
                              <AiOutlinePlusCircle size="16px" />
                              Thêm
                            </span>
                          </AddVariantButton>
                        )}
                        <label>Danh sách phân loại hàng</label>
                        <Table>
                          <TableHeader>
                            <TableCell>
                              <p>{values.firstVariant.name || "Tên"}</p>
                            </TableCell>
                            {hasSecondVariant && (
                              <TableCell>
                                <p>{values.secondVariant.name || "Tên"}</p>
                              </TableCell>
                            )}
                            <TableCell>
                              <p>Giá</p>
                            </TableCell>
                            <TableCell>
                              <p>Kho hàng</p>
                            </TableCell>
                            <TableCell>
                              <p>SKU phân loại</p>
                            </TableCell>
                          </TableHeader>
                          <TableContent>
                            <TableContentLeft
                              hasSecondVariant={hasSecondVariant}
                            >
                              {values.firstVariant.options.map(
                                (name1, index1) => (
                                  <TableRow key={index1}>
                                    <TableCell>
                                      <p>{name1 || "Loại"}</p>
                                    </TableCell>
                                    {hasSecondVariant && (
                                      <CellGroup>
                                        {values.secondVariant.options.map(
                                          (name2, index) => (
                                            <TableCell key={index}>
                                              <p>{name2 || "Loại"}</p>
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
                                      placeholder="Nhập vào"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Field
                                      type="number"
                                      name={`combinations.${index}.stock`}
                                      placeholder="Nhập vào"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Field
                                      type="text"
                                      name={`combinations.${index}.sku`}
                                      placeholder="Nhập vào"
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
                        <label>Phân loại hàng</label>
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
                            Thêm nhóm phân loại
                          </span>
                        </AddVariantButton>
                        <label>* Giá</label>
                        <InputArea>
                          <Field
                            type="number"
                            name="price"
                            placeholder="Nhập vào"
                            style={{ width: "70%" }}
                          />
                          {errors.price && touched.price && (
                            <ErrorMessage>{errors.price}</ErrorMessage>
                          )}
                        </InputArea>
                        <label>* Kho hàng</label>
                        <InputArea>
                          <Field
                            type="number"
                            name="stock"
                            placeholder="Nhập vào"
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
                  <h3>Vận chuyển</h3>
                </BoxHeader>
                <BoxContent>
                  <BasicGridContainer>
                    <label>* Cân nặng (Sau khi đóng gói)</label>
                    <InputArea>
                      <Field
                        type="number"
                        name="weight"
                        placeholder="Nhập vào"
                        style={{ width: "70%" }}
                      />
                      {errors.weight && touched.weight && (
                        <ErrorMessage>{errors.weight}</ErrorMessage>
                      )}
                    </InputArea>
                    <label>Kích thước đóng gói</label>
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
                  <h3>Thông tin khác</h3>
                </BoxHeader>
                <BoxContent>
                  <BasicGridContainer>
                    <label>SKU sản phẩm</label>
                    <Field
                      type="text"
                      name="sku"
                      style={{ width: "50%" }}
                      placeholder="-"
                    />
                  </BasicGridContainer>
                </BoxContent>
              </Box>
              <SaveButton type="submit">Lưu sản phẩm</SaveButton>
            </Container>
          </Form>
        )}
      </Formik>
    </>
  ) : (
    <Redirect to="/seller/category" />
  );
};

export default AddProductPage;
