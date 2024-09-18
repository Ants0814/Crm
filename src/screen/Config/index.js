import React, { useState, useEffect } from 'react';
import { Outlet ,NavLink} from 'react-router-dom';
import SubNavigator from '../../components/SubNavigator';

const staticLinks = [
  // { path: '/Config/site-info', label: '사이트정보설정' },
  // { path: '/Config/notification-settings', label: '알림톡설정' },
  // { path: '/Config/app-version-management', label: '앱버전관리' },
  // { path: '/Config/app-settings', label: '앱세팅관리' },
  // { path: '/Config/tester-management', label: '테스터관리' },
  // { path: '/Config/menu-management', label: '메뉴관리' },
  // { path: '/Config/movie-price-settings', label: '영화가격설정' },
  // { path: '/Config/code-management', label: '코드관리' },
  // { path: '/Config/pg-management', label: 'PG관리' },
  // { path: '/Config/bank-account-management', label: '무통장입금 계좌관리' },
  // { path: '/Config/file-management', label: '파일관리' },
  // { path: '/Config/phone-email-verification', label: '휴대폰/이메일 인증' },
  // { path: '/Config/screening-info-management', label: '상영정보관리' },
  // { path: '/Config/screening-time-management', label: '상영시간관리' },
  // { path: '/Config/screening-date-management', label: '상영날짜관리' },
  // { path: '/Config/movie-poster-management', label: '영화포스터관리' },
  // { path: '/Config/theater-management', label: '극장관리' },
  // { path: '/Config/ticket-theater-management', label: 'TicketTheater 극장관리' },
  // { path: '/Config/box-office-management', label: '박스오피스관리' },
  // { path: '/Config/signal-test', label: '시그널알테스트' },
];

export default function Config() {
  const [links, setLinks] = useState(staticLinks);

  useEffect(() => {
    // API 호출하여 테이블 이름 가져오기
    const fetchBoardTables = async () => {
      try {
        const response = await fetch('https://crm.skynet.re.kr/request/getBoardTables?category=Config',{credentials:'include'}); // 실제 API 엔드포인트로 변경
        const data = await response.json();

        // 가져온 테이블 이름을 링크로 변환
        const dynamicLinks = data.map(table => ({
          path: `/Config/Board/${table.boardId}`,
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

  return (
    <div className="Config" style={{ display: 'flex', width: '100%', height: '100%' }}>
      <nav style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'gray' }}>
        <SubNavigator links={links} />
      </nav>
      <main style={{ display: 'flex', width: '100%', background: '#fff' }}>
        <Outlet />
      </main>
    </div>
  );
}

