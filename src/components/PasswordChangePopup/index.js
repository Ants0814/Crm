import React, { useState } from 'react';
import styled from 'styled-components';

// Styled components 정의
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1001;
`;

const Title = styled.h2`
  margin: 0 0 20px 0;
  font-size: 18px;
  text-align: center;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #ddd;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #4CAF50;
  color: white;

  &:hover {
    background-color: #45a049;
  }
`;

const CancelButton = styled(Button)`
  background-color: #f44336;
  color: white;

  &:hover {
    background-color: #da190b;
  }
`;

// PasswordChangePopup 컴포넌트
const PasswordChangePopup = ({ onClose, onSubmit }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleSubmit = () => {
    // 간단한 유효성 검사
    if (!newPassword || !confirmNewPassword) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    // 비밀번호 변경 요청 콜백 함수 호출
    onSubmit(newPassword);
  };

  return (
    <Overlay>
      <PopupContainer>
        <Title>비밀번호 변경</Title>
        <Label>
          새 비밀번호:
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Label>
        <Label>
          새 비밀번호 확인:
          <Input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </Label>
        <ButtonContainer>
          <SubmitButton onClick={handleSubmit}>변경하기</SubmitButton>
          <CancelButton onClick={onClose}>취소</CancelButton>
        </ButtonContainer>
      </PopupContainer>
    </Overlay>
  );
};

export default PasswordChangePopup;
