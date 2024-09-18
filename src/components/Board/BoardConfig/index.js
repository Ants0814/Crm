import React, { useState, useEffect, useContext,useRef } from "react";
import { Navigate } from 'react-router-dom';
import "./style.css";
import BoardPost from "../BoardPost";
import { AppContext } from "../../../AppContext";
import Pagination from "./Pagination";
import styled from 'styled-components';

function AntsBoardMaster() {
  const [posts, setPosts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { isLoggedIn, user } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); // Adjust as needed
  const [totalPosts, setTotalPosts] = useState(0);
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const handlePostSuccess = () => {
    getBoardData(user.id, currentPage, postsPerPage);
  };

  const getBoardData = async (userId, page, limit) => {
    try {
      const response = await fetch(`request/boardList?userId=${userId}&page=${page}&limit=${limit}`, {
        headers: {
          Accept: "application/json",
        },
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setPosts(data.posts); // Assuming the response has a 'posts' array
      setTotalPosts(data.total); // Assuming the response includes a 'total' count
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn && user) {
      getBoardData(user.id, currentPage, postsPerPage);
    }
  }, [isLoggedIn, currentPage, postsPerPage, user]);

  // if (!isLoggedIn) {
  //   return <Navigate to="/login" />;
  // }

  // Pagination controls
  const numOfPages = Math.ceil(totalPosts / postsPerPage);
  const nextPage = () => setCurrentPage((prev) => (prev < numOfPages ? prev + 1 : prev));
  const prevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));

  const result = posts.map(data => (
    <BoardPost
      key={data.ID}
      id={data.node_id}
      title={data.title}
      content={data.content}
      user_name={data.user_name}
      file={data.file_name}
    />
  ));

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
  return (
    <div className="board-list">
      <div className="boardListHeader">
        <h2>게시판 관리</h2>
      
      </div>
      <div>
      <section style={{display:'flex',justifyContent:'space-between', alignItems: 'center'}}>
      <span> Page {currentPage} of {numOfPages} </span>
      <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalPosts / postsPerPage)}
            setCurrentPage={setCurrentPage}
          />
                   <button style={{width:'140px'}} className="postingBtn" onClick={() => setIsFormOpen(true)}>
          게시판 생성
        </button>
        </section>
          
</div>

      {isFormOpen && (<>
        <BoardCreationForm refresh={handlePostSuccess}  closeForm={() => setIsFormOpen(false)}></BoardCreationForm>
        </>
      )}
      {result.length > 0 ? result : <p>게시판이 없습니다.</p>}
      
   
    </div>
  );
}


/**글쓰기 */
function PostForm({ refresh, closeForm }) {
  //포스팅 저장 후 페이지를 리렌더링하기 위해 getBoardData를 가져옴
  const [postUserName, setPostUserName] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postFile, setPostFile] = useState(null); // 파일 상태
  const { user } = useContext(AppContext); // 로그인된 사용자 정보 가져오기

  useEffect(() => {
    if (user && user.name) {
      setPostUserName(user.id); // 로그인된 사용자의 이름으로 설정
    }
  }, [user]);


  /** file 타입 저장 */
  const handleFileChange = (event) => {
    setPostFile(event.target.files); // 첫 번째 선택된 파일을 저장
  };

  /**저장하기 */
  const myFormData = useRef();
  const handleSubmit = () => {
    if (postTitle.trim() && postContent.trim() && postFile) {
      const formData = new FormData(myFormData.current);
      formData.append("name", postUserName);
      formData.append("title", postTitle);
      formData.append("content", postContent);
      formData.append("files", postFile);

      fetch("https://crm.skynet.re.kr/request/create_board", {
        method: "POST",
        body: formData, // JSON이 아닌 FormData 사용
        credentials:'include',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          alert("게시글이 성공적으로 작성되었습니다!");
          refresh(); // 게시글 리렌더링

          // 입력 필드를 초기화합니다.
          setPostTitle("");
          setPostContent("");
          setPostFile(null); // 파일 입력 필드를 초기화합니다.
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
            type="button"
            className="closeBtn"
            onClick={() => closeForm(false)}
          >
            취소
          </button>
        </div>
        {/* <ImageUpload /> */}
      </div>
      </form>
    </div>
  );
}




const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  resize: vertical;
`;

const Select = styled.select`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #0056b3;
  }
`;

const ColumnContainer = styled.div`
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
`;

const AddColumnButton = styled(Button)`
  background-color: #28a745;
  &:hover {
    background-color: #218838;
  }
`;

const BoardCreationForm = () => {
  const [formData, setFormData] = useState({
    boardName: '',
    boardDescription: '',
    boardAdmin: '',
    category: '',
    tags: '',
    icon: '',
    rules: '',
  });

  const [columns, setColumns] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleColumnChange = (index, e) => {
    const { name, value } = e.target;
    const newColumns = [...columns];
    newColumns[index] = { ...newColumns[index], [name]: value };
    setColumns(newColumns);
  };

  const addColumn = () => {
    setColumns([...columns, { columnName: '', columnType: 'text', isRequired: false }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullData = { ...formData, columns };
    console.log(fullData);
  
    fetch('https://crm.skynet.re.kr/request/create_board', {
      method: 'POST',
      credentials:'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fullData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
        // 성공 처리 로직 추가
        alert('Board created successfully!');
      })
      .catch((error) => {
        console.error('Error:', error);
        // 에러 처리 로직 추가
        alert(`Failed to create board: ${error.message}`);
      });
  };

  return (
    <Container>
      <Title>게시판 생성</Title>
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="boardName">게시판 이름</Label>
        <Input
          type="text"
          id="boardName"
          name="boardName"
          value={formData.boardName}
          onChange={handleChange}
        />

        <Label htmlFor="boardDescription">게시판 설명</Label>
        <TextArea
          id="boardDescription"
          name="boardDescription"
          rows="4"
          value={formData.boardDescription}
          onChange={handleChange}
        />

        <Label htmlFor="boardAdmin">게시판 관리자</Label>
        <Input
          type="text"
          id="boardAdmin"
          name="boardAdmin"
          value={formData.boardAdmin}
          onChange={handleChange}
        />

        <Label htmlFor="category">카테고리</Label>
        <Input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        />

        <Label htmlFor="tags">태그</Label>
        <Input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
        />

        <Label htmlFor="icon">게시판 아이콘</Label>
        <Input
          type="text"
          id="icon"
          name="icon"
          value={formData.icon}
          onChange={handleChange}
        />

        <Label htmlFor="rules">게시판 규칙</Label>
        <TextArea
          id="rules"
          name="rules"
          rows="4"
          value={formData.rules}
          onChange={handleChange}
        />

        <Title>컬럼 설정</Title>
        {columns.map((column, index) => (
          <ColumnContainer key={index}>
            <Label htmlFor={`columnName-${index}`}>컬럼 이름</Label>
            <Input
              type="text"
              id={`columnName-${index}`}
              name="columnName"
              value={column.columnName}
              onChange={(e) => handleColumnChange(index, e)}
            />

            <Label htmlFor={`columnType-${index}`}>컬럼 타입</Label>
            <Select
              id={`columnType-${index}`}
              name="columnType"
              value={column.columnType}
              onChange={(e) => handleColumnChange(index, e)}
            >
              <option value="text">텍스트</option>
              <option value="number">숫자</option>
              <option value="date">날짜</option>
              <option value="boolean">불리언</option>
            </Select>

            <Label htmlFor={`isRequired-${index}`}>필수 여부</Label>
            <Select
              id={`isRequired-${index}`}
              name="isRequired"
              value={column.isRequired}
              onChange={(e) => handleColumnChange(index, e)}
            >
              <option value={false}>아니오</option>
              <option value={true}>예</option>
            </Select>
          </ColumnContainer>
        ))}
        <AddColumnButton type="button" onClick={addColumn}>
          컬럼 추가
        </AddColumnButton>

        <Button type="submit">생성</Button>
      </Form>
    </Container>
  );
};
export { AntsBoardMaster, PostForm };
