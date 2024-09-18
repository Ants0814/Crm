import React, { useState, useEffect, useContext,useRef } from "react";
import "./style.css";
import BoardPost from "../BoardPost";
import { AppContext } from "../../../AppContext";

function AntsBoard() {
  const [posts, setPosts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const {isLoggedIn,user} = useContext(AppContext);
  const [currentPage,setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10); // Adjust as needed
  const [totalPosts,setTotalPosts] = useState(0);
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const handlePostSuccess = () => {
    getBoardData(user.id, currentPage, postsPerPage);
  };

  const getBoardData = async (userId, page, limit) => {
    try {
      const response = await fetch(`api/boardList?userId=${userId}&page=${page}&limit=${limit}`, {
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
        <h2>게시판</h2>
      </div>
      <div>
      <section style={{display:'flex',justifyContent:'space-between', alignItems: 'center'}}>
      <span> Page {currentPage} of {numOfPages} </span>
      <div className="pagination" style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
          <button 
            onClick={prevPage} 
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
            onClick={nextPage} 
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
          refresh={handlePostSuccess}
          closeForm={() => setIsFormOpen(false)}
        />
        
      )}
      {result.length > 0 ? result : <p>게시글이 없습니다.</p>}
      
   
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

      fetch("/api/postings", {
        method: "POST",
        body: formData, // JSON이 아닌 FormData 사용
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
        {/* <ImageUpload /> */}
      </div>
      </form>
    </div>
  );
}

export { AntsBoard, PostForm };
