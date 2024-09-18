import React, { useState, useEffect, useContext } from "react";
import { FormGroup, SearchContainer, SearchBox, SearchLabel, DateInput, SelectBox, InputBase } from './styled';
import styled from 'styled-components';
import { AppContext } from "../../../../AppContext";
import MultiSelecter from "../../../MultiSelecter"; // 다중 선택기를 사용하기 위해 가져옴
import CustomSelectBox from '../../../SearchSelecter'; // 커스텀 선택 박스를 가져옴
import DynamicSimpleSearch from "../../../DynamicSimpleSearch";

export const DyInput = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const SimpleSearchForm = ({ handleSearchChange, formFields, searchParams, setSearchParams, getBoardData, currentPage, postsPerPage, tableName,orderBy }) => {
  const [selectedField, setSelectedField] = useState(''); // 선택된 필드를 저장
  const [options, setOptions] = useState([]); // 선택된 필드의 옵션 저장
  const [arraySelectOptions, setArraySelectOptions] = useState([]); // 배열 입력 옵션 저장
  const { user } = useContext(AppContext);
  
  // Initialize formData state to hold input values
  const [formData, setFormData] = useState({}); // 검색 폼 데이터 상태 추가

  useEffect(() => {
    // Reset selected field and input values when formFields change
    setSelectedField('');
    setOptions([]);
    setArraySelectOptions([]);
    setFormData({}); // Clear all form data
  }, [formFields]);

  useEffect(() => {
    if (selectedField) {
      const field = formFields.find(f => f.column_id === selectedField);
      fetchOptions(field);
      if (field?.control_type === 'ArrayInput') {
        fetchArrayOptions(field);
      }
    }
  }, [selectedField]);
  useEffect(()=>{

  },[searchParams])
  const fetchOptions = async (field) => {
    if (!field) return;
    let url;
    let response;

    // Fetch options based on control type and bind key
    if (field?.control_type === 'SelectBox' && field.bind_key) {
      try {
        url = `/request/getFormControlOptions?bind_key=${field.bind_key}&bind_option=${field.bind_option}`;
        response = await fetch(url, { credentials: 'include', headers: { Accept: 'application/json' }, method: 'GET' });
        if (response.ok) {
          const data = await response.json();
          setOptions(data);
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    }
  };

  const fetchArrayOptions = async (field) => {
    if (!field) return;
    try {
      const response = await fetch(`/request/getOptions?target_code=${field.root_column}&code_group=${field.bind_key}`, { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        const formattedOptions = data.options.map((item) => ({
          value: item.code_value,
          label: `[ ${item.code_option} | ${item.code_value} ]`,
        }));
        setArraySelectOptions(formattedOptions);
      }
    } catch (error) {
      console.error("Error fetching array options:", error);
    }
  };

  const handleFieldChange = (event) => {
    const newField = event.target.value;
    setSelectedField(newField);

    // Clear the search value for the previous field
    setFormData(prevFormData => ({
      ...prevFormData,
      [newField]: '', // Reset the value for the new field
    }));
  };

  // Define the handleInputChange function
  const handleInputChange = (fieldId, value) => {
    // Update formData with the new value
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldId]: value,
    }));
    //setSearchParams((prevData)=>({...prevData,[fieldId]: value}));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Use formData to set search parameters
    let Params={ ...searchParams, [selectedField]: formData[selectedField] };
    getBoardData(currentPage, postsPerPage, tableName,Params,orderBy,'SimpleSearchForm');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <SearchContainer>
        {/* 날짜 입력 */}
        <SearchBox>
          <DateInput
            selected={searchParams?.from}
            onChange={(date) => handleSearchChange('from', date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="from date"
          />
        </SearchBox>
        <SearchBox>
          <DateInput
            selected={searchParams?.to}
            onChange={(date) => handleSearchChange('to', date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="to date"
          />
        </SearchBox>

        {/* 검색 필드 선택 */}
        <FormGroup>
        <CustomSelectBox
            value={selectedField}
            onChange={handleFieldChange}
            isSearch={false}
            isCancel={true}
            placeholder={'검색조건을 선택하세요'}
            options={formFields
              .filter((field) => field?.col_search) // col_search가 true인 항목만 필터링
              .map((field) => ({
                std_value: field?.column_id,
                std_key: field?.column_title,
              }))}
          />
        </FormGroup>

        {/* 검색 값 입력 필드 */}
        <SearchBox>
          {selectedField && (
            <DynamicSimpleSearch
              field={formFields.find((field) => field.column_id === selectedField)}
              value={formData[selectedField] || ''} // Pass the current value from formData
              onChange={handleInputChange}
              isLable={false}
            />
          )}
        </SearchBox>
          {/* {JSON.stringify(formData)} */}
        {/* 제출 버튼 */}
        <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
          <button style={{ width: '5.5rem', fontSize: '1rem', margin: '0px 0px 0px 0px' }} className="postingBtn" type="submit" onClick={handleSubmit}>
            검색
          </button>
        </div>
      </SearchContainer>
    </div>
  );
};

export default SimpleSearchForm;
