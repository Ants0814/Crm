// styled.js
import styled from 'styled-components';
import DatePicker from "react-datepicker"; // 달력 입력란 사용

export const SearchContainer = styled.div`
  width:100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
`;


export const SearchBox = styled.div`
  display: flex;
  flex-direction: column;
`;

export const InputBase = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 12px;
  width: 100%;
`;

export const SearchInput = styled.input`
  ${InputBase};
`;

export const SearchLabel = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
  font-size:14px;
  text-align:left;
`;

export const SelectBox = styled.select`
  ${InputBase};
`;

export const DateInput = styled(DatePicker)`
  padding: 10px 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 12px;
  width: calc(100% - 23px);
  border: 1px solid #ccc;
  border-radius: 3px;
`;
export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;
  background-color: ${props => props.primary ? '#007bff' : '#6c757d'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s;
  &:hover {
    background-color: ${props => props.primary ? '#0056b3' : '#5a6268'};
  }
  svg {
    margin-right: 5px;
  }
`;