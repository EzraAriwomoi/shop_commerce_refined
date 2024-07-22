// src/components/SearchBar.jsx
import React from "react";
import styled from "styled-components";

const SearchBarContainer = styled.div`
  margin: 20px 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const SearchBar = ({ onSearch }) => {
  return (
    <SearchBarContainer>
      <Input
        type="text"
        placeholder="Search FAQs..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </SearchBarContainer>
  );
};

export default SearchBar;
