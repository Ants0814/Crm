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

// RequestRouter에 대한 문서를 보여주는 컴포넌트
const RequestRouterDocumentation = () => {
  const functions = [
    {
      path: '/register',
      method: 'POST',
      description: '새로운 사용자 등록을 처리합니다.',
      details: [
        {
          title: '요청 형식',
          content: `JSON 형식으로 {
            "user_id": <사용자 ID>, 
            "user_name": <사용자 이름>, 
            "user_pwd": <사용자 비밀번호>, 
            "gender": <성별>, 
            "birth_y": <출생 연도>, 
            "birth_m": <출생 월>, 
            "birth_d": <출생 일>, 
            "email": <이메일 주소>, 
            "phone": <전화번호>, 
            "alias": <별명>, 
            "company_name": <회사 이름>, 
            "business_number": <사업자 번호>, 
            "representative_name": <대표자 이름>, 
            "industry_type": <산업 유형>, 
            "business_category": <사업 카테고리>, 
            "address": <주소>
          }를 포함해야 합니다.`
        },
        {
          title: '저장되는 데이터',
          content: 'crm_unchain.ants_unchain_user와 crm_unchain.ants_unchain_business_info 테이블에 새로운 사용자와 사업자 정보가 추가됩니다.'
        },
        {
          title: '응답',
          content: '성공 시 201 상태 코드와 성공 메시지를 반환합니다. 실패 시 409 또는 500 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '새로운 사용자를 등록하고, 관련 사업자 정보를 저장합니다.'
        }
      ]
    },
    {
      path: '/login',
      method: 'POST',
      description: '사용자 로그인을 처리합니다.',
      details: [
        {
          title: '요청 형식',
          content: `JSON 형식으로 { "user_id": <사용자 ID>, "user_pwd": <사용자 비밀번호> }를 포함해야 합니다.`
        },
        {
          title: '반환되는 데이터',
          content: '로그인된 사용자 정보와 세션 데이터.'
        },
        {
          title: '응답',
          content: '성공 시 200 상태 코드와 사용자 정보를 반환합니다. 실패 시 401 또는 500 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '사용자의 자격 증명을 확인하고 세션을 설정합니다.'
        }
      ]
    },
    {
      path: '/logout',
      method: 'GET',
      description: '사용자 로그아웃을 처리합니다.',
      details: [
        {
          title: '요청 형식',
          content: '이 엔드포인트는 GET 요청이므로 요청 본문이 필요하지 않습니다.'
        },
        {
          title: '응답',
          content: '성공 시 200 상태 코드와 로그아웃 메시지를 반환합니다.'
        }
      ]
    },
    {
      path: '/session',
      method: 'GET',
      description: '현재 세션 정보를 확인합니다.',
      details: [
        {
          title: '요청 형식',
          content: '이 엔드포인트는 GET 요청이므로 요청 본문이 필요하지 않습니다.'
        },
        {
          title: '반환되는 데이터',
          content: '현재 로그인된 사용자에 대한 세션 정보.'
        },
        {
          title: '응답',
          content: '성공 시 200 상태 코드와 세션 정보를 반환합니다. 실패 시 401 상태 코드를 반환합니다.'
        }
      ]
    },
    {
      path: '/getBusinessInfo',
      method: 'GET',
      description: '현재 사용자의 사업자 정보를 가져옵니다.',
      details: [
        {
          title: '요청 형식',
          content: '이 엔드포인트는 GET 요청이므로 요청 본문이 필요하지 않습니다.'
        },
        {
          title: '반환되는 데이터',
          content: '현재 로그인된 사용자의 사업자 정보.'
        },
        {
          title: '응답',
          content: '성공 시 200 상태 코드와 사업자 정보를 반환합니다. 실패 시 401 또는 500 상태 코드를 반환합니다.'
        }
      ]
    },
    {
      path: '/updateBusinessInfo',
      method: 'PUT',
      description: '현재 사용자의 사업자 정보를 업데이트합니다.',
      details: [
        {
          title: '요청 형식',
          content: `JSON 형식으로 {
            "company_name": <회사 이름>, 
            "business_number": <사업자 번호>, 
            "representative_name": <대표자 이름>, 
            "industry_type": <산업 유형>, 
            "business_category": <사업 카테고리>, 
            "address": <주소>
          }를 포함해야 합니다.`
        },
        {
          title: '응답',
          content: '성공 시 200 상태 코드와 성공 메시지를 반환합니다. 실패 시 401, 404 또는 500 상태 코드를 반환합니다.'
        }
      ]
    },
    {
      path: '/UpdateProfile',
      method: 'PUT',
      description: '사용자 프로필을 업데이트합니다.',
      details: [
        {
          title: '요청 형식',
          content: `JSON 형식으로 {
            "user_id": <사용자 ID>, 
            "user_name": <사용자 이름>, 
            "gender": <성별>, 
            "birth_y": <출생 연도>, 
            "birth_m": <출생 월>, 
            "birth_d": <출생 일>, 
            "email": <이메일 주소>, 
            "phone": <전화번호>, 
            "alias": <별명>, 
            "user_pwd": <비밀번호 (선택)>
          }를 포함해야 합니다.`
        },
        {
          title: '응답',
          content: '성공 시 200 상태 코드와 업데이트된 사용자 정보를 반환합니다. 실패 시 404 또는 500 상태 코드를 반환합니다.'
        }
      ]
    },
    {
      path: '/DeleteProfile/:user_id',
      method: 'DELETE',
      description: '사용자 프로필을 삭제합니다.',
      details: [
        {
          title: '요청 형식',
          content: 'URL 파라미터로 사용자 ID를 포함해야 합니다.'
        },
        {
          title: '응답',
          content: '성공 시 200 상태 코드와 성공 메시지를 반환합니다. 실패 시 404 또는 500 상태 코드를 반환합니다.'
        }
      ]
    },
    {
      path: '/agents',
      method: 'GET',
      description: '대행자 목록을 가져옵니다.',
      details: [
        {
          title: '요청 형식',
          content: '이 엔드포인트는 GET 요청이므로 요청 본문이 필요하지 않습니다.'
        },
        {
          title: '반환되는 데이터',
          content: '대행자 목록을 JSON 형식으로 반환합니다.'
        },
        {
          title: '응답',
          content: '성공 시 200 상태 코드와 대행자 목록을 반환합니다. 실패 시 500 상태 코드를 반환합니다.'
        }
      ]
    }
  ];

  return (
    <div style={styles.container}>
      <h2>Request Router Documentation</h2>
      <p>사용자 요청과 관련된 기능을 제공하는 라우터입니다.</p>
      <ul>
        {functions.map((func, index) => (
          <RouterFunctionDetail key={index} {...func} />
        ))}
      </ul>
    </div>
  );
};

export default RequestRouterDocumentation;
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
}