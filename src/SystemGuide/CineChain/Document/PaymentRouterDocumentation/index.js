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

// PaymentRouter에 대한 문서를 보여주는 컴포넌트
const PaymentRouterDocumentation = () => {
  const functions = [
    {
      path: '/addPayment',
      method: 'POST',
      description: '새로운 결제 기록을 추가합니다.',
      details: [
        {
          title: '요청 형식',
          content: `JSON 형식으로 {
            "user_id": <사용자 ID>, 
            "order_id": <주문 ID>, 
            "item_name": <상품명>, 
            "payment_amount": <결제 금액>, 
            "details": <결제 상세 정보>
          }를 포함해야 합니다.`
        },
        {
          title: '저장되는 데이터',
          content: 'coupon_fi.payment_records 테이블에 새로운 결제 기록이 추가됩니다.'
        },
        {
          title: '응답',
          content: '성공 시 새로 추가된 결제 기록을 JSON 형식으로 반환합니다. 실패 시 500 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '사용자가 결제한 내역을 데이터베이스에 저장합니다.'
        }
      ]
    },
    {
      path: '/getPayments',
      method: 'GET',
      description: '모든 결제 기록을 조회합니다.',
      details: [
        {
          title: '요청 형식',
          content: '이 엔드포인트는 GET 요청이므로 요청 본문이 필요하지 않습니다.'
        },
        {
          title: '반환되는 데이터',
          content: 'coupon_fi.payment_records 테이블에서 모든 결제 기록을 조회합니다.'
        },
        {
          title: '응답',
          content: '성공 시 모든 결제 기록을 JSON 형식으로 반환합니다. 실패 시 500 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '데이터베이스에서 모든 결제 기록을 조회하여 반환합니다.'
        }
      ]
    }
  ];

  return (
    <div style={styles.container}>
      <h2>Payment Router Documentation</h2>
      <p>결제 기록과 관련된 기능을 제공하는 라우터입니다.</p>
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
    textAlign: 'left'
  },
  functionItem: {
    marginBottom: '20px',
    textAlign: 'left'
  },
  details: {
    marginTop: '10px',
    backgroundColor: '#fff',
    padding: '10px',
    border: '1px solid #eee',
    borderRadius: '5px',
    textAlign: 'left'
  },
  detailItem: {
    marginBottom: '5px',
    textAlign: 'left'
  }
};

export default PaymentRouterDocumentation;