import styled from 'styled-components';
import DatePicker from 'react-datepicker'; // 달력 입력란 사용
export const Checkbox = styled.input`
  margin-left: 10px;
  transform: scale(1.5);
`;
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;

  th, td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

export const TableCell = styled.td``;
export const ColumnSettingsWrapper = styled.div`
  width:100%;
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
`;
export const ControlSettingsWrapper = styled.div`
  width:100%;
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
`;
export const ManageBoardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const ActionSection = styled.div`
  position:relative;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex: 1 1 calc(33% - 40px); /* 세 섹션을 균등하게 배치 */
  box-sizing: border-box;
`;

export const SectionTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  text-align: center;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #007bff;
  }
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
  font-size: 14px;
  transition: background-color 0.3s;
  &:hover {
    background-color: ${props => props.primary ? '#0056b3' : '#5a6268'};
  }
  svg {
    margin-right: 5px;
  }
`;

export const SaveButton = styled(Button)`
  width: 100%;
  margin-top: 15px;
`;

export const AddButton = styled(Button)`
  margin: 10px 0;
`;

export const InputGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

export const RemoveButton = styled(Button)`
  padding: 5px 10px;
  margin-left: 10px;
`;
