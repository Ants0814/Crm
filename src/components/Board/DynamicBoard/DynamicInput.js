import { FormGroup, Label, Input, Select, DyInput, ModalOverlay,ModalContent, ModalHeader, ModalBody, ModalFooter  } from './styled';
import React, { useState, useEffect } from "react";

import { Button } from './ManageBoard/styled';
import CustomSelectBox from '../../SearchSelecter';  // CustomSelectBox를 불러옵니다.
import AddressModal from '../../../components/Board/AddressModal';
import MultiSelecter from '../../MultiSelecter';
import {encrypt,decrypt} from '../../Security';
const DynamicInput = ({ field,setFormFields, value, onChange,rootColumnValue }) => {
  const [options, setOptions] = useState([]);
  const [arrayInputs, setArrayInputs] = useState(value || [{ code_option: '', code_value: '' }]);
  const [arraySelectOptions,setArraySelectOptions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(value); // 선택된 값을 로컬 상태로 관리


const handleArrayInputChange = (index, event, key) => {
  const newArrayInputs = [...arrayInputs];
  newArrayInputs[index] = {...newArrayInputs[index], [key]: event.target.value};
  setArrayInputs(newArrayInputs);
  //onChange(field.column_id, newArrayInputs);
};

const addArrayInput = () => {
  setArrayInputs([...arrayInputs, {code_option: '', code_value: ''}]);
};

const removeArrayInput = (index) => {
  const newArrayInputs = arrayInputs.filter((_, i) => i !== index);
  setArrayInputs(newArrayInputs);
  onChange(field.column_id, newArrayInputs);
};

const toggleModal = async () => {
  if (!modalOpen) {
    // 모달이 열릴 때 기존 값을 가져옴
    try {
      const response = await fetch(`/request/getOptions?target_code=${rootColumnValue}&code_group=${field.bind_key}`,{credentials:'include'});
      if (response.ok) {
        const data = await response.json();
        setArrayInputs(data.options);
      } else {
        console.error('Failed to fetch options');
      }
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  }
  setModalOpen(!modalOpen);
};


const saveArrayInputs = async () => {
  try {//그룹코드를 받아야함
    //field.bind_key
    const target_code = rootColumnValue; // 기준 정보의 값 사용
    const payload = {
      code_group:field.bind_key,
      target_code,
      options: arrayInputs,
    };

    const response = await fetch('/request/saveOptions', {
      credentials:'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Data saved successfully:', result);
      setModalOpen(false); // 모달 닫기
      // 필요 시 상태 업데이트 로직 추가
    } else {
      console.error('Failed to save data');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        let url;
        let response = {};
        if ((field.control_type === 'SelectBox' || field.control_type === 'ArraySelectBox')  && field.bind_key) {
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
          }else if (field.bind_type === 'S' || field.bind_type === 'C') {
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
  }, [rootColumnValue, field]);

  useEffect(() => {
    if ((field.control_type === 'SelectBox' || field.control_type === 'ArraySelectBox') && field.bind_type === 'C') {
      const get_child_url = `/request/getFormControlOptions?bind_key=${field.bind_key}&bind_option=${value}`;
  
      fetch(get_child_url, {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
        method: 'GET',
      })
        .then((res) => res.json())
        .then((data) => {
          // column_id를 기준으로 옵션들을 그룹핑
          const groupedOptions = data.reduce((acc, item) => {
            if (!acc[item.std_value]) {
              acc[item.std_value] = [];
            }
            acc[item.std_value].push(item);
            return acc;
          }, {});
  
          console.log('그룹된 옵션들:' + JSON.stringify(groupedOptions));
  
          setFormFields((prevFields) =>
            prevFields.map((fieldItem) => {
              const options = groupedOptions[fieldItem.column_id] || [];
  
              // 초기화
              let visible = fieldItem.visible;
              let controlType = fieldItem.control_type;
  
              // 해당 필드에 연결된 모든 옵션을 확인하여 visible과 controlType 결정
              options.forEach((item) => {
                const optionPrefix = item.std_key.substring(0, 4); // std_key 앞 4자리 추출
  
                if (optionPrefix === 'disp') {
                  visible = item.code_desc === 'true'; // 'disp' 옵션에 따른 visible 설정
                }
  
                if (optionPrefix === 'type') {
                  controlType = item.code_desc; // 'type' 옵션에 따른 control_type 설정
                }
              });
  
              // 업데이트된 visible과 controlType을 반환
              return {
                ...fieldItem,
                visible,
                control_type: controlType,
              };
            })
          );
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [currentValue]); // currentValue가 변경될 때마다 실행
  const handleChange = (e) => {
    const newValue = e.target.value;
    setCurrentValue(newValue); // 선택된 값을 로컬 상태로 업데이트
    onChange(field.column_id, newValue); // 부모 컴포넌트로 상태 업데이트 알림
  };

  if (field.column_id === 'title' || field.column_id === 'content') return null;

  const gridStyles = {
    gridColumnStart: field.ctrl_pos_x || 'auto',
    gridColumnEnd: field.ctrl_pos_x ? `span ${field.ctrl_width || 1}` : 'auto',
    gridRowStart: field.ctrl_pos_y || 'auto',
    gridRowEnd: field.ctrl_pos_y ? `span ${field.ctrl_height || 1}` : 'auto',
    display: field.visible === false ? 'none' : 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
    width: field.width || 'auto',
    height: field.height || 'auto'
  };
  const handlePasswordChange = (e) => {
    const encryptedValue = encrypt(e.target.value, 'ANTS'); // 비밀번호를 암호화
    console.log('Encrypted password:', encryptedValue);
    onChange(field.column_id, encryptedValue); // 암호화된 값을 부모 컴포넌트로 전달
  };

  switch (field.control_type) {
    case 'NumberBox':
      return (
        <div type='number' style={gridStyles} id='dy-textBox'>
          <Label>{field.column_title}</Label>
          <DyInput type="number" value={value} onChange={handleChange} />
        </div>
      );
    case 'TextBox':
      return (
        <div style={gridStyles} id='dy-textBox'>
          <Label>{field.column_title}</Label>
          <DyInput type="text" value={value} onChange={handleChange} />
        </div>
      );
    case 'DateBox':
      return (
        <FormGroup  style={gridStyles}>
          <Label>{field.column_title}</Label>
          <DyInput type="date" value={value} onChange={handleChange} />
        </FormGroup>
      );
    case 'DateTimeBox':
      return (
        <FormGroup style={gridStyles}>
          <Label>{field.column_title}</Label>
          <DyInput type="datetime-local" value={value} onChange={handleChange} />
        </FormGroup>
      );
    case 'TimeBox':
      return (
        <FormGroup  style={gridStyles}>
          <Label>{field.column_title}</Label>
          <DyInput type="time" value={value} onChange={handleChange} />
        </FormGroup>
      );
    case 'PostCode':
      return (
        <FormGroup  style={gridStyles}>
          <Label>{field.column_title}</Label>
          <AddressModal onChange={(address) => handleChange({ target: { value: address } })} />
        </FormGroup>
      );
    case 'PasswordBox':
      return (
        <FormGroup style={gridStyles}>
          <Label>{field.column_title}</Label>
          <DyInput type="password" onChange={handlePasswordChange} /> {/* 비밀번호 입력 필드 */}
        </FormGroup>
      );
    case 'SelectBox':
      return (
        <FormGroup style={gridStyles}>
          {/* {JSON.stringify(field)} */}
        <Label>{field.column_title}</Label>
        <CustomSelectBox
          value={currentValue}
          placeholder={'선택하세요'}
          onChange={handleChange}
          options={options}
          field={field}
          isSearch={field?.mask?.includes("Search")}
          isCancel={field?.mask?.includes("Cancel")}
        />
      </FormGroup>
      );
    case 'CheckBox':
      return (
        <FormGroup style={gridStyles}>
          <Label>{field.column_title}</Label>
          <div style={{ alignContent: 'center', width:'100%', justifyContent:'center',display:'flex',marginBottom:'1px'}}>
            <div style={{justifyContent:'center',alignSelf: 'center',display:'flex',flexDirection:'row',flexWrap:'nowrap' , alignContent: 'center', alignSelf: 'end',borderColor:'silver',padding:'10px',width:'100%',borderStyle:'solid',borderWidth:'1px',borderRadius:'5px'}}>
              <Input style={{width:'1.3rem'}} type="checkbox" checked={value} onChange={(e) => onChange(field.column_id, e.target.checked)}></Input><label>{field.column_title}</label>
            </div>
          </div>
        </FormGroup>
      );
      case "ArraySelectBox":
        const transformedOptions = options.map(option => ({
          label: option.std_key,
          value: option.std_value,
        }));

       const handleArraySelectChange = (newValue) => {
  // 배열의 값을 문자열 배열 형식으로 변환
        const formattedValue = newValue.map(value => `${value}`).join(", ");

        console.log('Formatted newValue:', formattedValue); // 배열 형태의 문자열 출력

        setArrayInputs(newValue); // 로컬 상태를 배열로 유지
        onChange(field.column_id, formattedValue); // 부모 컴포넌트로 변경 알림 (배열 형태의 문자열 전달)
      };
      
        return (
          <FormGroup style={gridStyles}>
            <Label>{field.column_title}</Label>
            <MultiSelecter
              options={transformedOptions}
              value={arrayInputs.map(input => input.code_option)} // 선택된 값을 로컬 상태에서 가져옴
              onChange={handleArraySelectChange}
              placeholder={field.column_title}
            />
          </FormGroup>
        );
      case 'ArrayInput':
        return (
          <FormGroup style={gridStyles}>
            <Label>{field.column_title}</Label>
            <Button type='button' onClick={toggleModal}>{field.column_title+' 설정'}</Button>
            {modalOpen && (
              <ModalOverlay>
                <ModalContent>
                  <ModalHeader>
                 {field.column_title}
                    <Button  type='button' onClick={toggleModal}>&times;</Button>
                  </ModalHeader>
                  <ModalBody>
                    {arrayInputs.map((input, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <Label style={{ marginRight: '10px' }}>{input.code_option}</Label>
                        <DyInput
                          type="text"
                          value={input.code_value}
                          onChange={(e) => handleArrayInputChange(index, e, 'code_value')}
                          style={{ marginRight: '10px' }}
                        />
                        <Button type='button' onClick={() => removeArrayInput(index)}>-</Button>
                      </div>
                    ))}
                    {/* <Button  type='button'  onClick={addArrayInput}>항목추가</Button> */}
                    {/* {JSON.stringify(arrayInputs)} */}
                  </ModalBody>
                  <ModalFooter>
                  <Button
                          type="button"
                          onClick={() => {
                            const formattedString = arrayInputs
                              .map(item => `${item.code_option} : ${item.code_value}`)
                              .join(', '); // 각 항목을 ', '로 구분하여 스트링으로 변환
                            onChange(field.column_id, formattedString); // 변환된 스트링을 onChange에 전달
                            setModalOpen(false); // 모달 닫기
                          }}
                        >저장</Button>
                    <Button  style={{marginLeft:'10px'}} type='button'  onClick={toggleModal}>취소</Button>
                  </ModalFooter>
                </ModalContent>
              </ModalOverlay>
            )}
          </FormGroup>
        );
    default:
      return (
        <div style={gridStyles} id='dy-textBox'>
          <Label>{field.column_title}</Label>
          <DyInput type="text" value={value} onChange={handleChange} />
        </div>
      );
  }
};

export default DynamicInput;
