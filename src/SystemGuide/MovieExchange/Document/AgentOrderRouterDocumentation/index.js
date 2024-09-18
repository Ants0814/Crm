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

// AgentOrderRouter에 대한 문서를 보여주는 컴포넌트
const AgentOrderRouterDocumentation = () => {
  const functions = [
    {
      path: '/assign',
      method: 'POST',
      description: '특정 주문을 대행자에게 할당합니다.',
      details: [
        {
          title: '요청 형식',
          content: 'JSON 형식으로 { "orderId": <주문 ID>, "agentId": <대행자 ID> }를 포함해야 합니다.'
        },
        {
          title: '저장되는 데이터',
          content: 'crm_unchain.ants_unchain_agent_order 테이블에서 `assigned_agent`, `agent_status`를 업데이트하고, 주문 ID(`menu_id`)를 기준으로 업데이트합니다.'
        },
        {
          title: '응답',
          content: '성공 시 "Order assigned successfully" 메시지를 포함한 201 상태 코드를 반환합니다. 실패 시 500 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '이 엔드포인트는 특정 주문을 특정 대행자에게 할당하며, 데이터베이스의 대행자 주문 상태를 업데이트합니다.'
        }
      ]
    },
    {
      path: '/start/:orderId',
      method: 'POST',
      description: '특정 주문의 대행을 시작합니다.',
      details: [
        {
          title: '요청 형식',
          content: 'JSON 형식으로 { "reservation_number": <예약 번호>, "reservation_name": <예약자 이름>, "seat_number": <좌석 번호>, "booking_site": <예약 사이트>, "contact_number": <연락처 번호>, "agent_id": <대행자 ID> }를 포함해야 합니다.'
        },
        {
          title: '저장되는 데이터',
          content: 'crm_unchain.ants_unchain_agent_order_start 테이블에서 `reservation_number`, `reservation_name`, `seat_number`, `booking_site`, `contact_number` 필드를 업데이트하고, `agent_order_id` 및 `agent_id`로 필터링하여 해당 데이터를 저장합니다.'
        },
        {
          title: '응답',
          content: '성공 시 "Order started successfully" 메시지를 포함한 200 상태 코드를 반환합니다. 실패 시 500 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '대행자가 특정 주문을 시작할 때 호출됩니다. 대행 주문 시작 테이블을 업데이트하여 대행이 시작되었음을 기록합니다.'
        }
      ]
    },
    {
      path: '/getOrders',
      method: 'GET',
      description: '대행자에게 할당된 주문 및 경매 중인 주문을 조회합니다.',
      details: [
        {
          title: '요청 형식',
          content: '이 엔드포인트는 GET 요청이므로 요청 본문이 필요하지 않습니다.'
        },
        {
          title: '반환되는 데이터',
          content: 'crm_unchain.ants_unchain_agent_order 테이블에서 `assigned_agent`가 현재 대행자이거나 `agent_status`가 "assigned"인 주문을 조회합니다.'
        },
        {
          title: '응답',
          content: '성공 시 대행자에게 할당된 주문 및 경매 중인 주문 목록을 JSON 형식으로 반환합니다.'
        },
        {
          title: '설명',
          content: '현재 로그인된 대행자가 처리해야 할 주문 목록을 조회합니다.'
        }
      ]
    },
    {
      path: '/complete-agent-order',
      method: 'POST',
      description: '대행 주문을 완료 처리합니다.',
      details: [
        {
          title: '요청 형식',
          content: 'JSON 형식으로 { "agentOrderId": <대행 주문 ID> }를 포함해야 합니다.'
        },
        {
          title: '저장되는 데이터',
          content: 'crm_unchain.ants_unchain_agent_order 테이블에서 `agent_status`를 "completed"로 업데이트하고, crm_pinecinema.ants_movie_orders 테이블에서 `agent_status`를 "completed"로 업데이트합니다.'
        },
        {
          title: '응답',
          content: '성공 시 "Agent order completed" 메시지를 포함한 200 상태 코드를 반환합니다. 실패 시 500 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '대행자가 주문 처리를 완료했을 때 호출됩니다. 대행 주문과 원래 주문의 상태를 완료로 업데이트합니다.'
        }
      ]
    },
    {
      path: '/manual-agent-request',
      method: 'POST',
      description: '수동 대행 요청을 처리합니다.',
      details: [
        {
          title: '요청 형식',
          content: 'JSON 형식으로 { "orderId": <주문 ID> }를 포함해야 합니다.'
        },
        {
          title: '저장되는 데이터',
          content: 'crm_unchain.ants_unchain_agent_order 테이블에 새로운 대행 주문을 추가하며, 기존에 대행자로 할당되지 않은 경우에만 처리합니다.'
        },
        {
          title: '응답',
          content: '성공 시 "Manual agent request completed" 메시지를 포함한 200 상태 코드를 반환합니다. 실패 시 500 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '수동 대행 요청을 생성하며, 해당 주문이 기존에 대행자로 할당되지 않은 경우에만 처리합니다.'
        }
      ]
    },
    {
      path: '/agent-orders',
      method: 'GET',
      description: '대행자에게 할당된 주문 목록을 조회합니다.',
      details: [
        {
          title: '요청 형식',
          content: '이 엔드포인트는 GET 요청이므로 요청 본문이 필요하지 않습니다.'
        },
        {
          title: '반환되는 데이터',
          content: 'crm_unchain.ants_unchain_agent_order 테이블에서 현재 대행자에게 할당된 모든 주문을 조회합니다.'
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
      path: '/agent-orders/start',
      method: 'GET',
      description: '특정 대행자의 주문 시작 목록을 조회합니다.',
      details: [
        {
          title: '요청 형식',
          content: '이 엔드포인트는 GET 요청이므로 요청 본문이 필요하지 않습니다.'
        },
        {
          title: '반환되는 데이터',
          content: 'crm_unchain.ants_unchain_agent_order_start 테이블에서 대행자가 시작한 주문 목록을 조회합니다.'
        },
        {
          title: '응답',
          content: '대행자가 시작한 주문 목록을 JSON 형식으로 반환합니다.'
        },
        {
          title: '설명',
          content: '특정 대행자가 시작한 주문 목록을 가져옵니다.'
        }
      ]
    },
    {
      path: '/assignOrder',
      method: 'POST',
      description: '주문을 대행자에게 할당하고 시작합니다.',
      details: [
        {
          title: '요청 형식',
          content: 'JSON 형식으로 { "orderId": <주문 ID>, "agentId": <대행자 ID> }를 포함해야 합니다.'
        },
        {
          title: '저장되는 데이터',
          content: 'crm_unchain.ants_unchain_agent_order 테이블에 `assigned_agent`와 `agent_status`를 업데이트하고, crm_unchain.ants_unchain_agent_order_start 테이블에 새로운 주문 시작 정보를 추가합니다.'
        },
        {
          title: '응답',
          content: '성공 시 "Order assigned successfully" 메시지를 포함한 200 상태 코드를 반환합니다. 실패 시 500 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '주문을 대행자에게 할당하고, 해당 주문이 시작되었음을 기록합니다.'
        }
      ]
    }
  ];

  return (
    <div style={styles.container}>
      <h2>Agent Order Router Documentation</h2>
      <p>대행 주문과 관련된 기능을 제공하는 라우터입니다.</p>
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

export default AgentOrderRouterDocumentation;