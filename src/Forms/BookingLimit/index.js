import React, { useState } from 'react';
import styled from 'styled-components';

export default function BookingLimit({ rows, setIsShowDynamicPopup }) {
    const updateBookingLimit = async (row, isLimit) => {
      try {
        const updatedData = {
          id: row.id, // 현재 행의 ID
          limitEnabled: isLimit, // true 또는 false
        };
  
        const response = await fetch('/request/booking_limit', {
          credentials:'include',
          method: 'PUT', // PUT 메서드 사용
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData), // JSON 형식으로 변환된 데이터
        });
  
        if (!response.ok) {
          throw new Error('네트워크 응답이 올바르지 않습니다.');
        }
  
        const result = await response.json();
        console.log('업데이트 성공:', result);
        return result; // 성공한 결과 반환
      } catch (error) {
        console.error('업데이트 요청 실패:', error);
        throw error; // 에러를 호출한 곳으로 다시 던짐
      }
    };
  
    const handleEnableLimit = async () => {
      console.log('예매 제한 사용 설정');
      try {
        await Promise.all(rows.map((row) => updateBookingLimit(row, true)));
        console.log('모든 행에 대해 예매 제한 사용 설정 완료');
      } catch (error) {
        console.error('일부 또는 모든 행에 대한 예매 제한 사용 설정 실패:', error);
      }
      setIsShowDynamicPopup(false);
    };
  
    const handleDisableLimit = async () => {
      console.log('예매 제한 해제');
      try {
        await Promise.all(rows.map((row) => updateBookingLimit(row, false)));
        console.log('모든 행에 대해 예매 제한 해제 완료');
      } catch (error) {
        console.error('일부 또는 모든 행에 대한 예매 제한 해제 실패:', error);
      }
      setIsShowDynamicPopup(false);
    };
  return (
    <>
        <Overlay>
          <Modal>
            <h2>예매 제한 설정</h2>
            <p>원하는 작업을 선택하세요:</p>
            <Button onClick={handleEnableLimit}>예매 제한 사용</Button>
            <Button onClick={handleDisableLimit}>예매 제한 해제</Button>
            <Button onClick={()=>setIsShowDynamicPopup(false)}>취소</Button>
          </Modal>
        </Overlay>
    </>
  );
}

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
`;

const Button = styled.button`
  margin: 10px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;

  &:hover {
    background-color: #0056b3;
  }
`;