import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const OrderList = styled.div`
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  background-color: #f2f2f2;
  text-align: left;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const Footer = styled.div`
  margin-top: 20px;
`;

const FooterText = styled.p`
  margin: 5px 0;
`;

const Filters = styled.div`
  margin-top: 20px;
`;

const Label = styled.label`
  margin-right: 10px;
`;

const Select = styled.select`
  margin-right: 20px;
`;

const Input = styled.input`
  margin-right: 20px;
`;

const AdvancedFilters = styled.div`
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export const AccountPopup = () => {
  return (
    <Container>
      <h2>주문관리-목록</h2>
      <OrderList>
        <Table>
          <thead>
            <tr>
              <Th>입금자명</Th>
              <Th>상태</Th>
              <Th>입금액</Th>
              <Th>사이트명</Th>
              <Th>날짜</Th>
              <Th>문자내용</Th>
              <Th>계좌번호</Th>
              <Th>수정</Th>
            </tr>
          </thead>
          <tbody>
            {/* Repeat this block for each row */}
            <tr>
              <Td>김용진</Td>
              <Td>대기</Td>
              <Td>10,500</Td>
              <Td>파일시네마</Td>
              <Td>7월24일 19시57분</Td>
              <Td>[KB]07/24 19:56 464401**764 김용진 전자금융입금</Td>
              <Td>464401</Td>
              <Td><Button>목록에서제거</Button></Td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </Table>
      </OrderList>
      <Footer>
        <FooterText>오늘의 시세: cgv: 10,059원 / lotte: 8,938원 / megabox: 9,054원</FooterText>
        <FooterText>1인당 수수료안내</FooterText>
        <FooterText>주말기준정상가 - 체크금액 * 0.05 예) 주말기준정상가(15,000원 - 11,000원) * 0.05 = 200 원</FooterText>
      </Footer>
      <Filters>
        <Label>결제상태:</Label>
        <Select>
          <option>입금대기</option>
          <option>결제완료</option>
          <option>환불완료</option>
          <option>환불요청</option>
        </Select>
        <Label>예약상태:</Label>
        <Select>
          <option>준비</option>
          <option>진행중</option>
          <option>완료</option>
          <option>취소</option>
        </Select>
        <Label>결제기간:</Label>
        <Input type="date" />
        <Label>관람기간:</Label>
        <Input type="date" />
      </Filters>
      <AdvancedFilters>
        <Label>대행형태:</Label>
        <Select>
          <option>전체</option>
          <option>그룹</option>
          <option>시간타임그룹</option>
        </Select>
        <Label>결제수단:</Label>
        <Select>
          <option>전체</option>
          <option>사이트</option>
          <option>전체</option>
          <option>주문종류</option>
        </Select>
      </AdvancedFilters>
    </Container>
  );
};

