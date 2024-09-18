import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import SubNavigator from '../../components/SubNavigator';
import { useLocation } from 'react-router-dom';
const staticLinks = [
  // { path: '/Coin/product-list', label: '상품목록' },
  // { path: '/Coin/swap-management', label: '스왑관리' },
  // { path: '/Coin/sales-management', label: '판매관리' },
  // { path: '/Coin/coin-master', label: '코인마스터' },
  // { path: '/Coin/log-management', label: '로그 관리' },
  // { path: '/Coin/airdrop-schedule', label: '에어드랍 일정 설정' },
  // { path: '/Coin/withdrawal', label: '출금' },
  // { path: '/Coin/withdrawal-management', label: '출금 관리' },
  // { path: '/Coin/coin-list', label: '코인목록' },
];

export default function Coin() {
  const location = useLocation();
  const [links, setLinks] = useState(staticLinks);

  useEffect(() => {
    // API 호출하여 테이블 이름 가져오기
    const fetchBoardTables = async () => {
      try {
        const response = await fetch('https://crm.skynet.re.kr/request/getBoardTables?category=Coin',{credentials:'include'}); // 실제 API 엔드포인트로 변경
        const data = await response.json();

        // 가져온 테이블 이름을 링크로 변환
        const dynamicLinks = data.map(table => ({
          path: `/Coin/Board/${table.boardId}`,
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

  return (<div className="Coin" style={{ display: 'flex', width: '100%' }}>
      <nav style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'gray' }}>
        <SubNavigator links={links} location={location.state}/>
      </nav>
      <main style={{ display: 'flex', width: '100%', background: '#fff' }}>
        <Outlet />
      </main>
    </div>
  );
}








