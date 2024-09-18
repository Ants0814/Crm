import { saveAs } from 'file-saver';



export const member_delete = async(row) =>{
  return row; // 필요한 경우 결과를 반환
}

export const pw_change = async (row) => {
  try {
    //alert(JSON.stringify(row)); // 사용자 정보 확인을 위한 알림

    const options = {
      credentials:'include',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: row.id, // 사용자의 ID
        newPassword: row.new_password, // 새로운 비밀번호
      }),
    };

    const response = await fetch('https://crm.skynet.re.kr/request/pw_change', options);
    const result = await response.json();

    if (response.ok) {
      alert('비밀번호가 성공적으로 변경되었습니다.');
    } else {
      alert(`오류 발생: ${result.message}`);
    }

    return result; // 필요한 경우 결과를 반환
  } catch (error) {
    alert('비밀번호 변경 중 오류가 발생했습니다: ' + error.message);
  }
};

export const order_agent = async (rows) => {
  try {
    // rows가 비어있을 때 경고 메시지 표시
    if (!rows || rows.length === 0) {
      alert('항목을 선택하세요');
      return; // 함수 종료
    }

    // 모든 행에 대해 비동기 요청을 병렬로 처리
    const filteredRows = rows.filter(row => row.agent_status === 'false');

    // '대행진행중'인 행들 (alert로 표시할 목록)
    const excludedRows = rows.filter(row => row.agent_status !== 'false');
    alert(rows[0].agent_status==='false');
    const promises = filteredRows.map(async (row) => {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 각 행(row)의 데이터를 요청에 포함
        body: JSON.stringify(row),
      };
      
      const response = await fetch('https://coupon.skynet.re.kr/Acution/agent_request', options);
      const result = await response.json();
      return result; // 필요한 경우 결과를 반환
    });

    // 모든 요청이 완료될 때까지 대기
    const results = await Promise.all(promises);

    // 모든 결과 처리
    console.log('All responses:', results);
    alert(
      `대행 요청 성공 목록 (${filteredRows.length}건)\n[${filteredRows.map(row => `${row.coupon_code}`).join(', ')}]\n\n이미 진행중인 요청 목록 (${excludedRows.length}건)\n[${excludedRows.map(row => ` ${row.coupon_code}`).join(', ')}]`
    );
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
};

export const order_refund = async (rows) => {
  try {
    // rows가 비어있을 때 경고 메시지 표시
    if (!rows || rows.length === 0) {
      alert('항목을 선택하세요');
      return; // 함수 종료
    }

    // rows 배열을 순회하며 각 요청을 처리
    for (const row of rows) {  
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ row }),  // 개별 row를 본문에 추가
      };

      const response = await fetch('https://crm.skynet.re.kr/request/order_refund', options);

      if (!response.ok) {  // 응답 상태가 OK가 아닌 경우 에러 처리
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`Result for row ${JSON.stringify(row)}: `, result);  // 각 요청의 결과를 콘솔에 출력
    }

    alert('환불 요청이 완료되었습니다.');

  } catch (error) {
    alert(`Error: ${error.message}`);  // 에러 메시지 출력
  }
};

export const order_cancel = async (rows) => {
  try {
    // rows가 비어있을 때 경고 메시지 표시
    if (!rows || rows.length === 0) {
      alert('항목을 선택하세요');
      return; // 함수 종료
    }

    // 모든 행에 대해 비동기 요청을 병렬로 처리
    const promises = rows.map(async (row) => {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 각 행(row)의 데이터를 요청 본문에 포함
        body: JSON.stringify({ row }),
      };

      // 각 요청에 대해 fetch 실행
      const response = await fetch('https://crm.skynet.re.kr/request/order_cancel', options);

      if (!response.ok) { // 응답 상태가 OK가 아닌 경우 에러 처리
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 결과를 JSON으로 파싱
      const result = await response.json();

      return result; // 필요 시 결과 반환
    });

    // 모든 요청이 완료될 때까지 대기
    const results = await Promise.all(promises);

    // 모든 결과 처리
    console.log('All cancel responses:', results);
    alert('취소 요청이 완료되었습니다.');

  } catch (error) {
    alert(`Error: ${error.message}`); // 에러 메시지 출력
  }
};

export const order_accident = async (rows) => {
  try {
    // rows가 비어있을 때 경고 메시지 표시
    if (!rows || rows.length === 0) {
      alert('항목을 선택하세요');
      return; // 함수 종료
    }

    // 모든 행에 대해 비동기 요청을 병렬로 처리
    const promises = rows.map(async (row) => {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 각 행(row)의 데이터를 요청 본문에 포함
        body: JSON.stringify({ row }),
      };

      // 각 요청에 대해 fetch 실행
      const response = await fetch('https://crm.skynet.re.kr/request/accident_reg', options);

      if (!response.ok) { // 응답 상태가 OK가 아닌 경우 에러 처리
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 결과를 JSON으로 파싱
      const result = await response.json();

      return result; // 필요 시 결과 반환
    });

    // 모든 요청이 완료될 때까지 대기
    const results = await Promise.all(promises);

    // 모든 결과 처리
    console.log('All accident responses:', results);
    alert('사고 등록이 완료되었습니다.');

  } catch (error) {
    alert(`Error: ${error.message}`); // 에러 메시지 출력
  }
};

export const couponSetExport = (rows) => {
  try {
    const headers = ['식별키', '쿠폰코드', '유효기간종료일'];

    // CSV 데이터 생성: 'fran_type'과 'issue_cnt'를 제외한 데이터로 구성
    const csvData = [
      headers, // 첫 번째 행에 헤더 추가
      ...rows.map(row => {
        const { fran_type, issue_cnt, ...filteredRow } = row; // fran_type과 issue_cnt 제외
        return Object.values(filteredRow); // 나머지 필드의 값만 반환
      })
    ];

    // CSV 콘텐츠를 생성하여 파일로 저장
    const BOM = '\uFEFF';
    const csvContent = BOM + csvData.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    if (rows.length === 0) {
      alert('쿠폰 목록이 0건입니다.');
    } else {
      // fran_type과 issue_cnt는 파일명에만 사용
      saveAs(blob, '[' + rows[0].fran_type + '-' + String(rows[0].issue_cnt).padStart(4, '0') + ']_' + 'export.csv');
      console.log('엑셀 내보내기 버튼 클릭됨');
    }
  } catch (error) {
    alert(error.message);
  }
};

export const userAdd = async (setIsShowPopup)=>{
  setIsShowPopup(true);
  
}
export const statisticExport = async () => {
  
  try {
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch('https://crm.skynet.re.kr/request/statistic_down', options);
    const result = await response.json();
    const headers = ['가맹점명'	,'쿠폰종류'	,'유효기간'	,'발급쿠폰수'	,'인증쿠폰수'	,'인증율'	,'예매쿠폰수',	'예매율'];

    // CSV 데이터 생성: 'fran_type'과 'issue_cnt'를 제외한 데이터로 구성
    const csvData = [
      headers, // 첫 번째 행에 헤더 추가
      ...result.map(row => {
        const { ...filteredRow } = row; // fran_type과 issue_cnt 제외
        return Object.values(filteredRow); // 나머지 필드의 값만 반환
      })
    ];

    // CSV 콘텐츠를 생성하여 파일로 저장
    const BOM = '\uFEFF';
    const csvContent = BOM + csvData.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    if (result.length === 0) {
      alert('쿠폰 목록이 0건입니다.');
    } else {
      // fran_type과 issue_cnt는 파일명에만 사용
      //alert(JSON.stringify(result));
      saveAs(blob, '[' + result[0].fran_type + '-' + String(result[0].issue_cnt).padStart(4, '0') + ']_' + 'export.csv');
      console.log('엑셀 내보내기 버튼 클릭됨');
    }
  } catch (error) {
    alert(error.message);
  }
};


//전체발행 
export const couponSetExportAll = (rows) => {
    // CSV 데이터 생성: 첫 번째 행은 헤더, 그 다음은 rows 데이터
    // alert('[rows값]:'+JSON.stringify(rows));
    const headers = ['식별키','발행일','쿠폰코드','가맹점코드','쿠폰종류','쿠폰수','유효기간시작일','유효기간종료일','유효기간일','시간그룹','예매제한','주문최대인원','주문최소인원','발행횟차'];

    // CSV 데이터 생성: 첫 번째 행은 헤더, 그 다음은 rows 데이터
    const csvData = [
        headers, // 첫 번째 행에 헤더 추가
        ...rows.map(row => Object.values(row)) // 이후 각 행의 데이터 추가
    ];
    // CSV 콘텐츠를 생성하여 파일로 저장
    const BOM = '\uFEFF';
    const csvContent = BOM + csvData.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob,'['+ rows[0].fran_type + '-' + rows[0].issue_cnt.toString().padStart(3, '0')+']_' + 'export.csv');
  
    console.log('엑셀 내보내기 버튼 클릭됨');
  };