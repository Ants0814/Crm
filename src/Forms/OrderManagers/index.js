import styled from 'styled-components';
import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../AppContext';
import MessageSend from '../MessageSend';

// Styled components
const Container = styled.div`
  margin: 0 auto;
  padding: 10px; /* Padding reduced */
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Shadow reduced */
  border-radius: 4px; /* Border radius reduced */
  margin-bottom: 15px; /* Margin reduced */
`;

const Header = styled.h2`
  text-align: left;
  font-size: 1rem; /* Font size reduced */
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem; /* Margin reduced */
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-bottom: 1rem; /* Margin reduced */
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); /* Shadow reduced */
`;

const StyledHeader = styled.th`
  background-color: #f8f8f8;
  color: #555;
  padding: 4px; /* Padding reduced */
  text-align: left;
  font-size: 0.8rem; /* Font size reduced */
  border-bottom: 1px solid #e0e0e0; /* Border reduced */
`;

const StyledRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }

  &:hover {
    background-color: #f1f1f1;
  }
`;

const StyledCell = styled.td`
  padding: 4px; /* Padding reduced */
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
  font-size: 0.8rem; /* Font size reduced */
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 4px 8px; /* Padding reduced */
  border: none;
  border-radius: 3px; /* Border radius reduced */
  cursor: pointer;
  font-size: 0.6rem; /* Font size reduced */
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

function DataTable() {
  const { isLoggedIn, user } = useContext(AppContext);
  const [data, setData] = useState([]);
  const [isTableVisible, setIsTableVisible] = useState(true); // 테이블 표시 여부 상태

  useEffect(() => {
    // Fetch data from the server
    const fetchData = async () => {
      try {
        const response = await fetch('https://crm.skynet.re.kr/request/get_deposit_list', { credentials: 'include' });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        
        // 날짜 형식을 변환
        const formattedData = result.map((item) => ({
          ...item,
          payment_date: formatDate(item.payment_date),
        }));

        setData(formattedData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user && user.name) {
      // Handle user data if necessary
    }
  }, [user]);

  // 날짜 형식을 yyyy-mm-dd hh:mm:ss로 변환하는 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  };

  // 테이블 표시/숨기기 핸들러
  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };

  return (
    <Container>
      <div>
        <Header>
          입금대기/실패내역
          <Button onClick={toggleTableVisibility}>
            {isTableVisible ? '숨기기' : '보기'}
          </Button>
        </Header>
        {isTableVisible && ( // 테이블이 보일 때만 렌더링
          <TableWrapper>
            <StyledTable>
              <thead>
                <tr>
                  <StyledHeader>입금일자</StyledHeader>
                  <StyledHeader>입금액</StyledHeader>
                  <StyledHeader>입금자명</StyledHeader>
                  <StyledHeader>사이트명</StyledHeader>
                  <StyledHeader>계좌번호</StyledHeader>
                  <StyledHeader>입금방법</StyledHeader>
                  <StyledHeader>상태</StyledHeader>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <StyledRow key={index}>
                    <StyledCell>{item.payment_date}</StyledCell>
                    <StyledCell>{item.payamount}</StyledCell>
                    <StyledCell>{item.depositor_name}</StyledCell>
                    <StyledCell>{'파인시네마'}</StyledCell>
                    <StyledCell>{item.account_number}</StyledCell>
                    <StyledCell>{item.payment_method}</StyledCell>
                    <StyledCell>{item.status}</StyledCell>
                  </StyledRow>
                ))}
              </tbody>
            </StyledTable>
          </TableWrapper>
        )}
        <label style={{ fontSize: '0.7rem' }}>오늘의 시세 : cgv : 9,188원 / lotte : 8,013원 / megabox : 8,051원 - </label>
        <label style={{ fontSize: '0.6rem', color: 'red' }}>[주말기준정상가 - 체결금액 * 0.05]</label>
      </div>
    </Container>
  );
}

export default DataTable;
