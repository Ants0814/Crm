import styled from 'styled-components';
import DatePicker from "react-datepicker"; // 달력 입력란 사용

export const FileUploadLabel = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
  text-align:left;
`;
export const ZipButton = styled.button`
  width:100%;
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
export const FileIcon = styled.button`

  background: transparent;
  border: none;
  font-size: 12px;
  z-index: 1001;
  align-self:end;
`;
export const BoardContainer = styled.div`
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const BoardHeader = styled.div`
  text-align: center;
  justify-content: space-between;
  display: flex;
`;

export const BoardTitle = styled.h2`
  font-size: 20px;
  text-align: left;
  padding: 5px;
`;

export const PaginationContainer = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

export const PaginationButtons = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px;
`;

export const PaginationButton = styled.button`
  margin: 0 4px;
  padding: 8px 12px;
  background-color: ${props => (props.disabled ? '#b9b8c38f' : '#46b5bd')};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  &:hover {
    background-color: ${props => !props.disabled && '#469bbdb5'};
  }
`;

export const StyledTable = styled.table`
  min-width:100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 12px;
  text-align: left;
  color: black;
  table-layout:auto;
  flex-shrink:0;
`;

export const StyledThead = styled.thead`
  background-color: #f2f2f2;
`;

export const StyledTh = styled.th`
  padding: 4px;
  border: 1px solid #ddd;
  white-space:nowrap;
`;

export const StyledTbody = styled.tbody`
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

export const StyledTr = styled.tr``;

export const StyledTd = styled.td`
  padding: 4px;
  border: 1px solid #ddd;
  word-break : break-all;
`;

//===============================================================


export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  width:100%;
`;

export const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
  text-align:left;
`;

export const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 12px;
  width:calc(100% - 20px);
  min-width:20px;
`;
export const DyInput = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 12px;
`;
export const Select = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 12px;
`;

//===============================================================

export const PostFormContainer = styled.div`
  margin: 20px 0;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const FormTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
`;

export const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`;


export const SubmitButton = styled.button`
  padding: 10px 24px;
  margin: 5px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #1f2937;
  grid-column: span 4;
  width: 100%;
  ${({ variant }) => variant === 'blue' && `
    background-color: #1f2937;
    color: white;
  `}
  ${({ variant }) => variant === 'green' && `
    background-color: #1f2937;
    color: white;
  `}
`;

//================================================================
export const ManageBoardWrapper = styled.div`
display: flex;
flex-direction: row;
align-items: flex-start;
justify-content: space-around;
width: 100%;
padding: 20px;
box-sizing: border-box;
`;


export const Textarea = styled.textarea`
margin-bottom: 10px;
width: 300px;
height: 150px;
`;

export const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
`;

export const SearchBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 20px;

  &:last-child {
    margin-right: 0;
  }
`;
export const DateInput = styled(DatePicker)`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 12px;
  
  
`;
export const SearchLabel = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

export const SearchInput = styled.input`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
`;

export const SearchButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export const SaveButton = styled.button`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  width:100%;

  &:hover {
    background-color: #0056b3;
  }

  svg {
    margin-right: 8px;
  }
`;
export const TextareaWrapper = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
margin-right: 20px;
`;

//========================================================
export const InputWrapper = styled.div`
  display: flex;
  
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
`;
export const AddButton = styled.button`
display: flex;
align-items: center;
gap: 5px;
margin-top: 5px;
`;

export const JsonBox = styled.div`
flex-direction:column;
  margin-top: 10px;
`;
export const Modal = styled.div`
  /* Modal styling */
`;


export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 10px;
  margin-bottom: 20px;
`;

export const ModalBody = styled.div`
  margin-bottom: 20px;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;
export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

export const ToolbarContainer = styled.div`
  width:100%;
  display: grid;
  margin:0px 0px 15px 0px;
  padding: 20px 0px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
`;

export const DyControlButton = styled.button`
    width: 6.5rem;
    max-width:8.5rem;
    height: 2.2rem;
    margin:0px 2px;
    border-radius: 0.4rem;
    font-weight: bold;
    font-size: 1rem;
    border: none;
    background-color: ${(props) => (props.selected ? 'rgb(30, 150, 160)' : 'rgb(110, 10, 33)')};
    color: #fff;
      &:hover {
         background-color:rgb(140, 10, 33);
      }
    `

export const ControlButton = styled.button`
    width: 5.5rem;
    height: 2.2rem;
    margin:0px 2px;
    border-radius: 0.4rem;
    font-weight: bold;
    font-size: 1rem;
    border: none;
    background-color: ${(props) => (props.selected ? 'rgb(30, 150, 160)' : 'rgb(70, 181, 189)')};
    color: #fff;
    `
    
   export const PostButton = styled.button`
    width : calc(100%);
    height: 3.5rem;
    margin:0px 0px 15px 0px;
    border-radius: 0.5rem;
    font-weight: bold;
    font-size: 1rem;
    border: none;
    background-color: #0056b3;
    color: #fff;
    cursor:pointer;
      &:hover {
         background-color: #0036b5;
      }
    `