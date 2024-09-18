import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import SubNavigator from '../../components/SubNavigator';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const staticLinks = [
  // { path: '/Order/payment-complete', label: '결제완료' },
  // { path: '/Order/waiting-for-deposit', label: '입금대기' },
  // { path: '/Order/refund-request', label: '환불요청' },
  // { path: '/Order/refund-complete', label: '환불완료' },
  // { path: '/Order/credit-card-pg-admin', label: '신용카드PG사' },
  // { path: '/Order/temp-order', label: 'TempOrder' },
  // { path: '/Order/queue-management', label: '큐관리' },
  // { path: '/Order/sales-stats', label: '매출통계' },
  // { path: '/Order/agency-failure', label: '대행실패' },
  // { path: '/Order/inspection-complete', label: '검수완료' },
];

export default function AgentOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const [links, setLinks] = useState(staticLinks);

  useEffect(() => {
    // API 호출하여 테이블 이름 가져오기
    const fetchBoardTables = async () => {
      try {
        const response = await fetch('https://crm.skynet.re.kr/request/getBoardTables?category=AgentOrder',{credentials:'include'}); // 실제 API 엔드포인트로 변경
        const data = await response.json();

        // 가져온 테이블 이름을 링크로 변환
        const dynamicLinks = data.map(table => ({
          path: `/AgentOrder/Board/${table.boardId}`,
          label: table.boardTitle // ants_ 및 _board 제거하여 보기 좋게 만듦
        }));

        // 정적 링크와 동적 링크 결합
        setLinks([...staticLinks, ...dynamicLinks]);
      } catch (error) {
        console.error('Error fetching board tables:', error);
      }
    };

    fetchBoardTables();
  }, []);
  useEffect(()=>{
    if (links.length > 0 ) {
      if(location?.state?.fromNavigator===true){
        navigate(links[0].path);
      }
    }
  },[location,links])
  return (
    <div className="AgentOrder" style={{ display: 'flex', width: '100%', height: '100%' }}>
      <nav style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'gray' }}>
        <SubNavigator links={links} location={location.state}/>
      </nav>
      <main style={{ display: 'flex', width: '100%', background: '#fff' }}>
        <Outlet />
      </main>
    </div>
  );
}