import React ,{useContext}from 'react';
import { Outlet,NavLink, useNavigate, useParams ,Navigate} from 'react-router-dom';
import { CombineBoard} from '../../../../components/Board/CombineBoard';
import {AppContext} from '../../../../AppContext';

export default function CombineBoard() {
  const {Id} = useParams();
  const { isLoggedIn, user } = useContext(AppContext);
  return (
    <nav style={{padding:'3rem',maxWidth:'83vw',width:'100%'}}>
      <div className="board" style={{}}>
        TopComponent
      </div>
      <div className="board" style={{}}>
        <DefaultBoard {...{tableName:Id}}/>
      </div>
      <div className="board" style={{}}>
        BottomComponent
      </div>
    </nav>
  );
}
