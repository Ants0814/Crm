import React, { useEffect, useState } from "react";
import RichTextEditor from "../../RichTextEditor";
import "./style.css";

function BoardPost(props) {
  const [showContent, setShowContent] = useState(false); // 내용 토글 기본false
  const [files, setFiles] = useState(false); // 내용 토글 기본false
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  
  // 게시글 데이터 가져오기
  const getItemData = async (node_id) => {
    // 여기에 비동기 통신 로직 구현
    try {
      const response = await fetch(`api/fileList?node_id=${node_id}`, {
        headers: {
          Accept: "application / json",
        },
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
      getItemData(props.id); // 여기에서 사용자 아이디를 전달합니다.
  }, []); // user를 의존성 배열에 추가합니다.
 // 로그인 상태 변경시에만 실행

  // 로그인 상태가 아니면 로그인 페이지로 리다이렉트

  // 제목 클릭 시 내용을 토글하는 함수
  const toggleContent = () => {
    setShowContent(!showContent);
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const submitComment = () => {
    if (newComment) {
      setComments([...comments, newComment]);
      setNewComment("");
    }
  };


  return (
    <div className="post" id={`post-${props.ID}`}>
      <div className="post-header" onClick={toggleContent}>
        <span className="post-id">{props.id}</span>
        <span className="post-title">{props.title}</span>
        <span className="post-user">{props.user_name}</span>
      </div>
      {showContent && (
        <div className="post-body">
          {props.content && <div className="post-content">{props.content}</div>}
          {props.file && <div className="post-file">{props.file}</div>}
          <div>
            <label>[첨부파일]</label>
          {files.map((comment, index) => (
              <p><a style={{color:'#46b5bd',cursor:'pointer'}}
              href={`/files/${comment.file_Name}`} 
              download
              ><label key={index}>{comment.file_Name}</label></a></p>
            ))}
          </div>
          <div className="post-footer">
          <div className="comment-section">
          <input
            type="text"
            value={newComment}
            onChange={handleCommentChange}
            placeholder="댓글을 입력하세요"
          />
          <button onClick={submitComment}>댓글 달기</button>
          <div className="comments">
            {comments.map((comment, index) => (
              <div key={index} className="comment">{comment}</div>
            ))}
          </div>
        </div>
          </div>
        </div>
      )}
    </div>  
    );
}

export default BoardPost;
