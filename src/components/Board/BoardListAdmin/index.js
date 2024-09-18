import React, { useState, useEffect, useContext } from "react";

import { AppContext } from "../../../AppContext";
import Pagination from "./Pagination";
import {StyledSearchInput,StyledButton,ButtonContainer,StyledSelect,StyledInput,Label,FormField,ModalTitle,ModalContent,ModalOverlay,StyledTd,StyledTr,StyledTbody,StyledTh,StyledThead,StyledTable} from "./styled";


const ColumnModal = ({ selectedBoard, handleCloseModal }) => {
  const [updatedNewColumns, setUpdatedNewColumns] = useState([]);
  const [boardColumns, setBoardColumns] = useState([]);
  
  
  useEffect(() => {
    const initialBoardColumns = selectedBoard?.board_columns 
      ? selectedBoard.board_columns.split(',').map(columnId => ({ columnId })) 
      : [];
    setBoardColumns(initialBoardColumns);
  }, [selectedBoard]);
  
  const addColumn = () => {
    setUpdatedNewColumns([...updatedNewColumns, { columnId: '', columnName: '', columnType: 'text', columnSize: '', controlType: '' }]);
  };

  const handleColumnChange = (e, index, field) => {
    const { value } = e.target;
    const updatedColumns = [...updatedNewColumns];
    updatedColumns[index] = { ...updatedColumns[index], [field]: value };
    
    setUpdatedNewColumns(updatedColumns);
  };
  
  const handleSaveColumns = async () => {
    // 기존 컬럼은 변경 없이 신규 컬럼만 처리
    const columns = [...updatedNewColumns];
    const columnIds = columns.map(column => column.columnId || column.columnName); // 각 컬럼의 ID를 추출

    try {
      const response = await fetch('https://crm.skynet.re.kr/request/saveColumns', {
        method: 'POST',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boardId: selectedBoard.board_id,
          columns: columns,
          columnIds: columnIds,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save columns');
      }

      const result = await response.json();
      handleCloseModal(); // 성공적으로 저장한 후 모달 닫기
      
    } catch (error) {
      console.error('Error saving columns:', error);
    }
  };

  
  const handleRemoveColumn = async (index, isExisting) => {
    const columnToRemove = isExisting ? boardColumns[index] : updatedNewColumns[index];
  
    if (isExisting) {
      const updatedBoardColumns = [...boardColumns];
      updatedBoardColumns.splice(index, 1);
      setBoardColumns(updatedBoardColumns);
  
      // 백엔드로 삭제 요청
      try {
        const response = await fetch('https://crm.skynet.re.kr/request/deleteColumn', {
          method: 'POST',
          credentials:'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            boardId: selectedBoard.board_id,
            columnId: columnToRemove.columnId,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to delete column');
        }
  
        const result = await response.json();
        console.log('Column deleted successfully:', result);
      } catch (error) {
        console.error('Error deleting column:', error);
      }
    } else {
      const updatedNewColumns = [...updatedNewColumns];
      updatedNewColumns.splice(index, 1);
      setUpdatedNewColumns(updatedNewColumns);
    }
  };
  return (
    <ModalOverlay>
    <ModalContent>
      <ModalTitle>컬럼 편집</ModalTitle>
      <form>
        <div>
          {boardColumns.map((column, index) => (
            <FormField key={`existing_${index}`}>
              <div style={{width:'100%',display:'flex',flexDirection:'row',justifyContent:'center'}} >
              <Label style={{alignSelf:'center'}}>컬럼 ID</Label>
              <StyledInput
                style={{margin:'1rem', width:'60%', justifyContent:'center',alignSelf:'center'}} 
                type="text"
                value={column.columnId}
                readOnly
              />
              <StyledButton type="button" onClick={() => handleRemoveColumn(index, true)}>삭제</StyledButton>
              </div>
            </FormField>
          ))}
          <h3>신규 컬럼</h3>
          {updatedNewColumns.map((column, index) => (
            <FormField key={`new_${index}`}>
              <Label>컬럼 ID</Label>
              <StyledInput
                type="text"
                placeholder="컬럼 ID"
                value={column.columnId || ''}
                onChange={(e) => handleColumnChange(e, index, 'columnId')}
              />
              <Label>컬럼 이름</Label>
              <StyledInput
                type="text"
                placeholder="컬럼 이름"
                value={column.columnName || ''}
                onChange={(e) => handleColumnChange(e, index, 'columnName')}
              />
              <Label>컬럼 타입</Label>
              <StyledSelect
                value={column.columnType || ''}
                onChange={(e) => handleColumnChange(e, index, 'columnType')}
              >
                <option value="text">텍스트</option>
                <option value="number">숫자</option>
                <option value="date">날짜</option>
                <option value="boolean">불리언</option>
                <option value="file">파일</option>
              </StyledSelect>
              <Label>컬럼 크기</Label>
              <StyledInput
                type="text"
                placeholder="크기 (선택 사항)"
                value={column.columnSize || ''}
                onChange={(e) => handleColumnChange(e, index, 'columnSize')}
              />
              <Label>컨트롤 타입</Label>
              <StyledSelect
                value={column.controlType || ''}
                onChange={(e) => handleColumnChange(e, index, 'controlType')}
              >
                <option value="TextBox">텍스트박스</option>
                <option value="NumberBox">넘버박스</option>
                <option value="SelectBox">선택상자</option>
                <option value="CheckBox">체크박스</option>
                <option value="DateTimeBox">날짜선택</option>
                <option value="Button">버튼</option>
                <option value="ArrayInput">텍스트그룹</option>
                <option value="FileUpload">파일업로드</option>
              </StyledSelect>
            </FormField>
          ))}
          <StyledButton type="button" onClick={addColumn}>컬럼 추가</StyledButton>
        </div>
        <ButtonContainer>
          <StyledButton type="button" onClick={handleSaveColumns}>저장</StyledButton>
          <StyledButton type="button" onClick={handleCloseModal}>취소</StyledButton>
        </ButtonContainer>
      </form>
    </ModalContent>
  </ModalOverlay>
  );
};

const EditRow = ({ board,  handleSaveEdit }) => {
  const [editedBoard, setEditedBoard] = useState(board);

  const handleInputChange = (e, field) => {
    setEditedBoard({ ...editedBoard, [field]: e.target.value });
  };

  const saveEdit = () => {
    handleSaveEdit(editedBoard);
  };

  return (
    <StyledTr>
      <StyledTd><input type='checkbox' checked /></StyledTd>
      <StyledTd><StyledInput value={editedBoard.board_id} onChange={(e) => handleInputChange(e, 'board_id')} /></StyledTd>
      <StyledTd><StyledInput value={editedBoard.board_site_id} onChange={(e) => handleInputChange(e, 'board_site_id')} /></StyledTd>
      <StyledTd><StyledInput value={editedBoard.board_category} onChange={(e) => handleInputChange(e, 'board_category')} /></StyledTd>
      <StyledTd><StyledInput value={editedBoard.board_title} onChange={(e) => handleInputChange(e, 'board_title')} /></StyledTd>
      <StyledTd><StyledInput value={editedBoard.board_list_auth} onChange={(e) => handleInputChange(e, 'board_list_auth')} /></StyledTd>
      <StyledTd><StyledInput value={editedBoard.board_read_auth} onChange={(e) => handleInputChange(e, 'board_read_auth')} /></StyledTd>
      <StyledTd><StyledInput value={editedBoard.board_write_auth} onChange={(e) => handleInputChange(e, 'board_write_auth')} /></StyledTd>
      <StyledTd><StyledInput value={editedBoard.board_comment} onChange={(e) => handleInputChange(e, 'board_comment')} /></StyledTd>
      <StyledTd><StyledInput value={editedBoard.board_idx} onChange={(e) => handleInputChange(e, 'board_idx')} /></StyledTd>
      <StyledTd><StyledButton style={{width:'5rem'}} type="button" onClick={saveEdit}>저장</StyledButton></StyledTd>
      <StyledTd><StyledInput value={editedBoard.board_description} onChange={(e) => handleInputChange(e, 'board_description')} /></StyledTd>
    </StyledTr>
  );
};

const AntsBoardListAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [boards, setBoards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [newColumns, setNewColumns] = useState([]);
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [editingRows, setEditingRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const { isLoggedIn, user } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [totalPosts, setTotalPosts] = useState(0);
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const handleSearch = () => {
    getAllBoardData(1, searchTerm); // 검색어와 함께 첫 페이지 데이터 가져오기
    setCurrentPage(1); // 검색 결과를 첫 페이지부터 보여줌
  };
  const getAllBoardData = async (page, search = "") => {
    try {
      console.log("검색어:"+search);
      const response = await fetch(`https://crm.skynet.re.kr/request/get_all_boards?page=${page}&limit=${postsPerPage}&search=${encodeURIComponent(search)}`, {
        credentials: 'include',
        headers: {
          Accept: "application/json",
        },
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setBoards(data.boardData);
      setTotalPosts(data.total);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getAllBoardData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (isLoggedIn && user) {
      getAllBoardData(currentPage);
    }
  }, [isLoggedIn, user]);

  const handleOpenModal = (board) => {
    setSelectedBoard(board);
    setNewColumns([]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBoard(null);
    setNewColumns([]);
    getAllBoardData(currentPage); // 모달을 닫을 때 데이터를 다시 조회
  };

  const handleEditRows = () => {
    setEditingRows(selectedRows);
  };

  const handleSaveEdit = async (updatedBoard) => {
    
    const response = await fetch('https://crm.skynet.re.kr/request/update_board', {
      method: 'POST',
      credentials:'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedBoard),
    });
    if (response.ok) {
      alert('Board updated successfully!');
      setEditingRows(editingRows.filter(id => id !== updatedBoard.board_id));
      getAllBoardData(currentPage);
    } else {
      alert('Failed to update board.');
    }
  };

  const handleSelectRow = (boardId) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(boardId)) {
        return prevSelectedRows.filter(id => id !== boardId);
      } else {
        return [...prevSelectedRows, boardId];
      }
    });
  };

  const handleDeleteBoards = async () => {
    const response = await fetch('https://crm.skynet.re.kr/request/delete_boards', {
      method: 'POST',
      credentials:'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ boardIds: selectedRows }),
    });
    if (response.ok) {
      alert('Boards deleted successfully!');
      setSelectedRows([]);
      getAllBoardData(currentPage);
    } else {
      alert('Failed to delete boards.');
    }
  };

  const BoardsTable = ({ boards, handleOpenModal }) => (
    <StyledTable>
      <StyledThead>
        <tr>
          <StyledTh>
            <input type='checkbox' />
          </StyledTh>
          <StyledTh>게시판 ID</StyledTh>
          <StyledTh>사이트명</StyledTh>
          <StyledTh>카테고리</StyledTh>
          <StyledTh>게시판 TITLE</StyledTh>
          <StyledTh>리스트 권한</StyledTh>
          <StyledTh>읽기 권한</StyledTh>
          <StyledTh>쓰기 권한</StyledTh>
          <StyledTh>댓글 기능</StyledTh>
          <StyledTh>순서</StyledTh>
          <StyledTh>컬럼 편집</StyledTh>
          <StyledTh>설명</StyledTh>
        </tr>
      </StyledThead>
      <StyledTbody>
        {Array.isArray(boards) && boards.length === 0 ? (
          <StyledTr>
            <StyledTd colSpan="11">데이터가 없습니다.</StyledTd>
          </StyledTr>
        ) : (
          boards.map((board, index) => (
            editingRows.includes(board.board_id) ? (
              <EditRow 
                key={index} 
                board={board} 
                handleSaveEdit={handleSaveEdit} 
              />
            ) : (
              <StyledTr key={index}>
                <StyledTd><input type='checkbox' checked={selectedRows.includes(board.board_id)} onChange={() => handleSelectRow(board.board_id)} /></StyledTd>
                <StyledTd>{board.board_id}</StyledTd>
                <StyledTd>{board.board_site_id}</StyledTd>
                <StyledTd>{board.board_category}</StyledTd>
                <StyledTd>{board.board_title}</StyledTd>
                <StyledTd>{board.board_list_auth}</StyledTd>
                <StyledTd>{board.board_read_auth}</StyledTd>
                <StyledTd>{board.board_write_auth}</StyledTd>
                <StyledTd>{board.board_comment}</StyledTd>
                <StyledTd>{board.board_idx}</StyledTd>
                <StyledTd style={{textAlign:'center'}}>
                <StyledButton type="button" onClick={() => handleOpenModal(board)}>컬럼 편집</StyledButton>
              </StyledTd>
                  <StyledTd>{board.board_description}</StyledTd>
              </StyledTr>
            )
          ))
        )}
      </StyledTbody>
    </StyledTable>
  );

  const AddBoardRow = ({ onSaveNewBoard }) => {
    const [newBoard, setNewBoard] = useState({
      board_site_id: '',
      board_category: '',
      board_id: '',
      board_title: '',
      board_list_auth: '',
      board_read_auth: '',
      board_write_auth: '',
      board_comment: '',
      board_description: '',
      columns: []
    });

    const handleNewBoardChange = (e) => {
      const { name, value } = e.target;
      setNewBoard(prevState => ({
        ...prevState,
        [name]: value
      }));
    };

    return (<>
      <StyledThead>
      <tr>
        <StyledTh>게시판 ID</StyledTh>
        <StyledTh>사이트명</StyledTh>
        <StyledTh>카테고리</StyledTh>
        <StyledTh>게시판 TITLE</StyledTh>
        <StyledTh>리스트 권한</StyledTh>
        <StyledTh>읽기 권한</StyledTh>
        <StyledTh>쓰기 권한</StyledTh>
        <StyledTh>댓글 기능</StyledTh>
        <StyledTh>순서</StyledTh>
        <StyledTh>설명</StyledTh>
        <StyledTh></StyledTh>
      </tr>
    </StyledThead>
      <StyledTr>
        <StyledTd>
          <StyledInput
            type="text"
            placeholder="게시판 ID"
            name="board_id"
            value={newBoard.board_id}
            onChange={handleNewBoardChange}
          />
        </StyledTd>
        <StyledTd>
          <StyledInput
            type="text"
            placeholder="사이트명"
            name="board_site_id"
            value={newBoard.board_site_id}
            onChange={handleNewBoardChange}
          />
        </StyledTd>
        <StyledTd>
          <StyledInput
            type="text"
            placeholder="카테고리"
            name="board_category"
            value={newBoard.board_category}
            onChange={handleNewBoardChange}
          />
        </StyledTd>
        <StyledTd>
          <StyledInput
            type="text"
            placeholder="게시판 TITLE"
            name="board_title"
            value={newBoard.board_title}
            onChange={handleNewBoardChange}
          />
        </StyledTd>
        <StyledTd>
          <StyledInput
            type="text"
            placeholder="리스트 권한"
            name="board_list_auth"
            value={newBoard.board_list_auth}
            onChange={handleNewBoardChange}
          />
        </StyledTd>
        <StyledTd>
          <StyledInput
            type="text"
            placeholder="읽기 권한"
            name="board_read_auth"
            value={newBoard.board_read_auth}
            onChange={handleNewBoardChange}
          />
        </StyledTd>
        <StyledTd>
          <StyledInput
            type="text"
            placeholder="쓰기 권한"
            name="board_write_auth"
            value={newBoard.board_write_auth}
            onChange={handleNewBoardChange}
          />
        </StyledTd>
        <StyledTd>
          <StyledInput
            type="text"
            placeholder="댓글 기능"
            name="board_comment"
            value={newBoard.board_comment}
            onChange={handleNewBoardChange}
          />
        </StyledTd>
        <StyledTd>
          <StyledInput
            type="text"
            placeholder="순서"
            name="board_idx"
            value={newBoard.board_idx}
            onChange={handleNewBoardChange}
          />
        </StyledTd>
        <StyledTd>
          <StyledInput
            type="text"
            placeholder="설명"
            name="board_description"
            value={newBoard.board_description}
            onChange={handleNewBoardChange}
          />
        </StyledTd>
        <StyledTd>
          <StyledButton type="button" onClick={() => onSaveNewBoard(newBoard)}>저장</StyledButton>
        </StyledTd>
      </StyledTr>
      </>
    );
  };

  return (
    <div className="board-list">
      <div className="boardListHeader">
        <h2>통합 게시판 관리</h2>
      </div>
      <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0px' }}>
        <div>
        <StyledSearchInput
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '10px', width:'20rem' }}
        />
        <button className="postingBtn" onClick={handleSearch}>검색</button>
        </div>
    
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <button 
            style={{ margin: '0 10px' }} 
            className="postingBtn"
            onClick={() => setIsAddingBoard(true)}
          >
            추가
          </button>
          <button style={{ margin: '0 10px' }} className="postingBtn" onClick={handleEditRows}>
            수정
          </button>
          <button style={{ margin: '0 10px' }} className="postingBtn" onClick={handleDeleteBoards}>
            삭제
          </button>
        </div>
        </div>
        <BoardsTable boards={boards} handleOpenModal={handleOpenModal} />
        {isAddingBoard && (
          <AddBoardRow onSaveNewBoard={async (newBoard) => {
            const response = await fetch('https://crm.skynet.re.kr/request/create_board', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials:'include',
              body: JSON.stringify(newBoard),
            });
            if (response.ok) {
              alert('New board created successfully!');
              setIsAddingBoard(false);
              getAllBoardData(currentPage);
            } else {
              alert('Failed to create new board.');
            }
          }} />
        )}
        <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'black' }}> Page {currentPage} of {totalPages} </span>
          <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
        </section>
        {isModalOpen && (
          <ColumnModal
            selectedBoard={selectedBoard}
            handleCloseModal={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}

export { AntsBoardListAdmin };