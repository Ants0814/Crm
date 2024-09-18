// SearchForm.js
import React, { useState, useEffect, useContext } from "react";
import { SearchContainer, SearchBox, SearchLabel, DateInput } from './styled';
import DynamicSearch from '../../../DynamicSearch';
import { AppContext } from "../../../../AppContext";

const SearchForm = ({ handleSearchChange, formFields, hasTitleField, hasContentField, searchParams, setSearchParams,orderBy, getBoardData, currentPage, postsPerPage, tableName }) => {
  const [formData, setFormData] = useState({});
  const [editorContent, setEditorContent] = useState('');
  const [rootSearchColumnValues, setRootSearchColumnValues] = useState({});
  const { user } = useContext(AppContext);

  useEffect(() => {
    setFormData({});
    setEditorContent('');
    setRootSearchColumnValues({});
  }, [formFields, hasContentField, hasTitleField]);

  const handleInputChange = (fieldId, value) => {
    setFormData({ ...formData, [fieldId]: value });
    const field = formFields.find(f => f.column_id === fieldId);
    const field_root = formFields.find(f => f.root_column === fieldId);

    if (field_root && field_root.root_column === fieldId) {
      setRootSearchColumnValues({ ...rootSearchColumnValues, [field.column_id]: value });
    }
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let Params={ ...searchParams, ...formData };
    getBoardData(currentPage, postsPerPage, tableName,Params,orderBy,'SearchForm');
  };

  return (<div style={{display:'flex' , justifyContent:'center', width:'100%'}}>
    <SearchContainer>
      <SearchBox>
        <SearchLabel>From:</SearchLabel>
        <DateInput
          selected={searchParams?.from}
          onChange={(date) => handleSearchChange('from', date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
        />
      </SearchBox>
      <SearchBox>
        <SearchLabel>To:</SearchLabel>
        <DateInput
          selected={searchParams?.to}
          onChange={(date) => handleSearchChange('to', date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
        />
      </SearchBox>
      {formFields
  .sort((a, b) => {
    const controlIdxA = a.control_idx !== null ? parseInt(a.control_idx, 10) : null;
    const controlIdxB = b.control_idx !== null ? parseInt(b.control_idx, 10) : null;

    if (controlIdxA === null) return 1; // a가 null이면 b보다 뒤로 이동
    if (controlIdxB === null) return -1; // b가 null이면 a보다 앞으로 이동

    return controlIdxA - controlIdxB; // 둘 다 null이 아니면 숫자 비교
  })
  .map((field, index) => (
    field.col_search && (<div>
      {/* <label>{JSON.stringify(field)}</label> */}
      <SearchBox id='SearchBox' key={index}>
        <DynamicSearch
          field={field}
          value={formData[field.column_id] || ""}
          onChange={handleInputChange}
          isLable={true}
          rootColumnValue={rootSearchColumnValues[field.root_column]}
        />
      </SearchBox>
      </div>
    )
  ))}
    </SearchContainer>
    <SearchBox style={{ textAlign: "right" ,flexDirection:'row', justifyContent:'flex-end',alignItems:'center',width:'10%'}}>
        <button style={{ height:'100%',width:'100%',margin:'0px 0px 0px 10px'}} className="postingBtn" type="submit" onClick={handleSubmit}> 검색 </button>
    </SearchBox>
    </div>
  );
};

export default SearchForm;