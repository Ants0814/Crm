import React from 'react';
import { Outlet,NavLink ,useParams} from 'react-router-dom';
import { AntsBoardListAdmin} from '../../../../components/Board/BoardListAdmin';

export default function Admin() {
  return (
    <nav style={{padding:'20px',width:'100%'}}>
      <AntsBoardListAdmin/>
    </nav>
  );
}
