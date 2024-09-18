import styled from 'styled-components';

export const StyledTable = styled.table`
  width: 100%;
  table-layout: auto; /* 열 너비를 고정 */
  border-collapse: collapse;
  margin:0px 0px 0px 0px;
  font-size: 0.75rem;
  text-align: left;
  color: black;
`;

export const StyledThead = styled.thead`
  background-color: #f2f2f2;
`;

export const StyledTh = styled.th`
  padding: 12px;
  border: 1px solid #ddd;
`;

export const StyledTbody = styled.tbody`
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

export const StyledTr = styled.tr``;

export const StyledTd = styled.td`
  padding: 12px;
  border: 1px solid #ddd;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 50%;
  max-width: 600px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  color: black;
  font-family: Arial, sans-serif;
  max-height: 80vh;
  overflow-y: auto;
`;

export const ModalTitle = styled.h2`
  margin-top: 0;
  font-size: 24px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
`;

export const FormField = styled.div`
  margin-bottom: 15px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;
export const StyledSearchInput = styled.input`
  height: 100%; // 전체 높이를 td의 100%로 설정
  padding: 10px; // 내부 여백을 제거하여 더 많은 공간 확보
  border: 0px solid #ccc; // 입력 필드의 구분을 위한 경계선 추가
  background-color: #f8f8f8; // 배경색을 설정하여 입력 영역 구분
  font-size: 1.1rem;
  box-sizing: border-box; // 패딩과 보더가 너비에 포함되도록 설정
 height: 2rem; // 높이를 40px로 설정하여 입력 영역 확장
  &:focus {
    border-color: #0056b3; // 포커스 상태일 때 보더 색상 변경
    outline: none; // 기본 아웃라인 제거
    background-color: #eef; // 포커스 상태의 배경색 변경
  }
`;

export const StyledInput = styled.input`
  width: 100%; // 전체 너비를 td의 100%로 설정
  height: 100%; // 전체 높이를 td의 100%로 설정
  padding: 0; // 내부 여백을 제거하여 더 많은 공간 확보
  border: 0px solid #ccc; // 입력 필드의 구분을 위한 경계선 추가
  background-color: #f8f8f8; // 배경색을 설정하여 입력 영역 구분
  font-size: 1.1rem;
  box-sizing: border-box; // 패딩과 보더가 너비에 포함되도록 설정
 height: 2rem; // 높이를 40px로 설정하여 입력 영역 확장
  &:focus {
    border-color: #0056b3; // 포커스 상태일 때 보더 색상 변경
    outline: none; // 기본 아웃라인 제거
    background-color: #eef; // 포커스 상태의 배경색 변경
  }
`;
export const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

export const StyledButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.7rem;
  &:hover {
    background-color: #0056b3;
  }
  &:not(:last-child) {
    margin-right: 10px;
  }
`;
