import React, { useState, useEffect } from "react";
import {useNavigate,Link,useLocation } from "react-router-dom";
import "./style.css";
import { AppContext, useApp } from "../../AppContext";

function RegisterForm() {
    const [username, setUsername] = useState("");
    const [registerId, setRegisterId] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [gender, setGender] = useState("");
    const [birthYear, setBirthYear] = useState("");
    const [birthMonth, setBirthMonth] = useState("");
    const [birthDay, setBirthDay] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [alias, setAlias] = useState("");
    const [message, setMessage] = useState("");
    const [domain, setDomain] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
      // 여기서 간단한 폼 검증을 수행하고, 모든 조건이 충족되면 true를 반환합니다.
      if (registerId.length > 0 && username.length > 0 && password.length > 0) {
        if (password !== confirmPassword) {
          setMessage("비밀번호가 일치하지 않습니다.");
          return false;
        }
        return true;
      } else {
        setMessage("모든 필드를 채워주세요.");
        return false;
      }
    };
    const handleDomainChange = (e) => {
      setDomain(e.target.value);
      console.log(e.target.value);
    };
    const handleSubmitRegister = async (event) => {
      event.preventDefault(); // 폼 제출 기본 이벤트 방지

      if (validateForm()) {
        try {
          const response = await fetch('/request/register', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: registerId, user_name: username, user_pwd: password,
              gender: gender, birth_y:birthYear, birth_m:birthMonth, birth_d:birthDay,
              email:email, phone:phone,alias:alias
              ,domain:domain
            })
          });
  
          if (!response.ok) throw new Error(response.statusText);
          const data = await response.text();
                alert(`${username}님, 회원가입이 성공적으로 완료되었습니다.`);
                
          navigate('/login'); // 회원가입 완료 후 로그인 페이지로 이동

        } catch (error) {
          console.error("회원가입 실패: ", error);
          setMessage("회원가입에 실패하였습니다.");
        }
      }
    };
  
    return (
      <div className="container">
        <div className="form-box">
          <form onSubmit={handleSubmitRegister}>
          <div style={{width:'75%'}} className="forgetSec">
      
        </div>
            <h2>Register</h2>
            <p id="result">{message}</p>
            <div className="input-register">
            <select className="input-login" style={{width:'100%', fontSize: 'x-large'}} name="domain" value={domain} onChange={handleDomainChange}>
              <option value="" disabled>도메인 선택</option>
              <option value="crm_pinecinema">파인씨네마</option>
              <option value="crm_unchain">언체인</option>
              <option value="crm_movie">영화거례소</option>
            </select>
              <input
                type="text"
                placeholder="ID"
                required
                value={registerId}
                onChange={(e) => setRegisterId(e.target.value)}
              />
            </div>
            <div className="input-register">
              <input
                type="text"
                placeholder="이름"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-register">
              <input
                type="text"
                placeholder="별칭"
                required
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
              />
            </div>
            <div className="input-register">
              <input
                type="password"
                placeholder="비밀번호"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="input-register">
              <input
                type="password"
                placeholder="비밀번호 확인"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="input-register-radio">
              <span>
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="1"
                  checked={gender === '1'}
                  onChange={(e) => setGender(e.target.value)}
                />
                <label htmlFor="male">남성</label>
              </span>
              
              <span>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="2"
                  checked={gender === '2'}
                  onChange={(e) => setGender(e.target.value)}
                />
                <label htmlFor="female">여성</label>
              </span>
            </div>
            <div className="input-register-group"> {/* Flexbox 컨테이너 추가 */}
    <div className="input-register">
      <input
        name="birth_y"
        type="text"
        placeholder="생년 (YYYY)"
        value={birthYear}
        onChange={(e) => setBirthYear(e.target.value)}
      />
    </div>
    <div className="input-register">
  <select
    name="birth_y"
    value={birthMonth}
    onChange={(e) => setBirthMonth(e.target.value)}
    placeholder="생월 선택"
  >
    <option value="">월 선택</option>
    <option value="01">1월</option>
    <option value="02">2월</option>
    <option value="03">3월</option>
    <option value="04">4월</option>
    <option value="05">5월</option>
    <option value="06">6월</option>
    <option value="07">7월</option>
    <option value="08">8월</option>
    <option value="09">9월</option>
    <option value="10">10월</option>
    <option value="11">11월</option>
    <option value="12">12월</option>
  </select>
</div>
    <div className="input-register">
      <input
        type="text"
        placeholder="생일 (DD)"
        value={birthDay}
        onChange={(e) => setBirthDay(e.target.value)}
      />
    </div>
    </div>
            <div className="input-register">
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-register">
              <input
                type="text"
                placeholder="전화번호"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="registerbutton">
              <button
                type="submit"
                className="registerBtn"
              >
                회원가입
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }


  function Login() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [domain, setDomain] = useState('');
    //const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    const { login, isLoggedIn ,setIsLoggedIn } = useApp();
    const handleDomainChange = (e) => {
      setDomain(e.target.value);
      console.log(e.target.value);
    };

    const validateForm = () => {
      if (!domain) {
        setMessage("도메인을 선택해주세요.");
        return false;
      }
      if (!userId) {
        setMessage("아이디를 입력해주세요.");
        return false;
      }
      if (!password) {
        setMessage("비밀번호를 입력해주세요.");
        return false;
      }
      setMessage("");
      return true;
    };


  
    const handleLoginClick = async () => { 
      if (validateForm()) {
        try {
          // Send a login request to the server
          const response = await fetch('/request/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, user_pwd: password ,domain:domain })
          });
    
          if (response.ok) {
            const userData = await response.json();
            console.log("로그인 성공: ", userData);
            alert(`${userData.name}님, 로그인에 성공하였습니다!`);
            login(userData); // userData를 login 함수에 전달
            console.log("로그인 상태 : " , );
            const redirectTo = location.state?.from || '/';
            navigate(redirectTo);
          } else {
            // 로그인 실패 처리
            if (response.status === 401) {
              setMessage("아이디 또는 비밀번호가 잘못되었습니다.");
            } else {
              setMessage("로그인에 실패하였습니다. 다시 시도해주세요.");
            }
          }
        } catch (error) {
          console.error('로그인 오류:', error);
          console.log('로그인 오류:', error);
          setMessage("로그인 요청 중 문제가 발생했습니다.");
        }
        setUserId(''); 
        setPassword(''); 
      }
    };
    
  
  
  return (
    <div className="container">
      <div className="login-box">
        <h2>Log In</h2>
        <label id="result">{message}</label>
        <div className="input-login">
          <input
            type="text"
            name="id"
            placeholder="ID"
            required
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div className="input-login">
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div style={{width:'75%'}} className="forgetSec">
        <select className="input-login" style={{width:'100%', fontSize: 'x-large'}} name="domain" value={domain} onChange={handleDomainChange}>
          <option value="" disabled>도메인 선택</option>
          <option value="crm_pinecinema">파인씨네마</option>
          <option value="crm_unchain">시네체인</option>
          <option value="crm_movie">영화거래소</option>
        </select>
        </div>
        <div className="loginButton">
          <button type="button" className="loginBtn" onClick={handleLoginClick}>
            로그인
          </button>
        </div>
        <Link to={'/register'} className="registerLink">회원가입</Link>

      </div>
    </div>
  );
}

export { RegisterForm, Login };
