import React, { useEffect, useState } from 'react';
import './style.css';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { StandardInfoAtom, ListStandardInfoAtom, DetailStandardInfoAtom, CodeGroupStandardInfoAtom } from '../../../atoms/standardModelAtom';
import deleteImg from '../../../images/Trash.png';

export default function StandardInfo() {
  const [codeGroupInput, setCodeGroupInput] = useRecoilState(StandardInfoAtom); // 코드그룹 입력 상태
  const [selectedCodeGroup, setSelectedCodeGroup] = useRecoilState(ListStandardInfoAtom); // 선택된 코드그룹 상태
  const [filterValue1, setFilterValue1] = useState(''); // 필터 입력값 상태 (코드그룹용)
  const [codeGroupList, setCodeGroupList] = useState([]); // 코드그룹 리스트 상태
  const [selectedCodeGroupDetails, setSelectedCodeGroupDetails] = useRecoilState(DetailStandardInfoAtom); // 선택된 코드그룹의 상세정보 상태
  const [isEditMode, setIsEditMode] = useState(false); // 편집 모드 상태
  const [tableKey, setTableKey] = useState(0); // 테이블 리렌더링을 위한 key 상태

  useEffect(() => {
    initializeComponent();
  }, []);

  const initializeComponent = async () => {
    setCodeGroupInput('');
    setSelectedCodeGroup('');
    setFilterValue1('');
    setCodeGroupList([]);
    setSelectedCodeGroupDetails([]);
    setIsEditMode(false);
    await getItemSample();
  };

  const getItemSample = async () => {
    try {
      const res = await fetch('https://crm.skynet.re.kr/request/getCommonCodeGroup', { credentials: 'include' });
      const data = await res.json();
      console.log('getItemSample data:', data);
      if (Array.isArray(data)) {
        setCodeGroupList(data);
      } else {
        console.error('API response is not an array:', data);
      }
    } catch (error) {
      alert('Error: ' + error);
    }
  };

  const getStdDtl = async (codeGroup) => {
    try {
      const res = await fetch(`https://crm.skynet.re.kr/request/getStdDtl?std_group_code=${codeGroup}`, { credentials: 'include' });
      const data = await res.json();
      setSelectedCodeGroupDetails(data);
      setTableKey(prevKey => prevKey + 1); // 테이블 리렌더링을 위해 key 변경
    } catch (error) {
      alert('Error: ' + error);
    }
  };

  const insertStdInfo = async (codeGroupInput) => {
    try {
      const res = await fetch('https://crm.skynet.re.kr/request/InsertStdInfo', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeGroupInput })
      });
      await res.json();
      alert(`새 코드그룹 [${codeGroupInput}] 생성`);
      initializeComponent(); // Re-fetch the data after insertion
    } catch (error) {
      alert('Error: ' + error);
    }
  };

  const deleteStdInfo = async (codeGroup) => {
    if (!window.confirm(`${codeGroup}을 정말 삭제하시겠습니까?`)) return;
    try {
      const res = await fetch('https://crm.skynet.re.kr/request/deleteStdInfo', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group_code: codeGroup })
      });
      if (!res.ok) throw new Error(`Server responded with status code ${res.status}`);
      alert('삭제 되었습니다.');
      initializeComponent(); // Re-fetch the data after deletion
      setSelectedCodeGroupDetails([]);
    } catch (error) {
      alert('Error: ' + error);
    }
  };

  const handleCodeGroupClick = (codeGroup) => {
    setIsEditMode(false);
    getStdDtl(codeGroup);
    setSelectedCodeGroup(codeGroup);
  };

  const getFilteredRows2 = () => {
    const filterText = filterValue1.toLowerCase();
    return codeGroupList.filter(row => row.std_group_code.toLowerCase().includes(filterText));
  };

  const handleDetailEdit = () => {
    setIsEditMode(true);
  };

  return (
    <div className="standard_container">
      <div className='standard_wrap'>
        <div className="category-wrapper">
          <div className="category-box">
            <div>
              <h1 className='head-title'>코드그룹 리스트</h1>
              <div className='searchBox'>
                <input
                  id="searchValue"
                  placeholder="찾을 코드를 입력해주세요."
                  value={filterValue1}
                  onChange={e => setFilterValue1(e.target.value)}
                />
                <button className="searchBtn" onClick={getFilteredRows2}>검색</button>
              </div>
              <table className="category-table">
                <tbody>
                  {getFilteredRows2().map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      onClick={() => handleCodeGroupClick(row.std_group_code)}
                      className={selectedCodeGroup === row.std_group_code ? 'selected' : ''}
                    >
                      <td>{row.std_group_code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='addColumn'>
              <input
                style={{ padding: 7, fontSize: 14 }}
                value={codeGroupInput}
                onChange={e => setCodeGroupInput(e.target.value)}
                placeholder="새 코드그룹명을 입력하세요."
              />
              <div className='addBtnWrap'>
                <img
                  className='CodeGruopImg'
                  src={deleteImg}
                  onClick={() => deleteStdInfo(selectedCodeGroup)}
                />
                <button className="CodeGroupButton" onClick={() => insertStdInfo(codeGroupInput)}>추가</button>
              </div>
            </div>
          </div>
        </div>
        <div className="detail-wrapper">
          <div className="detail-box">
            <div className='detailTitleBox'>
              <h1 className="head-title">상세 내용</h1>
            </div>
            <div className="detail-table-wrapper">
              <table className="detail-table" key={tableKey}>
                <thead>
                  <tr>
                    <th>선택</th>
                    <th>그룹코드</th>
                    <th>명칭</th>
                    <th>값</th>
                    <th>설명</th>
                    <th>삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCodeGroupDetails && selectedCodeGroupDetails.length > 0 && (
                    <EditTable
                      refresh={getStdDtl}
                      rows={selectedCodeGroupDetails}
                      isEditMode={isEditMode}
                      setIsEditMode={setIsEditMode}
                      edit={handleDetailEdit}
                      codeGroup={selectedCodeGroup}
                    />
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditTable({ rows, isEditMode, setIsEditMode, edit, refresh, codeGroup }) {
  const [modifiedRows, setModifiedRows] = useState(new Set());
  const [tableRows, setTableRows] = useState(rows || []);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [newRowIndex, setNewRowIndex] = useState(null); // 새 행 인덱스 상태
  const [isNewRowAdded, setIsNewRowAdded] = useState(false); // 새 행 추가 상태

  useEffect(() => {
    setTableRows(rows || []);
    setSelectedRows(new Set()); // 코드그룹이 변경될 때 체크박스 선택 해제
    setNewRowIndex(null); // 코드그룹이 변경될 때 새 행 인덱스 초기화
    setIsNewRowAdded(false); // 코드그룹이 변경될 때 새 행 추가 상태 초기화
  }, [rows, codeGroup]);

  const handleDeleteClick = async (std_id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      const res = await fetch('https://crm.skynet.re.kr/request/deleteStdInfoCheck', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ std_id })
      });
      if (!res.ok) throw new Error(`Failed to delete std_id: ${std_id}, status: ${res.status}`);
      await res.json();
      
      setTableRows(prevRows => prevRows.filter(row => row.std_id !== std_id));
      alert('삭제 되었습니다.');
      refresh(codeGroup); // Re-fetch the data after deletion
    } catch (error) {
      alert('Error: ' + error);
    }
  };

  const handleInput = (index, field, value) => {
    setTableRows(prevRows => {
      const updatedRows = [...prevRows];
      updatedRows[index] = { ...updatedRows[index], [field]: value };
      return updatedRows;
    });
    setModifiedRows(prev => new Set([...prev, index]));
  };

  const handleConfirmNewRow = async () => {
    const newRow = tableRows[newRowIndex];
    try {
      await fetch('https://crm.skynet.re.kr/request/InsertStdInfoDtl', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group_code: newRow.std_group_code,
          key: newRow.std_key,
          value: newRow.std_value,
          description: newRow.std_description,
          id: newRow.std_id
        })
      });
      setNewRowIndex(null); // 새 행 인덱스 초기화
      setModifiedRows(new Set());
      setIsNewRowAdded(false); // 새 행 추가 상태 초기화
      alert('새 행이 추가되었습니다.');
      refresh(codeGroup); // Re-fetch the data after insertion
    } catch (error) {
      alert('Error: ' + error);
    }
  };

  const addNewRow = () => {
    if (isNewRowAdded) {
      alert('새 행이 이미 추가되었습니다.');
      return;
    }
    const newRow = {
      std_id: '',
      std_group_code: codeGroup,
      std_key: '',
      std_value: '',
      std_description: '',
      std_flag: 'I',
    };
    setTableRows(prevRows => [...prevRows, newRow]);
    setEditingIndex(tableRows.length); // 새 행의 인덱스로 설정
    setNewRowIndex(tableRows.length); // 새 행의 인덱스로 설정
    setIsNewRowAdded(true); // 새 행 추가 상태로 설정
  };

  const handleSelectRow = (index) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(index)) {
      newSelectedRows.delete(index);
    } else {
      newSelectedRows.add(index);
    }
    setSelectedRows(newSelectedRows);
  };

  const startEditingSelectedRows = () => {
    if (selectedRows.size === 1) {
      const [selectedIndex] = Array.from(selectedRows);
      setEditingIndex(selectedIndex);
      setIsEditMode(true);
    } else {
      alert('하나의 행만 선택해주세요.');
    }
  };

  const handleDetailSave = async () => {
    const updatedRows = Array.from(modifiedRows).map(index => tableRows[index]);
    try {
      for (const element of updatedRows) {
        await fetch('https://crm.skynet.re.kr/request/UpdateStdInfo', {
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            group_code: element.std_group_code,
            key: element.std_key,
            value: element.std_value,
            description: element.std_description,
            id: element.std_id
          })
        });
      }
      setIsEditMode(false);
      setEditingIndex(null);
      setSelectedRows(new Set()); // Clear selected rows after saving
      alert('적용되었습니다.');
      refresh(codeGroup); // Re-fetch the data after saving
    } catch (error) {
      alert('Error: ' + error);
    }
  };

  const fields = ['std_id', 'std_group_code', 'std_key', 'std_value', 'std_description'];

  return (
    <>
      {tableRows.map((row, lineIndex) => (
        <tr key={lineIndex}>
          <td>
            {newRowIndex === lineIndex ? (
              <button onClick={handleConfirmNewRow} style={{ fontSize: '0.75em' }}>확인</button>
            ) : (
              <input
                type="checkbox"
                checked={selectedRows.has(lineIndex)}
                onChange={() => handleSelectRow(lineIndex)}
              />
            )}
          </td>
          {fields.map(field => (
            <td key={field} style={{ display: field === 'std_id' ? 'none' : '' }}>
              {(editingIndex === lineIndex || newRowIndex === lineIndex) ? (
                <input
                  type="text"
                  value={row[field]}
                  onChange={(e) => handleInput(lineIndex, field, e.target.value)}
                />
              ) : (
                row[field]
              )}
            </td>
          ))}
          <td>
            <button className='delRowBtn' onClick={() => handleDeleteClick(row.std_id)}>-</button>
          </td>
        </tr>
      ))}
      <tr>
        <td colSpan={fields.length + 2}>
          <div className="AddRemove2">
            {isEditMode ? (
              <button className="btnEditTable submit" onClick={handleDetailSave}>저장</button>
            ) : (
              !isNewRowAdded && <button className="btnEditTable modify" onClick={startEditingSelectedRows}>수정</button>
            )}
            {!isEditMode && <button className="btnEditTable addBtn" onClick={addNewRow}>+</button>}
          </div>
        </td>
      </tr>
    </>
  );
}
