import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { couponSetExport, statisticExport, pw_change, member_delete } from '../clientAction';
import "react-datepicker/dist/react-datepicker.css";
import { faSave, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import CustomSelectBox from '../../../../components/SearchSelecter';
import ArrayButtonCell from "./ArrayButtonCell.js";
import LongTextPopup from '../../../../components/LongTextPopup';
import PasswordChangePopup from '../../../PasswordChangePopup';
import usePasswordChange from '../../../PasswordChangePopup/usePasswordChange.js';
import { useNavigate } from 'react-router-dom';
import {
  StyledTable,
  StyledThead,
  StyledTh,
  StyledTbody,
  StyledTr,
  StyledTd,
  Input,
  FileIcon,
} from '../styled';
import MultiSelecter from "../../../MultiSelecter/index.js";

export function BoardsTable({
  setOpenPost,
  boards,
  columns,
  selectedRows,
  toggleRowSelection,
  isEditMode,
  editedRows,
  handleRowChange,
  saveMessage,
  codeDisplayMap,
  isAllSelected,
  setIsAllSelected,
  setIsOpenViewer,
  isOpenViewer,
  refrashFlag,
  setRefrashFlag
}) {
  const {
    showPasswordChangePopup,
    handleOpenPasswordChangePopup,
    handleClosePasswordChangePopup,
    handlePasswordChangeSubmit
  } = usePasswordChange();
  const [selectBoxOptions, setSelectBoxOptions] = useState({});
  const [arraySelectBoxOptions, setArraySelectBoxOptions] = useState({});
  const [openPopupRow, setOpenPopupRow] = useState(null); // 현재 팝업이 열려 있는 행을 추적하는 상태
  const navigate = useNavigate();

  useEffect(() => {
    boards.forEach((_, index) => {
      if (selectedRows.includes(index)) {
        toggleRowSelection(index, boards[index], false);
      }
    });
    setIsAllSelected(false);
  }, [boards, refrashFlag]);

  useEffect(() => {
    const fetchSelectBoxData = async (bind_key, column_id, bind_type,bind_option,bind_display) => {
      try {
        console.log('바인딩 파라미터:'+bind_type+bind_option+bind_display);
        // M 유형인 경우 다른 URL 또는 파라미터 설정
        const url =
          bind_type === 'M'
            ? `/request/getFormMasterData?bind_key=${bind_key}&bind_option=${bind_option}&bind_display=${bind_display}` // M 유형에 맞는 URL
            : `/request/getFormControlOptions?bind_key=${bind_key}`; // S와 C 유형에 맞는 URL
  
        const response = await fetch(url, { credentials: 'include' });
  
        if (!response.ok) throw new Error('Failed to fetch select box options');
  
        const data = await response.json();
        setSelectBoxOptions((prevState) => ({
          ...prevState,
          [column_id]: data,
        }));
        //alert(JSON.stringify(data));
        // setArraySelectBoxOptions((prevState) => ({
        //   ...prevState,
        //   [column_id]: data,
        // }));
        setArraySelectBoxOptions((prevState) => ({
          ...prevState,
          [column_id]: data.map(item => ({
            label: item.std_key,
            value: item.std_value,
          })),
        }));
      } catch (error) {
        console.error('Error fetching SelectBox options:', error);
      }
    };
  
    columns.forEach((column) => {
      if (
        (column.control_type === 'ArraySelectBox' || column.control_type === 'SelectBox') &&
        ['S', 'C', 'M'].includes(column.bind_type)
      ) {
        fetchSelectBoxData(column.bind_key, column.column_id, column.bind_type,column.bind_option,column.bind_display);
      }
    });
  }, [columns]);

 // Function to handle button click and perform API fetch
 const handleButtonClick = async (columnFunction , board,result_action) => {
  //alert(JSON.stringify(board));
  
  const apiParameters = await fetchApiParameters(columnFunction);
  if (!apiParameters) {
    alert('Failed to fetch API parameters. Please try again later.');
    return;
  }
  
  const row = board;
  const api_url = (apiParameters && apiParameters[0] && apiParameters[0].std_description) ? apiParameters[0].std_description : null;
  if (api_url !== null) {
    console.log(api_url);
  } 
  
  let url;
  try {
    url = new URL(api_url);
  } catch {
    alert('API URL이 비정상입니다.'+api_url);
    return;
  }

  // Prepare request options
  const options = {
    credentials:'include',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Create the request body with separate row and param objects
  const requestBody = {
    parameters: apiParameters,
    row: row,
  };
  
  options.body = JSON.stringify(requestBody);
  // Perform fetch call
  
  try {
    console.log('Making API call to:', url); // Debugging log
    const response = await fetch(url, options);
    //alert(JSON.stringify(result));
    const result = await response.json();
    if(result_action){
      callResultFunc(result_action,result);
    }
    // Now send the result to the InterfaceResultTable endpoint
    await storeResultInDatabase(result);
    
    
    
    //alert('API call was successful.');
  } catch (error) {
    console.error("API call failed:", error);
    alert('API call failed. Please check the console for more details.'+error);
  }
};
const storeResultInDatabase = async (result) => {
  const saveUrl = '/request/saveResult'; // Replace with your server's endpoint

  try {
    const response = await fetch(saveUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ result }),
    });

    if (response.ok) {
      // alert('.');
    } else {
      alert('Failed to save result to the database.');
    }
  } catch (error) {
    console.error('Failed to save result:', error);
    alert('Failed to save result. Please check the console for more details.');
  }
};

const fetchApiParameters = async (columnFunction) => {
  try {
    const url = new URL('/request/getApiParameters', window.location.origin);
    url.searchParams.append('target_code', columnFunction);
    const response = await fetch(url, {
      credentials: 'include',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    alert("Failed to fetch API parameters: " + error.message);
    return null;
  }
};
const callResultFunc = (action,result) => {
  switch (action) {
    case 'execel_down':
      couponSetExport(result);
      break;
    case 'statistic_down':
      statisticExport(result);
      break;
    case 'pw_change':
      handleOpenPasswordChangePopup(result); // 팝업 열기 함수 호출
      break;
    case 'member_delete':
      console.log(result);
      //member_delete(row);
      setRefrashFlag(prev=>!prev)
      break;
    case 'loginCb'://loginCb
        alert('로그인처리');
      break;
      case 'mobileLoginCb'://mobileLoginCb
        alert('모바일로그인처리');
        break;
      case 'viewInfoCb'://viewInfoCb
        alert('사용자정보처리');
        break;
      case 'viewRefundsCb'://viewRefundsCb
        navigate('/Order/Board/refund_req',{ state: { user_name: result.name} }); // Navigate to purchase history page
        break;
      case 'viewRewardsCb'://viewRewardsCb
        alert('적립금내역보기');
        navigate('/Savings/Board/used_point',{ state: { result: result} }); // Navigate to purchase history page
        break;
      case 'viewOrdersCb'://viewOrdersCb
        alert('주문내역보기');
        navigate('/Order/Board/order_list',{ state: { result: result} }); // Navigate to purchase history page
        break;
      case 'viewCouponsCb'://viewCouponsCb
        alert('쿠폰리스트보기');
        navigate('/Coupon/Board/coupon_total',{ state: { result: result} }); // Navigate to purchase history page
        break;
      case 'verifyCouponCb'://verifyCouponCb
        alert('인증내역보기');
        navigate('/Coupon/Board/coupon_cert',{ state: { result: result} }); // Navigate to purchase history page
        break;
      case 'viewDepositsCb'://viewDepositsCb
        alert('입금내역보기');
        navigate('/Order/Board/deposit_list', { state: { result: result} }); //조회조건에 해당하는 get url
        break;
      case 'viewPurchasesCb'://
        alert('구매내역보기');
        navigate('/Product/Board/product_reg',{ state: { result: result} }); // Navigate to purchase history page
        break;
    default:
      break;
  }
}



  const handleHeaderCheckboxChange = (e) => {
    const newIsAllSelected = e.target.checked;
    setIsAllSelected(newIsAllSelected);

    boards.forEach((_, index) => {
      toggleRowSelection(index, boards[index], newIsAllSelected);
    });
  };

  const renderSelectBox = (column, board, index) => (
    <CustomSelectBox
      value={editedRows[index]?.[column.column_id] ?? board[column.column_id] ?? ""}
      onChange={(e) => handleRowChange(index, column.column_id, e.target.value, board)}
      options={selectBoxOptions[column.column_id]}
      field={columns}
      disabled={column.read_only}
    />
  );
  const ArraySelectBox = (column, board, index) => (
    <div>
      {/* {JSON.stringify(arraySelectBoxOptions[column.column_id])} */}
    <MultiSelecter
      value={editedRows[index]?.[column.column_id] ?? board[column.column_id] ?? ""}
      onChange={(e) => handleRowChange(index, column.column_id, e.target.value, board)}
      options={arraySelectBoxOptions[column.column_id]}
      field={columns}
      disabled={column.read_only}
    />
    </div>
  );

  const renderButton = (column, board) => (
    <button
      style={{ background: 'white' }}
      disabled={isEditMode}
      onClick={() => handleButtonClick(column.function, board, column.result_action)}
    >
      {column.function === null ? "함수 미설정" : column.column_title}
    </button>
  );

  const renderArrayButton = (column, board, index) => (
    <ArrayButtonCell
    column={column}
      board={board}
      isEditMode={isEditMode}
      handleButtonClick={handleButtonClick}
      isPopupVisible={openPopupRow === index} // Check if the popup should be visible for the current row
      onPopupToggle={() => setOpenPopupRow(openPopupRow === index ? null : index)} // Function to toggle popup visibility
    />
  );

  const renderDateTimeBox = (column, board, index) => {
    const isDate = column.control_type === "DateBox";
    const isTime = column.control_type === "TimeBox";
    const inputType = isDate ? "date" : isTime ? "time" : "datetime-local";
  
    // Get the value from the board
    const rawValue = board[column.column_id];
  
    // Check if the value is a valid date
    let formattedValue = "";
    if (rawValue && !isNaN(Date.parse(rawValue))) {
      const dateObj = new Date(rawValue);
  
      if (isDate) {
        formattedValue = dateObj.toISOString().split('T')[0]; // Get only the date part
      } else if (isTime) {
        formattedValue = dateObj.toISOString().split('T')[1].slice(0, 5); // Get only the time part (HH:MM)
      } else {
        formattedValue = dateObj.toISOString().slice(0, 16); // Get date and time without seconds
      }
    }
  
    return (
      <input
        type={inputType}
        value={formattedValue}
        onChange={(e) => handleRowChange(index, column.column_id, e.target.value, board)}
        disabled={column.read_only}
      />
    );
  };

  const renderCheckBox = (column, board, index,read_only) => {
    const isChecked = editedRows[index]?.[column.column_id] ?? (board[column.column_id] === 'true' ? true : false);
    return (
      <Input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => handleRowChange(index, column.column_id, read_only?e.target.checked:isChecked, board)}
        read_only={read_only?column.read_only:true}
      />
    );
  };

  const renderDefaultInput = (column, board, index) => (
    <Input
      disabled={column.read_only}
      value={editedRows[index]?.[column.column_id] ?? board[column.column_id]}
      onChange={(e) => handleRowChange(index, column.column_id, e.target.value, board)}
    />
  );

  const renderControl = (column, board, index) => {
    // Check if the row is selected
    const isRowSelected = selectedRows.includes(index);
  
    // Render appropriate control based on the column type and selection state
    switch (column.control_type) {
      case "SelectBox":
        return isRowSelected ? renderSelectBox(column, board, index) : renderDisplayValue(column, board);
      case "ArraySelectBox":
        return isRowSelected ? ArraySelectBox(column, board, index) : renderDisplayValue(column, board);
      case "Button":
        return renderButton(column, board);
      case "ArrayButton":
        return renderArrayButton(column, board, index);
      case "DateTimeBox":
      case "DateBox":
      case "TimeBox":
        return isRowSelected ? renderDateTimeBox(column, board, index) : renderDisplayValue(column, board);
      case "CheckBox":
        return isRowSelected ? renderCheckBox(column, board, index,isRowSelected) : renderCheckBox(column, board, index,isRowSelected);
      case "LongText":
          return <LongTextPopup text={board[column.column_id]} buttonName={column.column_title}></LongTextPopup>
      default:
        return isRowSelected ? renderDefaultInput(column, board, index) : renderDisplayValue(column, board);
    }
  };

  
  const renderDisplayValue = (column, board) => {
    const displayValue = (() => {
      if (["S", "M", "C"].includes(column.bind_type)) {
        
      if (column.control_type === 'ArraySelectBox') {
        const rawValue = board[column.column_id];
        // 문자열을 쉼표로 구분하여 배열로 변환
        const valuesArray = rawValue.split(",").map(value => value.trim());
    
        // 배열의 각 값을 codeDisplayMap을 사용해 변환
        const mappedValues = valuesArray.map(value => {
          const mappedValue = codeDisplayMap[column.bind_key]?.[value];
          return mappedValue ? mappedValue : value; // 매핑된 값이 있으면 사용, 없으면 원래 값 반환
        });
    
        // 변환된 값을 쉼표로 구분된 문자열로 반환
        return mappedValues.join(", ");
      }
        return codeDisplayMap[column.bind_key]?.[board[column.column_id]] || board[column.column_id];
      }
    
    
    
      // 기본 처리
      return board[column.column_id];
    })();

    if (column.mask === "PriceNum") {
      return formatNumberWithCommas(displayValue);
    } else if (column.mask === "DateTime") {
      if (!displayValue) {
        return ""; 
      }

      if (/^(\d{2}):(\d{2})$/.test(displayValue)) {
        return displayValue; 
      }

      const date = new Date(displayValue);
      if (!isNaN(date.getTime())) {
        return date.toISOString().replace('T', ' ').split('.')[0];
      }

      return displayValue;
    } else if (column.mask === "Date") {
      const date = new Date(displayValue);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      } else {
        return displayValue;
      }
    } else if (column.mask === "Time") {
      const date = new Date(displayValue);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[1]?.slice(0, 5);
      } else {
        return displayValue;
      }
    } else if (column.mask === "LongText") {
      return (
        <LongTextPopup text={displayValue} buttonName={column.column_title} />
      );
    } else if (column.mask === "Files") {
      return board[column.column_id] ? (
        <FileIcon>
          <FontAwesomeIcon icon={faPaperclip} />
        </FileIcon>
      ) : (
        <></>
      );
    } else {
      return displayValue;
    }
  };

  const formatNumberWithCommas = (number) => {
    if (!number || isNaN(number)) return '';
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const sortedColumns = [...columns].sort((a, b) => {
    const idxA = a.column_idx !== undefined ? a.column_idx : Number.MAX_SAFE_INTEGER;
    const idxB = b.column_idx !== undefined ? b.column_idx : Number.MAX_SAFE_INTEGER;
    return idxA + idxB; // 작은 값부터 큰 값 순으로 정렬
  });

  return (
    <StyledTable>
      {showPasswordChangePopup && (
        <PasswordChangePopup 
          onClose={handleClosePasswordChangePopup} 
          onSubmit={handlePasswordChangeSubmit} 
        />
      )}
      <StyledThead>
        <tr>
          <StyledTh style={{ width: '10px' }}>
            <Input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleHeaderCheckboxChange}
            />
          </StyledTh>
          {sortedColumns.map((column, index) => (
            column.cell_visible && (
              <StyledTh key={index} style={{ width: column.column_width || 'auto' }}>
                {column.mapping_name || column.column_title}
              </StyledTh>
            )
          ))}
        </tr>
      </StyledThead>
      <StyledTbody>
        {boards.map((board, index) => (
          <StyledTr key={index} onDoubleClick={() => { setIsOpenViewer(!isOpenViewer); setOpenPost(board); }}>
            <StyledTd style={{ width: '10px' }}>
              <Input
                type="checkbox"
                checked={selectedRows.includes(index)}
                onChange={() => toggleRowSelection(index, board)}
              />
            </StyledTd>
            {sortedColumns.map((column, colIndex) => (
              column.cell_visible && (
                <StyledTd key={colIndex} style={{ width: column.column_width || 'auto', textAlign: column.column_align || 'left' }}>
                  {renderControl(column, board, index)}
                </StyledTd>
              )
            ))}
          </StyledTr>
        ))}
      </StyledTbody>
      {saveMessage && (
        <div style={{ textAlign: "center", marginTop: "10px", color: "green" }}>
          {saveMessage}
        </div>
      )}
    </StyledTable>
  );
}
