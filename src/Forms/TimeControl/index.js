import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

export default function TimeControl({ rows, setIsShowDynamicPopup }) {
  const [selectedGroup, setSelectedGroup] = useState('A'); // 초기값을 'A' 그룹으로 설정
  const [groups, setGroups] = useState(['A']); // 초기값을 'A' 그룹으로 설정

  // DB에서 그룹 데이터를 가져오는 함수
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('/request/getTimeControlGroups'); // 그룹 데이터를 가져오는 API 호출
        if (!response.ok) {
          throw new Error('네트워크 응답이 올바르지 않습니다.');
        }

        const data = await response.json();
        setGroups(data); // 가져온 그룹 데이터를 상태로 설정
      } catch (error) {
        console.error('그룹 데이터를 가져오는 데 실패했습니다:', error);
      }
    };

    fetchGroups();
  }, []);

  const handleRadioChange = (event) => {
    setSelectedGroup(event.target.value); // 라디오 버튼의 값으로 상태 업데이트
  };

  const updateTimeControl = async (row) => {
    try {
      const updatedData = {
        id: row.id,
        selected_group: selectedGroup, // 사용자가 선택한 그룹을 전송 데이터에 포함
      };

      const response = await fetch('/request/time_control', {
        credentials: 'include',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('네트워크 응답이 올바르지 않습니다.');
      }

      const result = await response.json();
      console.log('업데이트 성공:', result);
      return result;
    } catch (error) {
      console.error('업데이트 요청 실패:', error);
      throw error;
    }
  };

  const handleUpdateAllRows = async () => {
    try {
      // 모든 로우에 대해 time_control 업데이트 수행
      const updatePromises = rows.map(row => updateTimeControl(row));
      await Promise.all(updatePromises); // 모든 업데이트가 완료될 때까지 대기

      console.log('모든 로우 업데이트 성공');
      setIsShowDynamicPopup(false); // 모든 업데이트가 성공하면 팝업 닫기
    } catch (error) {
      console.error('하나 이상의 로우 업데이트 실패:', error);
    }
  };

  return (
    <>
      <Overlay>
        <Modal>
          <h2>그룹 선택</h2>
          {groups.map((group) => (
            <StyledLabel key={group}>
              <StyledRadio
                type="radio"
                value={group}
                checked={selectedGroup === group}
                onChange={handleRadioChange}
              />
              {group}
            </StyledLabel>
          ))}
          <Button onClick={handleUpdateAllRows}>확인</Button> {/* 모든 로우 업데이트 함수 호출 */}
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
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const Modal = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  width: 350px;
  max-width: 90%;
  text-align: center;
  position: relative;
  animation: fadeIn 0.3s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 24px;
  background-color: #007bff;
  color: white;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }

  &:active {
    background-color: #003f7f;
    transform: translateY(1px);
  }
`;

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  margin: 10px 0;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
`;

const StyledRadio = styled.input`
  margin-right: 10px;
  width: 18px;
  height: 18px;
  accent-color: #007bff;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;
