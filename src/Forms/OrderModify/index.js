import React, { useState } from 'react';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  margin: 40px auto;
  text-align :left;
  width:100%;
`;

const FormSection = styled.div`
  margin-bottom: 30px;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
`;

const Label = styled.label`
  display: block;
  margin: 10px 0 5px;
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 14px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  margin-top: 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
`;

const FlexColumn = styled.div`
  flex: 1;
  min-width: 250px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-bottom: 10px;
  background: white;
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  height: 100px;
  font-size: 14px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;


// Form component
const OrderModify = () => {
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    phoneNumber: '',
    transactionID: '',
    createDate: '',
    siteDomain: '',
    ipAddress: '',
    modifiedDate: '',
    time: '',
    processType: '',
    groupType: '',
    detailType: '',
    employeeType: '',
    content: '',
    processDate: '',
    processTime: '',
    numberOfTickets: ''
  });
  const [reservationData, setReservationData] = useState({
    processType: '',
    groupType: '',
    detailType: '',
    registrationTime: '',
    processDate: '',
    processTime: '',
    relatedTickets: '',
    content: ''
  });

  const [paymentData, setPaymentData] = useState({
    paymentMethod: '',
    paymentAmount: '',
    refundAmount: '',
    orderCode: '',
    memberRegistrationNumber: '',
    couponCode: ''
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Add your submission logic here
  };

  return (
    <Container>
        <div style={{width:'50%'}}>
    <form onSubmit={handleSubmit}>
      <FormSection>
        <SectionTitle>기본 정보</SectionTitle>
        <FlexRow>
          <FlexColumn>
            <Label>이름</Label>
            <Input name="name" value={formData.name} onChange={handleChange} />
            <Label>주민등록번호</Label>
            <Input name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} />
            <Label>전화번호</Label>
            <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          </FlexColumn>
          <FlexColumn>
            <Label>주문번호</Label>
            <Input name="transactionID" value={formData.transactionID} onChange={handleChange} />
            <Label>주문시간</Label>
            <Input name="createDate" type="datetime-local" value={formData.createDate} onChange={handleChange} />
            <Label>사이트 도메인</Label>
            <Input name="siteDomain" value={formData.siteDomain} onChange={handleChange} />
          </FlexColumn>
          <FlexColumn>
            <Label>등록 일시</Label>
            <Input name="modifiedDate" type="datetime-local" value={formData.modifiedDate} onChange={handleChange} />
            <Label>IP 주소</Label>
            <Input name="ipAddress" value={formData.ipAddress} onChange={handleChange} />
          </FlexColumn>
        </FlexRow>
        <Button>기본 정보 저장</Button>
      </FormSection>

      <FormSection>
        <SectionTitle>예약 정보</SectionTitle>
        <FlexRow>
          <FlexColumn>
            <Label>예약체크</Label>
            <Select name="processType" value={reservationData.processType} onChange={handleChange}>
              <option value="정규">정규</option>
              <option value="특별">특별</option>
            </Select>
          </FlexColumn>
          <FlexColumn>
            <Label>파일첨부</Label>
            <Input type="file" onChange={handleChange} />
          </FlexColumn>
          <FlexColumn>
            <Label>그룹</Label>
            <Input name="groupType" value={reservationData.groupType} onChange={handleChange} />
          </FlexColumn>
        </FlexRow>
        <FlexRow>
          <FlexColumn>
            <Label>상세 타입</Label>
            <Select name="detailType" value={reservationData.detailType} onChange={handleChange}>
              <option value="상세타입1">상세타입1</option>
              <option value="상세타입2">상세타입2</option>
            </Select>
          </FlexColumn>
          <FlexColumn>
            <Label>등록 일시</Label>
            <Input name="registrationTime" type="datetime-local" value={reservationData.registrationTime} onChange={handleChange} />
          </FlexColumn>
          <FlexColumn>
            <Label>처리 일시</Label>
            <Input name="processDate" type="date" value={reservationData.processDate} onChange={handleChange} />
            <Input name="processTime" type="time" value={reservationData.processTime} onChange={handleChange} />
          </FlexColumn>
        </FlexRow>
        <FlexRow>
          <FlexColumn>
            <Label>관련 티켓 수</Label>
            <Input name="relatedTickets" type="number" value={reservationData.relatedTickets} onChange={handleChange} />
          </FlexColumn>
          <FlexColumn>
            <Label>비고</Label>
            <TextArea name="content" value={reservationData.content} onChange={handleChange} />
          </FlexColumn>
        </FlexRow>
        <Button type="submit">예약정보 저장</Button>
      </FormSection>

      <FormSection>
        <SectionTitle>결제 정보</SectionTitle>
        <FlexRow>
          <FlexColumn>
            <Label>결제수단</Label>
            <Select name="paymentMethod" value={paymentData.paymentMethod} onChange={handleChange}>
              <option value="credit">신용카드</option>
              <option value="transfer">계좌이체</option>
            </Select>
          </FlexColumn>
          <FlexColumn>
            <Label>결제금액</Label>
            <Input name="paymentAmount" type="number" value={paymentData.paymentAmount} onChange={handleChange} />
          </FlexColumn>
          <FlexColumn>
            <Label>환불금액</Label>
            <Input name="refundAmount" type="number" value={paymentData.refundAmount} onChange={handleChange} />
          </FlexColumn>
        </FlexRow>
        <FlexRow>
          <FlexColumn>
            <Label>주문 코드</Label>
            <Input name="orderCode" value={paymentData.orderCode} onChange={handleChange} />
          </FlexColumn>
          <FlexColumn>
            <Label>멤버십등록번호</Label>
            <Input name="memberRegistrationNumber" value={paymentData.memberRegistrationNumber} onChange={handleChange} />
          </FlexColumn>
          <FlexColumn>
            <Label>쿠폰 코드</Label>
            <Input name="couponCode" value={paymentData.couponCode} onChange={handleChange} />
          </FlexColumn>
        </FlexRow>
        <Button type="submit">결제 정보 저장</Button>
      </FormSection>
    </form>
    </div>
  </Container>
  );
};

export default OrderModify;