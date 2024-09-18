import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faReply, faTrash } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import Reply from '../ReplyView';

const TextArea = styled.textarea`
  width: calc(100% - 60px);
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  resize: vertical;
  margin-right: 8px;
  font-size: 14px;
`;

const CommentCard = styled.div`
  background: white;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 14px;
`;

const DeleteButton = styled.button`
  background-color: #dc3545;
  font-size: 12px;
  padding: 4px 8px;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 8px;
  &:hover {
    background-color: #c82333;
  }
`;
const EditButton = styled.button`
  background-color: #007bff;
  font-size: 12px;
  padding: 4px 8px;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 8px;
  transition: background-color 0.3s, transform 0.1s;
  &:hover {
    background-color: #0056b3;
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(1px);
  }
`;
const EditTextArea = styled.textarea`
  width: 100%;
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

export default function CommentView({ comment, index, onDelete, onEdit, onReplyAdd, onReplyEdit, onReplyDelete }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [newCommentContent, setNewCommentContent] = useState(comment.content);
  const [newReply, setNewReply] = useState('');

  const handleEditToggle = () => {
    if (isEditMode) {
      onEdit(comment.comment_id, newCommentContent); // Save 버튼을 클릭할 때 업데이트 수행
    }
    setIsEditMode(!isEditMode); // Edit 모드 토글
  };

  const handleReplyAdd = () => {
    if (newReply.trim() !== "") {
      onReplyAdd(index, newReply); // `index`와 새 답글을 전달합니다.
      setNewReply(''); // 새 답글 필드를 초기화
    }
  };

  return (
    <CommentCard>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <strong>{comment.author}</strong> <span>{new Date(comment.date).toLocaleString()}</span>
        </div>
        <div>
          <DeleteButton onClick={handleEditToggle}>
            <FontAwesomeIcon icon={isEditMode ? faReply : faEdit} /> {isEditMode ? 'Save' : 'Edit'}
          </DeleteButton>
          <DeleteButton onClick={() => onDelete(comment.comment_id)}>
            <FontAwesomeIcon icon={faTrash} /> Delete
          </DeleteButton>
        </div>
      </div>
      {!isEditMode ? (
        <p>{comment.content}</p>
      ) : (
        <>
          <hr />
          <InputWrapper>
            <EditTextArea
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
              placeholder="Edit comment..."
            />
          </InputWrapper>
          <hr />
        </>
      )}
      {comment.replies.map((reply, replyIndex) => (
        <Reply
          key={replyIndex}
          reply={reply}
          commentId={comment.comment_id}
          onEdit={onReplyEdit}
          onDelete={onReplyDelete}
        />
      ))}
      <InputWrapper>
        <TextArea
          placeholder="Add a reply..."
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
        />
        <Button onClick={handleReplyAdd}>
          <FontAwesomeIcon icon={faReply} /> Reply
        </Button>
      </InputWrapper>
    </CommentCard>
  );
}