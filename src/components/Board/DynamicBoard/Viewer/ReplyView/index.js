import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faReply, faTrash } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const ReplyCard = styled.div`
  margin-left: 20px;
  background-color: #f8f9fa;
  border-left: 3px solid #007bff;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 12px;
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

const EditTextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  resize: vertical;
  margin-right: 8px;
  font-size: 14px;
`;

export default function ReplyView({ reply, commentId, onEdit,onDelete }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [newReplyContent, setNewReplyContent] = useState(reply.content);

  const handleEditToggle = async () => {
    if (isEditMode) {
      // Save 버튼을 클릭할 때 업데이트 수행
      try {
        await onEdit(reply.comment_id, newReplyContent);
      } catch (error) {
        console.error('Failed to update the reply:', error);
      }
    }
    setIsEditMode(!isEditMode); // Edit 모드 토글
  };

  return (
    <ReplyCard>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <strong>{reply.author}</strong> <span>{new Date(reply.date).toLocaleString()}</span>
        </div>
        <div>
          <DeleteButton onClick={handleEditToggle}>
            <FontAwesomeIcon icon={isEditMode ? faReply : faEdit} /> {isEditMode ? 'Save' : 'Edit'}
          </DeleteButton>
          <DeleteButton onClick={() => onDelete(commentId, reply.comment_id)}>
            <FontAwesomeIcon icon={faTrash} /> Delete
          </DeleteButton>
        </div>
      </div>
      {!isEditMode ? (
        <p>{reply.content}</p>
      ) : (
        <>
          <hr />
          <EditTextArea
            value={newReplyContent}
            onChange={(e) => setNewReplyContent(e.target.value)}
            placeholder="Edit reply..."
          />
          <hr />
        </>
      )}
    </ReplyCard>
  );
}
