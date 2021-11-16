import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import CategoryServices from "../services/category.services";
import { Category } from "../types/Category";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { selectCategory, setCategoryLink } from "../actions/productActions";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
`;

const Box = styled.div`
  background-color: #fff;
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 10%);
  border-radius: 4px;
  padding: 25px;
  width: 80%;
`;

const BoxHeader = styled.div`
  border-bottom: 1px solid #ccc;
  padding-bottom: 20px;
  margin-bottom: 20px;

  h2 {
    font-weight: 500;
  }

  p {
    margin-top: 10px;
    color: #999;
    font-size: 12px;
  }
`;

const BoxContent = styled.div``;

const CategoryContainer = styled.div`
  background-color: #f6f6f6;
  padding: 20px;
  height: 400px;
  border-radius: 4px;
`;

const CategoryList = styled.div`
  padding: 10px 0;
  height: 100%;
  background-color: #fff;
  display: flex;
`;

const CategoryBox = styled.div`
  background-color: #fff;
  border-right: 1px solid #e8e8e8;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  flex: 1;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
`;

const Item = styled.li`
  list-style: none;
  margin: 0;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background-color: #f6f6f6;
    cursor: pointer;
  }

  &.active {
    color: #ee4d2d;
  }
`;

const SelectedCategory = styled.div`
  margin-top: 10px;

  p {
    display: inline-block;
    margin-right: 10px;
  }

  span {
    color: #ee4d2d;
    font-weight: 500;
  }
`;

const ActionContaier = styled.div`
  margin-top: 20px;
  cursor: not-allowed;
  width: fit-content;
`;

const NextButton = styled(Link)`
  outline: none;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  background-color: #ee4d2d;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  display: inline-block;

  &.isDisabled {
    pointer-events: none;
    opacity: 0.7;
  }
`;

interface CateBox {
  CategoryList?: Category[];
  Depth?: Number;
}

const CategoryPage: React.FC = () => {
  const [cateList, setCateList] = useState<Category[]>([]);
  const [cateBoxes, setCateBoxes] = useState<CateBox[]>([]);
  const [selectedCate, setSelectedCate] = useState<Category>();
  const [cateLink, setCateLink] = useState<Category[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    CategoryServices.getMenu().then((response) => {
      setCateList(response.data);
      setCateBoxes((cateBoxes) => [
        ...cateBoxes,
        { CategoryList: response.data, Depth: 0 },
      ]);
    });
  }, []);

  let categoryBoxes = [];
  let depth = 0;

  const getMaxDepth = (list: Category[], lastDepth: number) => {
    if (list.length === 0) return 0;

    list.forEach((item) => {
      if (item.children && item.children.length > 0) {
        lastDepth++;
        if (lastDepth > depth) depth = lastDepth;
        getMaxDepth(item.children, lastDepth);
      }

      lastDepth = 0;
    });
  };

  getMaxDepth(cateList, 0);

  for (let i = 0; i <= depth; i++) {
    categoryBoxes.push(
      <CategoryBox key={i}>
        <List>
          {cateBoxes.length > 0 &&
            cateBoxes[i]?.CategoryList?.map((item) => (
              <Item
                key={item.id}
                onClick={() => {
                  expandCategory(item.id);
                }}
                className={item.isActive ? "active" : ""}
              >
                {item.name}
                {item.children && item.children.length > 0 && (
                  <IoIosArrowForward />
                )}
              </Item>
            ))}
        </List>
      </CategoryBox>
    );
  }

  const expandCategory = (id: number) => {
    const category = findCategory(cateList, id, 0);
    setSelectedCate(category);

    //Check category in cateBoxes
    const current = cateBoxes.find(
      (item) => item.Depth === category.currentDepth
    );

    if (current) {
      let updateCateBoxes = cateBoxes.map((cateBox) => {
        if (cateBox.Depth === category.currentDepth)
          return { ...cateBox, CategoryList: category.children };
        if (
          cateBox.Depth &&
          category.currentDepth &&
          cateBox.Depth >= category.currentDepth
        )
          return { CategoryList: [], Depth: cateBox.Depth };

        return cateBox;
      });
      setCateBoxes(updateCateBoxes);
    } else {
      setCateBoxes((state) => [
        ...state,
        { CategoryList: category.children, Depth: category.currentDepth },
      ]);
    }

    if (category && category.currentDepth) {
      //Add to cate link
      const isInCateLink = cateLink.find(
        (link) => link.currentDepth === category.currentDepth
      );
      if (isInCateLink) {
        let newCateLink = cateLink
          .filter(
            (item) =>
              item.currentDepth &&
              category.currentDepth &&
              item.currentDepth <= category.currentDepth
          )
          .map((item) =>
            item.currentDepth === category.currentDepth ? category : item
          );

        setCateLink(newCateLink);
      } else setCateLink((cateLink) => [...cateLink, category]);

      //Active category
      const cateList = cateBoxes[category.currentDepth - 1].CategoryList?.map(
        (cate) => {
          if (cate.id === category.id) return { ...cate, isActive: true };
          return { ...cate, isActive: false };
        }
      );
      setCateBoxes((state) =>
        state.map((item, index) => {
          if (index + 1 === category.currentDepth)
            return { ...item, CategoryList: cateList };
          return item;
        })
      );
    }
  };

  const findCategory = (list: Category[], id: number, depth: number) => {
    var result: Category = { id: 0, name: "", isActive: false };
    for (var category of list) {
      depth++;
      if (category.id === id) {
        result = category;
        result.currentDepth = depth;
        depth = 0;
        break;
      } else if (category.children) {
        result = findCategory(category.children, id, depth);
        depth = 0;
        if (result.id !== 0) break;
      }
    }
    return result;
  };

  return (
    <Container>
      <Box>
        <BoxHeader>
          <h2>Thêm 1 sản phẩm mới</h2>
          <p>Vui lòng chọn ngành hàng phù hợp cho sản phẩm của bạn.</p>
        </BoxHeader>
        <BoxContent>
          <CategoryContainer>
            <CategoryList>{categoryBoxes}</CategoryList>
          </CategoryContainer>
          <SelectedCategory>
            <p>Đã chọn:</p>
            {cateLink.length > 0 &&
              cateLink.map((item, index) =>
                index === 0 ? (
                  <span key={index}>{item.name}</span>
                ) : (
                  <span key={index}>{" > " + item.name}</span>
                )
              )}
          </SelectedCategory>
          <ActionContaier>
            <NextButton
              className={
                selectedCate
                  ? selectedCate.children && selectedCate.children.length > 0
                    ? "isDisabled"
                    : ""
                  : "isDisabled"
              }
              to="/seller/product/new"
              onClick={() => {
                if (selectedCate) {
                  dispatch(selectCategory(selectedCate));
                  let link = cateLink.map((item) => item.name).join(" > ");
                  dispatch(setCategoryLink(link));
                }
              }}
            >
              Tiếp theo
            </NextButton>
          </ActionContaier>
        </BoxContent>
      </Box>
    </Container>
  );
};

export default CategoryPage;
