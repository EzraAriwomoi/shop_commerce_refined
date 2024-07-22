// src/components/FAQItem.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

const FAQItemContainer = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Question = styled.div`
  font-weight: bold;
  cursor: pointer;
`;

const Answer = styled.div`
  margin-top: 5px;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FAQItemContainer>
      <Question onClick={() => setIsOpen(!isOpen)}>{question}</Question>
      <Answer isOpen={isOpen}>{answer}</Answer>
    </FAQItemContainer>
  );
};

export default FAQItem;
