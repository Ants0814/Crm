import React, { useState, Suspense, lazy } from 'react';

// require.context를 사용하여 'Document' 폴더 내의 모든 하위 폴더의 .js 파일을 가져옴
const context = require.context('./Document', true, /\.js$/);

// 동적으로 가져온 컴포넌트를 저장할 객체
const components = {};

// context.keys()를 사용하여 파일 경로를 가져오고, 해당 경로를 lazy로 동적 import하여 components 객체에 저장
context.keys().forEach((filePath) => {
  const componentName = filePath.replace('./', '').replace('.js', '').replace(/\//g, '-'); // 경로를 컴포넌트 이름으로 변환
  components[componentName] = lazy(() => import(`./Document/${filePath.replace('./', '')}`));
});

const Document = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);

  // 클릭 이벤트 핸들러: 선택된 컴포넌트를 설정
  const handleComponentClick = (componentName) => {
    setSelectedComponent(componentName);
  };

  // 선택된 컴포넌트에 따라 동적으로 콘텐츠 렌더링
  const renderContent = () => {
    const Component = components[selectedComponent]; // 동적으로 로드할 컴포넌트
    return Component ? <Component /> : <div>Select a component to view its content.</div>;
  };

  return (
    <div style={styles.wrapper}>
      {/* 왼쪽 사이드바 */}
      <div style={styles.sidebar}>
        <ul style={styles.navList}>
          {Object.keys(components).map((key) => (
            <li
              key={key}
              onClick={() => handleComponentClick(key)}
              style={styles.navItem}
            >
              {key}
            </li>
          ))}
        </ul>
      </div>

      {/* 우측 콘텐츠 영역 */}
      <div style={styles.content}>
        <Suspense fallback={<div>Loading...</div>}>
          {renderContent()}
        </Suspense>
      </div>
    </div>
  );
};

// 스타일 정의
const styles = {
  wrapper: {
    display: 'flex',
    width: '100%',
  },
  sidebar: {
    width: '350px',
    backgroundColor: '#f1f1f1',
    padding: '20px',
    borderRight: '1px solid #ddd',textAlign:'left'
  },
  navList: {
    listStyleType: 'none',
    padding: 0,
  },
  navItem: {
    cursor: 'pointer',
    padding: '10px',
    marginBottom: '5px',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
  content: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#f9f9f9',
  },
};

export default Document;
