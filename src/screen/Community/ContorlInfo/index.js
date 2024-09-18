import React, { useState, useEffect } from 'react';
import {
  Container,
  Select,
  Title,
  ButtonContainer,
  Button,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  Input,
  SearchContainer,
  SearchInput,
  ControlBox,
  StyledSearchInput,
} from './styled';

import { FaCheck } from 'react-icons/fa';

export default function ControlInfo() {
  const controlTypeOptions = [
    'NumberBox',
    'TextBox',
    'SelectBox',
    'CheckBox',
    'ArrayInput',
    'ArraySelectBox',
    'PasswordBox',
    'TimeBox',
    'DateBox',
    'DateTimeBox',
    'Button',
    'ArrayButton',
    'PostCode',
    'FileUpload',
  ];
  const bindTypeOptions = ['M', 'S', 'O','C'];

  const initialFakeData = [
    {
      board_id: 'board1', // Example board_id for testing
      column_id: 'column1',
      control_type: 'type1',
      control_size: 'size1',
      bind_key: 'key1',
      bind_type: 'M', // Initial type for testing binding
      bind_option: 'option1',
      bind_display: 'display1',
      root_column: 'root1',
      where_column: 'where1',
      bindKeyOptions: [],
    },
  ];

  const [boardSearch, setBoardSearch] = useState('');
  const [columnSearch, setColumnSearch] = useState('');
  const [controlData, setControlData] = useState(initialFakeData);
  const [newRow, setNewRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [deletedRows, setDeletedRows] = useState([]);
  const [isModified, setIsModified] = useState(false);
  const [boardIdOptions, setBoardIdOptions] = useState(['board ID']);
  const [columnIdOptions, setColumnIdOptions] = useState({}); // Store column options for each board

  useEffect(() => {
    fetchBoardIds();
    fetchData();
  }, []);

  useEffect(() => {
    // When entering edit mode, initialize child dropdowns for selected rows
    if (isEditing) {
      selectedRows.forEach((index) => {
        const item = controlData[index];
        if (item.board_id) {
          fetchColumnIds(item.board_id, index); // Fetch columns for the selected board_id
        }
        if (item.bind_type === 'M') {
          getTableList(index);
        } else {
          getCommonCodeGroup(index);
        }
      });
    }
  }, [isEditing]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://crm.skynet.re.kr/request/getControlInfo',
        { credentials: 'include' }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setControlData(data.map((item) => ({ ...item, bindKeyOptions: [] })));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleBoardSearch = async () => {
    try {
      const response = await fetch(
        `https://crm.skynet.re.kr/request/getControlInfo?boardId=${boardSearch}`,
        { credentials: 'include' }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setControlData(data.map((item) => ({ ...item, bindKeyOptions: [] })));
    } catch (error) {
      console.error('Error searching boards:', error);
    }
  };

  

  const handleBoardIdChange = async (e, index) => {
    const boardId = e.target.value;
    handleInputChange(e, index, 'board_id');
    await fetchColumnIds(boardId, index);
  };

  const fetchColumnIds = async (boardId, rowIndex) => {
    try {
      const response = await fetch(
        `https://crm.skynet.re.kr/request/getColumns?boardId=${boardId}`,
        { credentials: 'include' }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setColumnIdOptions((prevOptions) => ({
        ...prevOptions,
        [rowIndex]: data.map((column) => column.column_name),
      }));
    } catch (error) {
      console.error('Error fetching column IDs:', error);
    }
  };

  const fetchBoardIds = async () => {
    try {
      const response = await fetch(
        'https://crm.skynet.re.kr/request/getBoards',
        { credentials: 'include' }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setBoardIdOptions(data);
    } catch (error) {
      console.error('Error fetching board IDs:', error);
    }
  };

  const handleSelectRow = (index) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(index)) {
        return prevSelectedRows.filter((row) => row !== index);
      } else {
        return [...prevSelectedRows, index];
      }
    });
  };

  const getCommonCodeGroup = async (index) => {
    try {
      const res = await fetch(
        'https://crm.skynet.re.kr/request/getCommonCodeGroup',
        { credentials: 'include' }
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setControlData((prevData) =>
          prevData.map((item, idx) =>
            idx === index ? { ...item, bindKeyOptions: data } : item
          )
        );
      } else {
        console.error('API response is not an array:', data);
      }
    } catch (error) {
      alert('Error: ' + error);
    }
  };

  const getTableList = async (index) => {
    try {
      const res = await fetch(
        'https://crm.skynet.re.kr/request/getTableList',
        { credentials: 'include' }
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setControlData((prevData) =>
          prevData.map((item, idx) =>
            idx === index ? { ...item, bindKeyOptions: data } : item
          )
        );
      } else {
        console.error('API response is not an array:', data);
      }
    } catch (error) {
      alert('Error: ' + error);
    }
  };

  const handleAddRow = () => {
    setNewRow({
      column_id: '',
      control_type: '',
      control_size: 2,
      bind_key: '',
      bind_type: '',
      bind_option: '',
      bind_display: '',
      root_column: '',
      where_column: '',
      bindKeyOptions: [],
    });
    setIsEditing(true);
  };

  const handleInputChange = (e, index, field) => {
    const newData = controlData.map((row, i) => {
      if (i === index) {
        return { ...row, [field]: e.target.value };
      }
      return row;
    });
    setControlData(newData);
    setIsModified(true);
  };

  const handleNewRowInputChange = (e, field) => {
    setNewRow({
      ...newRow,
      [field]: e.target.value,
    });
  };

  const handleTypeChange = (e, index) => {
    handleInputChange(e, index, 'bind_type');
    if (e.target.value === 'M') {
      getTableList(index);
    } else {
      getCommonCodeGroup(index);
    }
    setIsModified(true);
  };

  const handleSaveNewRow = () => {
    setControlData([...controlData, newRow]);
    setNewRow(null);
    setIsEditing(false);
    setIsModified(true);
  };

  const handleSave = async () => {
    const rowsToDelete = deletedRows.map((index) => controlData[index]);
    const rowsToSave = controlData.filter(
      (_, index) => !deletedRows.includes(index)
    );
    try {
      if (rowsToDelete.length > 0) {
        const deleteResponse = await fetch(
          'https://crm.skynet.re.kr/request/deleteControlInfo',
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(rowsToDelete),
          }
        );
        if (!deleteResponse.ok) {
          throw new Error('Network response was not ok');
        }
      }

      const saveResponse = await fetch(
        'https://crm.skynet.re.kr/request/updateControlInfo',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(rowsToSave),
        }
      );
      alert('저장 완료');
      if (!saveResponse.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await saveResponse.json();
      setControlData(data.map((item) => ({ ...item, bindKeyOptions: [] })));
      setIsEditing(false);
      setSelectedRows([]);
      setDeletedRows([]);
      setIsModified(false);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleDeleteRows = () => {
    setDeletedRows([...deletedRows, ...selectedRows]);
    setSelectedRows([]);
    setIsModified(true);
  };

  const cancelNewRow = () => {
    setNewRow(null);
    setIsEditing(false);
  };

  const toggleEdit = () => {
    if (newRow) {
      cancelNewRow();
    } else {
      setIsEditing(!isEditing);
    }
  };

  useEffect(() => {
    if (!isEditing) {
      setSelectedRows([]);
    }
  }, [isEditing]);

  const isAnyRowSelected = selectedRows.length > 0;

  return (
    <Container>
      <Title>컨트롤 정보</Title>
      <ControlBox>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0px' }}>
          <StyledSearchInput
            type="text"
            placeholder="검색어를 입력하세요"
            value={boardSearch}
            onChange={(e) => setBoardSearch(e.target.value)}
            />
          <Button onClick={handleBoardSearch}>검색</Button>
          </div>
        <ButtonContainer>
          {isModified && <Button onClick={handleSave}>저장</Button>}
          {!isAnyRowSelected && !newRow && <Button onClick={handleAddRow}>추가</Button>}
          <Button onClick={toggleEdit} disabled={!isAnyRowSelected && !newRow}>
            {isEditing ? '취소' : '수정'}
          </Button>
          <Button onClick={handleDeleteRows} disabled={!isAnyRowSelected}>
            삭제
          </Button>
        </ButtonContainer>
      </ControlBox>
      <Table>
        <Thead>
          <Tr>
            <Th></Th>
            <Th>Board ID</Th>
            <Th>Column ID</Th>
            <Th>Control Type</Th>
            <Th>Bind Type</Th>
            <Th>Bind Key</Th>
            <Th>Bind Option</Th>
            <Th>Bind Display</Th>
            <Th>root_column</Th>
            <Th>where_column</Th>
          </Tr>
        </Thead>
        <Tbody>
          {controlData.map(
            (control, index) =>
              !deletedRows.includes(index) && (
                <Tr key={index}>
                  <Td>
                    {!newRow && (
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(index)}
                        onChange={() => handleSelectRow(index)}
                        readOnly={isEditing}
                        disabled={isEditing && true}
                      />
                    )}
                  </Td>
                  {isEditing && selectedRows.includes(index) ? (
                    <>
                      <Td>
                        <Select
                          value={control.board_id}
                          onChange={(e) => handleBoardIdChange(e, index)}
                        >
                          <option value="">선택</option>
                          {boardIdOptions.map((option) => (
                            <option
                              key={option.board_id}
                              value={option.board_id}
                            >
                              {option.board_title}
                            </option>
                          ))}
                        </Select>
                      </Td>
                      <Td>
                        <Select
                          value={control.column_id}
                          onChange={(e) =>
                            handleInputChange(e, index, 'column_id')
                          }
                        >
                          <option value="">선택</option>
                          {(columnIdOptions[index] || []).map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </Select>
                      </Td>
                      <Td>
                        <Select
                          value={control.control_type}
                          onChange={(e) =>
                            handleInputChange(e, index, 'control_type')
                          }
                        >
                          <option value="">선택</option>
                          {controlTypeOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </Select>
                      </Td>
                      <Td>
                        <Select
                          value={control.bind_type}
                          onChange={(e) => handleTypeChange(e, index)}
                        >
                          <option value="">선택</option>
                          {bindTypeOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </Select>
                      </Td>
                      <Td>
                        <Select
                          value={control.bind_key}
                          onChange={(e) =>
                            handleInputChange(e, index, 'bind_key')
                          }
                        >
                          <option value="">선택</option>
                          {control.bindKeyOptions.map((option) => (
                            <option
                              key={option.std_group_code}
                              value={option.std_group_code}
                            >
                              {option.std_group_code}
                            </option>
                          ))}
                        </Select>
                      </Td>
                      <Td>
                        <Input
                          value={control.bind_option}
                          onChange={(e) =>
                            handleInputChange(e, index, 'bind_option')
                          }
                        />
                      </Td>
                      <Td>
                        <Input
                          value={control.bind_display}
                          onChange={(e) =>
                            handleInputChange(e, index, 'bind_display')
                          }
                        />
                      </Td>
                      <Td>
                        <Input
                          value={control.root_column}
                          onChange={(e) =>
                            handleInputChange(e, index, 'root_column')
                          }
                        />
                      </Td>
                      <Td>
                        <Input
                          value={control.where_column}
                          onChange={(e) =>
                            handleInputChange(e, index, 'where_column')
                          }
                        />
                      </Td>
                    </>
                  ) : (
                    <>
                      <Td>{control.board_id}</Td>
                      <Td>{control.column_id}</Td>
                      <Td>{control.control_type}</Td>
                      <Td>{control.bind_type}</Td>
                      <Td>{control.bind_key}</Td>
                      <Td>{control.bind_option}</Td>
                      <Td>{control.bind_display}</Td>
                      <Td>{control.root_column}</Td>
                      <Td>{control.where_column}</Td>
                    </>
                  )}
                </Tr>
              )
          )}
          {newRow && (
            <Tr>
              <Td>
                <FaCheck
                  onClick={handleSaveNewRow}
                  style={{ cursor: 'pointer' }}
                />
              </Td>
              <Td>
                <Select
                  value={newRow.board_id}
                  onChange={(e) => handleNewRowInputChange(e, 'board_id')}
                >
                  <option value="">선택</option>
                  {boardIdOptions.map((option) => (
                    <option key={option.board_id} value={option.board_id}>
                      {option.board_title}
                    </option>
                  ))}
                </Select>
              </Td>
              <Td>
                <Select
                  value={newRow.column_id}
                  onChange={(e) => handleNewRowInputChange(e, 'column_id')}
                >
                  <option value="">선택</option>
                  {(columnIdOptions[newRow.board_id] || []).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </Td>
              <Td>
                <Select
                  value={newRow.control_type}
                  onChange={(e) => handleNewRowInputChange(e, 'control_type')}
                >
                  <option value="">선택</option>
                  {controlTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </Td>
              <Td>
                <Select
                  value={newRow.bind_type}
                  onChange={(e) => handleNewRowInputChange(e, 'bind_type')}
                >
                  <option value="">선택</option>
                  {bindTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </Td>
              <Td>
                <Select
                  value={newRow.bind_key}
                  onChange={(e) => handleNewRowInputChange(e, 'bind_key')}
                >
                  <option value="">선택</option>
                  {newRow.bindKeyOptions.map((option) => (
                    <option key={option.std_group_code} value={option.std_group_code}>
                      {option.std_group_code}
                    </option>
                  ))}
                </Select>
              </Td>
              <Td>
                <Input
                  value={newRow.bind_option}
                  onChange={(e) => handleNewRowInputChange(e, 'bind_option')}
                />
              </Td>
              <Td>
                <Input
                  value={newRow.bind_display}
                  onChange={(e) => handleNewRowInputChange(e, 'bind_display')}
                />
              </Td>
              <Td>
                <Input
                  value={newRow.root_column}
                  onChange={(e) => handleNewRowInputChange(e, 'root_column')}
                />
              </Td>
              <Td>
                <Input
                  value={newRow.where_column}
                  onChange={(e) => handleNewRowInputChange(e, 'where_column')}
                />
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Container>
  );
}
