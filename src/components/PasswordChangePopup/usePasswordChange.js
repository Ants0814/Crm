import { useState, useEffect } from 'react';
import { pw_change } from '../Board/DynamicBoard/clientAction'; // 비밀번호 변경 API 호출 함수 임포트

const usePasswordChange = () => {
  const [showPasswordChangePopup, setShowPasswordChangePopup] = useState(false); // 비밀번호 변경 팝업 상태
  const [pwChangeRow, setPwChangeRow] = useState(null); // 비밀번호 변경할 행의 데이터 저장

  // 상태가 변경될 때마다 콘솔에 로그 출력
  useEffect(() => {
  }, [showPasswordChangePopup]);

  // 비밀번호 변경 팝업 열기
  const handleOpenPasswordChangePopup = (row) => {
    setPwChangeRow(row); // 비밀번호 변경할 행 데이터 설정
    setShowPasswordChangePopup(true); // 팝업 열기
  };

  // 비밀번호 변경 팝업 닫기
  const handleClosePasswordChangePopup = () => {
    setShowPasswordChangePopup(false); // 팝업 닫기
  };

  // 비밀번호 변경 요청 처리
  const handlePasswordChangeSubmit = async (newPassword) => {
    alert('handlePasswordChangeSubmit 호출됨');
  
    try {
      const result = await pw_change({ 
        id: pwChangeRow.id,
        new_password: newPassword
      });
  
      console.log('서버 응답:', result);
  
      if (result) {
        console.log('비밀번호 변경 성공');
        alert('비밀번호가 성공적으로 변경되었습니다.');
      } else {
        console.log('비밀번호 변경 실패:',result );
        alert('비밀번호 변경에 실패했습니다.'+JSON.stringify(result));
      }
    } catch (error) {
      console.error('비밀번호 변경 중 오류가 발생했습니다: ', error);
      alert('오류가 발생했습니다.');
    } finally {
      console.log('비밀번호 변경 처리 종료');
      handleClosePasswordChangePopup(); // 팝업 닫기
    }
  };

  return {
    showPasswordChangePopup,
    handleOpenPasswordChangePopup,
    handleClosePasswordChangePopup,
    handlePasswordChangeSubmit,
  };
};

export default usePasswordChange;