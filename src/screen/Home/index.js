import React, { useState, useEffect ,useContext} from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { HeaderAtom } from '../../atoms/atomSample';
import { HomeConsumer, HomeContext ,HomeProvider} from './HomeContext';
import SubNavigator from '../../components/SubNavigator';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

const staticLinks = [
  { path: '/StatisticList', label: '대시보드' },
  { path: '/BoardAdmin', label: '메뉴관리' },
  { path: '/ControlInfo', label: '컨트롤 정보 관리' },
  { path: '/StandardInfo', label: '기준정보 관리' },
  { path: '/StandardInfo_Dtl', label: '기준정보 상세' },
  { path: '/SystemGuide', label: '시스템 메뉴얼' },
];



export default function Home() {
  const [links, setLinks] = useState(staticLinks);
  useEffect(() => {
    // API 호출하여 테이블 이름 가져오기
    const fetchBoardTables = async () => {
      try {
        const response = await fetch('https://crm.skynet.re.kr/request/getBoardTables?category=root',{credentials:'include'}); // 실제 API 엔드포인트로 변경
        const data = await response.json();
  
        // 가져온 테이블 이름을 링크로 변환
        const dynamicLinks = data.map(table => ({
          path: `/Board/${table.boardId}`,
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
           <div className="root" style={{ display: 'flex', width: '100%', height: '100%' }}>
           <nav style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'gray' }}>
             <SubNavigator links={links} />
           </nav>
           <main style={{ display: 'flex', width: '100%', background: '#fff' }}>
             <Outlet />
           </main>
         </div>
    )
}

