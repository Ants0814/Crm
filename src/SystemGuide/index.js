import React, { useState, Suspense, lazy } from 'react';
import CineChain from './CineChain';
// 각 탭에 표시될 컴포넌트들을 동적으로 임포트
const PineCinema = lazy(() => import('./PineCinema'));
const MovieExchange = lazy(() => import('./MovieExchange'));

function SystemGuide() {
  const [selectedTab, setSelectedTab] = useState('pine-cinema');

  const renderContent = () => {
    switch (selectedTab) {

      case 'cine-chain':
        return <CineChain />;
      case 'pine-cinema':
        return <PineCinema />;
      case 'movie-exchange':
        return <MovieExchange />;
      default:
        return <PineCinema />;
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>가이드 문서</h2>
      <ul style={styles.navList}>
        <li
          onClick={() => setSelectedTab('cine-chain')}
          style={{
            ...styles.link,
            backgroundColor: selectedTab === 'cine-chain' ? '#e7f3ff' : 'transparent'
          }}
        >
          1. 시네체인
        </li>
        <li
          onClick={() => setSelectedTab('pine-cinema')}
          style={{
            ...styles.link,
            backgroundColor: selectedTab === 'pine-cinema' ? '#e7f3ff' : 'transparent'
          }}
        >
            2. 파인시네마
        </li>
        <li
          onClick={() => setSelectedTab('movie-exchange')}
          style={{
            ...styles.link,
            backgroundColor: selectedTab === 'movie-exchange' ? '#e7f3ff' : 'transparent'
          }}
        >
          3. 영화거래소
        </li>
      </ul>

      <div style={styles.guideContent}>
        <Suspense fallback={<div>Loading...</div>}>
          {renderContent()}
        </Suspense>
      </div>
    </div>
  );
}

// 스타일 정의
const styles = {
  container: {
    width: '100%',
    height: '100%',
    padding: '20px',
    fontFamily: "'Arial', sans-serif",
    backgroundColor: '#f9f9f9',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    
  },
  title: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '20px'
  },
  navList: {
    listStyleType: 'none',
    padding: 0,
    marginBottom: '20px',
    display: 'flex',
    gap: '10px',
  },
  link: {
    cursor: 'pointer',
    color: '#007BFF',
    textDecoration: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    transition: 'background-color 0.3s, color 0.3s',
    fontWeight: 'bold'
  },
  guideContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    width: '100%',
    maxWidth: '90vw'
  }
};

export default SystemGuide;
