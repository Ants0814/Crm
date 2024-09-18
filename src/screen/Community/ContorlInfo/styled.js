import styled from 'styled-components';

// Styled Components 정의
export const Container = styled.div`
width:100%;
  padding: 20px;
  font-family: Arial, sans-serif;
`;
export const Select = styled.select`
  width: calc(100% - 24px);  // padding과 border를 고려하여 조정
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box; // padding과 border가 width에 포함되도록 설정
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
`;
export const Title = styled.h2`
  text-align: left;
  color: #333;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;
export const ControlBox = styled.div`
  display: flex;
  justify-content: space-between;
  width:100%;
`;
export const Button = styled.button`
    width: 5.5rem;
    height: 2.2rem;
    border-radius: 0.4rem;
    font-weight: bold;
    font-size: 0.7rem;
    border: none;
    background-color: rgb(70, 181, 189);
    color: #fff;
    margin-left:20px;
  &:hover 
    background-color: #0056b3;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 0.8rem;
  text-align: left;
`;

export const Thead = styled.thead`
  background-color: #f2f2f2;
`;

export const Th = styled.th`
  padding: 12px;
  border: 1px solid #ddd;
`;

export const Tbody = styled.tbody`
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

export const Tr = styled.tr``;

export const Td = styled.td`
  padding: 12px;
  border: 1px solid #ddd;
  position: relative;
`;

export const Input = styled.input`
  width: calc(100% - 24px);  // padding과 border를 고려하여 조정
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box; // padding과 border가 width에 포함되도록 설정
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
`;

export const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
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