import React, { useState, useEffect, useContext, useRef } from "react";
import { Navigate } from 'react-router-dom';
import "./style.css";
import styled from 'styled-components';
import BoardPost from "../BoardPost";
import { AppContext } from "../../../AppContext";

function AntsBoardListAdmin() {
  const [boards, setBoards] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { isLoggedIn, user } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [totalPosts, setTotalPosts] = useState(0);
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const getAllBoardData = async () => {
    try {
      const response = await fetch(`https://crm.skynet.re.kr/request/get_all_boards`, {
        credentials:'include',
        headers: {
          Accept: "application/json",
        },
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setBoards(data); // 모든 테이블 데이터를 상태에 저장
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getAllBoardData();
  }, []);

  useEffect(() => {
    if (isLoggedIn && user) {
      getAllBoardData();
    }
  }, [isLoggedIn, user]);

  const renderBoardPosts = (boardData) => {
    return boardData.map(data => (
      <BoardPost
        key={data.id}
        id={data.node_id}
        title={data.title}
        content={data.content}
        user_name={data.user_name}
        file={data.file_name}
      />
    ));
  };

  // 현재 페이지 주변의 페이지 번호를 계산하여 배열로 반환합니다.
  const getPageNumbers = () => {
    const startPage = Math.max(currentPage - 5, 1);
    const endPage = Math.min(startPage + 9, totalPages);
    const pages = [];

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 18px;
  text-align: left;
  color:black;
`;

const StyledThead = styled.thead`
  background-color: #f2f2f2;
`;

const StyledTh = styled.th`
  padding: 12px;
  border: 1px solid #ddd;
`;

const StyledTbody = styled.tbody`
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const StyledTr = styled.tr``;

const StyledTd = styled.td`
  padding: 12px;
  border: 1px solid #ddd;
`;

const StyledP = styled.p`
  margin: 0;
  color: #888;
`;
const BoardsTable = ({ boards }) => (
  <StyledTable>
    <StyledThead>
          <tr>
            <StyledTh>
                <input type="checkbox" />
            </StyledTh>
            <StyledTh>게시판 ID</StyledTh>
            <StyledTh>게시판 명칭</StyledTh>
            <StyledTh>게시판 관리자</StyledTh>
            <StyledTh>리스트 권한</StyledTh>
            <StyledTh>읽기 권한</StyledTh>
            <StyledTh>카테고리</StyledTh>
            <StyledTh>게시판 규칙</StyledTh>
        </tr>
    </StyledThead>
    <StyledTbody>
      {Object.keys(boards).map((boardName) => (
        <StyledTr key={boardName}>
             <StyledTd>
                <input type="checkbox" />
            </StyledTd>
          <StyledTd>{boardName}</StyledTd>
          <StyledTd>
            {boards[boardName].rows.length > 0 
              ? renderBoardPosts(boards[boardName].rows) 
              : <StyledP>게시글이 없습니다.</StyledP>}
          </StyledTd>
          <StyledTd>
            {boards[boardName].rows.length > 0 
              ? renderBoardPosts(boards[boardName].rows) 
              : <StyledP>게시글이 없습니다.</StyledP>}
          </StyledTd>
          <StyledTd>
            {boards[boardName].rows.length > 0 
              ? renderBoardPosts(boards[boardName].rows) 
              : <StyledP>게시글이 없습니다.</StyledP>}
          </StyledTd>
          <StyledTd>
            {boards[boardName].rows.length > 0 
              ? renderBoardPosts(boards[boardName].rows) 
              : <StyledP>게시글이 없습니다.</StyledP>}
          </StyledTd>
          <StyledTd>
            {boards[boardName].rows.length > 0 
              ? renderBoardPosts(boards[boardName].rows) 
              : <StyledP>게시글이 없습니다.</StyledP>}
          </StyledTd>
          <StyledTd>
            {boards[boardName].rows.length > 0 
              ? renderBoardPosts(boards[boardName].rows) 
              : <StyledP>게시글이 없습니다.</StyledP>}
          </StyledTd>
        </StyledTr>
      ))}
    </StyledTbody>
  </StyledTable>
);

  return (
    <div className="board-list">
      <div className="boardListHeader">
        <h2>게시판 관리</h2>
      </div>
      <div>
          <BoardsTable boards={boards}/>
        <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span> Page {currentPage} of {totalPages} </span>
          <div className="pagination" style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1}
              style={{
                marginRight: '8px',
                padding: '8px 16px',
                backgroundColor: currentPage === 1 ? '#b9b8c38f' : '#46b5bd',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              이전
            </button>
            {getPageNumbers().map((page) => (
              <button 
                key={page} 
                onClick={() => setCurrentPage(page)} 
                disabled={currentPage === page}
                style={{
                  margin: '0 4px',
                  padding: '8px 12px',
                  backgroundColor: currentPage === page ? '#469bbdb5' : '#46b5bd',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: currentPage === page ? 'not-allowed' : 'pointer',
                }}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages}
              style={{
                marginLeft: '8px',
                padding: '8px 16px',
                backgroundColor: currentPage === totalPages ? '#b9b8c38f' : '#46b5bd',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              다음
            </button>
          </div>
          <button className="postingBtn" onClick={() => setIsFormOpen(true)}>
            글쓰기
          </button>
        </section>
      </div>
      {isFormOpen && (
        <PostForm 
          closeForm={() => setIsFormOpen(false)}
        />
      )}
 
    </div>
  );
}

/**글쓰기 */
function PostForm({ refresh, closeForm }) {
  const [postUserName, setPostUserName] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postFile, setPostFile] = useState(null);
  const { user } = useContext(AppContext);

  useEffect(() => {
    if (user && user.name) {
      setPostUserName(user.id);
    }
  }, [user]);

  const handleFileChange = (event) => {
    setPostFile(event.target.files);
  };

  const myFormData = useRef();
  const handleSubmit = () => {
    if (postTitle.trim() && postContent.trim() && postFile) {
      const formData = new FormData(myFormData.current);
      formData.append("name", postUserName);
      formData.append("title", postTitle);
      formData.append("content", postContent);
      formData.append("files", postFile);

      fetch("/api/postings", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          alert("게시글이 성공적으로 작성되었습니다!");
          refresh();
          setPostTitle("");
          setPostContent("");
          setPostFile(null);
        })
        .catch((error) => {
          console.error("Error creating post:", error);
        });
    } else {
      alert("Title, content, and file are required!");
    }
  };

  return (
    <div className="postFormBox">
      <h2>글쓰기</h2>
      <form ref={myFormData}>
        <div className="post-form">
          <input
            className="userNameInput"
            defaultValue={postUserName}
            onChange={(e) => setPostUserName(e.target.value)}
            readOnly 
            placeholder="작성자"
          />

          <input
            className="postTitleInput"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            placeholder="제목"
          />
          <textarea
            className="postContentInput"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="내용"
          />
          <input
            name="Myfiles"
            type="file"
            className="fileInput"
            onChange={handleFileChange}
            placeholder="파일"
            multiple
          />
          <div className="button-container">
            <button type="button" className="formSubmitBtn" onClick={handleSubmit}>
              저장
            </button>
            <button
              typq="button"
              className="closeBtn"
              onClick={() => closeForm(false)}
            >
              취소
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export { AntsBoardListAdmin, PostForm };
