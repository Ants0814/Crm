import React from 'react';
import { Outlet,NavLink } from 'react-router-dom';
import { AntsBoard} from '../../../../components/Board/BoardList';

export default function DefaultBoard() {
  return (
    <nav>
      <div className="board" style={{ backgroundColor:'gray',width:'30rem',height:'30rem'}}>
        <AntsBoard/>
      </div>
    {/* <Outlet></Outlet> */}
    </nav>
  );
}
