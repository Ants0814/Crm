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

// AuctionService에 대한 문서를 보여주는 컴포넌트
const AuctionServiceDocumentation = () => {
  const functions = [
    {
      path: '/subscribe',
      method: 'POST',
      description: '푸시 알림을 구독합니다.',
      details: [
        {
          title: '요청 형식',
          content: 'JSON 형식으로 { "subscription": { "endpoint": <푸시 서비스 엔드포인트>, "keys": { "p256dh": <공개 키>, "auth": <인증 키> } } }를 포함해야 합니다.'
        },
        {
          title: '저장되는 데이터',
          content: 'crm_unchain.ants_push_subscriptions 테이블에 `user_id`, `endpoint`, `p256dh`, `auth`를 저장하고, `endpoint`를 기준으로 중복 시 업데이트합니다.'
        },
        {
          title: '응답',
          content: '성공 시 "Subscription added" 메시지를 포함한 201 상태 코드를 반환합니다. 실패 시 500 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '사용자의 푸시 알림 구독 정보를 데이터베이스에 저장하여 푸시 알림을 받을 수 있도록 설정합니다.'
        }
      ]
    },
    {
      path: '/unsubscribe',
      method: 'POST',
      description: '푸시 알림 구독을 취소합니다.',
      details: [
        {
          title: '요청 형식',
          content: 'JSON 형식으로 { "endpoint": <푸시 서비스 엔드포인트> }를 포함해야 합니다.'
        },
        {
          title: '삭제되는 데이터',
          content: 'crm_unchain.ants_push_subscriptions 테이블에서 `user_id`와 `endpoint`가 일치하는 구독 정보를 삭제합니다.'
        },
        {
          title: '응답',
          content: '성공 시 "구독이 성공적으로 삭제되었습니다." 메시지를 포함한 200 상태 코드를 반환합니다. 실패 시 500 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '사용자의 푸시 알림 구독 정보를 삭제하여 푸시 알림을 받지 않도록 합니다.'
        }
      ]
    },
    {
      path: '/assigned-orders',
      method: 'GET',
      description: '특정 대행자에게 할당된 주문 목록을 조회합니다.',
      details: [
        {
          title: '요청 형식',
          content: '이 엔드포인트는 GET 요청이므로 요청 본문이 필요하지 않습니다.'
        },
        {
          title: '반환되는 데이터',
          content: 'crm_unchain.ants_unchain_agent_order 테이블에서 `assigned_agent`가 현재 사용자 ID인 주문 목록을 조회합니다.'
        },
        {
          title: '응답',
          content: '할당된 대행 주문 목록을 JSON 형식으로 반환합니다.'
        },
        {
          title: '설명',
          content: '현재 대행자에게 할당된 모든 주문을 조회합니다.'
        }
      ]
    },
    {
      path: '/send-notification',
      method: 'POST',
      description: '대행자에게 푸시 알림을 전송합니다.',
      details: [
        {
          title: '요청 형식',
          content: 'JSON 형식으로 { "user_id": <대행자 ID>, "notificationPayload": { "title": <알림 제목>, "body": <알림 내용>, "icon": <아이콘 경로>, "data": { "url": <알림 클릭 시 이동할 URL> } } }를 포함해야 합니다.'
        },
        {
          title: '참조되는 데이터',
          content: 'crm_unchain.ants_push_subscriptions 테이블에서 `user_id`로 푸시 알림 구독 정보를 조회하고, 각 구독 정보로 푸시 알림을 전송합니다.'
        },
        {
          title: '응답',
          content: '성공 시 "Notification sent successfully" 메시지를 반환합니다. 실패 시 오류 메시지를 반환합니다.'
        },
        {
          title: '설명',
          content: '지정된 사용자에게 푸시 알림을 전송하여 새로운 주문이 할당되었음을 알립니다.'
        }
      ]
    },
    {
      path: '/schedule-job',
      method: 'POST',
      description: '경매 주문에 대한 스케줄링 작업을 설정합니다.',
      details: [
        {
          title: '요청 형식',
          content: 'JSON 형식으로 { "orderId": <주문 ID>, "scheduleTime": <스케줄 시간> }를 포함해야 합니다.'
        },
        {
          title: '저장되는 데이터',
          content: '내부 메모리에서 `orderJobs` 배열에 스케줄 작업을 추가하고, 지정된 시간에 주문을 처리하도록 설정합니다.'
        },
        {
          title: '응답',
          content: '성공 시 "Job scheduled successfully" 메시지를 반환합니다. 실패 시 오류 메시지를 반환합니다.'
        },
        {
          title: '설명',
          content: '지정된 시간에 특정 주문을 자동으로 처리하기 위한 스케줄 작업을 설정합니다.'
        }
      ]
    }
  ];

  return (
    <div style={styles.container}>
      <h2>Auction Service Router Documentation</h2>
      <p>경매 서비스 및 푸시 알림 관리를 위한 라우터입니다.</p>
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
    backgroundColor: '#f9f9f9'
  },
  functionItem: {
    marginBottom: '20px'
  },
  details: {
    marginTop: '10px',
    backgroundColor: '#fff',
    padding: '10px',
    border: '1px solid #eee',
    borderRadius: '5px'
  },
  detailItem: {
    marginBottom: '5px'
  }
};

export default AuctionServiceDocumentation;
