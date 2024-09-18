import { CheckGroup,FormGroup, Label, Input, SelectBox, DyInput, } from './styled';
import React, { useState, useEffect } from "react";
import MultiSelecter from "../MultiSelecter";
import CustomSelectBox from '../SearchSelecter';  // CustomSelectBox를 불러옵니다.
const DynamicSearch = ({ field, value, onChange, rootColumnValue ,isLable}) => {
  const [options, setOptions] = useState([]);
  const [arraySelectOptions,setArraySelectOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        let url;
        let response = {};

        if (field.control_type === 'SelectBox' && field.bind_key) {
          if (field.bind_type === 'M') {
            url = `/request/getFormMasterData?bind_key=${field.bind_key}&bind_option=${field.bind_option}&bind_display=${field.bind_display}`;
            if (rootColumnValue) {
              url += `&rootColumnValue=${rootColumnValue}&parent_column=${field.root_column}&where_column=${field.where_column}`;
            }
          } else if (field.bind_type === 'O') {
            url = `/request/getFormControlOptions?bind_key=${field.bind_key}&bind_option=${field.bind_option}`;
            if (rootColumnValue) {
              url += `&rootColumnValue=${rootColumnValue}&parent_column=${field.root_column}&where_column=${field.where_column}`;
            }
          } else if (field.bind_type === 'S' || field.bind_type === 'C') {
            url = `/request/getFormControlOptions?bind_key=${field.bind_key}`;
            if (rootColumnValue) {
              url += `&rootColumnValue=${rootColumnValue}&parent_column=${field.root_column}&where_column=${field.where_column}`;
              
            }
          } else {
            url = `/request/getFormControlOptions?bind_key=${field.bind_key}`;
          }
          response = await fetch(url, {
            credentials: 'include',
            headers: {
              Accept: 'application/json',
            },
            method: 'GET',
          });
        }

        if (response.ok) {

          const data = await response.json();
          setOptions(data);
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };
    fetchOptions();
    arrayInputSelect();
  }, [rootColumnValue, field]);

  const arrayInputSelect = async () => {
    try {
      const response = await fetch(
        `/request/getOptions?target_code=${rootColumnValue}&code_group=${field.bind_key}`,
        { credentials: "include" }
      );
      if (response.ok) {
        const data = await response.json();
        const formattedOptions = data.options.map((item) => ({
          value: item.code_value, // Use code_value as value
          label: '[ '+item.code_option+' | ' +item.code_value+' ]', // Use code_option as label
        }));
        setArraySelectOptions(formattedOptions);
      } else {
        console.error("Failed to fetch options");
      }
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };
    // 스타일 커스터마이징: 선택된 값이 태그로 표시되지 않도록 설정
    const customStyles = {
      control: (provided) => ({
        ...provided,
        minHeight: "40px", // 일정한 높이 유지
        zIndex: 1, // 드롭다운이 다른 요소보다 위에 표시되도록 설정
      }),
      valueContainer: (provided) => ({
        ...provided,
        padding: "0 8px", // 패딩 설정
        overflow: "hidden", // 값 표시 공간을 숨김
      }),
      multiValue: (provided) => ({
        ...provided,
        display: "none", // 선택된 값 표시 안 함
      }),
      menu: (provided) => ({
        ...provided,
        zIndex: 101, // 드롭다운 메뉴가 다른 요소보다 위에 표시되도록 설정
      }),
    };
  

  const handleChange = (e) => {
    onChange(field?.column_id, e.target.value);
  };

  if (field?.column_id === 'title' || field?.column_id === 'content') return null;

  const gridStyles = {
    gridColumnStart: field.ctrl_pos_x || 'auto',
    gridColumnEnd: field.ctrl_pos_x ? `span ${field.ctrl_width || 1}` : 'auto',
    gridRowStart: field.ctrl_pos_y || 'auto',
    gridRowEnd: field.ctrl_pos_y ? `span ${field.ctrl_height || 1}` : 'auto',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
    // width: field.width || 'auto',
    // height: field.height || 'auto'
  };

  switch (field.control_type) {
    case 'NumberBox':
      return (
        <div style={gridStyles} id='dy-textBox'>
           {isLable && <Label>{field.column_title}</Label>}
          <DyInput type='number'  value={value} onChange={handleChange} />
        </div>
      );
    case 'TextBox':
      return (
        <div style={gridStyles} id='dy-textBox'>
           {isLable && <Label>{field.column_title}</Label>}
          <DyInput type="text" value={value} onChange={handleChange} />
        </div>
      );
    case 'DateTimeBox':
      return (
        <FormGroup style={gridStyles}>
           {isLable && <Label>{field.column_title}</Label>}
          <DyInput type="datetime-local" value={value} onChange={handleChange} />
        </FormGroup>
      );
      case 'DateBox':
        return (
          <FormGroup style={gridStyles}>
             {isLable && <Label>{field.column_title}</Label>}
            <DyInput type="date" value={value} onChange={handleChange} />
          </FormGroup>
        );
        case 'TimeBox':
          return (
            <FormGroup style={gridStyles}>
               {isLable && <Label>{field.column_title}</Label>}
              <DyInput type="time" value={value} onChange={handleChange} />
            </FormGroup>
          );
      case 'SelectBox':
        return (
        <FormGroup style={gridStyles}>
           {isLable && <Label>{field.column_title}</Label>}
          <CustomSelectBox
            value={value}
            onChange={handleChange}
            options={options}
            field={field}
          />
        </FormGroup>
        );
      case 'CheckBox':
        return (
          <CheckGroup id='test' style={gridStyles}>
           {isLable && <Label>{field.column_title}</Label>} 
          <div
            id='wrap'
            style={{
              height: '100%',
              alignSelf: 'center',
              alignContent: 'center',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <div
              className='check'
              style={{
                justifyContent: 'center',
                alignSelf: 'center',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                alignContent: 'center',
              }}
            >
              <section
                style={{
                  justifyContent: 'center',
                  background: 'white',
                  display: 'flex',
                  borderStyle: 'solid',
                  borderWidth: '1px',
                  padding: '8px',
                  height: '1.5rem',
                  borderRadius: '5px',
                  width: '100%',
                  borderColor: 'silver',
                  alignItems: 'center',
                }}
              >
                {/* 체크박스 */}
                <Input
                  style={{ width: '1.3rem' }}
                  type="checkbox"
                  checked={value}
                  onChange={(e) => onChange(field.column_id, e.target.checked)}
                />
                {isLable &&<Label
                  style={{
                    alignSelf: 'center',
                    marginLeft: '5px',
                    marginTop: '5px',
                    fontSize: '0.9rem',
                  }}
                >
                  {field.column_title}
                </Label>}
    
                {/* 'X' 버튼: 값이 있을 때만 렌더링 */}
                {value && (
                  <button
                    style={{
                      marginLeft: '10px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'red',
                      fontSize: '1rem',
                      cursor: 'pointer',
                    }}
                    onClick={() => onChange(field.column_id, undefined)}
                    aria-label="Clear checkbox"
                  >
                    &#x2716;
                  </button>
                )}
              </section>
            </div>
          </div>
        </CheckGroup>
        );
        case "ArraySelectBox":
          return (
            <FormGroup style={gridStyles}>
               {isLable && <Label>{field.column_title}</Label>}
              <MultiSelecter
                  options={arraySelectOptions}
                  value={value}
                  onChange={(newValue) => onChange(field.column_id, newValue)}
                  placeholder={field.column_title}
                />
            </FormGroup>
          );
        case "ArrayInput":
          return (
            <FormGroup style={gridStyles}>
               {isLable && <Label>{field.column_title}</Label>}
              <MultiSelecter
                  options={arraySelectOptions}
                  value={value}
                  onChange={(newValue) => onChange(field.column_id, newValue)}
                  placeholder={field.column_title}
                />
            </FormGroup>
          );
    default:
      return (
        <div style={gridStyles} id='dy-textBox'>
          {isLable && <Label>{field.column_title}</Label>}
          <DyInput type="text" value={value} onChange={handleChange} />
        </div>
      );
  }
};

export default DynamicSearch;