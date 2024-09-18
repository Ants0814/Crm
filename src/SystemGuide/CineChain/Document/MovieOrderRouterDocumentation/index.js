import React from 'react';

// 개별 라우터 경로에 대한 상세 설명을 포함하는 컴포넌트
const RouterFunctionDetail = ({ path, method, description, details }) => (
  <li style={styles.functionItem}>
    <strong>{path}</strong> ({method}): {description}
    {details && (
      <div style={styles.details}>
        <h4>세부 사항:</h4>
        <ul>
          {details.map((detail, index) => (
            <li key={index} style={styles.detailItem}>
              <strong>{detail.title}:</strong> {detail.content}
            </li>
          ))}
        </ul>
      </div>
    )}
  </li>
);

// MovieOrderRouter에 대한 문서를 보여주는 컴포넌트
const MovieOrderRouterDocumentation = () => {
  const functions = [
    {
      path: '/orders',
      method: 'GET',
      description: '모든 영화 주문을 조회합니다.',
      details: [
        {
          title: '요청 형식',
          content: '이 엔드포인트는 GET 요청이므로 요청 본문이 필요하지 않습니다.'
        },
        {
          title: '반환되는 데이터',
          content: 'crm_pinecinema.ants_movie_orders 테이블에서 모든 주문을 조회합니다.'
        },
        {
          title: '응답',
          content: '성공 시 모든 주문 목록을 JSON 형식으로 반환합니다. 실패 시 500 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '데이터베이스에서 모든 영화 주문을 조회하고 반환합니다.'
        }
      ]
    },
    {
      path: '/submit-order',
      method: 'POST',
      description: '새로운 영화 주문을 제출합니다.',
      details: [
        {
          title: '요청 형식',
          content: `JSON 형식으로 { 
            "movieTitle": <영화 제목>, 
            "theater": <극장>, 
            "date": <날짜>, 
            "screeningTime": <상영 시간>, 
            "viewerCount": <관객 수>, 
            "seatInfo": <좌석 정보>, 
            "amount": <금액>, 
            "bookingUrlPc": <PC 예약 URL>, 
            "bookingUrlMobile": <모바일 예약 URL>, 
            "orderCategory": <주문 카테고리>, 
            "cinemaBrand": <시네마 브랜드> 
          }를 포함해야 합니다.`
        },
        {
          title: '저장되는 데이터',
          content: 'crm_pinecinema.ants_movie_orders 테이블에 새로운 주문이 추가됩니다.'
        },
        {
          title: '응답',
          content: '성공 시 "Order submitted successfully" 메시지와 생성된 주문의 ID를 포함한 200 상태 코드를 반환합니다. 실패 시 500 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '새로운 영화 주문을 데이터베이스에 추가합니다.'
        }
      ]
    }
  ];

  return (
    <div style={styles.container}>
      <h2>Movie Order Router Documentation</h2>
      <p>영화 주문과 관련된 기능을 제공하는 라우터입니다.</p>
      <ul>
        {functions.map((func, index) => (
          <RouterFunctionDetail key={index} {...func} />
        ))}
      </ul>
    </div>
  );
};

// 스타일 정의
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    border: '1px solid #ddd',
    borderRadius: '5px',
    marginBottom: '20px',
    backgroundColor: '#f9f9f9',
    textAlign: 'left' // 텍스트 좌측 정렬
  },
  functionItem: {
    marginBottom: '20px',
    textAlign: 'left' // 텍스트 좌측 정렬
  },
  details: {
    marginTop: '10px',
    backgroundColor: '#fff',
    padding: '10px',
    border: '1px solid #eee',
    borderRadius: '5px',
    textAlign: 'left' // 텍스트 좌측 정렬
  },
  detailItem: {
    marginBottom: '5px',
    textAlign: 'left' // 텍스트 좌측 정렬
  }
};

export default MovieOrderRouterDocumentation;