import React from 'react';

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const numOfPages = Math.ceil(totalPages);
  const nextPage = () => setCurrentPage((prev) => (prev < numOfPages ? prev + 1 : prev));
  const prevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));

  const getPageNumbers = () => {
    const startPage = Math.max(currentPage - 5, 1);
    const endPage = Math.min(startPage + 9, numOfPages);
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
      <button 
        onClick={prevPage} 
        disabled={currentPage === 1}
        style={{
          marginRight: '8px',
          padding: '8px 16px',
          backgroundColor: currentPage === 1 ? '#b9b8c38f' : '#46b5bd',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
        }}
      >
        이전
      </button>
      {getPageNumbers().map((page) => (
        <button 
          key={page} 
          onClick={() => setCurrentPage(page)} 
          disabled={currentPage === page}
          style={{
            margin: '0 4px',
            padding: '8px 12px',
            backgroundColor: currentPage === page ? '#469bbdb5' : '#46b5bd',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: currentPage === page ? 'not-allowed' : 'pointer',
          }}
        >
          {page}
        </button>
      ))}
      <button 
        onClick={nextPage} 
        disabled={currentPage === numOfPages}
        style={{
          marginLeft: '8px',
          padding: '8px 16px',
          backgroundColor: currentPage === numOfPages ? '#b9b8c38f' : '#46b5bd',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: currentPage === numOfPages ? 'not-allowed' : 'pointer',
        }}
      >
        다음
      </button>
    </div>
  );
};

export default Pagination;