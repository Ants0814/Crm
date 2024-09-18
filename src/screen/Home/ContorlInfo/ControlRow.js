export default function ControlInfo() {
    const controlTypeOptions = ['NumberBox','TextBox','TimeBox','DateBox','DateTimeBox', 'SelectBox', 'CheckBox','PasswordBox','ArraySelectBox','ArrayInput','Button','ArrayButton','FileUpload'];
    const bindKeyOptions = [{ std_group_code: 'key1' }, { std_group_code: 'key2' }, { std_group_code: 'key3' }];
    const bindTypeOptions = ['M', 'S', 'O','C'];
  
    const initialFakeData = [
      {
        column_id: 'column1',
        control_type: 'type1',
        control_size: 'size1',
        bind_key: 'key1',
        bind_type: 'type1',
        bind_option: 'option1',
        bind_display: 'display1'
      }
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
    const [columnIdOptions, setColumnIdOptions] = useState(['column ID']);
    const [bindCodeOptions, setBindCodeOptions] = useState(bindKeyOptions);
  
    useEffect(() => {
      fetchBoardIds();
      fetchData();
    }, []);
  
    const fetchData = async () => {
      try {
        const response = await fetch('https://crm.skynet.re.kr/request/getControlInfo', { credentials: 'include' });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setControlData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    const handleBoardSearch = async () => {
      try {
        const response = await fetch(`https://crm.skynet.re.kr/request/getControlInfo?boardId=${boardSearch}`, { credentials: 'include' });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setControlData(data);
      } catch (error) {
        console.error('Error searching boards:', error);
      }
    };
  
    const handleBoardIdChange = async (e, index) => {
      const boardId = e.target.value;
      handleInputChange(e, index, 'board_id');
      await fetchColumnIds(boardId);
    };

  
    const fetchColumnIds = async (boardId) => {
      try {
        const response = await fetch(`https://crm.skynet.re.kr/request/getColumns?boardId=${boardId}`, { credentials: 'include' });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setColumnIdOptions(data.map(column => column.column_name));
      } catch (error) {
        console.error('Error fetching column IDs:', error);
      }
    };
  
    const fetchBoardIds = async () => {
      try {
        const response = await fetch('https://crm.skynet.re.kr/request/getBoards', { credentials: 'include' });
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
  
    const getCommonCodeGroup = async () => {
      try {
        const res = await fetch('https://crm.skynet.re.kr/request/getCommonCodeGroup', { credentials: 'include' });
        const data = await res.json();
        if (Array.isArray(data)) {
          setBindCodeOptions(data);
        } else {
          console.error('API response is not an array:', data);
        }
      } catch (error) {
        alert('Error: ' + error);
      }
    };
  
    const getTableList = async () => {
      try {
        const res = await fetch('https://crm.skynet.re.kr/request/getTableList', { credentials: 'include' });
        const data = await res.json();
        if (Array.isArray(data)) {
          setBindCodeOptions(data);
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
        bind_display: ''
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
        [field]: e.target.value
      });
    };
  
    const handleTypeChange = (e, index) => {
      handleInputChange(e, index, 'bind_type');
      if (e.target.value === 'M') {
        getTableList();
      } else {
        getCommonCodeGroup();
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
      const rowsToDelete = deletedRows.map(index => controlData[index]);
      const rowsToSave = controlData.filter((_, index) => !deletedRows.includes(index));
      try {
        if (rowsToDelete.length > 0) {
          const deleteResponse = await fetch('https://crm.skynet.re.kr/request/deleteControlInfo', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(rowsToDelete)
          });
          if (!deleteResponse.ok) {
            throw new Error('Network response was not ok');
          }
        }
  
        const saveResponse = await fetch('https://crm.skynet.re.kr/request/updateControlInfo', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(rowsToSave)
        });
        if (!saveResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await saveResponse.json();
        setControlData(data);
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
  
    const toggleEdit = () => {
      setIsEditing(!isEditing);
    };
  
    useEffect(() => {
      if (!isEditing) {
        setSelectedRows([]);
      }
    }, [isEditing]);
  
    return (
      <Container>
        <Title>컨트롤 정보</Title>
        <ControlBox>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search Board ID"
              value={boardSearch}
              onChange={(e) => setBoardSearch(e.target.value)}
            />
            <Button onClick={handleBoardSearch}>검색</Button>
          </SearchContainer>
          <ButtonContainer>
            {isModified && <Button onClick={handleSave}>저장</Button>}
            <Button onClick={handleAddRow}>추가</Button>
            <Button onClick={toggleEdit} disabled={selectedRows.length === 0}>{isEditing ? '취소' : '수정'}</Button>
            <Button onClick={handleDeleteRows}>삭제</Button>
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
            </Tr>
          </Thead>
          <Tbody>
            {controlData.map((control, index) => (
              <ControlRow
                key={index}
                control={control}
                index={index}
                isEditing={isEditing}
                isSelected={selectedRows.includes(index)}
                boardIdOptions={boardIdOptions}
                columnIdOptions={columnIdOptions}
                controlTypeOptions={controlTypeOptions}
                bindTypeOptions={bindTypeOptions}
                bindCodeOptions={bindCodeOptions}
                handleBoardIdChange={handleBoardIdChange}
                handleInputChange={handleInputChange}
                handleTypeChange={handleTypeChange}
                handleSelectRow={handleSelectRow}
                newRow={newRow}
                handleNewRowInputChange={handleNewRowInputChange}
                handleSaveNewRow={handleSaveNewRow}
              />
            ))}
            {newRow && (
              <ControlRow
                control={newRow}
                index={controlData.length}
                isEditing={isEditing}
                isSelected={true}
                boardIdOptions={boardIdOptions}
                columnIdOptions={columnIdOptions}
                controlTypeOptions={controlTypeOptions}
                bindTypeOptions={bindTypeOptions}
                bindCodeOptions={bindCodeOptions}
                handleBoardIdChange={handleBoardIdChange}
                handleInputChange={handleInputChange}
                handleTypeChange={handleTypeChange}
                handleSelectRow={handleSelectRow}
                newRow={newRow}
                handleNewRowInputChange={handleNewRowInputChange}
                handleSaveNewRow={handleSaveNewRow}
              />
            )}
          </Tbody>
        </Table>
      </Container>
    );
  }