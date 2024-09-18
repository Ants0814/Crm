import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faComment, faReply, faTrash, faPaperclip,faSearch } from '@fortawesome/free-solid-svg-icons';
import { couponSetExport, statisticExport } from '../clientAction';
import ThumbnailViewer from './ThumbnailViewer';
import "react-datepicker/dist/react-datepicker.css";
import styled from 'styled-components';
import CommentView from "./CommentView";





// 스타일드 컴포넌트 정의
const Container = styled.div`
  margin: 20px auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  position: relative;
`;

const Header = styled.header`
  background-color: #f8f9fa;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
`;

const Title = styled.input`
  width: 100%;
  font-size: 24px;
  font-weight: bold;
  border: none;
  background: transparent;
  margin-bottom: 8px;
  color: #333;
  &:disabled {
    color: #333;
  }
`;

const Meta = styled.div`
  font-size: 12px;
  color: #6c757d;
  display: flex;
  justify-content: space-between;
`;

const Content = styled.div`
  width: 100%;
  min-height: 200px;
  padding: 16px;
  border: none;
  resize: vertical;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 12px;
  text-align:left;
  &:disabled {
    background: white;
    color: #333;
  }
`;

const Footer = styled.footer`
  background-color: #f8f9fa;
  padding: 20px;
  border-top: 1px solid #e9ecef;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
  margin-left: 8px;
  &:hover {
    background-color: #0056b3;
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(1px);
  }
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;
  font-size: 12px;
  padding: 4px 8px;
  &:hover {
    background-color: #c82333;
  }
`;

const CommentSection = styled.div`
  margin-top: 16px;
`;

const CommentCard = styled.div`
  background: white;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 14px;
`;




const TextArea = styled.textarea`
  width: calc(100% - 60px);
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  resize: vertical;
  margin-right: 8px;
  font-size: 14px;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
`;


// 파일 리스트 컨테이너 스타일 정의
const FileListContainer = styled.div`
  position: relative;
  bottom: 20px;
  right: 20px;
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 10px;
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
  z-index: 1000;
`;

// 파일 아이콘 스타일 정의
const FileIcon = styled.button`
  position: relative;
  bottom: 20px;
  right: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 24px;
  z-index: 1001;
  align-self:end;
`;

export default function Viewer({
  post_id,
  board_id,
  board,
  columns,
  isEditMode,
  saveMessage,
  codeDisplayMap,
  menuConfig,
}) {
  const [selectBoxOptions, setSelectBoxOptions] = useState({});
  const [title, setTitle] = useState(board?.title || "");
  const [content, setContent] = useState(board?.content || "");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isCommentEdit,setIsCommentEdit] = useState(false);
  const [isFileListVisible, setIsFileListVisible] = useState(false); // 파일 리스트 보이기 상태
  const replyRefs = useRef([]);

  useEffect(() => {
    setTitle(board?.title || "");
    setContent(board?.content || "");
  }, [board]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/request/get_comments?board_id=${board_id}&post_id=${post_id}`, { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Failed to fetch board data');
      }
      const data = await response.json();
      setTitle(data.title);
      setContent(data.content);
      setComments(data);
    } catch (error) {
      console.error('Error fetching board data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [post_id, board_id]);

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    try {
      const result = await addComment(board_id, post_id, newComment, board?.author);
      if (result) {
        setNewComment("");
        fetchData();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  async function addComment(board_id, post_id, content, author) {
    try {
      const response = await fetch('/request/add_comment', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          board_id,
          post_id,
          content,
          author,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add comment: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Comment added successfully:', data);
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  }
  const handleEditReply = async ( replyId, newContent) => {
    try {
      const response = await fetch('/request/update_reply', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reply_id: replyId,
          content: newContent,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update the reply');
      }
  
      console.log('Reply updated successfully');
      fetchData(); // 업데이트된 데이터를 다시 가져옴
    } catch (error) {
      console.error('Error updating reply:', error);
    }
  };

  async function editComment(commentId, content) {
    try {
      const response = await fetch('/request/update_comment', { // 경로 수정
        credentials: 'include',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment_id: commentId,
          content,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to edit comment: ${response.statusText}`);
      }
  
      console.log('Comment edited successfully');
      // 상태 업데이트
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.comment_id === commentId ? { ...comment, content } : comment
        )
      );
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  }

  async function deleteComment(commentId) {
    try {
      const response = await fetch(`/request/delete_comment/${commentId}`, {
        credentials: 'include',
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete comment: ${response.statusText}`);
      }

      console.log('Comment deleted successfully');
      setComments(comments.filter(comment => comment.comment_id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  }

  async function deleteReply(commentId, replyId) {
    try {
      const response = await fetch(`/request/delete_reply/${replyId}`, {
        credentials: 'include',
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete reply: ${response.statusText}`);
      }

      console.log('Reply deleted successfully');
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.comment_id === commentId
            ? {
                ...comment,
                replies: comment.replies.filter((reply) => reply.comment_id !== replyId),
              }
            : comment
        )
      );
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  }

  

  const handleAddReply = async (commentIndex, replyText) => {
    if (!replyText || replyText.trim() === "") return;
  
    try {
      const parentCommentId = comments[commentIndex].comment_id;
      const result = await addReply(parentCommentId, replyText, board?.author);
  
      if (result) {
        fetchData(); // 댓글과 답글 데이터를 다시 가져옵니다.
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  async function addReply(parentCommentId, content, author) {
    try {
      const response = await fetch('/request/add_reply', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          board_id: board_id,
          post_id: post_id,
          parent_comment_id: parentCommentId,
          content,
          author,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add reply: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Reply added successfully:', data);
      return data;
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  }

  const toggleFileList = () => {
    setIsFileListVisible(!isFileListVisible);
  };

  return (
    <Container>
      <Header>
        <Title
          type="text"
          value={board[menuConfig.display_title]}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title here..."
          disabled={!isEditMode}
        />
        <Meta>
          <div>Author: {board?.author || "Unknown"}</div>
          <div>Date: {board?.date || "N/A"}</div>
        </Meta>
      </Header>

      <Content
        value={board[menuConfig.display_content]}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter content here..."
        disabled={!isEditMode}
        dangerouslySetInnerHTML={{ __html: (board[menuConfig.display_content]) }}
      />
      <section style={{width:'100%',display:'flex',marginLeft:'20px'}}>
 {/* 파일 첨부 아이콘 */}
    {board.upload &&<FileIcon onClick={toggleFileList}>
        <FontAwesomeIcon icon={faPaperclip} />
      </FileIcon>
    }
      {/* 파일 리스트 */}
      <FileListContainer isVisible={isFileListVisible}>
      <ThumbnailViewer images={board.upload?.split(',')}/>
      <ul>
          {board.upload?.split(',').map((item, index) => {
            const trimmedItem = item.trim();
            const isImage = /\.(jpeg|jpg|gif|png|svg|webp)$/i.test(trimmedItem); // 이미지 파일 형식 확인
            return (
              <li key={index}>
                {trimmedItem}
                
                {isImage && (
                  <button
                    onClick={() => window.open(trimmedItem, '_blank')} // 클릭 시 이미지 새 탭에서 열기
                    style={{ marginLeft: '8px', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <FontAwesomeIcon icon={faSearch} title="View Thumbnail" />
                  </button>
                )}
              </li>
              );
          })}
           
        </ul>
      </FileListContainer>
       
      </section>
<Footer>
  <div style={{ textAlign: 'left' }}>
    {/* 댓글 섹션 */}
    <InputWrapper>
      <TextArea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
      />
      <Button onClick={handleAddComment}>
        <FontAwesomeIcon icon={faComment} /> Comment
      </Button>
    </InputWrapper>

    <CommentSection>
      {comments.map((comment, index) => (
        <CommentView
          key={index}
          index={index} // 인덱스를 전달합니다.
          comment={comment}
          onDelete={deleteComment}
          onEdit={editComment}
          onReplyAdd={handleAddReply}
          onReplyDelete={deleteReply}
          onReplyEdit={handleEditReply}
        />
      ))}
    </CommentSection>
  </div>
</Footer>
</Container>
);
}