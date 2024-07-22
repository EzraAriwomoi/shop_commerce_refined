// src/pages/FAQPage.jsx
import React, { useState } from "react";
import styled from "styled-components";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";

// Sample data for FAQs
const faqData = {
  "Ordering & Payment": [
    {
      question: "How do I place an order?",
      answer:
        "To place an order, add items to your cart and proceed to checkout.",
    },
    {
      question: "Can I modify my order after placing it?",
      answer: "You can modify your order within 1 hour of placing it.",
    },
    {
      question: "Is it safe to use my credit card on your website?",
      answer:
        "Yes, we use SSL encryption to protect your personal information.",
    },
    {
      question: "Do you offer discounts for bulk orders?",
      answer: "Yes, please contact our support team for bulk order discounts.",
    },
    {
      question: "Can I save items in my cart for later?",
      answer:
        "Yes, you can save items in your cart by logging into your account.",
    },
    {
      question: "Do you offer installment payment options?",
      answer: "Yes, we offer installment payment options through Klarna.",
    },
  ],
  "Shipping & Delivery": [
    {
      question: "What are the shipping options?",
      answer: "We offer standard, expedited, and next-day delivery options.",
    },
    {
      question: "How do I track my order?",
      answer:
        "You can track your order using the tracking number provided in your order confirmation email.",
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to most countries worldwide.",
    },
    {
      question: "How much does shipping cost?",
      answer:
        "Shipping costs vary based on the shipping method and destination.",
    },
    {
      question: "What if my package is lost or damaged?",
      answer:
        "Please contact our support team for assistance with lost or damaged packages.",
    },
    {
      question: "Can I change my shipping address after placing an order?",
      answer:
        "You can change your shipping address within 1 hour of placing your order.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Shipping times vary based on the shipping method and destination.",
    },
    {
      question: "Do you offer free shipping?",
      answer: "Yes, we offer free standard shipping on orders over $50.",
    },
    {
      question: "Can I pick up my order in-store?",
      answer: "Currently, we do not offer in-store pickup options.",
    },
    {
      question: "What if I miss my delivery?",
      answer:
        "The carrier will leave a notice and you can arrange a re-delivery or pickup.",
    },
  ],
  "Returns & Refunds": [
    {
      question: "What is your return policy?",
      answer:
        "You can return items within 30 days of receipt for a full refund.",
    },
    {
      question: "How do I request a refund?",
      answer: "Contact our support team to initiate a refund request.",
    },
    {
      question: "Do I need to pay for return shipping?",
      answer: "Return shipping is free for defective or incorrect items.",
    },
    {
      question: "How long does it take to process a refund?",
      answer:
        "Refunds are processed within 5-7 business days after we receive the returned item.",
    },
    {
      question: "Can I exchange an item?",
      answer: "Yes, you can exchange an item within 30 days of receipt.",
    },
    {
      question: "What items are non-refundable?",
      answer: "Gift cards and final sale items are non-refundable.",
    },
    {
      question: "How do I return a damaged item?",
      answer:
        "Please contact our support team to arrange a return for damaged items.",
    },
    {
      question: "Can I return an item without the original packaging?",
      answer:
        "Items must be returned in their original packaging for a full refund.",
    },
    {
      question: "What if I received the wrong item?",
      answer:
        "Contact our support team to arrange a return for incorrect items.",
    },
    {
      question: "How do I check the status of my return?",
      answer:
        "You can check the status of your return by logging into your account.",
    },
  ],
  "Community & Support": [
    {
      question: "How can I contact customer support?",
      answer: "You can contact our support team via email or phone.",
    },
    {
      question: "Do you have a community forum?",
      answer: "Yes, join our community forum to connect with other customers.",
    },
    {
      question: "How can I provide feedback?",
      answer:
        "You can provide feedback through our website or by contacting our support team.",
    },
    {
      question: "Are there any community events?",
      answer:
        "Yes, we host regular community events. Check our website for upcoming events.",
    },
    {
      question: "Can I become a brand ambassador?",
      answer: "Yes, apply to become a brand ambassador through our website.",
    },
    {
      question: "Do you offer live chat support?",
      answer: "Yes, live chat support is available during business hours.",
    },
    {
      question: "How can I follow your social media updates?",
      answer: "Follow us on Facebook, Twitter, and Instagram for updates.",
    },
    {
      question: "What are your customer support hours?",
      answer: "Our customer support is available 24/7.",
    },
    {
      question: "Can I suggest new products?",
      answer:
        "Yes, we welcome product suggestions. Contact our support team with your ideas.",
    },
    {
      question: "How can I unsubscribe from your newsletter?",
      answer:
        "Click the unsubscribe link at the bottom of our newsletter emails.",
    },
  ],
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9f9f9;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const SearchBar = styled.input`
  width: 300px;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: rgb(202, 142, 63);
  color: white;
  padding: 20px;
`;

const SidebarItem = styled.div`
  margin-bottom: 30px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    text-decoration: none;
    color: grey;
    font-size: 30px;
  }
`;

const Content = styled.div`
  flex: 1;
  margin-botom: 20px;
  padding: 20px;
  font-size: 18px;
  // overflow-y: auto; /* Enable scrolling for content */
`;

const FAQItem = styled.div`
  margin-right: 20px; /* Add margin between FAQ items */
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;

  h3 {
    margin: 0 0 10px 0;
    color: grey;
    font-size: 20px;
    font-family: "Arial", sans-serif;
    font-weight: 900;
  }

  p {
    margin: 0;
    font-family: "Arial", sans-serif;
  }
`;

const FAQPage = () => {
  const [selectedCategory, setSelectedCategory] =
    useState("Ordering & Payment");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter FAQs based on search term
  const filteredFAQs = faqData[selectedCategory].filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <NavBar />
      <Container>
        <TopBar>
          <SearchBar
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </TopBar>
        <div style={{ display: "flex" }}>
          <Sidebar>
            {Object.keys(faqData).map((category) => (
              <SidebarItem
                key={category}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </SidebarItem>
            ))}
          </Sidebar>
          <Content>
            {filteredFAQs.map((faq, index) => (
              <FAQItem key={index}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </FAQItem>
            ))}
          </Content>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default FAQPage;
