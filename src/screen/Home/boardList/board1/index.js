import React from 'react';
import { Outlet,NavLink } from 'react-router-dom';
export default function board1() {
  return (
    <nav>
      <div className="board" style={{ backgroundColor:'gray',width:'30rem',height:'30rem'}}>
        TEST A
      </div>
    <Outlet/>
    </nav>
  );
}
