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

// AutoProcessingRouter에 대한 문서를 보여주는 컴포넌트
const AutoProcessingRouterDocumentation = () => {
  const functions = [
    {
      path: '/enable-auto-processing',
      method: 'POST',
      description: '자동 주문 처리를 활성화합니다.',
      details: [
        {
          title: '요청 형식',
          content: '이 엔드포인트는 POST 요청이므로 요청 본문이 필요하지 않습니다.'
        },
        {
          title: '저장되는 데이터',
          content: '서버의 전역 변수 `autoProcessingEnabled`를 `true`로 설정합니다.'
        },
        {
          title: '응답',
          content: '성공 시 "자동 주문 처리가 활성화되었습니다" 메시지를 포함한 200 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '이 엔드포인트를 호출하여 자동 주문 처리 기능을 활성화합니다.'
        }
      ]
    },
    {
      path: '/disable-auto-processing',
      method: 'POST',
      description: '자동 주문 처리를 비활성화합니다.',
      details: [
        {
          title: '요청 형식',
          content: '이 엔드포인트는 POST 요청이므로 요청 본문이 필요하지 않습니다.'
        },
        {
          title: '저장되는 데이터',
          content: '서버의 전역 변수 `autoProcessingEnabled`를 `false`로 설정합니다.'
        },
        {
          title: '응답',
          content: '성공 시 "자동 주문 처리가 비활성화되었습니다" 메시지를 포함한 200 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '이 엔드포인트를 호출하여 자동 주문 처리 기능을 비활성화합니다.'
        }
      ]
    },
    {
      path: '/auto-processing-status',
      method: 'GET',
      description: '현재 자동 주문 처리 상태를 확인합니다.',
      details: [
        {
          title: '요청 형식',
          content: '이 엔드포인트는 GET 요청이므로 요청 본문이 필요하지 않습니다.'
        },
        {
          title: '반환되는 데이터',
          content: '자동 처리 상태를 나타내는 객체 `{ enabled: <boolean> }`를 반환합니다.'
        },
        {
          title: '응답',
          content: '성공 시 현재 자동 주문 처리 상태를 포함한 200 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '자동 주문 처리 기능이 현재 활성화되었는지 또는 비활성화되었는지를 확인합니다.'
        }
      ]
    }
  ];

  return (
    <div style={styles.container}>
      <h2>Auto Processing Router Documentation</h2>
      <p>자동 주문 처리 기능을 제어하는 라우터입니다.</p>
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

export default AutoProcessingRouterDocumentation;
