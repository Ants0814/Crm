import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { DynamicBoard } from '../../../../components/Board/DynamicBoard';
import { AppContext } from '../../../../AppContext';
import CouponEdit from '../../../../Forms/CouponEdit';
import MessageSend from '../../../../Forms/MessageSend';
import OrderManagers from '../../../../Forms/OrderManagers';
import OrderModify from '../../../../Forms/OrderModify';
import ProductEdit from '../../../../Forms/ProductEdit';

// 예시 상단 및 하단 컴포넌트
const ExampleTopComponent = () => <div>Example Top Component</div>;
const ExampleBottomComponent = () => <div>Example Bottom Component</div>;

// ID와 컴포넌트 매핑
const componentMap = {
  'order_list': {
    TopComponent: OrderManagers,
    BottomComponent: ()=><></>,
  },
  'example-id': {
    TopComponent: ExampleTopComponent,
    BottomComponent: ExampleBottomComponent,
  },
};

export default function DefaultBoard() {
  const { Id } = useParams();
  const { isLoggedIn, user } = useContext(AppContext);

  // ID에 따라 매핑된 컴포넌트 가져오기
  const { TopComponent, BottomComponent } = componentMap[Id] || {};

  return (
    <nav style={{ padding: '20px', maxWidth: '83vw', width: '100%' }}>
      <div className="board">
        {TopComponent ? <TopComponent /> : ' '}
      </div>
      <div className="board">
        <DynamicBoard {...{ tableName: Id }} />
      </div>
      <div className="board">
        {BottomComponent ? <BottomComponent /> : ' '}
      </div>
    </nav>
  );
}