import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useNavigate } from 'react-router-dom'; 
import { AuthContext } from "../../context/AuthContext";
import './style.css';

const MyPage = () => {
  const { isLoggedIn, user,  logout } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState(user || {});
  const [, forceRender] = useState();
  const navigate = useNavigate();
  const [apiResponse, setApiResponse] = useState(null);



  const handleEdit = () => {
    setIsEditing(true);
    setUserInfo(user);
  };

  useEffect(() => {
    console.log("UserInfo 업데이트됨:", userInfo);
  }, [userInfo]);
  
  

  const handleDelete = async () => {
    if (window.confirm("정말로 계정을 삭제하시겠습니까?")) {
      try {
        const response = await fetch(`/api/DeleteProfile/${userInfo.id}`, { 
          method: 'DELETE'
        });
  
        if (!response.ok) throw new Error(await response.text());
        alert("계정이 성공적으로 삭제되었습니다.");
        // 로그아웃 처리 또는 메인 페이지로 리디렉션
        logout();
        navigate('/'); // 메인 페이지로 리디렉션 예시
      } catch (error) {
        console.error("계정 삭제 실패: ", error);
        alert("계정 삭제에 실패하였습니다.");
      }
    }
  };
  

  

  const handleSave = async () => {
    setIsEditing(false);
    try {
      const response = await fetch('/api/UpdateProfile', { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userInfo.id, 
          user_name: userInfo.name, 
          user_pwd: userInfo.password, // 비밀번호 변경이 필요한 경우에만 사용
          gender: userInfo.gender, 
          birth_y: userInfo.birth_y, 
          birth_m: userInfo.birth_m, 
          birth_d: userInfo.birth_d,
          email: userInfo.email, 
          phone: userInfo.phone
        })
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      const data = await response.json();
      console.log('API 응답:', data);
      setApiResponse(data);
      alert('프로필 수정이 성공적으로 완료되었습니다.');
    } catch (error) {
      console.error("프로필 수정 실패: ", error);
      alert("프로필 수정 실패: " + error.message);
    }
      };

      useEffect(() => {
        if (apiResponse) {
          setUserInfo(apiResponse.updatedUserInfo);
        }
      }, [apiResponse]);
          

      const handleChange = (e) => {
        const { name, value } = e.target;
        console.log("handleChange - name:", name, "value:", value); // 로그 출력
        setUserInfo({ ...userInfo, [name]: value });
      };

      
        if (!isLoggedIn) {
    return <p>로그인이 필요합니다.</p>;
  }

  return (
<div className="my-page-container">
  <h2>마이페이지</h2>
  <table className={isEditing ? 'edit-mode' : ''}>
    <tbody>
      <tr>
        <td>아이디</td>
        <td><span className='rightLine'></span>
          {isEditing ? (
            <input type="text" name="user_id" value={userInfo.id} onChange={handleChange} disabled />
          ) : (
            user.id
          )}
        </td>
      </tr>
      <tr>
        <td>이름</td>
        <td><span className='rightLine'></span>
          {isEditing ? (
            <input type="text" name="name" value={userInfo.name} onChange={handleChange} />
          ) : (
            user.name
          )}
        </td>
      </tr>
      <tr>
        <td>이메일</td>
        <td><span className='rightLine'></span>
          {isEditing ? (
            <input type="email" name="email" value={userInfo.email} onChange={handleChange} />
          ) : (
            user.email
          )}
        </td>
      </tr>
      <tr>
        <td>전화번호</td>
        <td><span className='rightLine'></span>
          {isEditing ? (
            <input type="text" name="phone" value={userInfo.phone} onChange={handleChange} />
          ) : (
            user.phone
          )}
        </td>
      </tr>
      <tr>
        <td>생년 (YYYY)</td>
        <td><span className='rightLine'></span>
          {isEditing ? (
            <input type="text" name="birth_y" value={userInfo.birth_y} onChange={handleChange} />
          ) : (
            user.birth_y
          )}
        </td>
      </tr>
      <tr>
        <td>생월 (MM)</td>
        <td><span className='rightLine'></span>
          {isEditing ? (
            <select name="birth_m" value={userInfo.birth_m} onChange={handleChange}>
              <option value="">월 선택</option>
              {/* 월별 옵션 추가 */}
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={String(i + 1).padStart(2, '0')}>{i + 1}월</option>
              ))}
            </select>
          ) : (
            user.birth_m
          )}
        </td>
      </tr>
      <tr>
        <td>생일 (DD)</td>
        <td><span className='rightLine'></span>
          {isEditing ? (
            <input type="text" name="birth_d" value={userInfo.birth_d} onChange={handleChange} />
          ) : (
            user.birth_d
          )}
        </td>
      </tr>
      <tr>
        <td>성별</td>
        <td><span className='rightLine'></span>
          {isEditing ? (
            <span className='selectGender'>
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                checked={userInfo.gender === '1'}
                onChange={handleChange}
              />
              <label htmlFor="male">남성</label>
              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                checked={userInfo.gender === '2'}
                onChange={handleChange}
              />
              <label htmlFor="female">여성</label>
            </span>
          ) : ( 
            user.gender === '1' ? '남성' : '여성'
          )}
        </td>
      </tr>
    </tbody>
  </table>
  {/* {user.gender} */}
  {isEditing ? (
    <div className='saveBtn'>
      <button onClick={handleSave}>저장</button>
      <button onClick={() => setIsEditing(false)}>취소</button>
    </div>
  ) : (
    <div className='modifyBtn'>
      <button onClick={handleEdit}>수정</button>
      <button onClick={handleDelete}>탈퇴</button>
    </div>
  )}
</div>
);
};

export default MyPage;
