import { Routes, Route,NavLink ,Outlet} from 'react-router-dom';
import React from 'react';

export default function UsedCoupons() {
  return (
    <div className="BPage">
        <div>
        <ul className='rightNav'>
            <li><NavLink to={'/Mypage'}>APage</NavLink></li>
            <li><NavLink to={'/pg1'}>BPage</NavLink></li>
            <li><NavLink to={'/pg2'}>CPage</NavLink></li>
          </ul>        
        </div>
        <Outlet></Outlet>
    </div>
  );
}
