import React from 'react';
import { Outlet,NavLink } from 'react-router-dom';
import {AntsBoard} from '../../../components/Board/BoardList';

export default function Board() {
  return (
    <nav>
      <AntsBoard/>
    </nav>
  );
}
