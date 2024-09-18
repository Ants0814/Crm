import React,{useEffect,useState} from 'react';
import { NavLink,useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

// 스타일이 적용된 컨테이너
const Container = styled.div`
  height: 100%;
  min-height: 100vh;
  width: 15rem;
  background: linear-gradient(135deg, #f9f9f9, #e9e9e9);
`;

// 스타일이 적용된 리스트
const StyledList = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 30px;
  margin:0px;
  color:#000;
`;

// 스타일이 적용된 리스트 아이템
const ListItem = styled.li`
  padding: 10px;
  margin: 10px 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: all 0.3s;
  font-weight:900;
  list-style-type:none;
  &:hover {
    background-color: #f0f0f0;
    transform: translateX(5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
`;

// 스타일이 적용된 네비게이션 링크
const StyledNavLink = styled(NavLink)`
  color: #333;
  text-decoration: none;
  display: block;
  &.active {
    font-weight: bold;
    color: #0056b3;
  }
`;

export default function SubNavigator({ links }) {
  return (
    <Container>
      <StyledList>
        {links.map((link, index) => (
          <ListItem key={index}>
            <StyledNavLink to={link.path}>{link.label}</StyledNavLink>
          </ListItem>
        ))}
      </StyledList>
    </Container>
  );
};