import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useRecoilState } from 'recoil';
import { StandardInfoAtom, ListStandardInfoAtom, DetailStandardInfoAtom } from '../../../atoms/standardModelAtom';
import deleteImg from '../../../images/Trash.png';

const Container = styled.div`
  width: 95%;
  height: 90vh;
  margin: 0 auto 1%;
  font-family: 'Arial', sans-serif;
`;

const Wrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  height: 100%;
`;

const HeadTitle = styled.h1`
  text-align: left;
  margin-top: 5%;
  font-size: calc(10px + 1vmin);
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  height: 90%;
  overflow: auto;
`;

const MiddleSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  height: 90%;
  overflow: auto;
`;

const Content = styled.div`
  width: 55%;
  height: 90%;
  margin: 0 0.5rem;
`;

const ContentBox = styled.div`
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  border:1px solid #e0e0e0;
  padding: 1.5rem;
  height: calc(100% - 8px);
  overflow: auto;
`;

const DetailForm = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const DetailInput = styled.input`
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
`;

const DetailButton = styled.button`
  padding: 8px 16px;
  border: none;
  background-color: #4a90e2;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #357abd;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const TableRow = styled.tr`
  padding: 4%;
  border-bottom: 1px solid #f0f0f0;
  background-color: ${props => (props.selected ? '#e6f2ff' : 'transparent')};
  color: ${props => (props.selected ? '#4a90e2' : 'black')};
  font-weight: ${props => (props.selected ? 'bold' : 'normal')};
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const SearchBox = styled.div`
  width: 100%;
  margin-bottom: 7%;
  display: flex;
  justify-content: space-between;
`;

const SearchInput = styled.input`
  padding: 3%;
  font-size: calc(5px + 1vmin);
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  width: 12vw;
`;

const SearchButton = styled.button`
  width: 4rem;
  font-size: calc(7px + 1vmin);
  cursor: pointer;
  border: none;
  background: #4a90e2;
  color: #fff;
  border-radius: 4px;
  padding: 1%;
  transition: background-color 0.3s;

  &:hover {
    background-color: #357abd;
  }
`;

const AddColumn = styled.div`
  background-color: #f7f7f7;
  padding: 1rem 0.5rem 0.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const AddButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
`;

const CodeGroupImg = styled.img`
  margin: 7px;
  height: 28px;
  cursor: pointer;
`;

const CodeGroupButton = styled.button`
  width: 80px;
  margin: 7px;
  height: 35px;
  font-size: 16px;
  margin-top: 7px;
  cursor: pointer;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #357abd;
  }
`;

export default function StandardInfo_Dtl() {
  const [codeGroupInput, setCodeGroupInput] = useRecoilState(StandardInfoAtom);
  const [selectedCodeGroup, setSelectedCodeGroup] = useRecoilState(ListStandardInfoAtom);
  const [filterValue1, setFilterValue1] = useState('');
  const [codeGroupList, setCodeGroupList] = useState([]);
  const [codeOptionList, setCodeOptionList] = useState([]);
  
  const [selectedCodeGroupDetails, setSelectedCodeGroupDetails] = useRecoilState(DetailStandardInfoAtom);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [optionKey, setOptionKey] = useState(''); 
  const [optionValue, setOptionValue] = useState(''); 
  const [optionDesc, setOptionDesc] = useState(''); 
  const [stdKey, setStdKey] = useState(''); 
  const [stdValue, setStdValue] = useState(''); 
  const [stdDescription, setStdDescription] = useState(''); 
  const [detailVisible, setDetailVisible] = useState(false);


  useEffect(() => {
    getItemSample();
  }, []);

  const getItemSample = async () => {
    try {
      const res = await fetch('https://crm.skynet.re.kr/request/getCommonCodeGroup', { credentials: 'include' });
      const data = await res.json();
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
      setSelectedDetail(null);
      setStdKey('');
      setStdValue('');
      setStdDescription('');
      setDetailVisible(true);
    } catch (error) {
      alert('Error: ' + error);
    }
  };

  const getStdOptions = async (codeGroup,std_value) => {
    try {
      const res = await fetch(`https://crm.skynet.re.kr/request/getStdOptions?std_group_code=${codeGroup}&std_value=${std_value}`, { credentials: 'include' });
      const data = await res.json();
      setCodeOptionList(data);
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
      getItemSample(); 
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
      await res.json();
      alert('삭제 되었습니다.');
      getItemSample();
      setSelectedCodeGroupDetails([]);
      setSelectedDetail(null);
      setDetailVisible(false);
    } catch (error) {
      alert('Error: ' + error);
    }
  };

  const handleCodeGroupClick = (codeGroup) => {
    getStdDtl(codeGroup);
    setSelectedCodeGroup(codeGroup);
  };

  const handleDetailClick = (detail) => {
    setSelectedDetail(detail);
    setStdKey(detail.std_key);
    setStdValue(detail.std_value);
    getStdOptions(detail.std_group_code,detail.std_value);
  };

  const getFilteredRows2 = () => {
    const filterText = filterValue1.toLowerCase();
    return codeGroupList.filter(row => row.std_group_code.toLowerCase().includes(filterText));
  };

  const handleInsertNewOption = async () => {
    try {
      const res = await fetch('https://crm.skynet.re.kr/request/InsertStdInfoDtlOption', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group_code: selectedCodeGroup,
          optionName: optionKey,
          optionValue: optionValue,
          optionDesc: optionDesc,
          target_code:stdValue,
          key: stdKey,
          value: stdValue,
          description: stdDescription
        })
      });
      await res.json();
      alert(`코드그룹 [${selectedCodeGroup}]에 새로운 항목이 추가되었습니다.`);
      getStdOptions(selectedCodeGroup,selectedDetail?.std_value);
    } catch (error) {
      alert('Error: ' + error);
    }
  };

  return (
    <Container>
      <Wrap>
        <Sidebar>
          <HeadTitle>그룹 리스트</HeadTitle>
          <SearchBox>
            <SearchInput
              id="searchValue"
              placeholder="찾을 코드를 입력해주세요."
              value={filterValue1}
              onChange={e => setFilterValue1(e.target.value)}
            />
            <SearchButton onClick={getFilteredRows2}>검색</SearchButton>
          </SearchBox>
          <Table>
            <tbody style={{textAlign:'left'}}>
              {getFilteredRows2().map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  onClick={() => handleCodeGroupClick(row.std_group_code)}
                  selected={selectedCodeGroup === row.std_group_code}
                >
                  <td style={{padding:'10px'}}>{row.std_group_code}</td>
                </TableRow>
              ))}
            </tbody>
          </Table>
          <AddColumn>
            <SearchInput
              value={codeGroupInput}
              onChange={e => setCodeGroupInput(e.target.value)}
              placeholder="새 코드그룹명을 입력하세요."
            />
            <AddButtonWrapper>
              <CodeGroupImg
                src={deleteImg}
                onClick={() => deleteStdInfo(selectedCodeGroup)}
              />
              <CodeGroupButton onClick={() => insertStdInfo(codeGroupInput)}>추가</CodeGroupButton>
            </AddButtonWrapper>
          </AddColumn>
        </Sidebar>
        <MiddleSection visible={detailVisible}>
          <HeadTitle>코드 리스트</HeadTitle>
          <Table>
            <tbody>
              {selectedCodeGroupDetails && selectedCodeGroupDetails.map((detail, index) => (
                <TableRow
                  key={index}
                  onClick={() => handleDetailClick(detail)}
                  selected={selectedDetail && selectedDetail.std_key === detail.std_key}
                >
                  <td style={{padding:'10px'}}>{detail.std_key}</td>
                  <td style={{padding:'10px'}}>{detail.std_value}</td>
                  <td style={{padding:'10px'}}>{detail.std_description}</td>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </MiddleSection>
        <Content>
          <ContentBox>
            <HeadTitle>새로운 옵션 정보 추가</HeadTitle>
            <DetailForm>
              <DetailInput
                type="text"
                placeholder="옵션"
                value={optionKey}
                onChange={e => setOptionKey(e.target.value)}
              />
              <DetailInput
                type="text"
                placeholder="값"
                value={optionValue}
                onChange={e => setOptionValue(e.target.value)}
              />
              <DetailInput
                type="text"
                placeholder="설명"
                value={optionDesc}
                onChange={e => setOptionDesc(e.target.value)}
              />
              <DetailButton onClick={handleInsertNewOption}>추가</DetailButton>
            </DetailForm>
            <div>
              <HeadTitle>등록된 상세 정보</HeadTitle>
              <Table>
                <thead>
                  <tr>
                    <th>코드그룹</th>
                    <th>코드</th>
                    <th>옵션명</th>
                    <th>값</th>
                    <th>설명</th>
                  </tr>
                </thead>
                <tbody>
                  {codeOptionList && codeOptionList.map((option, index) => (
                    <tr key={index}>
                      <td>{option.code_group}</td>
                      <td>{option.target_code}</td>
                      <td>{option.code_option}</td>
                      <td>{option.code_value}</td>
                      <td>{option.code_desc}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </ContentBox>
        </Content>
      </Wrap>
    </Container>
  );
}
