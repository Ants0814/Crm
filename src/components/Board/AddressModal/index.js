import React, { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
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

const AddressInput = styled.input`
  width: calc(100% - 20px);
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ConfirmButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #218838;
  }
`;

export function AddressModal({ onChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  // 주소 선택 시 호출되는 함수
  const handleComplete = data => {
    const fullAddress = data.address;
    setSelectedAddress(fullAddress); // 기본 주소 설정
  };

  // 확인 버튼 클릭 시 호출되는 함수
  const handleConfirm = () => {
    const fullAddress = `${selectedAddress} ${detailAddress}`.trim();
    setIsModalOpen(false); // 모달 닫기

    // 부모 컴포넌트로 주소 전달
    if (onChange) {
      onChange(fullAddress);
    }
  };

  // 주소 초기화 함수
  const handleReset = e => {
    e.stopPropagation(); // 부모 버튼이 클릭되는 것을 방지
    setSelectedAddress(''); // 선택된 주소 초기화
    setDetailAddress(''); // 상세 주소 초기화
    if (onChange) {
      onChange(undefined); // 부모 컴포넌트에 undefined 값 전달
    }
  };

  return (
    <div>
      <Button type="button" onClick={() => setIsModalOpen(true)}>
        <span className="button-content">
          {selectedAddress ? `${selectedAddress} ${detailAddress}` : '주소 검색'}
        </span>
        {selectedAddress && (
          <span className="reset-icon" onClick={handleReset}>
            &times;
          </span>
        )}
      </Button>

      {/* 모달창 */}
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={() => setIsModalOpen(false)}>&times;</CloseButton>
            <DaumPostcode onComplete={handleComplete} />
            {
              <>
                {/* 기본 주소 입력란 (ReadOnly) */}
                <AddressInput
                  type="text"
                  value={selectedAddress}
                  readOnly
                  placeholder="선택된 기본 주소"
                />
                {/* 상세 주소 입력란 */}
                <AddressInput
                  type="text"
                  placeholder="상세 주소를 입력하세요"
                  value={detailAddress}
                  onChange={e => setDetailAddress(e.target.value)}
                />
                {/* 확인 버튼 */}
                <ConfirmButton type='button' onClick={handleConfirm}>확인</ConfirmButton>
              </>
            }
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
}

export default AddressModal;
