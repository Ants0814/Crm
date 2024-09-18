import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import SubNavigator from '../../components/SubNavigator';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const staticLinks = [
  // { path: '/Community/BoardAdmin', label: '메뉴관리' },
  // { path: '/Community/ControlInfo', label: '컨트롤 정보 관리' },
  // { path: '/Community/StandardInfo', label: '기준정보 관리' },
  // { path: '/Community/StandardInfo_Dtl', label: '기준정보 상세' },
];



export default function Community() {
  const location = useLocation();
  const navigate = useNavigate();
  const [links, setLinks] = useState(staticLinks);

  useEffect(() => {
    // API 호출하여 테이블 이름 가져오기
    const fetchBoardTables = async () => {
      try {
        const response = await fetch('https://crm.skynet.re.kr/request/getBoardTables?category=Community',{credentials:'include'}); // 실제 API 엔드포인트로 변경
        const data = await response.json();

        // 가져온 테이블 이름을 링크로 변환
        const dynamicLinks = data.map(table => ({
          path: `/Community/Board/${table.boardId}`,
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
    <div className="Community" style={{ display: 'flex', width: '100%', height: '100%'}}>
      <nav style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'gray' }}>
        <SubNavigator links={links} />
      </nav>
      <main style={{ display: 'flex', width: '100%', background: '#fff' }}>
        <Outlet />
      </main>
    </div>
  );
}