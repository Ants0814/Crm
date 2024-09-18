
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import SubNavigator from '../../components/SubNavigator';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const staticLinks = [
  // { path: '/Product/product-list', label: '상품목록' },
  // { path: '/Product/product-registration', label: '상품등록' },
  // { path: '/Product/cart-list', label: '장바구니리스트' },
  // { path: '/Product/main-photo-management', label: '메인사진관리' },
  // { path: '/Product/member-wishlist', label: '회원찜리스트' },
  // { path: '/Product/deal-management', label: '딜관리' },
  // { path: '/Product/deal-statistics', label: '딜통계관리' },
  // { path: '/Product/deal-purchase-management', label: '딜매입관리' },
  // { path: '/Product/settlement-management', label: '정산관리' },
  // { path: '/Product/delivery-company-management', label: '택배사관리' },
  // { path: '/Product/product-management-list', label: '상품관리-목록' },
];

export default function Price() {
  const location = useLocation();
  const navigate = useNavigate();
  const [links, setLinks] = useState(staticLinks);

  useEffect(() => {
    // API 호출하여 테이블 이름 가져오기
    const fetchBoardTables = async () => {
      try {
        const response = await fetch('https://crm.skynet.re.kr/request/getBoardTables?category=Price',{credentials:'include'}); // 실제 API 엔드포인트로 변경
        const data = await response.json();

        // 가져온 테이블 이름을 링크로 변환
        const dynamicLinks = data.map(table => ({
          path: `/Price/Board/${table.boardId}`,
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
    <div className="Price" style={{ display: 'flex', width: '100%', height: '100%' }}>
      <nav style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'gray' }}>
        <SubNavigator links={links} />
      </nav>
      <main style={{ display: 'flex', width: '100%', background: '#fff' }}>
        <Outlet />
      </main>
    </div>
  );
}