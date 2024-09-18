import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { useApp } from '../../../AppContext';
import { PostForm } from "./PostForm";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan ,faClock,faUserPlus,faUserTie,faUndo,faTicketAlt,faDollarSign,faCog,faExclamationTriangle, faEdit, faTrash, faColumns, faSave, faFileExcel,faPlusSquare,faTimes, faSleigh } from '@fortawesome/free-solid-svg-icons';
import {statisticExport,order_agent,order_refund,order_cancel,order_accident,userAdd} from './clientAction';
import AddUserForm from '../../../Forms/AddUserForm';
import {
  ControlButton,
  BoardContainer,
  BoardHeader,
  BoardTitle,
  PaginationContainer,
  PaginationButtons,
  PaginationButton,
  PostButton,
  DyControlButton,
} from './styled';
import { saveAs } from 'file-saver';
import Viewer from './Viewer';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ManageBoard from './ManageBoard/ManageBoard';
import SearchForm from './SearchForm';
import { BoardsTable } from "./BoardTable";
import SimpleSearchForm from "./SimpleSearchForm";
import { useNavigate } from 'react-router-dom';
import DynamicPopup from './DynamicPopup';

function DynamicBoard({ tableName }) {
  
  
  const [initFlag, setInitFlag] = useState(false); // 초기화 완료 여부를 확인하는 상태
  const [popupType, setPopupType] = useState('None'); // 초기값 설정
  const navigate = useNavigate(); // Hook to navigate programmatically
  const location =useLocation();
  //const { userId, additionalInfo } = location.state || {}; // Destructure state parameters
  const { user } = useApp();
  const [isOpenViewer,setIsOpenViewer] = useState(false);
  const [isShowPopup,setIsShowPopup] = useState(false); 
  const [isShowDynamicPopup,setIsShowDynamicPopup] = useState(false); 
  const [openPost,setOpenPost] = useState({});
  const [codeDisplayMap, setCodeDisplayMap] = useState({});
  const [hasTitleField, setHasTitleField] = useState(false);
  const [hasContentField, setHasContentField] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [formFields, setFormFields] = useState([]);
  const [refrashFlag , setRefrashFlag] = useState(false);
  const [orderBy, setOrderBy]=useState([]);
  const [menuConfig,setMenuConfig] = useState({  
    use_editer:false,
    use_new:false,
    use_modify:false,
    use_delete:false,
    use_excel:false,
    use_trigger:false,
    use_view:false,
    use_upload:false,
    display_title:'title',
    display_content:'content',
    sort_order:'desc',
    post_btn_type:false,
    search_type:false,
  });
// 아이콘을 매핑하는 객체
  const iconMapping = {
    faFileExcel: faFileExcel,
    faEdit: faEdit,
    faTrash: faTrash,
    faColumns: faColumns,
    faTimes: faTimes,
    faExclamationTriangle:faExclamationTriangle,
    faDollarSign:faDollarSign,
    faTicketAlt:faTicketAlt,
    faUndo:faUndo,
    faUserTie:faUserTie,
    faUserPlus:faUserPlus,
    faBan:faBan ,
    faClock:faClock,
    // 필요한 다른 아이콘들도 여기에 추가
  };

  const buttonsData = [
    // { label: "통계", iconName: "faFileExcel", onClickHandler: () => console.log("새 버튼 1 클릭됨") },
  ];
  if (tableName === "personal_info_mgmt") {
    buttonsData.push({
      label: "등록",
      iconName: "faUserPlus",
      onClickHandler: () => userAdd(setIsShowPopup),
    });
  }
  if (tableName === "coupon_set") {
    buttonsData.push({
      label: "시간설정",
      iconName: "faClock",
      onClickHandler: () => {
         // 체크박스로 선택된 행이 있는지 확인
      if (selectedRows.length === 0) {
        alert('항목을 선택하세요.');
        return;
      }
      // 선택된 행이 있으면 팝업을 표시
        setPopupType('TimeControl');
        setIsShowDynamicPopup(true);
      },
    });
    buttonsData.push({
      label: "예매제한",
      iconName: "faBan",
      onClickHandler: () => {
        //const selectedRowsData = selectedRows.map(rowIndex => posts[rowIndex]);
        setPopupType('BookingLimit');
        setIsShowDynamicPopup(true);
      },
    });
    buttonsData.push({
      label: "통계",
      iconName: "faFileExcel",
      onClickHandler: () => statisticExport(),
    });
  }
  else if (tableName === "order_list") {
   
    buttonsData.push({
      label: "예매대행",
      iconName: "faUserTie",
      onClickHandler: () => {
        const selectedRowsData = selectedRows.map(rowIndex => posts[rowIndex]);
        order_agent(selectedRowsData);
      },
    });
    buttonsData.push({
      label: "환불요청",
      iconName: "faDollarSign",
      onClickHandler: () => {
        const selectedRowsData = selectedRows.map(rowIndex => posts[rowIndex]);
        order_refund(selectedRowsData);
      },
    });
    buttonsData.push({
      label: "취소요청",
      iconName: "faUndo",
      onClickHandler: () => {
        const selectedRowsData = selectedRows.map(rowIndex => posts[rowIndex]);
        order_cancel(selectedRowsData);
      },
    });
    buttonsData.push({
      label: "사고접수",
      iconName: "faExclamationTriangle",
      onClickHandler: () => {
        const selectedRowsData = selectedRows.map(rowIndex => posts[rowIndex]);
        order_accident(selectedRowsData);
      },
    });
   
  }
  // 예시로 사용되는 버튼 데이터베이스 값 (아이콘은 문자열로 저장됨)

  //tableName만약 order_list라면 버튼데이터에 { label: "통계", iconName: "faFileExcel", onClickHandler: () => console.log("새 버튼 1 클릭됨") }, 이렇게 추가하고싶은거야

  const initValues = {
    save: {
      table: "테이블명",
      setColumns: ["컬럼명"],
      keyColumn: ["키컬럼명"]
    },
    update: {
      table: "테이블명",
      setColumns: ["컬럼명"],
      keyColumn: ["키컬럼명"]
    },
    delete: {
      table: "테이블명",
      keyColumn: ["키컬럼명"]
    }
  };

  const [searchParams, setSearchParams] = useState({ from: null, to: null});
  const [autoSearch,setAutoSearch] = useState({ from: null, to: null });
  const [values, setValues] = useState(initValues);
  const [title, setTitle] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isManageMode, setIsManageMode] = useState(false);
  const [posts, setPosts] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(15);
  const [totalPosts, setTotalPosts] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [saveMessage, setSaveMessage] = useState("");
  const totalPages = Math.ceil(totalPosts / postsPerPage);
// useEffect를 사용하여 location state로부터 searchParams 업데이트
useEffect(() => {
  if (location.state) {
    let newSearchParams = {};
    for (const key in location.state) {
      if (location.state.hasOwnProperty(key)) {
        newSearchParams[key] = location.state[key];
      }
    }
    setAutoSearch(newSearchParams);
  }
}, [location.state]);

// tableName이 변경될 때 상태 초기화 및 initFlag를 false로 설정
useEffect(() => {
  const resetStates = async () => {
    setIsAllSelected(false);
    setIsFormOpen(false);
    setTitle('');
    setIsOpenViewer(false);
    setIsEditMode(false);
    setIsManageMode(false);
    setPosts([]);
    setColumns([]);
    setCurrentPage(1);
    setTotalPosts(0);
    setSelectedRows([]);
    setEditedRows({});
    setSaveMessage("");
    setSearchParams({ from: null, to: null });
    setOrderBy([]);
    setInitFlag(false); // 초기화 중에는 initFlag를 false로 설정
  };

  resetStates();
}, [tableName]);
 // useEffect를 사용하여 location state로부터 searchParams 업데이트
 useEffect(() => {
  if (location.state) {
    let newSearchParams = {}; // 빈 객체로 초기화

    for (const key in location.state) {
      if (location.state.hasOwnProperty(key)) {
        newSearchParams[key] = location.state[key]; // 각 키를 객체에 추가
      }
    }
    setAutoSearch(newSearchParams); // 새로운 searchParams 객체를 autoSearch로 설정
  }
}, [location.state]); // location.state가 변경될 때마다 실행
// 초기화가 완료된 후 initFlag를 true로 설정
useEffect(() => {
  const initialize = async () => {
    await fetchBoardData();
    setInitFlag(true); // 초기화 완료 후 initFlag를 true로 설정
  };

  initialize();
}, [tableName]); // tableName이 변경될 때마다 실행

// initFlag와 searchParams가 준비된 후에만 데이터 조회를 수행
useEffect(() => {
  if (!initFlag) return; // 초기화가 완료되지 않았으면 실행하지 않음

  const fetchData = async () => {
    const data = await getBoardData(currentPage, postsPerPage, tableName, searchParams, orderBy, 'main data fetch');
    if (data) {
      setPosts(data.boardData[0].sampleRows || []);
      setColumns(data.boardData[0].columns || []);
      setTitle(data.boardData[0].board_title);
      setTotalPosts(data.total);
    }
  };

  fetchData();
}, [initFlag, currentPage, refrashFlag, saveMessage]); // tableName 제거

// searchParams가 변경될 때 데이터를 다시 조회
useEffect(() => {
  if (!initFlag) return;
  const fetchData = async () => {
    const data = await getBoardData(currentPage, postsPerPage, tableName, searchParams, orderBy, 'searchParams changed');
    if (data) {
      setPosts(data.boardData[0].sampleRows || []);
      setColumns(data.boardData[0].columns || []);
      setTitle(data.boardData[0].board_title);
      setTotalPosts(data.total);
    }
  };

  fetchData();
}, [searchParams]);





  useEffect(() => {
    const fetchCodeDisplayMappings = async () => {
      const newCodeDisplayMap = {};
  
      // Filter columns based on bind_type
      const columnsWithSType = columns.filter(column => (column.bind_type === 'S'|| column.bind_type === 'C'));
      const columnsWithMType = columns.filter(column => column.bind_type === 'M');
  
      // Fetch mappings for 'S' type columns
      for (const column of columnsWithSType) {
        if (column.bind_key) {
          try {
            const response = await fetch(`/request/getCodeDisplayMappings?bind_key=${encodeURIComponent(column.bind_key)}`, {
              credentials: 'include',
              headers: {
                Accept: 'application/json',
              },
              method: 'GET',
            });
  
            if (!response.ok) {
              throw new Error('Failed to fetch code display mappings');
            }
  
            const mappings = await response.json();
  
            // Add new mappings to the map
            newCodeDisplayMap[column.bind_key] = mappings[column.bind_key];
          } catch (error) {
            console.error(`Error fetching code display mappings for bind_key: ${column.bind_key}`, error);
          }
        }
      }
  
      // Fetch mappings for 'M' type columns
      for (const column of columnsWithMType) {
        if (column.bind_key) {
          try {
            const response = await fetch(`/request/getMasterDataMappings?table=${encodeURIComponent(column.bind_key)}&option=${encodeURIComponent(column.bind_option)}&display=${encodeURIComponent(column.bind_display)}`, {
              credentials: 'include',
              headers: {
                Accept: 'application/json',
              },
              method: 'GET',
            });
    
            if (!response.ok) {
              throw new Error('Failed to fetch master data mappings');
            }
    
            const mappings = await response.json();
    
            // Directly assign the mappings for 'M' type columns
            newCodeDisplayMap[column.bind_key] = mappings[column.bind_key]; // 테이블 이름이 아닌 컬럼 아이디를 사용하고 싶다면 필요에 따라 수정하세요
          } catch (error) {
            console.error(`Error fetching master data mappings for table: ${column.bind_key}`, error);
          }
        }
      }
      setCodeDisplayMap(newCodeDisplayMap); // Set all mapping data into state
    };
  
    if (columns.length > 0) { // Fetch data only if columns are not empty
      fetchCodeDisplayMappings();
    }

      // Set order by columns based on `order_by_idx` values
  if (columns.length > 0) {
   
    fetchCodeDisplayMappings(); // Fetch the mappings after setting the order
   
  }
  }, [columns]);

  const fetchBoardData = async () => {
    try {
      const response = await fetch(`/request/getActionInfo?board_id=${tableName}`);
      const data = await response.json();
      if (data.action_info) {
        setValues(data.action_info);
      }

      const formResponse = await fetch(`/request/getFormControls?table=${tableName}`);
      const formData = await formResponse.json();
      setFormFields(formData);
      setHasTitleField(formData.some(field => field.column_id === 'title'));
      setHasContentField(formData.some(field => field.column_id === 'content'));
  // `formData`에서 `order_by_idx` 기준으로 정렬할 열 목록 설정
      const orderByColumns = formData
      .filter(field => field.order_by_idx !== null) // `order_by_idx`가 존재하는 열 필터링
      .sort((a, b) => a.order_by_idx - b.order_by_idx) // `order_by_idx` 기준으로 오름차순 정렬
      .map(field => field.column_id); // `column_id`만 추출하여 배열 생성

      setOrderBy(orderByColumns); // `orderBy` 상태 업데이트
      
    } catch (error) {
      console.error('Error fetching board data:', error);
    }
  };
  

  useEffect(() => {
    console.log("수정된행:", JSON.stringify(editedRows));
  }, [editedRows]);

  useEffect(() => { }, [values]);

  const toggleRowSelection = (index) => {
    setSelectedRows(prevSelectedRows =>
      prevSelectedRows.includes(index)
        ? prevSelectedRows.filter(i => i !== index)
        : [...prevSelectedRows, index]
    );
  };

  const generateRequestBody = (actionType, tableName, values, row) => {
    let actionData = values[actionType];
    let query = '';
    let valuesArray = [];

    switch (actionType) {
      case 'save':
        const savePlaceholders = actionData.setColumns.map((col, index) => `$${index + 1}`);
        valuesArray = actionData.setColumns.map(col => row[col]);
        query = `INSERT INTO ${user.domain}.ants_${tableName} (${actionData.setColumns.join(', ')}) VALUES (${savePlaceholders.join(', ')})`;
        break;
      case 'update':
         // Calculate the placeholders for the SET clause
          const updatePlaceholders = Object.keys(row).map((key, index) => `"${key}" = $${index + 1}`);

          // The values for the SET clause
          valuesArray = Object.values(row);

          // Calculate the placeholders for the WHERE clause, accounting for the SET clause length
          const wherePlaceholders = actionData.keyColumn.map((col, index) => `${col} = $${index + 1}`);

          // Add the keyColumn values (for WHERE clause) to the valuesArray after the SET clause values
          valuesArray = [...valuesArray];
          query = `UPDATE ${user.domain}.ants_${tableName} SET ${updatePlaceholders.join(', ')} WHERE ${wherePlaceholders.join(' AND ')}`;
        break;
      case 'delete':
        valuesArray = actionData.keyColumn.map(col => row[col]);
        query = `DELETE FROM ${user.domain}.ants_${tableName} WHERE ${actionData.keyColumn.map((col, index) => `${col} = $${index + 1}`).join(' AND ')}`;
        break;
      default:
        break;
    }
    return { query, values: valuesArray };
  };

  const handleSaveClick = async (actionType, tableName, values, rows) => {
    for (let i = 0; i < rows.length; i++) {
      const requestBody = generateRequestBody(actionType, tableName, values, rows[i]);
      await fetch('/request/saveAction', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
    }
    //setSaveMessage("반영 완료");
    //setTimeout(() => setSaveMessage(""), 3000);
  };

  const getBoardData = async (page = 1, limit = 10, table, searchParams,orderByColumns,callName) => {
    try {
      const formattedFrom =
        searchParams?.from instanceof Date && !isNaN(searchParams.from)
          ? searchParams?.from.toISOString().split('T')[0]
          : '';
      const formattedTo =
        searchParams?.to instanceof Date && !isNaN(searchParams.to)
          ? searchParams?.to.toISOString().split('T')[0]
          : '';
          
      const queryParams = new URLSearchParams({
        page,
        limit,
        table,
        ...searchParams,
        from: formattedFrom,
        to: formattedTo,
        orderby:orderByColumns,
        sort:menuConfig.sort_order
      }).toString();
      //alert(orderBy);
      //order by
      const response = await fetch(`/request/dynamicboardList?${queryParams}`, {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
     
      setPosts(data.boardData[0].sampleRows || []);
      setColumns(data.boardData[0].columns || []);
      setTitle(data.boardData[0].board_title);
      setMenuConfig({
        use_new:data.boardData[0].use_new,
        use_editer:data.boardData[0].use_editer,
        use_modify:data.boardData[0].use_modify,
        use_delete:data.boardData[0].use_delete,
        use_excel:data.boardData[0].use_excel,
        use_trigger:data.boardData[0].use_trigger,
        use_view:data.boardData[0].use_view,
        use_upload:data.boardData[0].use_upload,
        display_title:data.boardData[0].display_title,
        display_content:data.boardData[0].display_content,
        sort_order:data.boardData[0].sort_order,
        post_btn_type:data.boardData[0].post_btn_type,
        search_type:data.boardData[0].search_type,
       });
      setTotalPosts(data.total);
    } catch (error) {
      alert('조회오류 ' +'['+callName+']' + error+'['+orderByColumns+']');
      console.error('Error fetching data:', error);
    }
  };
  


  useEffect(() => {
    if(!initFlag) return;
    fetchBoardData();
    const fetchData = async () => {
      const data = await getBoardData(currentPage, postsPerPage, tableName, autoSearch,orderBy,'autoSearch useEffect');
      if (data) {
        setPosts(data.boardData[0].sampleRows || []);
        setColumns(data.boardData[0].columns || []);
        setTitle(data.boardData[0].board_title);
        setTotalPosts(data.total);
      }
    };
  
    // Fetch data only when searchParams have been updated
    if (Object.keys(autoSearch).some((key) => autoSearch[key] !== null && autoSearch[key] !== '')) {
      fetchData();
    }
  }, [initFlag,autoSearch]); // Dependency array to call fetchData when searchParams change
  useEffect(() => {
    if(!initFlag) return;
    fetchBoardData();
    const fetchData = async () => {
      const data = await getBoardData(currentPage, postsPerPage, tableName, searchParams,orderBy,'currentPage, tableName, refrashFlag,saveMessage');
      if (data) {
        setPosts(data.boardData[0].sampleRows || []);
        setColumns(data.boardData[0].columns || []);
        setTitle(data.boardData[0].board_title);
        setTotalPosts(data.total);
      }
    };
    
    fetchData();
  }, [initFlag,currentPage, refrashFlag,saveMessage]);
  
  

  const getPageNumbers = () => {
    const startPage = Math.max(currentPage - 5, 1);
    const endPage = Math.min(startPage + 9, totalPages);
    const pages = [];

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handleUpdate = (tableName, values, posts) => {
    const selectedRowsData = selectedRows.map(rowIndex => editedRows[rowIndex] || posts[rowIndex]);
    handleSaveClick('update', tableName, values, selectedRowsData);
    setEditedRows({});
    setSelectedRows([]);
    setIsEditMode(false);
    console.log('수정 버튼 클릭됨');
    fetchBoardData();
    setRefrashFlag(!refrashFlag);
  };

  const handleDelete = (tableName, values, posts) => {
    // 삭제 확인 메시지
    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return; // 사용자가 '아니오'를 선택한 경우 함수 종료
    }
  
    const selectedRowsData = selectedRows.map(rowIndex => posts[rowIndex]);
    handleSaveClick('delete', tableName, values, selectedRowsData);
    setIsEditMode(false);
    console.log('삭제 버튼 클릭됨');
    fetchBoardData();
    setRefrashFlag(!refrashFlag);
  };


  const handleExport = () => {
    const selectedRowsData = selectedRows.map(rowIndex => editedRows[rowIndex] || posts[rowIndex]);
    const csvData = [
      columns.map(col => col.column_title), // 컬럼 제목 포함
      ...selectedRowsData.map(row => columns.map(col => row[col.column_id])) // 데이터 매핑
    ];
    const BOM = '\uFEFF';
    const csvContent = BOM+csvData.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${tableName}_export.csv`);
    console.log('엑셀 내보내기 버튼 클릭됨');
  };

  const handleSaveJson = () => {
    setIsEditMode(false);
    console.log('JSON 저장 버튼 클릭됨');
  };

 const handleRowChange = (index, column, value, board) => {
  let actionData = values['update'];

  // keyColumn에 있는 속성명을 사용해 board에서 값을 추출
  const keyColumnValues = actionData.keyColumn.reduce((acc, key) => {
    acc[key] = board[key]; // board 객체에서 keyColumn 값 추출
    return acc;
  }, {});

  // 고유한 keyColumn 값을 문자열로 연결하여 식별자로 사용

  // keyColumnIdentifier는 상태에 저장하지 않고 상태 관리에만 사용
  setEditedRows((prevEditedRows) => ({
    ...prevEditedRows,
    [index]: {
      ...prevEditedRows[index],
      ...keyColumnValues, // keyColumn 값 추가
      [column]: value // 수정된 값 추가
    }
  }));
};
  const handleSaveRow = (index) => {
    setIsEditMode(false);
    setIsManageMode(false);
    setPosts((prevPosts) => {
      const newPosts = [...prevPosts];
      newPosts[index] = { ...newPosts[index], ...editedRows[index] }; // 변경 사항 병합
      return newPosts;
    });

    setEditedRows((prevEditedRows) => {
      const newEditedRows = { ...prevEditedRows };
      delete newEditedRows[index];
      return newEditedRows;
    });
  };

  const handleSearchChange = (field, value) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      [field]: value
    }));
  };

  return (
    <BoardContainer>
        {!menuConfig.post_btn_type && menuConfig.use_new && <PostButton onClick={() => setIsFormOpen(!isFormOpen)}>
            <FontAwesomeIcon icon={faPlusSquare} /> 신  규  등  록
        </PostButton>}
        <hr/>
      <div>
        {isFormOpen ? (
          <PostForm
            handleSearchChange={handleSearchChange}
            formFields={formFields}
            hasTitleField={hasTitleField}
            hasContentField={hasContentField}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            getBoardData={getBoardData}
            currentPage={currentPage}
            postsPerPage={postsPerPage}
            tableName={tableName}
            refrashFlag={refrashFlag}
            setRefrashFlag={setRefrashFlag}
            closeForm={() => setIsFormOpen(false)}
            menuConfig={menuConfig}
            setFormFields={setFormFields}
          />):(<></>)
        }
        <BoardHeader>
          <BoardTitle>{title}</BoardTitle>

          {/* {isEditMode && ( */}
            <div className="edit-buttons" style={{alignContent:'center'}}>
               {/* 동적으로 버튼을 추가 */}
              {buttonsData.map((button, index) => (
                <DyControlButton key={index} onClick={button.onClickHandler}>
                 <FontAwesomeIcon icon={iconMapping[button.iconName]} /> {button.label}
               </DyControlButton>
              ))}
             
              {menuConfig.post_btn_type && menuConfig.use_new && <ControlButton onClick={() => setIsFormOpen(!isFormOpen)}>
                <FontAwesomeIcon icon={faPlusSquare} /> 등록
              </ControlButton>}
        
              {menuConfig.use_modify &&<ControlButton onClick={() => handleUpdate(tableName, values, posts)}>
                <FontAwesomeIcon icon={faEdit} /> 수정
              </ControlButton>}
              {menuConfig.use_delete && <ControlButton onClick={() => handleDelete(tableName, values, posts)}>
                <FontAwesomeIcon icon={faTrash} /> 삭제
              </ControlButton>}
              {menuConfig.use_excel &&<ControlButton onClick={handleExport}>
                <FontAwesomeIcon icon={faFileExcel} /> 엑셀
              </ControlButton>}
              <ControlButton selected={isManageMode}  onClick={() => setIsManageMode(!isManageMode)}>
                <FontAwesomeIcon icon={faColumns} /> 관리
              </ControlButton>
              {/* 톱니바퀴 모드용 */}
              {/* <ControlButton onClick={()=>setIsEditMode(!isEditMode)}>
                <FontAwesomeIcon icon={faTimes} /> 취소
              </ControlButton> */}
            </div>
          {/* )} */}
        </BoardHeader>
        {isManageMode && (
          <ManageBoard
            setMenuConfig={setMenuConfig}
            menuConfig={menuConfig}
            handleSaveJson={handleSaveJson}
            tableName={tableName}
            setValues={setValues}
            values={values}
            setIsManageMode={setIsManageMode}
          />
        )}
        {/* <ToolbarContainer></ToolbarContainer> */}
        {menuConfig.search_type ? <SearchForm
          orderBy={orderBy}
          handleSearchChange={handleSearchChange}
          formFields={formFields}
          hasTitleField={hasTitleField}
          hasContentField={hasContentField}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          getBoardData={getBoardData}
          currentPage={currentPage}
          postsPerPage={postsPerPage}
          tableName={tableName}
        />:<SimpleSearchForm
        orderBy={orderBy}
        handleSearchChange={handleSearchChange}
        formFields={formFields}
        hasTitleField={hasTitleField}
        hasContentField={hasContentField}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        getBoardData={getBoardData}
        currentPage={currentPage}
        postsPerPage={postsPerPage}
        tableName={tableName}
      />}
        {isOpenViewer && menuConfig.use_view &&
        <Viewer
          board_id={tableName}
          post_id={openPost[values['update'].keyColumn]}
          isAllSelected={isAllSelected}
          setIsAllSelected={setIsAllSelected}
          board={openPost}
          setPosts={setPosts}
          columns={columns}
          isEditMode={isEditMode}
          toggleRowSelection={toggleRowSelection}
          editedRows={editedRows}
          handleRowChange={handleRowChange}
          handleSaveRow={handleSaveRow}
          saveMessage={saveMessage}
          codeDisplayMap={codeDisplayMap} // codeDisplayMap을 전달
          isManageMode={isManageMode}
          menuConfig={menuConfig}
        />}
        <div style={{display:'flex',overflowX:'auto'}}>
        <BoardsTable
          setOpenPost={setOpenPost}
          setIsOpenViewer={setIsOpenViewer}
          isOpenViewer={isOpenViewer}
          isAllSelected={isAllSelected}
          setIsAllSelected={setIsAllSelected}
          boards={posts}
          setPosts={setPosts}
          columns={columns}
          selectedRows={selectedRows}
          isEditMode={isEditMode}
          toggleRowSelection={toggleRowSelection}
          editedRows={editedRows}
          handleRowChange={handleRowChange}
          handleSaveRow={handleSaveRow}
          saveMessage={saveMessage}
          codeDisplayMap={codeDisplayMap} // codeDisplayMap을 전달
          isManageMode={isManageMode}
          refrashFlag={refrashFlag}
          setRefrashFlag={setRefrashFlag}
        />
        </div>
        <PaginationContainer>
          <span>[ {totalPosts} ] - Page {currentPage} of {totalPages} </span>
          <PaginationButtons>
            <PaginationButton
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              이전
            </PaginationButton>
            {getPageNumbers().map((page) => (
              <PaginationButton
                key={page}
                onClick={() => setCurrentPage(page)}
                disabled={currentPage === page}
              >
                {page}
              </PaginationButton>
            ))}
            <PaginationButton
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              다음
            </PaginationButton>
          </PaginationButtons>
        </PaginationContainer>
      </div>
      {isShowPopup && <AddUserForm setIsShowPopup={setIsShowPopup} setRefrashFlag={setRefrashFlag}/>}
      {isShowDynamicPopup &&<DynamicPopup rows={selectedRows.map(rowIndex => posts[rowIndex])} type={popupType} setIsShowDynamicPopup={setIsShowDynamicPopup}/>}
    </BoardContainer>
  );
}

export { DynamicBoard };