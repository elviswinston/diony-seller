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

interface PageProps {
  productId: number;
}

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

interface Option {
  id?: number;
  name?: string;
}

interface Variant {
  id?: number;
  name?: string;
  options: Option[];
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
  combinations: { id?: number; price: number; stock: number; sku: string }[];
  hasSecondVariant: boolean;
  typingProperties: TypingProp[];
  selectProperties: SelectProp[];
}

interface CategoryInfo {
  category: Category;
  cateLink: string;
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
    firstVariant: {
      id: 0,
      name: "",
      options: [],
    },
    secondVariant: {
      id: 0,
      name: "",
      options: [],
    },
    combinations: [],
    hasSecondVariant: false,
    typingProperties: [{ id: 0, value: "", name: "" }],
    selectProperties: [{ id: 0, valueIDs: [0], isRequired: false, name: "" }],
  });

  const [hasVariant, setHasVariant] = useState(false);
  const [hasSecondVariant, setHasSecondVariant] = useState(false);
  const [images, setImages] = useState<{ id: number; file: File }[]>([]);
  const [selectProps, setSelectProps] = useState<SelectProperty[]>([]);
  const [typingProps, setTypingProps] = useState<TypingProperty[]>([]);
  const [cateLink, setCateLink] = useState("");
  const [product, setProduct] = useState<ProductResponse>();

  useEffect(() => {
    const fetchProductInfo = () => {
      ProductServices.getProductInfo(productId).then((response) => {
        const data: ProductResponse = response.data;
        if (data.variants.length > 0) {
          setHasVariant(true);
          data.variants.length === 2 && setHasSecondVariant(true);
        }
        setProduct(data);
        setInitialValues((previous) => ({
          ...previous,
          productName: data.name,
          description: data.description,
          price: data.combinations.length > 0 ? 0 : data.price,
          stock: data.combinations.length > 0 ? 0 : data.stock,
          weight: data.weight,
          heigth: data.height,
          width: data.width,
          length: data.length,
          sku: data.sku,
          firstVariant:
            data.variants.length > 0
              ? data.variants[0]
              : {
                  id: undefined,
                  name: undefined,
                  options: [],
                },
          secondVariant:
            data.variants.length === 2
              ? data.variants[1]
              : {
                  id: undefined,
                  name: undefined,
                  options: [],
                },
          combinations: data.combinations,
        }));
      });
    };

    const fetchCategoryInfo = () => {
      ProductServices.getCategoryInfo(productId).then((response) => {
        const data: CategoryInfo = response.data;
        setCateLink(data.cateLink);
      });
    };

    fetchProductInfo();
    fetchCategoryInfo();
  }, [productId]);

  let imgUpload: number[] = [];
  for (let index = 0; index < config.defaults.productImgNum; index++) {
    imgUpload.push(index);
  }

  const AddProductSchema =
    initialValues.productName &&
    Yup.object().shape({
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
            Yup.object().shape({
              name: Yup.string().when("hasVariant", {
                is: () => hasVariant === true,
                then: Yup.string().required("Không được để trống ô"),
              }),
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
            Yup.object().shape({
              name: Yup.string().when("hasSecondVariant", {
                is: () => hasSecondVariant === true,
                then: Yup.string().required("Không được để trống ô"),
              }),
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

  return (
    <>
      {initialValues.productName && (
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            console.log(values);
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
                    <h3>Thông tin cơ bản</h3>
                  </BoxHeader>
                  <BoxContent>
                    <BasicGridContainer>
                      <label>Hình ảnh sản phẩm</label>
                      <UploadContainer>
                        {imgUpload.map((item, index) => (
                          <ImageUpload
                            key={item}
                            index={item}
                            explainText={
                              item === 0 ? "*Ảnh bìa" : "Hình ảnh " + item
                            }
                            setImages={setImages}
                            imageUrl={index === 0 ? product?.coverImage : ""}
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
                                    options: [],
                                  },
                                  secondVariant: {
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
                              {values.firstVariant.options.map(
                                (item, index) => {
                                  const error: any =
                                    errors.firstVariant?.options?.length &&
                                    touched.firstVariant?.options &&
                                    errors.firstVariant.options[index];
                                  return (
                                    <OptionContainer key={index}>
                                      <label>
                                        {index > 0 ? "" : "Phân loại"}
                                      </label>
                                      <InputArea>
                                        <Field
                                          type="text"
                                          name={`firstVariant.options.${index}.name`}
                                          placeholder="Nhập phân loại hàng, ví dụ: trắng, đỏ"
                                          values={item.name}
                                        />
                                        {error && (
                                          <ErrorMessage>
                                            {error.name}
                                          </ErrorMessage>
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
                                    if (
                                      product &&
                                      product.variants.length > 0 &&
                                      product.variants[0].options.length >
                                        values.firstVariant.options.length
                                    ) {
                                      const index =
                                        values.firstVariant.options.length;

                                      values.firstVariant.options.push({
                                        id: product.variants[0].options[index]
                                          .id,
                                        name: "",
                                      });
                                    } else {
                                      values.firstVariant.options.push({
                                        name: "",
                                      });
                                    }

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
                                      id: undefined,
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
                                    const error: any =
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
                                            name={`secondVariant.options.${index}.name`}
                                            placeholder="Nhập phân loại hàng, ví dụ: trắng, đỏ"
                                            values={item.name}
                                          />
                                          {error && (
                                            <ErrorMessage>
                                              {error.name}
                                            </ErrorMessage>
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
                                      // const secondVariant =
                                      //   values.secondVariant;
                                      // secondVariant.options.push({
                                      //   id: undefined,
                                      //   name: "",
                                      // });
                                      // const combinations = values.combinations;
                                      // combinations.splice(
                                      //   0,
                                      //   combinations.length
                                      // );
                                      // values.firstVariant.options.forEach(
                                      //   () => {
                                      //     values.secondVariant.options.forEach(
                                      //       () => {
                                      //         combinations.push({
                                      //           price: 0,
                                      //           stock: 0,
                                      //           sku: "",
                                      //         });
                                      //       }
                                      //     );
                                      //   }
                                      // );
                                      // setValues({
                                      //   ...values,
                                      //   secondVariant,
                                      //   combinations,
                                      // });
                                      if (
                                        product &&
                                        product.variants.length === 2 &&
                                        product.variants[1].options.length >
                                          values.secondVariant.options.length
                                      ) {
                                        var index =
                                          values.secondVariant.options.length;
                                        values.secondVariant.options.push({
                                          id: product.variants[1].options[index]
                                            .id,
                                          name: "",
                                        });
                                      } else {
                                        values.secondVariant.options.push({
                                          name: "",
                                        });
                                      }
                                      values.combinations.splice(0, values.combinations.length);
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
                                product && product.variants.length === 2
                                  ? (values.secondVariant = {
                                      id: product.variants[1].id,
                                      name: "",
                                      options: [
                                        {
                                          id: product.variants[1].options[0].id,
                                          name: "",
                                        },
                                      ],
                                    })
                                  : (values.secondVariant = {
                                      name: "",
                                      options: [{ name: "" }],
                                    });

                                setValues({ ...values });
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
                                  (item1, index1) => (
                                    <TableRow key={index1}>
                                      <TableCell>
                                        <p>{item1.name || "Loại"}</p>
                                      </TableCell>
                                      {hasSecondVariant && (
                                        <CellGroup>
                                          {values.secondVariant.options.map(
                                            (item2, index) => (
                                              <TableCell key={index}>
                                                <p>{item2.name || "Loại"}</p>
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
                              const firstVariant =
                                product && product.variants.length > 0
                                  ? {
                                      id: product.variants[0].id,
                                      name: "",
                                      options: [
                                        {
                                          id: product.variants[0].options[0].id,
                                          name: "",
                                        },
                                      ],
                                    }
                                  : {
                                      name: "",
                                      options: [{ name: "" }],
                                    };
                              setValues({
                                ...values,
                                stock: undefined,
                                price: undefined,
                                firstVariant: firstVariant,
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
      )}
    </>
  );
};

export default UpdateProductPage;
