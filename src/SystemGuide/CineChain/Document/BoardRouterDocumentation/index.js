
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

// BoardRouter에 대한 문서를 보여주는 컴포넌트
const BoardRouterDocumentation = () => {
  const functions = [
    {
      path: '/upload',
      method: 'POST',
      description: '이미지 파일을 업로드합니다.',
      details: [
        {
          title: '요청 형식',
          content: 'multipart/form-data 형식으로 최대 10개의 이미지 파일을 업로드할 수 있습니다.'
        },
        {
          title: '저장되는 데이터',
          content: '이미지 파일은 서버의 "uploads/" 디렉토리에 저장됩니다.'
        },
        {
          title: '응답',
          content: '성공 시 업로드된 이미지의 URL 목록을 포함한 JSON 객체를 반환합니다. 실패 시 400 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '클라이언트가 여러 이미지를 업로드할 수 있는 엔드포인트입니다.'
        }
      ]
    },
    {
      path: '/inquiries',
      method: 'POST',
      description: '새로운 문의 글을 생성합니다.',
      details: [
        {
          title: '요청 형식',
          content: 'JSON 형식으로 { "title": <제목>, "content": <내용>, "author": <작성자>, "imageUrls": <이미지 URL 목록> }를 포함해야 합니다.'
        },
        {
          title: '저장되는 데이터',
          content: 'coupon_fi.inquiries 테이블에 새로운 글을 추가합니다.'
        },
        {
          title: '응답',
          content: '성공 시 생성된 글 정보를 포함한 200 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '새로운 문의 글을 생성합니다.'
        }
      ]
    },
    {
      path: '/inquiries',
      method: 'GET',
      description: '모든 문의 글을 조회합니다.',
      details: [
        {
          title: '요청 형식',
          content: '이 엔드포인트는 GET 요청이므로 요청 본문이 필요하지 않습니다.'
        },
        {
          title: '반환되는 데이터',
          content: 'coupon_fi.inquiries 테이블에서 모든 글을 조회합니다.'
        },
        {
          title: '응답',
          content: '성공 시 모든 문의 글 목록을 포함한 JSON 객체를 반환합니다.'
        },
        {
          title: '설명',
          content: '모든 문의 글을 조회합니다.'
        }
      ]
    },
    {
      path: '/inquiries/:id',
      method: 'GET',
      description: '특정 문의 글을 조회합니다.',
      details: [
        {
          title: '요청 형식',
          content: 'GET 요청으로 경로 매개변수로 글의 ID를 포함해야 합니다.'
        },
        {
          title: '반환되는 데이터',
          content: 'coupon_fi.inquiries 테이블에서 특정 ID에 해당하는 글을 조회합니다.'
        },
        {
          title: '응답',
          content: '성공 시 조회된 글 정보를 포함한 JSON 객체를 반환합니다. 실패 시 404 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '특정 ID에 해당하는 문의 글을 조회합니다.'
        }
      ]
    },
    {
      path: '/inquiries/:id',
      method: 'PUT',
      description: '특정 문의 글을 업데이트합니다.',
      details: [
        {
          title: '요청 형식',
          content: 'JSON 형식으로 { "title": <제목>, "content": <내용>, "author": <작성자>, "imageUrls": <이미지 URL 목록> }를 포함해야 합니다.'
        },
        {
          title: '저장되는 데이터',
          content: 'coupon_fi.inquiries 테이블에서 특정 ID에 해당하는 글을 업데이트합니다.'
        },
        {
          title: '응답',
          content: '성공 시 업데이트된 글 정보를 포함한 200 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '특정 ID에 해당하는 문의 글을 업데이트합니다.'
        }
      ]
    },
    {
      path: '/inquiries/:id',
      method: 'DELETE',
      description: '특정 문의 글을 삭제합니다.',
      details: [
        {
          title: '요청 형식',
          content: 'DELETE 요청으로 경로 매개변수로 글의 ID를 포함해야 합니다.'
        },
        {
          title: '저장되는 데이터',
          content: 'coupon_fi.inquiries 테이블에서 특정 ID에 해당하는 글을 삭제합니다.'
        },
        {
          title: '응답',
          content: '성공 시 삭제된 글 정보를 포함한 200 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '특정 ID에 해당하는 문의 글을 삭제합니다.'
        }
      ]
    },
    {
      path: '/customer_support',
      method: 'POST',
      description: '새로운 고객 지원 글을 생성합니다.',
      details: [
        {
          title: '요청 형식',
          content: 'JSON 형식으로 { "title": <제목>, "content": <내용>, "author": <작성자>, "imageUrls": <이미지 URL 목록> }를 포함해야 합니다.'
        },
        {
          title: '저장되는 데이터',
          content: 'coupon_fi.customer_support 테이블에 새로운 글을 추가합니다.'
        },
        {
          title: '응답',
          content: '성공 시 생성된 글 정보를 포함한 200 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '새로운 고객 지원 글을 생성합니다.'
        }
      ]
    },
    {
      path: '/customer_support',
      method: 'GET',
      description: '모든 고객 지원 글을 조회합니다.',
      details: [
        {
          title: '요청 형식',
          content: '이 엔드포인트는 GET 요청이므로 요청 본문이 필요하지 않습니다.'
        },
        {
          title: '반환되는 데이터',
          content: 'coupon_fi.customer_support 테이블에서 모든 글을 조회합니다.'
        },
        {
          title: '응답',
          content: '성공 시 모든 고객 지원 글 목록을 포함한 JSON 객체를 반환합니다.'
        },
        {
          title: '설명',
          content: '모든 고객 지원 글을 조회합니다.'
        }
      ]
    },
    {
      path: '/notices',
      method: 'POST',
      description: '새로운 공지사항 글을 생성합니다.',
      details: [
        {
          title: '요청 형식',
          content: 'JSON 형식으로 { "title": <제목>, "content": <내용>, "author": <작성자>, "imageUrls": <이미지 URL 목록> }를 포함해야 합니다.'
        },
        {
          title: '저장되는 데이터',
          content: 'coupon_fi.notices 테이블에 새로운 글을 추가합니다.'
        },
        {
          title: '응답',
          content: '성공 시 생성된 글 정보를 포함한 200 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '새로운 공지사항 글을 생성합니다.'
        }
      ]
    },
    {
      path: '/notices',
      method: 'GET',
      description: '모든 공지사항 글을 조회합니다.',
      details: [
        {
          title: '요청 형식',
          content: '이 엔드포인트는 GET 요청이므로 요청 본문이 필요하지 않습니다.'
        },
        {
          title: '반환되는 데이터',
          content: 'coupon_fi.notices 테이블에서 모든 글을 조회합니다.'
        },
        {
          title: '응답',
          content: '성공 시 모든 공지사항 글 목록을 포함한 JSON 객체를 반환합니다.'
        },
        {
          title: '설명',
          content: '모든 공지사항 글을 조회합니다.'
        }
      ]
    }
  ];

  return (
    <div style={styles.container}>
      <h2>Board Router Documentation</h2>
      <p>게시판 관련 기능을 제공하는 라우터입니다.</p>
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

export default BoardRouterDocumentation;
