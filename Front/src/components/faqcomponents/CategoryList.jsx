// src/components/CategoryList.jsx
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const CategoryListContainer = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const CategoryItem = styled.li`
  a {
    text-decoration: none;
    color: #333;
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    display: block;
    &:hover,
    &.selected {
      background-color: #f0f0f0;
      border-color: #bbb;
    }
  }
`;

const CategoryList = ({ categories, selectedCategory }) => {
  return (
    <CategoryListContainer>
      {categories.map((category) => (
        <CategoryItem key={category.id}>
          <Link
            to={category.link}
            className={selectedCategory === category.id ? "selected" : ""}
          >
            {category.name}
          </Link>
        </CategoryItem>
      ))}
    </CategoryListContainer>
  );
};

export default CategoryList;
