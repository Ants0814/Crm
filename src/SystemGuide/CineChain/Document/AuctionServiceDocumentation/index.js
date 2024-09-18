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

// Agent Management and Notification Router에 대한 문서를 보여주는 컴포넌트
const AuctionServiceDocumentation = () => {
  const functions = [
    {
      path: '/subscribe',
      method: 'POST',
      description: '사용자로부터 푸시 알림 구독 정보를 받아 데이터베이스에 저장합니다.',
      details: [
        {
          title: '요청 형식',
          content: 'JSON 형식으로 { "subscription": { "endpoint": <endpoint>, "keys": { "p256dh": <p256dh>, "auth": <auth> } } }를 포함해야 합니다.'
        },
        {
          title: '저장되는 데이터',
          content: 'crm_unchain.ants_push_subscriptions 테이블에 사용자 구독 정보를 추가하거나, 이미 존재하는 경우 업데이트합니다.'
        },
        {
          title: '응답',
          content: '성공 시 "Subscription added" 메시지를 포함한 201 상태 코드를 반환합니다. 실패 시 500 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '푸시 알림을 받기 위해 사용자 구독 정보를 서버에 저장합니다.'
        }
      ]
    },
    {
      path: '/unsubscribe',
      method: 'POST',
      description: '사용자의 푸시 알림 구독을 해제합니다.',
      details: [
        {
          title: '요청 형식',
          content: 'JSON 형식으로 { "endpoint": <endpoint> }를 포함해야 합니다.'
        },
        {
          title: '저장되는 데이터',
          content: 'crm_unchain.ants_push_subscriptions 테이블에서 해당 endpoint와 user_id에 일치하는 구독 정보를 삭제합니다.'
        },
        {
          title: '응답',
          content: '성공 시 "구독이 성공적으로 삭제되었습니다." 메시지를 포함한 200 상태 코드를 반환합니다. 실패 시 500 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '사용자가 푸시 알림을 받지 않도록 구독 정보를 제거합니다.'
        }
      ]
    },
    {
      path: '/assigned-orders',
      method: 'GET',
      description: '대행자에게 할당된 주문 목록을 조회합니다.',
      details: [
        {
          title: '요청 형식',
          content: '이 엔드포인트는 GET 요청이므로 요청 본문이 필요하지 않습니다.'
        },
        {
          title: '반환되는 데이터',
          content: 'crm_unchain.ants_unchain_agent_order 테이블에서 assigned_agent가 현재 대행자이고 agent_status가 "assigned"인 주문을 조회합니다.'
        },
        {
          title: '응답',
          content: '성공 시 대행자에게 할당된 주문 목록을 JSON 형식으로 반환합니다. 실패 시 500 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '현재 로그인된 대행자가 처리해야 할 주문 목록을 조회합니다.'
        }
      ]
    },
    {
      path: '/order-details/:menuId',
      method: 'GET',
      description: '특정 주문의 상세 정보를 조회합니다.',
      details: [
        {
          title: '요청 형식',
          content: '이 엔드포인트는 GET 요청이므로 요청 본문이 필요하지 않으며, 경로 매개변수로 menuId를 사용합니다.'
        },
        {
          title: '반환되는 데이터',
          content: 'crm_unchain.ants_unchain_agent_order 테이블에서 menu_id에 해당하는 주문의 상세 정보를 조회합니다.'
        },
        {
          title: '응답',
          content: '성공 시 주문의 상세 정보를 JSON 형식으로 반환합니다. 실패 시 404 또는 500 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '특정 주문의 상세 정보를 조회합니다.'
        }
      ]
    },
    {
      path: '/agent_request',
      method: 'POST',
      description: '대행자 요청을 생성하고, 적절한 대행자를 할당합니다.',
      details: [
        {
          title: '요청 형식',
          content: 'JSON 형식으로 { "domain": <도메인>, "title": <제목>, "content": <내용>, "movie_title": <영화 제목>, "theater": <극장>, "date": <날짜>, "screening_time": <상영 시간>, "viewer_count": <관객 수>, "seat_info": <좌석 정보>, "booking_url_pc": <PC 예약 URL>, "booking_url_mobile": <모바일 예약 URL>, "user_id": <사용자 ID> }를 포함해야 합니다.'
        },
        {
          title: '저장되는 데이터',
          content: 'crm_unchain.ants_unchain_agent_order 테이블에 새로운 대행자 요청을 추가하고, 요청이 성공하면 주문을 할당합니다.'
        },
        {
          title: '응답',
          content: '성공 시 생성된 주문 정보와 함께 201 상태 코드를 반환합니다. 실패 시 500 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '새로운 대행자 요청을 생성하고, 적절한 대행자를 자동으로 할당합니다.'
        }
      ]
    },
    {
      path: '/process-order',
      method: 'PUT',
      description: '대행 처리 시 스케줄링을 취소하고 주문서 작성을 완료합니다.',
      details: [
        {
          title: '요청 형식',
          content: 'JSON 형식으로 { "menu_id": <메뉴 ID>, "reservation_number": <예약 번호>, "reservation_name": <예약자 이름>, "seat_number": <좌석 번호>, "actual_seat_number": <실제 좌석 번호>, "contact_number": <연락처 번호> }를 포함해야 합니다.'
        },
        {
          title: '저장되는 데이터',
          content: 'crm_unchain.ants_unchain_agent_order 테이블에서 agent_status를 "in progress"로 업데이트하고, crm_unchain.ants_user_order_history 테이블에 기록을 추가합니다.'
        },
        {
          title: '응답',
          content: '성공 시 "Order processed and scheduling cancelled" 메시지를 포함한 200 상태 코드를 반환합니다. 실패 시 500 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '대행자가 주문을 처리할 때 호출되며, 스케줄링 작업을 취소하고 주문을 처리합니다.'
        }
      ]
    },
  ];

  return (
    <div style={styles.container}>
      <h2>AuctionServiceDocumentation</h2>
      <p>대행자 관리 및 푸시 알림과 관련된 기능을 제공하는 라우터입니다.</p>
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

export default AuctionServiceDocumentation;
