import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faPlus, faTrash, faL } from '@fortawesome/free-solid-svg-icons';
import CustomSelectBox from '../../../SearchSelecter';  // CustomSelectBox를 불러옵니다.
import { ControlSettingsWrapper,SectionTitle, AddButton, ActionSection, InputGroup, SaveButton, ManageBoardWrapper, Input, RemoveButton, ColumnSettingsWrapper, Checkbox, Table, TableRow, TableCell } from './styled';

const ManageBoard = ({ tableName, setValues, values ,menuConfig,setMenuConfig}) => {
  const { user } = useApp();
  const [columns, setColumns] = useState([]);
  const [options, setOptions] = useState([]);
  const [titleColumn, setTitleColumn] = useState(menuConfig.display_title);
  const [contentColumn, setContentColumn] = useState(menuConfig.display_content);

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const response = await fetch(`/request/getActionInfo?board_id=${tableName}`, { credentials: 'include' });
        const data = await response.json();
        if (data.action_info) {
          setValues(data.action_info);
        }
      } catch (error) {
        console.error('Error fetching board data:', error);
      }
    };

    const fetchColumns = async () => {
      try {
        const response = await fetch(`/request/getColumnsInfo?boardId=${tableName}`, { credentials: 'include' });
        const data = await response.json();
        setColumns(data);
      } catch (error) {
        console.error('Error fetching columns:', error);
      }
    };

    fetchBoardData();
    fetchColumns();
  }, [tableName, setValues]);
    useEffect(() => {
      const updatedOptions = columns.map(column => ({
        std_key: column.column_title, // Display value
        std_value: column.column_id     // Actual value
      }));
      setOptions(updatedOptions);
    }, [columns]);

  const handleChange = (actionType, field, value) => {
    setValues(prev => ({
      ...prev,
      [actionType]: {
        ...prev[actionType],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (actionType, field, index, value) => {
    setValues(prev => ({
      ...prev,
      [actionType]: {
        ...prev[actionType],
        [field]: prev[actionType][field].map((item, i) => i === index ? value : item)
      }
    }));
  };

  const handleAddField = (actionType, field) => {
    setValues(prev => ({
      ...prev,
      [actionType]: {
        ...prev[actionType],
        [field]: [...(prev[actionType][field] || []), ""]
      }
    }));
  };

  const handleRemoveField = (actionType, field, index) => {
    setValues(prev => ({
      ...prev,
      [actionType]: {
        ...prev[actionType],
        [field]: prev[actionType][field].filter((_, i) => i !== index)
      }
    }));
  };

  const handleSaveActionInfo = async () => {
    try {
      await fetch('/request/saveActionInfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board_id: tableName, action_info: values })
      });
      alert('Action info saved successfully');
    } catch (error) {
      console.error('Error saving action info:', error);
      alert('Failed to save action info');
    }
  };

  const handleSaveControlSettings = async () => {
    alert(tableName);
    try {
      await fetch('/request/saveControlSettings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board_id: tableName, columns })
      });
      alert('Column settings saved successfully');
    } catch (error) {
      console.error('Error saving column settings:', error);
      alert('Failed to save column settings');
    }
  };
  const handleSaveColumnSettings = async () => {
    alert(tableName);
    try {
      await fetch('/request/saveColumnSettings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board_id: tableName, columns })
      });
      alert('Column settings saved successfully');
    } catch (error) {
      console.error('Error saving column settings:', error);
      alert('Failed to save column settings');
    }
  };

  const handleColumnSettingChange = (index, field, value) => {
    setColumns(prev =>
      prev.map((column, i) =>
        i === index ? { ...column, [field]: value } : column
      )
    );
  };
  // 체크박스 상태 변경 핸들러
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setMenuConfig((prevConfig) => ({
      ...prevConfig,
      [name]: checked,  // 체크박스의 이름에 해당하는 상태값 업데이트
    }));
  };
  const handleRadioChange = (event) => {
    const { name, value } = event.target;
    setMenuConfig((prevConfig) => ({
      ...prevConfig,
      [name]: value === 'true', // value 값을 true/false로 변환하여 상태 업데이트
    }));
  };
  const handleSelectChange = (event,field) => {
    const selectedValue = event.target.value;
    setMenuConfig(prevConfig => ({
      ...prevConfig,
      [field]: selectedValue,  // Update the state with the selected value
    }));
  };
   // 적용 버튼 클릭 시 서버로 POST 요청 보내기
  const handleApplyClick = async () => {
    try {
      const response = await fetch('/request/updateBoardInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          use_new: menuConfig.use_new,
          use_editer: menuConfig.use_editer,
          use_modify: menuConfig.use_modify,
          use_delete: menuConfig.use_delete,
          use_excel: menuConfig.use_excel,
          use_trigger: menuConfig.use_trigger,
          use_view: menuConfig.use_view,
          use_upload:menuConfig.use_upload,
          display_title:menuConfig.display_title,
          display_content:menuConfig.display_content,
          sort_order:menuConfig.sort_order,
          post_btn_type:menuConfig.post_btn_type,
          search_type: menuConfig.search_type,
          board_id: tableName // 실제 보드 ID
        }),
      });

      if (response.ok) {
        alert('설정이 성공적으로 저장되었습니다!');
      } else {
        alert('설정 저장 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('서버에 연결할 수 없습니다.');
    }
  };
  //handleApplyClick
  const renderColumnSettings = () => (
    <Table>
      <thead>
        <tr>
          <th>Column Name</th>
          <th>Column Title</th>
          <th>Mapping Name</th>
          <th>Column Width</th>
          <th>API Function</th>
          <th>Result Function</th>
          <th>Mask</th>
          <th>Column idx</th>
          <th>OrderBy idx</th>
          <th>Column align</th>
          <th>Show</th>
          <th>ReadOnly</th>
        </tr>
      </thead>
      <tbody>
        
        {columns.map((column, index) => (
          <TableRow key={index}>
            <TableCell>
              <Input
                value={column.column_id}
                onChange={(e) => handleColumnSettingChange(index, 'column_name', e.target.value)}
                placeholder="Column Name"
                disabled
              />
            </TableCell>
            <TableCell>
              <Input
                value={column.column_title}
                onChange={(e) => handleColumnSettingChange(index, 'column_title', e.target.value)}
                disabled
                placeholder="column_title"
              />
            </TableCell>
            <TableCell>
              <Input
                value={column.mapping_name}
                onChange={(e) => handleColumnSettingChange(index, 'mapping_name', e.target.value)}
                placeholder="Mapping Name"
              />
            </TableCell>
            <TableCell>
              <Input
                value={column.cell_width_size}
                onChange={(e) => handleColumnSettingChange(index, 'cell_width_size', e.target.value)}
                placeholder="column_width"
              />
            </TableCell>
            <TableCell>
              <Input
                value={column.function}
                onChange={(e) => handleColumnSettingChange(index, 'function', e.target.value)}
                placeholder="Function"
              />
            </TableCell>
            <TableCell>
              <Input
                value={column.result_action}
                onChange={(e) => handleColumnSettingChange(index, 'result_action', e.target.value)}
                placeholder="ResultAction"
              />
            </TableCell>
            <TableCell>
              <Input
                value={column.mask}
                onChange={(e) => handleColumnSettingChange(index, 'mask', e.target.value)}
                placeholder="mask"
              />
            </TableCell>
            <TableCell>
              <Input
                value={column.column_idx}
                onChange={(e) => handleColumnSettingChange(index, 'column_idx', e.target.value)}
                placeholder="column_idx"
              />
            </TableCell>
            <TableCell>
              <Input
                value={column.order_by_idx}
                onChange={(e) => handleColumnSettingChange(index, 'order_by_idx', e.target.value)}
                placeholder="column_idx"
              />
            </TableCell>
         
            <TableCell>
              <Input
                value={column.column_align}
                onChange={(e) => handleColumnSettingChange(index, 'column_align', e.target.value)}
                placeholder="column_align"
              />
            </TableCell>
            <TableCell>
              <Checkbox
                type="checkbox"
                checked={column.cell_visible}
                onChange={(e) => handleColumnSettingChange(index, 'cell_visible', e.target.checked)}
              />
            </TableCell>
            <TableCell>
              <Checkbox
                type="checkbox"
                checked={column.read_only}
                onChange={(e) => handleColumnSettingChange(index, 'read_only', e.target.checked)}
              />
            </TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  );

  const renderControlSettings = () => (
    <div>
      {/* {JSON.stringify(menuConfig)} */}
      <Table>
        <thead>
          <tr>
          <th>기능관리</th>
          <th>신규등록</th>
          <th>등록버튼타입</th>
          <th>검색타입</th>
          <th>수정</th>
          <th>삭제</th>
          <th>엑셀</th>
          <th>업로드</th>
          <th>본문</th>
          <th>에디터</th>
          <th>타이틀컬럼</th>
          <th>컨텐츠컬럼</th>
          <th>데이터정렬</th>
          </tr>
        </thead>
        <tbody>
        <TableRow>         
          <TableCell>사용여부</TableCell>
          <TableCell>
        <Checkbox
          type="checkbox"
          name="use_new"                // name 속성을 menuConfig의 key 값으로 설정
          checked={menuConfig.use_new}  // checked 상태를 menuConfig의 해당 상태로 설정
          onChange={handleCheckboxChange}
        />
      </TableCell>
      <TableCell>
      <label>
            <input
            type="radio"
            name="post_btn_type"
            checked={menuConfig.post_btn_type === true}
            onChange={handleRadioChange} // 라디오 버튼 전용 핸들러 사용
            value="true" // 문자열 "true"로 설정
          />
        기본
      </label>
      <label>
          <input
          type="radio"
          name="post_btn_type"
          checked={menuConfig.post_btn_type === false}
          onChange={handleRadioChange} // 라디오 버튼 전용 핸들러 사용
          value="false" // 문자열 "false"로 설정
        />
        확장
      </label>
      </TableCell>
      <TableCell>
      <label>
          <input
          type="radio"
          name="search_type"
          checked={menuConfig.search_type === false}
          onChange={handleRadioChange} // 라디오 버튼 전용 핸들러 사용
          value="false" // 문자열 "false"로 설정
        />
        기본검색
      </label>
      <label>
            <input
            type="radio"
            name="search_type"
            checked={menuConfig.search_type === true}
            onChange={handleRadioChange} // 라디오 버튼 전용 핸들러 사용
            value="true" // 문자열 "true"로 설정
          />
        확장검색
      </label>
      </TableCell>
   
  
      <TableCell>
        <Checkbox
          type="checkbox"
          name="use_modify"             // name 속성 설정
          checked={menuConfig.use_modify}
          onChange={handleCheckboxChange}
        />
      </TableCell>
      <TableCell>
        <Checkbox
          type="checkbox"
          name="use_delete"             // name 속성 설정
          checked={menuConfig.use_delete}
          onChange={handleCheckboxChange}
        />
      </TableCell>
      <TableCell>
        <Checkbox
          type="checkbox"
          name="use_excel"              // name 속성 설정
          checked={menuConfig.use_excel}
          onChange={handleCheckboxChange}
        />
      </TableCell>
      <TableCell>
        <Checkbox
          type="checkbox"
          name="use_upload"              // name 속성 설정
          checked={menuConfig.use_upload}
          onChange={handleCheckboxChange}
        />
      </TableCell>
      <TableCell>
        <Checkbox
          type="checkbox"
          name="use_view"                // name 속성을 menuConfig의 key 값으로 설정
          checked={menuConfig.use_view}  // checked 상태를 menuConfig의 해당 상태로 설정
          onChange={handleCheckboxChange}
        />
      </TableCell>
      <TableCell>
        <Checkbox
          type="checkbox"
          name="use_editer"             // name 속성 설정
          checked={menuConfig.use_editer}
          onChange={handleCheckboxChange}
        />
      </TableCell>
      <TableCell>
      <CustomSelectBox
          value={menuConfig.display_title}
          placeholder={'타이틀컬럼'}
          onChange={(e)=>handleSelectChange(e,'display_title')}
          options={options}
        />
      </TableCell>
      <TableCell>
      <CustomSelectBox
          value={menuConfig.display_content}
          placeholder={'컨텐츠컬럼'}
          onChange={(e)=>handleSelectChange(e,'display_content')}
          options={options}
        />
      </TableCell>
      <TableCell>
      <CustomSelectBox
          value={menuConfig.sort_order}
          placeholder={'데이터 정렬'}
          onChange={(e)=>handleSelectChange(e,'sort_order')}
          options={[{std_key:'내림차순',std_value:'desc'},{std_key:'오름차순',std_value:'asc'}]}
        />
      </TableCell>
        </TableRow>
        <TableRow>         
        <TableCell colSpan={13}>
              <SaveButton  onClick={handleApplyClick}>
              <FontAwesomeIcon icon={faSave} />적용</SaveButton>
          </TableCell>
        </TableRow>
        </tbody>
      </Table>
    <Table>
      <thead>
        <tr>
          <th>Column Name</th>
          <th>Column Title</th>
          <th>Control Position X</th>
          <th>Control Position Y</th>
          <th>Control Size W</th>
          <th>Control Size H</th>
          <th>Control idx</th>
          <th>Show</th>
          <th>Search</th> {/* Add Search Column Header */}
        </tr>
      </thead>
      <tbody>
        {columns.map((column, index) => (
          <TableRow key={index}>
            <TableCell>
              <Input
                value={column.column_id}
                onChange={(e) => handleColumnSettingChange(index, 'column_name', e.target.value)}
                placeholder="Column Name"
                disabled
              />
            </TableCell>
            <TableCell>
              <Input
                value={column.column_title}
                onChange={(e) => handleColumnSettingChange(index, 'column_title', e.target.value)}
                placeholder="column_title"
                disabled
              />
            </TableCell>
            <TableCell>
              <Input
                value={column.ctrl_pos_x}
                onChange={(e) => handleColumnSettingChange(index, 'ctrl_pos_x', e.target.value)}
                placeholder="Control Size X"
              />
            </TableCell>
            <TableCell>
              <Input
                value={column.ctrl_pos_y}
                onChange={(e) => handleColumnSettingChange(index, 'ctrl_pos_y', e.target.value)}
                placeholder="Control Size Y"
              />
            </TableCell>
            <TableCell>
              <Input
                value={column.ctrl_width}
                onChange={(e) => handleColumnSettingChange(index, 'ctrl_width', e.target.value)}
                placeholder="W"
              />
            </TableCell>
            <TableCell>
              <Input
                value={column.ctrl_height}
                onChange={(e) => handleColumnSettingChange(index, 'ctrl_height', e.target.value)}
                placeholder="H"
              />
            </TableCell>
            <TableCell>
              <Input
                value={column.control_idx}
                onChange={(e) => handleColumnSettingChange(index, 'control_idx', e.target.value)}
                placeholder="control_idx"
              />
            </TableCell>
            <TableCell>
              <Checkbox
                type="checkbox"
                checked={column.visible}
                onChange={(e) => handleColumnSettingChange(index, 'visible', e.target.checked)}
              />
            </TableCell>
            <TableCell> {/* Add Search Column Input */}
              <Checkbox
               type="checkbox"
               checked={column.col_search}
               onChange={(e) => handleColumnSettingChange(index, 'col_search', e.target.checked)}
              />
            </TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
    </div>
  );

  const renderInputs = (actionType, field) => (
    <>
      {(values[actionType][field] || []).map((value, index) => (
        <InputGroup key={index}>
          <Input
            value={value}
            onChange={(e) => handleArrayChange(actionType, field, index, e.target.value)}
            placeholder={`${field} ${index + 1}`}
          />
          <RemoveButton onClick={() => handleRemoveField(actionType, field, index)}>
            <FontAwesomeIcon icon={faTrash} />
          </RemoveButton>
        </InputGroup>
      ))}
      <AddButton onClick={() => handleAddField(actionType, field)}>
        <FontAwesomeIcon icon={faPlus} /> Add {field}
      </AddButton>
    </>
  );

  const renderActionSection = (actionType, title) => (
    <ActionSection>
      <SectionTitle>{title}</SectionTitle>
      <Input
        value={values[actionType]?.table || ''}
        onChange={(e) => handleChange(actionType, 'table', e.target.value)}
        placeholder="Table Name"
      />
      {renderInputs(actionType, 'setColumns')}
      {renderInputs(actionType, 'keyColumn')}
      <hr style={{ marginBottom: '30px' }}></hr>
      <SaveButton style={{ position: 'absolute', bottom: '10px', width: '90%' }} primary onClick={handleSaveActionInfo}>
        <FontAwesomeIcon icon={faSave} /> Save {title}
      </SaveButton>
    </ActionSection>
  );

  return (
    <ManageBoardWrapper>
      <ControlSettingsWrapper>
        <section style={{display:'flex' , justifyContent:'center'}}>
          <SectionTitle> UI Control Settings - [{tableName}]</SectionTitle>
          <label style={{fontSize:'10px', fontWeight:'900', margin:'15px'}}></label>
        </section>
        {renderControlSettings()}
        <SaveButton primary onClick={handleSaveControlSettings}>
          <FontAwesomeIcon icon={faSave} /> Save Control Settings
        </SaveButton>
      </ControlSettingsWrapper>
      <ColumnSettingsWrapper>
        <section style={{display:'flex' , justifyContent:'center'}}>
          <SectionTitle> Display Column Settings - [{tableName}]</SectionTitle>
          <label style={{fontSize:'10px', fontWeight:'900', margin:'15px'}}></label>
        </section>
        {renderColumnSettings()}
        <SaveButton primary onClick={handleSaveColumnSettings}>
          <FontAwesomeIcon icon={faSave} /> Save Column Settings
        </SaveButton>
      </ColumnSettingsWrapper>
      {renderActionSection('save', 'Save Action')}
      {renderActionSection('update', 'Update Action')}
      {renderActionSection('delete', 'Delete Action')}
    </ManageBoardWrapper>
  );
};

export default ManageBoard;