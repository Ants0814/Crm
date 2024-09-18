import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SubNavigator from '../../components/SubNavigator';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const staticLinks = [
  // { path: '/User/member-list', label: '전체리스트' },
  // { path: '/User/franchisee-list', label: '가맹점리스트' },
  // { path: '/User/partner-list', label: '파트너리스트' },
  // { path: '/User/dealer-list', label: '딜러리스트' },
  // { path: '/User/referrer-stats', label: '추천인 리스트' },
  // { path: '/User/identity-verification-list', label: '신분인증리스트' },
  // { path: '/User/purchase-grade', label: '구매등급' },
  // { path: '/User/app-installation', label: '앱설치관리' },
  // { path: '/User/point-management', label: '포인트관리' },
  // { path: '/User/permission-management', label: '권한관리' },
  // { path: '/User/partners', label: '파트너스' },
];

export default function User() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [links, setLinks] = useState(staticLinks);

 
  
  useEffect(() => {
    // API 호출하여 테이블 이름 가져오기
    const fetchBoardTables = async () => {
      try {
        const response = await fetch('https://crm.skynet.re.kr/request/getBoardTables?category=User',{credentials:'include'});
        const data = await response.json();

        // 가져온 테이블 이름을 링크로 변환
        const dynamicLinks = data.map(table => ({
          path: `/User/Board/${table.boardId}`,
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
    <div className="User" style={{ display: 'flex', width: '100%', height: '100%' }}>
      <nav style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'gray' }}>
      <SubNavigator links={links}/>
      </nav>
      <main style={{ display: 'flex', width: '100%', background: '#fff' }}>
        <Outlet />
      </main>
    </div>
  );
}