import React, { useContext, useEffect, useState } from "react";
import './style.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt, faHeadset, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { AppContext } from "../../AppContext";
import { styled } from 'styled-components';
import Logo from "../../images/logo.png";

export default function Navigator() {
  const [isVisible, setIsVisible] = useState(true);
  const { isLoggedIn, logout, user } = useContext(AppContext);
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate(); // useNavigate 훅 사용

  
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/request/getMenuItems');
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/request/logout', { method: 'GET' });

      if (response.ok) {
        logout();
        sessionStorage.removeItem('user');
      } else {
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleNavigate = (path, state) => {
    navigate(path, { state });
  };

  const AccountBox = styled.div`
    a {
      color: white; 
      text-decoration: none; 

      &:visited {
        color: white; 
      }

      &:hover {
        color: darkblue; 
      }

      &:active {
        color: darkblue; 
      }
    }
  `;

  const InquiryButton = styled.div`
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    font-size: 14px;
    position: fixed;
    bottom: 3rem;
    background: white;
    color: black;
    border-radius: 4rem;
    padding: 15px 17px 15px 30px;
    left: 3rem;
    z-index: 100;
    transform: ${(props) => (props.isVisible ? 'translateX(0)' : 'translateX(-110%)')}; 
    transition: transform 1.5s ease;
    &:hover {
      background: #f0f0f0;
      color: #007bff;
    }
  `;

  const ArrowButton = styled.div`
    margin-left: 20px;
    cursor: pointer;
    font-size: 16px;
  `;

  return (
    <div className='menu'>
      <InquiryButton isVisible={isVisible} onClick={toggleVisibility}>
        <div style={{ display: 'flex', justifyContent: 'space-between', whiteSpace: 'nowrap', alignItems: 'center' }}>
          <div onClick={() => handleNavigate(`/Control/Board/cs_onetoone`, { fromNavigator: true })}>
            <FontAwesomeIcon icon={faHeadset} /> 1:1문의 
          </div>
          <ArrowButton>
            <FontAwesomeIcon icon={isVisible ? faChevronLeft : faChevronRight} />
          </ArrowButton>
        </div>
      </InquiryButton>
      <div className='leftLogo'>
        <div onClick={() => handleNavigate('/', { fromNavigator: true })}>
          <img src={Logo} alt='로고' />
        </div>
      </div>
      {/* 오른쪽 메뉴 */}
      <ul className='rightNav'>
        {menuItems.map(item => (
          <li key={item.std_id}>
            <div 
              onClick={() => handleNavigate(`/${item.std_value}`, { fromNavigator: true })} 
            >
              {item.std_key}
            </div>
          </li>
        ))}
        <AccountBox>
          {isLoggedIn ? (
            <li onClick={handleLogout}>
              <div onClick={() => handleNavigate('/Login', { fromNavigator: true })}>
                <FontAwesomeIcon icon={faSignOutAlt} />
              </div>
            </li>
          ) : (
            <li>
              <div onClick={() => handleNavigate('/Login', { fromNavigator: false })}>
                <FontAwesomeIcon icon={faUser} />
              </div>
            </li>
          )}
        </AccountBox>
        <a style={{ position: 'absolute', fontSize: '12px', top: '0px', right: '0px' }}>{user.domain}</a>
      </ul>
    </div>
  );
}