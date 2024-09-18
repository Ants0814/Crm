import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileAlt } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const FormContainer = styled.div`
  background: #fff;
  padding: 20px;
  width: 600px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const FormField = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  input[type='text'],
  textarea,
  select {
    width: 100%;
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  textarea {
    height: 150px;
    resize: vertical;
  }

  .help-text {
    font-size: 12px;
    color: #666;
    margin-top: 5px;
  }
`;

const FormTitle = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-right: 10px;
`;

const MsgButton = styled.button`
  margin-top: 30px;
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
`;

function MessageSend() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [siteName, setSiteName] = useState('');
  const [receiverNumber, setReceiverNumber] = useState('');
  const [messageContent, setMessageContent] = useState('');

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle button click to send the message
  const sendMessage = async () => {
    // 서버에서 기대하는 필드 이름으로 데이터 매핑
    const data = {
      siteName:siteName,
      sender: receiverNumber, // 필드를 서버의 'sender'로 맞춤
      message: messageContent, // 필드를 서버의 'message'로 맞춤
    };

    try {
      const response = await fetch('https://crm.skynet.re.kr/request/send-message', { 
        credentials:'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Message sent successfully:', result);
      closeModal(); // Close the modal after successful submission
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <>
      <MsgButton onClick={openModal}>
        <FontAwesomeIcon icon={faMobileAlt} />
        문자 발송
      </MsgButton>

      {isModalOpen && (
        <Modal>
          <ModalContent>
            <FormContainer>
              <FormTitle>문자발송</FormTitle>
              <FormField>
                <label htmlFor="siteType">사이트명</label>
                <select
                  id="siteType"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                >
                  <option value="">사이트를 선택하세요</option>
                  <option value="피시인사이드">피시인사이드</option>
                  <option value="파인시네마">파인시네마</option>
                  <option value="씨네픽쳐스">씨네픽쳐스</option>
                </select>
              </FormField>

              <FormField>
                <label htmlFor="receiverNumber">수신번호</label>
                <input
                  type="text"
                  id="receiverNumber"
                  placeholder=""
                  value={receiverNumber}
                  onChange={(e) => setReceiverNumber(e.target.value)}
                />
              </FormField>

              <FormField>
                <label htmlFor="messageContent">문자내용</label>
                <textarea
                  id="messageContent"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                ></textarea>
              </FormField>

              <Button onClick={sendMessage}>전송</Button>
              <Button onClick={closeModal}>닫기</Button>
            </FormContainer>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}

export default MessageSend;
