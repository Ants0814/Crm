import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// 스타일드 컴포넌트 정의
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  width: 420px;
  padding: 30px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  backdrop-filter: blur(15px);
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
`;

const FormTitle = styled.h2`
  font-size: 32px;
  color: #333;
  text-align: center;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 310px;
  border-bottom: 2px solid #ddd;
  margin: 20px 0;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  background: transparent;
  border: none;
  outline: none;
  padding: 0 20px 0 5px;
  font-size: 16px;
  color: #333;
  ::placeholder {
    color: #bbb;
  }
`;

const Select = styled.select`
  align-items: center;
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #dddddd59;
  border-radius: 4px;
  background-color: transparent;
  font-size: 16px;
  color: #979797;
  text-align: center;
  &:focus {
    outline: none;
    border-color: #2969c9;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 50px;
  background: dodgerblue;
  border-radius: 5px;
  box-shadow: 3px 0 10px rgba(0, 0, 0, 0.5);
  border: none;
  outline: none;
  font-size: 17px;
  color: #fff;
  font-weight: 600;
  letter-spacing: 2px;
  cursor: pointer;
  margin: 20px 0;
`;

const ErrorMessage = styled.p`
  color: rgb(41, 166, 224);
  font-weight: 600;
  margin-bottom: 30px;
`;

function UserLoginForm({ setIsShowPopup,setRefrashFlag }) {
  const [siteName, setSiteName] = useState("");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    if (!siteName || !userId || !username || !password || !confirmPassword || !email) {
      setMessage("모든 필드를 채워주세요.");
      return false;
    }
    if (password !== confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      // 폼 데이터를 객체로 생성
      const PostFormData = {
        table:'personal_info_mgmt',
        phone_number:userId,
        name:username,
        password:password,
        email:email,
      };

      alert(JSON.stringify(PostFormData)); // 확인을 위해 데이터 출력
      try {
        const response = await fetch(`/request/member_join`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(PostFormData),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        alert("사용자가 등록되었습니다!");
        setRefrashFlag(prev=>!prev);
        setIsShowPopup(false);
      } catch (error) {
        console.error("Error creating post:", error);
        alert("신규 등록 중 오류가 발생했습니다." + error);
      }
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={() => setIsShowPopup(false)}>X</CloseButton>
        <form onSubmit={handleSubmit}>
          <FormTitle>유저 로그인 폼</FormTitle>
          <ErrorMessage>{message}</ErrorMessage>
          <InputWrapper>
            <Select value={siteName} onChange={(e) => setSiteName(e.target.value)}>
              <option value="" disabled>사이트명 선택</option>
              <option value="crm_pinecinema">파인씨네마</option>
              <option value="crm_unchain">씨네체인</option>
              <option value="crm_movie">영화거래소</option>
            </Select>
          </InputWrapper>
          <InputWrapper>
            <Input
              type="text"
              placeholder="아이디"
              required
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              type="text"
              placeholder="이름"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              type="password"
              placeholder="비밀번호"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              type="password"
              placeholder="비밀번호 확인"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              type="email"
              placeholder="이메일"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              type="text"
              placeholder="휴대폰 번호"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </InputWrapper>
          <SubmitButton type="submit">회원가입</SubmitButton>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}

export default UserLoginForm;