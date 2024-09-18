import React from 'react';
import { Outlet,NavLink } from 'react-router-dom';
export default function board() {
  return (
    <nav>
      <div className="board" style={{height:'3rem' , backgroundColor:'blue'}}>
        <NavLink to='/Community/board/1'><label style={{padding:'10px'}}>게시판관리A</label></NavLink>
        <NavLink to='/Community/board/2'><label style={{padding:'10px'}}>게시판관리B</label></NavLink>
      </div>
    <Outlet></Outlet>
    </nav>
  );
}
