import styled from 'styled-components';
import React from 'react';

const FormContainer = styled.div`
  background: #fff;
  padding: 20px;
  border: 1px solid #ccc;
  margin: 20px;
  border-radius: 5px;
  width: auto;
`;

const FormTitle = styled.h1`
  font-size: 20px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const FormField = styled.div`
  margin-bottom: 15px;

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
  }

  input[type="text"],
  select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
`;

const InputGroup = styled.div`
  display: flex;
  justify-content: space-between;

  & > * {
    width: 48%; // Slightly less than half to fit the gap
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  float: right;
  margin-top: 20px;

  &:hover {
    background-color: #0056b3;
  }
`;

const CommunicationForm = () => {
  return (
    <FormContainer>
      <FormTitle>상품관리 - 등록</FormTitle>
      <FormField>
        <label>상품명</label>
        <input type="text" />
      </FormField>
      <FormField>
        <label>브랜드</label>
        <input type="text" />
      </FormField>
      <InputGroup>
        <FormField>
          <label>상품 종류</label>
          <select>
            <option>일반</option>
            {/* Additional options */}
          </select>
        </FormField>
        <FormField>
          <label>SMS 제품여부</label>
          <select>
            <option>선택 안 함</option>
            {/* Additional options */}
          </select>
        </FormField>
      </InputGroup>
      <InputGroup>
        <FormField>
          <label>MMS 제품여부</label>
          <select>
            <option>선택 안 함</option>
            {/* Additional options */}
          </select>
        </FormField>
        <FormField>
          <label>상품가격</label>
          <input type="text" />
        </FormField>
      </InputGroup>
      <FormField>
        <label>판매가</label>
        <input type="text" />
      </FormField>
      <FormField>
        <label>최대 사용가능인원</label>
        <input type="text" />
      </FormField>
      <FormField>
        <label>최소 사용가능인원</label>
        <input type="text" />
      </FormField>
      <InputGroup>
        <FormField>
          <label>상품 최대 구매수</label>
          <input type="text" />
        </FormField>
        <FormField>
          <label>상품 최소 구매수</label>
          <input type="text" />
        </FormField>
      </InputGroup>
      <FormField>
        <label>상품상태</label>
        <select>
          <option>판매중</option>
          {/* Additional options */}
        </select>
      </FormField>
      <FormField>
        <label>카테고리</label>
        <select>
          <option>선택하세요</option>
          {/* Additional options */}
        </select>
      </FormField>
      <Button>저장</Button>
    </FormContainer>
  );
};

export default CommunicationForm;