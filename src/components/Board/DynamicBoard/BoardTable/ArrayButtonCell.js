import React, { useState, useEffect } from "react";

const ArrayButtonCell = ({ column, board, isEditMode, handleButtonClick, isPopupVisible, onPopupToggle }) => {
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 }); // 팝업 위치 상태 관리

  const handleMouseEnter = (e) => {
    const { clientX, clientY } = e;
    setPopupPosition({ x: clientX, y: clientY });
    onPopupToggle(); // 팝업 열기/닫기 토글
  };

  const handlePopupClose = () => {
    onPopupToggle(); // 팝업 닫기
  };

  let functionArray = [];
  try {
    functionArray = new Function(`return ${column.function}`)(); // 자바스크립트 배열로 변환
  } catch (error) {
    alert("Invalid function format in functionArray: " + error.message);
  }

  let actionArray = [];
  try {
    actionArray = new Function(`return ${column.result_action}`)(); // 자바스크립트 배열로 변환
  } catch (error) {
    alert("Invalid function format in actionArray: " + error.message);
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        style={{ background: "white",width:'100%' }}
        disabled={isEditMode}
        onClick={handleMouseEnter} // 마우스 클릭 시 팝업 띄우기
      >
        {column.column_title}
      </button>

      {/* 팝업 - 나머지 버튼들 */}
      {isPopupVisible && (
        <div
          style={{
            position: "fixed",
            top: popupPosition.y + 10, // 팝업 위치 설정
            left: popupPosition.x + 10,
            backgroundColor: "white",
            border: "1px solid black",
            padding: "10px",
            zIndex: 1000, // 팝업을 최상위에 표시
          }}
        >
          {Array.isArray(functionArray) &&
            functionArray.map((funcObj, idx) => {
              const resultObj = actionArray.find(
                (result) => result.exec_func === funcObj.function
              );
              return (
                <div key={idx}>
                  <button
                    style={{
                      marginRight: "5px",
                      display: "block",
                      marginBottom: "5px",
                    }}
                    disabled={isEditMode}
                    onClick={() =>
                      handleButtonClick(funcObj.function, board, resultObj?.result_action)
                    }
                  >
                    {funcObj.button_txt || `${column.column_title} ${idx + 1}`}
                  </button>
                </div>
              );
            })}

          {/* 팝업 닫기 버튼 */}
          <button onClick={handlePopupClose}>닫기</button>
        </div>
      )}
    </div>
  );
};

export default ArrayButtonCell;
