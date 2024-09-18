import React from 'react';
import { Outlet,NavLink } from 'react-router-dom';
export default function board2() {
  return (
    <nav>
      <div className="board" style={{ backgroundColor:'gray',width:'30rem',height:'30rem'}}>
      TEST B
      </div>
    <Outlet/>
    </nav>
  );
}
