import React, { useState } from 'react';
import styled from 'styled-components';

// Styled Components 정의
const ModalOverlay = styled.div`
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
`;

const ModalContent = styled.div`
  background-color: #fff;
  margin: 10% auto;
  padding: 80px;
  border-radius: 8px;
  width: 50%;
  position: relative;
`;

const CloseButton = styled.span`
  color: #aaa;
  position: absolute;
  right: 50px;
  top: 10px;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    color: black;
  }
`;

const Button = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: ${props => (props.primary ? '#007bff' : '#6c757d')};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
  position: relative;

  &:hover {
    background-color: ${props => (props.primary ? '#0056b3' : '#5a6268')};
  }

  .button-content {
    flex-grow: 1;
    text-align: center;
  }

  .reset-icon {
    background-color: red;
    border-radius: 50%;
    color: white;
    padding: 2px 8px;
    font-size: 16px;
    cursor: pointer;
    margin-left: 10px;
  }
`;

export function LongTextPopup({ text , buttonName }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <Button type="button" onClick={() => setIsModalOpen(true)}>
        {buttonName}
      </Button>
      {/* 모달창 */}
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={() => setIsModalOpen(false)}>&times;</CloseButton>
            <label>{text}</label>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
}

export default LongTextPopup;