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

// MovieSchedulesRouter에 대한 문서를 보여주는 컴포넌트
const MovieSchedulesRouterDocumentation = () => {
  const functions = [
    {
      path: '/',
      method: 'POST',
      description: '영화 상영 일정을 네이버 API로부터 가져와서 데이터베이스에 저장합니다.',
      details: [
        {
          title: '요청 형식',
          content: `JSON 형식으로 {
            "movieTitle": <영화 제목>,
            "date": <YYYY-MM-DD>,
            "cinemaBrand": <영화관 브랜드 (선택)>
          }를 포함해야 합니다.`
        },
        {
          title: '반환되는 데이터',
          content: '상영 일정을 성공적으로 저장한 후 총 삽입된 일정 수를 반환합니다.'
        },
        {
          title: '응답',
          content: '성공 시 200 상태 코드와 함께 삽입된 일정 수를 반환합니다. 실패 시 500 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '영화 상영 일정을 네이버 API에서 가져와 데이터베이스에 저장합니다.'
        }
      ]
    },
    {
      path: '/movies',
      method: 'GET',
      description: '데이터베이스에 저장된 모든 영화 목록을 조회합니다.',
      details: [
        {
          title: '요청 형식',
          content: '이 엔드포인트는 GET 요청이므로 요청 본문이 필요하지 않습니다.'
        },
        {
          title: '반환되는 데이터',
          content: '모든 영화 목록을 JSON 배열로 반환합니다.'
        },
        {
          title: '응답',
          content: '성공 시 200 상태 코드와 함께 영화 목록을 반환합니다. 실패 시 500 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '데이터베이스에서 영화 목록을 조회하여 반환합니다.'
        }
      ]
    },
    {
      path: '/regions',
      method: 'GET',
      description: '특정 영화와 영화관 브랜드에 대한 지역 목록을 조회합니다.',
      details: [
        {
          title: '요청 형식',
          content: '쿼리 파라미터로 "movieTitle"과 "cinemaBrand"를 포함해야 합니다.'
        },
        {
          title: '반환되는 데이터',
          content: '해당 영화와 영화관 브랜드에 대한 지역 목록을 JSON 배열로 반환합니다.'
        },
        {
          title: '응답',
          content: '성공 시 200 상태 코드와 함께 지역 목록을 반환합니다. 실패 시 500 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '특정 영화와 영화관 브랜드에 대한 지역 목록을 조회하여 반환합니다.'
        }
      ]
    },
    {
      path: '/sub-regions',
      method: 'GET',
      description: '특정 영화, 지역, 영화관 브랜드에 대한 세부 지역 목록을 조회합니다.',
      details: [
        {
          title: '요청 형식',
          content: '쿼리 파라미터로 "movieTitle", "region", "cinemaBrand"를 포함해야 합니다.'
        },
        {
          title: '반환되는 데이터',
          content: '해당 조건에 맞는 세부 지역 목록을 JSON 배열로 반환합니다.'
        },
        {
          title: '응답',
          content: '성공 시 200 상태 코드와 함께 세부 지역 목록을 반환합니다. 실패 시 500 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '특정 영화, 지역, 영화관 브랜드에 대한 세부 지역 목록을 조회하여 반환합니다.'
        }
      ]
    },
    {
      path: '/theaters',
      method: 'GET',
      description: '특정 영화, 지역, 세부 지역, 영화관 브랜드에 대한 상영관 목록을 조회합니다.',
      details: [
        {
          title: '요청 형식',
          content: '쿼리 파라미터로 "movieTitle", "region", "subRegion", "cinemaBrand"를 포함해야 합니다.'
        },
        {
          title: '반환되는 데이터',
          content: '해당 조건에 맞는 상영관 목록을 JSON 배열로 반환합니다.'
        },
        {
          title: '응답',
          content: '성공 시 200 상태 코드와 함께 상영관 목록을 반환합니다. 실패 시 500 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '특정 영화, 지역, 세부 지역, 영화관 브랜드에 대한 상영관 목록을 조회하여 반환합니다.'
        }
      ]
    },
    {
      path: '/dates',
      method: 'GET',
      description: '특정 영화, 지역, 세부 지역, 상영관에 대한 상영 날짜 목록을 조회합니다.',
      details: [
        {
          title: '요청 형식',
          content: '쿼리 파라미터로 "movieTitle", "region", "subRegion", "theater"를 포함해야 합니다.'
        },
        {
          title: '반환되는 데이터',
          content: '해당 조건에 맞는 상영 날짜 목록을 JSON 배열로 반환합니다.'
        },
        {
          title: '응답',
          content: '성공 시 200 상태 코드와 함께 날짜 목록을 반환합니다. 실패 시 500 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '특정 영화, 지역, 세부 지역, 상영관에 대한 상영 날짜 목록을 조회하여 반환합니다.'
        }
      ]
    },
    {
      path: '/times',
      method: 'GET',
      description: '특정 영화, 지역, 세부 지역, 상영관, 날짜에 대한 상영 시간 목록을 조회합니다.',
      details: [
        {
          title: '요청 형식',
          content: '쿼리 파라미터로 "movieTitle", "region", "subRegion", "theater", "date"를 포함해야 합니다.'
        },
        {
          title: '반환되는 데이터',
          content: '해당 조건에 맞는 상영 시간 목록을 JSON 배열로 반환합니다.'
        },
        {
          title: '응답',
          content: '성공 시 200 상태 코드와 함께 시간 목록을 반환합니다. 실패 시 500 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '특정 영화, 지역, 세부 지역, 상영관, 날짜에 대한 상영 시간 목록을 조회하여 반환합니다.'
        }
      ]
    },
    {
      path: '/schedule/:id',
      method: 'GET',
      description: '특정 ID에 대한 상영 일정의 상세 정보를 조회합니다.',
      details: [
        {
          title: '요청 형식',
          content: 'URL 파라미터로 상영 일정의 "id"를 포함해야 합니다.'
        },
        {
          title: '반환되는 데이터',
          content: '해당 ID에 대한 상영 일정의 상세 정보를 JSON 형식으로 반환합니다.'
        },
        {
          title: '응답',
          content: '성공 시 200 상태 코드와 함께 상영 일정의 상세 정보를 반환합니다. 실패 시 404 또는 500 상태 코드를 반환합니다.'
        },
        {
          title: '설명',
          content: '특정 ID에 대한 상영 일정의 상세 정보를 조회하여 반환합니다.'
        }
      ]
    }
  ];

  return (
    <div style={styles.container}>
      <h2>Movie Schedules Router Documentation</h2>
      <p>영화 상영 일정과 관련된 기능을 제공하는 라우터입니다.</p>
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

export default MovieSchedulesRouterDocumentation;
