const express = require('express');
const app = express();
const cors = require('cors');
const router = express.Router();
const pool = require('../dbConfig_pg');
const format = require('pg-format');

const {encrypt,decrypt}  = require('./Security');
// 전처리 미들웨어 추가
app.use(express.json({ strict: false }));

const getExecutedQuery = (query, params) => {
  let executedQuery = query;
  params.forEach((param, index) => {
      executedQuery = executedQuery.replace(`$${index + 1}`, `'${param}'`);
  });
  return executedQuery;
};

function ExtractText(str) {
  // 결과를 저장할 객체 초기화
  const result = {
    sender: null,
    message: null
  };

  // 문자열에서 "sender" 키워드 이후의 값을 추출 (콜론과 공백을 포함한 다양한 형식 허용)
  const senderMatch = str.match(/"sender"\s*:\s*"([^"]+)"/);
  if (senderMatch) {
    result.sender = senderMatch[1]; // 추출한 sender 값을 저장
  }

  // 문자열에서 "message" 키워드 이후의 값을 추출 (콜론과 공백을 포함한 다양한 형식 허용)
  const messageMatch = str.match(/"message"\s*:\s*"([^"]+)"/);
  if (messageMatch) {
    result.message = messageMatch[1]; // 추출한 message 값을 저장
  }

  console.log('추출내역: ' + JSON.stringify(result));
  return result; // 결과 객체 반환
}


////주문관리 내역을 SMS 전송 요청을 처리하는 엔드포인트
router.post('/req_sms_send', async (req, res) => {
  console.log('[요청정보]/request/req_sms_send===========================================');
  console.log('Request Body: ', req.body);

  try {
    // 세션에서 스키마 가져오기, 기본값은 'crm_pinecinema'로 설정
    const schema = req.session?.domain || 'crm';
    const { row } = req.body; // 요청 바디에서 발신자와 메시지 추출
    
    // ants_send_sms 테이블에 데이터 삽입 쿼리
    const insertQuery = `
      INSERT INTO ${schema}.ants_send_sms (sender_num, send_text, sms_status, created_at)
      VALUES ($1, $2, 'wait', NOW())
      RETURNING id, sender_num AS sender, send_text AS message, sms_status AS status, created_at;
    `;
    const values = [row.user_id, row.complate_code];
    console.log('Executing insert query:', insertQuery);

    // 데이터베이스에 데이터 삽입
    const result = await pool.query(insertQuery, values);
    const insertedData = result.rows[0];

    console.log('Data inserted into ants_send_sms:', insertedData);

    // 삽입된 데이터 반환
    res.status(201).json({
      message: 'SMS has been successfully inserted and is waiting to be sent.',
      data: insertedData
    });
  } catch (error) {
    console.error('Error inserting SMS: ', error);
    res.status(500).send('An error occurred while inserting the SMS.');
  }
});

// 예매 제한 그룹 조회 엔드포인트
router.get("/getTimeControlGroups", async (req, res) => {
  console.log('요청자: getTimeControlGroups===========================' + req.session.domain);
  const schema = req.session.domain || 'crm'; // 동적으로 스키마 설정
  const query = `SELECT std_key FROM ${schema}."StandardInfo" WHERE std_group_code = 'time_control_group'`; // 그룹 정보 조회 쿼리

  try {
    const result = await pool.query(query);
    console.log('쿼리 성공: ' + new Date().toISOString());
    res.json(result.rows.map(row => row.std_key)); // 그룹 목록을 JSON으로 반환
  } catch (error) {
    console.error('쿼리 에러: ' + error);
    res.status(500).send('그룹 데이터를 가져오는 중 오류가 발생했습니다.');
  }
});
// 예매 제한 업데이트 엔드포인트
router.put("/time_control", async (req, res) => { 
  console.log('요청자: time_control===========================' + req.session.domain);
  const schema = req.session.domain || 'crm'; // 동적으로 스키마 설정
  const query = `UPDATE ${schema}.ants_coupon_set SET time_group = $2 WHERE id = $1 RETURNING *`;
  const params = [req.body.id, req.body.selected_group]; // id와 그룹 값을 받기 

  try {
    const result = await pool.query(query, params);
    console.log('쿼리 성공: ' + new Date().toISOString());
    console.log(result.rows[0]);
    res.json(result.rows[0]); // 성공 시 업데이트된 행을 JSON 형식으로 반환
  } catch (error) {
    console.error('쿼리 에러: ' + error);
    res.status(500).send('쿼리 실행 중 오류가 발생했습니다.');
  }
});
// 예매 제한 업데이트 엔드포인트
router.put("/booking_limit", async (req, res) => {
  console.log('요청자: booking_limit===========================' + req.session.domain);
  const schema = req.session.domain || 'crm'; // 동적으로 스키마 설정
  const query = `UPDATE ${schema}.ants_coupon_set SET ticketing_limited = $2 WHERE id = $1 RETURNING *`;
  const params = [req.body.id, req.body.limitEnabled]; // id와 제한 여부 값 받기

  try {
    const result = await pool.query(query, params);
    console.log('쿼리 성공: ' + new Date().toISOString());
    console.log(result.rows[0]);
    res.send(result.rows[0]); // 성공 시 업데이트된 행 반환
  } catch (error) {
    console.error('쿼리 에러: ' + error);
    res.status(500).send('쿼리 실행 중 오류가 발생했습니다.');
  }
});

// SMS 전송 요청을 처리하는 엔드포인트
router.post('/send-message', async (req, res) => {
  console.log('[요청정보]/request/send-message===========================================');
  console.log('Request Body: ', req.body);

  try {
    // 세션에서 스키마 가져오기, 기본값은 'crm_pinecinema'로 설정
    const schema = req.session?.domain || 'crm';
    const { sender, message } = req.body; // 요청 바디에서 발신자와 메시지 추출

    // 필수 필드가 누락된 경우 처리
    if (!sender || !message) {
      console.error('Required fields are missing: sender or message.');
      return res.status(400).send('Required fields are missing.');
    }

    // ants_send_sms 테이블에 데이터 삽입 쿼리
    const insertQuery = `
      INSERT INTO ${schema}.ants_send_sms (sender_num, send_text, sms_status, created_at)
      VALUES ($1, $2, 'wait', NOW())
      RETURNING id, sender_num AS sender, send_text AS message, sms_status AS status, created_at;
    `;
    const values = [sender, message];
    console.log('Executing insert query:', insertQuery);

    // 데이터베이스에 데이터 삽입
    const result = await pool.query(insertQuery, values);
    const insertedData = result.rows[0];

    console.log('Data inserted into ants_send_sms:', insertedData);

    // 삽입된 데이터 반환
    res.status(201).json({
      message: 'SMS has been successfully inserted and is waiting to be sent.',
      data: insertedData
    });
  } catch (error) {
    console.error('Error inserting SMS: ', error);
    res.status(500).send('An error occurred while inserting the SMS.');
  }
});

// 추가된 코드: 입금 리스트 조회 엔드포인트
router.get('/get_deposit_list', async (req, res) => {
  console.log('[요청정보]/deposit_list===========================================');

  try {
    const schema = req.session?.domain || 'crm'; // 세션에서 도메인 가져오기, 기본값은 'crm'

    // 필요한 컬럼만 조회하는 SQL 쿼리
    const selectQuery = `
    SELECT 
      payment_date, 
      depositor_name, 
      payamount, 
      account_number, 
      payment_method
    FROM ${schema}.ants_deposit_list
    LIMIT 5
    `;

    const result = await pool.query(selectQuery);

    console.log('Deposit list retrieved successfully: ', result.rows);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving deposit list: ', error);
    res.status(500).send('An error occurred while retrieving the deposit list');
  }
});

// SMS 전송을 위한 엔드포인트
router.get('/send_sms', async (req, res) => {
  try {
    const schema = 'crm_pinecinema';

    // sms_status가 'wait'인 SMS 데이터를 조회하는 쿼리
    const selectQuery = `
      SELECT id, sender_num AS sender, send_text AS message, sms_status AS status
      FROM ${schema}.ants_send_sms
      WHERE sms_status = 'wait';
    `;

    console.log('쿼리 실행:', selectQuery);
    // 데이터베이스에서 쿼리 실행
    const result = await pool.query(selectQuery);
    const smsList = result.rows;
    console.log(JSON.stringify(smsList));

    // 조회된 SMS 데이터가 있을 경우에만 업데이트 실행
    if (smsList.length > 0) {
      const ids = smsList.map(sms => sms.id); // 조회된 SMS 데이터의 ID 목록 추출

      // sms_status를 'sent'로 업데이트하는 쿼리
      const updateQuery = `
        UPDATE ${schema}.ants_send_sms
        SET sms_status = 'request'
        WHERE id = ANY($1::int[]);
      `;

      await pool.query(updateQuery, [ids]);
      console.log('SMS 상태가 "request"로 업데이트되었습니다.');
    }

    // 조회된 데이터 반환
    res.status(200).json(smsList);
  } catch (error) {
    console.error('SMS 리스트 조회 오류:', error);
    res.status(500).send('SMS 리스트 조회 중 오류가 발생했습니다.');
  }
});
// SMS 수신 및 저장 엔드포인트
router.post('/receive_sms', async (req, res) => {
  console.log('[요청정보]/receive_sms===========================================');
  console.log('Request Body: ', req.body);

  try {
    const schema = 'crm_pinecinema';
    let sender, message;

    // JSON 형식으로 파싱 가능한 경우 처리
    if (typeof req.body === 'object' && req.body !== null) {
      sender = req.body.sender;
      message = req.body.message;
    }

    // JSON 파싱이 실패한 경우 문자열로 수신되었을 가능성 있음
    if (typeof req.body === 'string') {
      try {
        const parsedBody = ExtractText(req.body);
        sender = parsedBody.sender;
        message = parsedBody.message;
        console.log('정제된값:'+sender+'/'+message);
      } catch (jsonError) {
        console.error('JSON 파싱 오류:', jsonError.message);
        return res.status(400).send('Invalid JSON format');
      }
    }

    // 필수 필드가 누락된 경우 처리
    if (!sender || !message) {
      console.error('Required fields are missing: sender or message.');
      return res.status(400).send('Required fields are missing.');
    }

    // 모든 발신자에 대해 수행할 데이터베이스 INSERT 쿼리
    const insertQuery = `
      INSERT INTO ${schema}.ants_receive_sms (sender, message, received_at)
      VALUES ($1, $2, NOW())
      RETURNING id, sender, message, received_at;
    `;
    const values = [sender, message];
    console.log('Executing insert query:', insertQuery);

    // 기본 테이블에 데이터 삽입
    const result = await pool.query(insertQuery, values);
    const data = result.rows[0];

    console.log('Data inserted into ants_receive_sms:', data);

    // 발신자가 16449999인 경우, 추가로 다른 테이블에 업데이트 작업 수행
    if (sender === '16449999') {
      // message에서 입금자명, 금액 추출

      const {  transactionAccount, depositorName, transactionType, payAmount } = parseMessage(message);
      console.log('입금내역 추가');
      if (depositorName && payAmount) {
        const updateQuery = `
          INSERT INTO ${schema}.ants_deposit_list (account_number,depositor_name, payamount,payment_method, payment_date)
          VALUES ($1, $2,$3,$4, NOW())
          RETURNING id, account_number,user_name, payamount, payment_date;
        `;
        const updateValues = [transactionAccount,depositorName, payAmount,transactionType];
        console.log('Executing update query for special sender:', updateQuery);

        // 추가로 다른 테이블에 데이터 업데이트
        const updateResult = await pool.query(updateQuery, updateValues);
        const updatedData = updateResult.rows[0];

        console.log('Special table updated with data:', updatedData);

        // 업데이트된 데이터도 함께 반환
        res.status(200).json({
          message: 'Data inserted and updated for special sender.',
          insertedData: data,
          updatedData: updatedData
        });
      } else {
        res.status(400).json({ message: 'Failed to parse deposit details from message.' });
      }
    } else {
      // 발신자가 다른 경우: 기본 처리만 수행
      res.status(200).json({
        message: 'Data inserted for regular sender.',
        insertedData: data
      });
    }
  } catch (error) {
    console.error('Error saving SMS: ', error);
    res.status(500).send('An error occurred');
  }
});

// 메시지에서 정보 추출하는 함수
function parseMessage(message) {
  try {
    // 메시지를 개행 문자 기준으로 분리하여 각 줄의 내용을 배열로 저장
    const lines = message.split('\n').map(line => line.trim());
    console.log('Parsed lines:', lines); // 분리된 줄 로그 출력

    // 각 줄의 데이터를 추출
    const snsInfo = lines[0] || ''; // 첫 번째 줄: 은행 정보와 입금일시
    console.log('SMS INFO:', snsInfo);

    const transactionDate = lines[1] || '';
    console.log('transactionDate:', transactionDate);

    const transactionAccount = lines[2] || ''; // 세 번째 줄: 입금자명
    console.log('Depositor Name:', transactionAccount);

    const depositorName = lines[3] || ''; // 세 번째 줄: 입금자명
    console.log('Depositor Name:', depositorName);

    const transactionType = lines[4] || ''; // 네 번째 줄: 입금 형태
    console.log('Transaction Type:', transactionType);

    const payAmount = lines[5] ? lines[5].replace(/,/g, '') : ''; // 다섯 번째 줄: 금액, 콤마 제거
    console.log('Pay Amount:', payAmount);

    return { snsInfo,transactionDate, transactionAccount, depositorName, transactionType, payAmount };
  } catch (error) {
    // 오류 발생 시 로그 출력
    console.error('Error while parsing message:', error.message);
    console.error('Original Message:', message);
    return { snsInfo: '', transactionDate:'',transactionAccount: '', depositorName: '', transactionType: '', payAmount: '' }; // 기본 빈 값을 반환
  }
  
}




// 강제 로그인
router.post('/force_login', async (req, res) => {
  console.log('[요청정보]/force_login===========================================');
  console.log('Request Body: ', req.body);
  // TODO: 강제 로그인 로직 추가
  res.status(200).send(req.body.row);
});

// 모바일 강제 로그인
router.post('/force_mobile_login', async (req, res) => {
  console.log('[요청정보]/force_mobile_login=====================================');
  console.log('Request Body: ', req.body);
  // TODO: 모바일 강제 로그인 로직 추가
  res.status(200).send(req.body.row);
});

// 회원 정보 보기
router.post('/view_member_info', async (req, res) => {
  console.log('[요청정보]/view_member_info=======================================');
  console.log('Request Body: ', req.body);
  // TODO: 회원 정보 조회 로직 추가
  res.status(200).send(req.body.row);
});

// 환불 내역 보기
router.post('/view_refund_history', async (req, res) => {
  console.log('[요청정보]/view_refund_history====================================');
  console.log('Request Body: ', req.body);
  // TODO: 환불 내역 조회 로직 추가
  res.status(200).send(req.body.row);
});

// 적립금 내역 보기
router.post('/view_reward_history', async (req, res) => {
  console.log('[요청정보]/view_reward_history====================================');
  console.log('Request Body: ', req.body);
  // TODO: 적립금 내역 조회 로직 추가
  res.status(200).send(req.body.row);
});

// 주문 내역 보기
router.post('/view_order_history', async (req, res) => {
  console.log('[요청정보]/view_order_history=====================================');
  console.log('Request Body: ', req.body);
  // TODO: 주문 내역 조회 로직 추가
  res.status(200).send(req.body.row);
});

// 쿠폰 리스트 보기
router.post('/view_coupon_list', async (req, res) => {
  console.log('[요청정보]/view_coupon_list=======================================');
  console.log('Request Body: ', req.body);
  // TODO: 쿠폰 리스트 조회 로직 추가
  res.status(200).send(req.body.row);
});

// 쿠폰 인증
router.post('/verify_coupon', async (req, res) => {
  console.log('[요청정보]/verify_coupon==========================================');
  console.log('Request Body: ', req.body);
  // TODO: 쿠폰 인증 로직 추가
  res.status(200).send(req.body.row);
});

// 입금 내역 보기
router.post('/view_deposit_history', async (req, res) => {
  console.log('[요청정보]/view_deposit_history===================================');
  console.log('Request Body: ', req.body);
  // TODO: 입금 내역 조회 로직 추가
  res.status(200).send(req.body.row);
});

// 구매 내역 보기
router.post('/view_purchase_history', async (req, res) => {
  console.log('[요청정보]/view_purchase_history==================================');
  console.log('Request Body: ', req.body);
  // TODO: 구매 내역 조회 로직 추가
  res.status(200).send(req.body.row);
});

/////=====================================================================//

router.post('/member_join', async (req, res) => {
  console.log('[요청정보]/member_join===========================================');
  console.log('Request Body: ', req.body);

  try {
    const { table,phone_number, name, password, email } = req.body; // 요청 바디에서 정보 추출
    const schema = req.session?.domain || 'crm'; // 세션에서 도메인 가져오기, 기본값은 'crm'
    // 비밀번호 암호화
    const encryptedPassword = encrypt(password, 'ANTS'); // 키 'ANTS'를 사용하여 비밀번호 암호화

    // 사용자 정보 삽입 (id는 자동 증가되므로 명시하지 않음)
    const insertUserQuery = `
    INSERT INTO ${schema}.ants_${table} (phone_number, name, email, password, created_at, updated_at)
    VALUES ($1, $2, $3, $4, NOW(), NOW())
    RETURNING id,phone_number, name, email;
  `;

    const values = [phone_number, name, email, encryptedPassword];
    const result = await pool.query(insertUserQuery, values);

    console.log('User registered successfully: ', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error registering user: ', error);
    res.status(500).send('An error occurred');
  }
});


router.post('/member_delete', async (req, res) => {
  console.log('[요청정보]/===========================================');
  console.log('Request Body: ', req.body);

  try {
   
    const row  = req.body.row;
    const { phone_number, name, password, email } = row; // 요청 바디에서 정보 추출
    const schema = req.session?.domain || 'crm'; // 세션에서 도메인 가져오기, 기본값은 'crm'

    // 삭제할 사용자가 존재하는지 확인
    const checkUserQuery = `
      SELECT id FROM ${schema}.ants_personal_info_mgmt WHERE phone_number = $1 AND name = $2;
    `;
    
    const value = [phone_number,name];
    const sql = formatQuery(checkUserQuery,value);
    console.log(sql);

    const checkUserResult = await pool.query(checkUserQuery, value);
    if (checkUserResult.rows.length === 0) {
      return res.status(404).send('User not found');
    }

    // 사용자 삭제
    const deleteUserQuery = `
      DELETE FROM ${schema}.ants_personal_info_mgmt WHERE phone_number = $1 AND name = $2
      RETURNING id, name, email;
    `;
    const deleteUserResult = await pool.query(deleteUserQuery, value);

    console.log('User deleted successfully: ', deleteUserResult.rows[0]);
    res.status(200).json(deleteUserResult.rows[0]);
  } catch (error) {
    console.error('Error deleting user: ', error);
    res.status(500).send('An error occurred');
  }
});
router.post('/pw_change', async (req, res) => {
  console.log('[요청정보]/pw_change===========================================');
  console.log('Request Body: ', req.body);

  try {
    // 요청 바디가 유효한지 확인
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).send('Invalid JSON format');
    }

    const { id, newPassword } = req.body; // 사용자 ID와 새로운 비밀번호를 요청 바디에서 추출
    const schema = req.session?.domain || 'crm'; // 세션에서 도메인 가져오기, 기본값은 'crm'

    // 비밀번호 암호화
    const encryptedPassword = encrypt(newPassword, 'ANTS'); // 키 'ANTS'를 사용하여 비밀번호 암호화

    const query = `
      UPDATE ${schema}.ants_personal_info_mgmt
      SET password = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, name, email;
    `;

    const values = [encryptedPassword, id];
    const result = await pool.query(query, values);

    // 사용자가 존재하지 않을 경우 처리
    if (result.rows.length === 0) {
      return res.status(404).send('User not found');
    }

    console.log('Password updated successfully: ', result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating password: ', error);
    res.status(500).send('An error occurred');
  }
});

// 사용자 정보 조회 API
router.post('/req_user_info', async (req, res) => {
  console.log('[요청정보]/req_user_info===========================================');
  console.log('Request Body: ', req.body);

  try {
    // 요청 바디가 유효한지 확인
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).send('Invalid JSON format');
    }

    const row  = req.body.row;

    const schema = req.session.domain || 'crm'; // 세션에서 도메인 가져오기, 기본값은 'crm'
    
    const query = `
      SELECT 
        menu_id,
        domain,
        title,
        content,
        created_at,
        updated_at,
        id,
        name,
        password,
        phone_number,
        email,
        new_password,
        confirm_new_password,
        coupon_number,
        coupon_name,
        availability_status,
        available_period,
        bank_name,
        account_number,
        account_holder_name,
        user_name,
        pw_change
       FROM ${schema}.ants_personal_info_mgmt
      WHERE id = $1;
    `;

    const values = [row.id];
    let sql = formatQuery(query, values);
    console.log(sql);
    const result = await pool.query(query, values);

    // 사용자가 존재하지 않을 경우 처리
    if (result.rows.length === 0) {
      return res.status(404).send('User not found');
    }

    console.log('User data retrieved successfully: ', result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error retrieving user data: ', error);
    res.status(500).send('An error occurred');
  }
});

// 코멘트 삭제 라우터
router.delete('/delete_comment/:comment_id', async (req, res) => {
  console.log('[요청정보]/delete_comment===========================================');
  console.log('요청자: ' + req.session.domain);
  console.log('Query Parameters: ', req.params);

  try {
    const { comment_id } = req.params; // URL 매개변수에서 comment_id를 추출
    const schema = req.session.domain || 'crm';

    // 코멘트를 삭제하는 SQL 쿼리
    const query = `
      DELETE FROM ${schema}.board_comments
      WHERE comment_id = $1;
    `;

    const values = [comment_id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).send('Comment not found');
    }

    console.log('Comment deleted successfully: ', comment_id);
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment: ', error);
    res.status(500).send('An error occurred while deleting the comment');
  }
});

// 리플 삭제 라우터
router.delete('/delete_reply/:reply_id', async (req, res) => {
  console.log('[요청정보]/delete_reply===========================================');
  console.log('요청자: ' + req.session.domain);
  console.log('Query Parameters: ', req.params);

  try {
    const { reply_id } = req.params; // URL 매개변수에서 reply_id를 추출
    const schema = req.session.domain || 'crm'; // 스키마 설정 (기본 스키마 설정 가능)

    // 리플을 삭제하는 SQL 쿼리
    const query = `
      DELETE FROM ${schema}.board_comments
      WHERE comment_id = $1
      AND parent_comment_id IS NOT NULL;  -- 대댓글만 삭제하도록 추가
    `;

    const values = [reply_id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).send('Reply not found'); // 대댓글이 없을 때 404 반환
    }

    res.status(200).json({ message: 'Reply deleted successfully' }); // 성공적으로 삭제되었을 때 200 반환
  } catch (error) {
    console.error('Error deleting reply: ', error);
    res.status(500).send('An error occurred while deleting the reply'); // 에러가 발생했을 때 500 반환
  }
});
// 코멘트 수정
router.put('/update_comment', async (req, res) => {
  console.log('[요청정보]/update_comment===========================================');
  console.log('요청자: ' + req.session.domain);
  console.log('Request Body: ', req.body);

  try {
      if (!req.body || typeof req.body !== 'object') {
          return res.status(400).send('Invalid JSON format');
      }

      const { comment_id, content } = req.body;
      const schema = req.session.domain || 'crm';

      const query = `
          UPDATE ${schema}.board_comments
          SET content = $1, updated_at = NOW()
          WHERE comment_id = $2;
      `;

      const values = [content, comment_id];
      const result = await pool.query(query, values);

      if (result.rowCount === 0) {
          return res.status(404).send('Comment not found');
      }

      console.log('Comment updated successfully: ', comment_id);
      res.status(200).send('Comment updated successfully');
  } catch (error) {
      console.error('Error updating comment: ', error);
      res.status(500).send('An error occurred');
  }
});

// 코멘트 입력
router.post('/add_comment', async (req, res) => {
  console.log('[요청정보]/add_comment===========================================');
  console.log('요청자: ' + req.session.domain);
  console.log('Request Body: ', req.body);

  try {
      if (!req.body || typeof req.body !== 'object') {
          return res.status(400).send('Invalid JSON format');
      }

      const { board_id,post_id, content} = req.body;
      const schema = req.session.domain || 'crm';

      const query = `
          INSERT INTO ${schema}.board_comments (board_id,post_id, content, user_id, created_at)
          VALUES ($1, $2, $3, $4,NOW())
          RETURNING comment_id;
      `;

      const values = [board_id,post_id, content, req.session.userId];
      const result = await pool.query(query, values);

      console.log('Comment added successfully: ', result.rows[0]);
      res.status(201).send({ comment_id: result.rows[0].comment_id });
  } catch (error) {
      console.error('Error adding comment: ', error);
      res.status(500).send('An error occurred');
  }
});

// 코멘트 조회
router.get('/get_comments', async (req, res) => {
  console.log('[요청정보]/get_comments===========================================');
  
  // 쿼리 파라미터 로그로 확인
  console.log('Query Parameters: ', req.query);

  try {
      // 쿼리 파라미터에서 post_id와 domain 추출
      const { post_id,board_id} = req.query;

      // post_id 유효성 검사
      if (!post_id) {
          return res.status(400).send('post_id is required');
      }

      // 스키마 설정 (기본 스키마 설정 가능)
      const schema = req.session.domain || 'crm';

         // 기본 코멘트 조회 쿼리 (parent_comment_id가 NULL인 댓글만 조회)
      const commentQuery = `
          SELECT c.comment_id, c.content, c.created_at, c.user_id
          FROM ${schema}.board_comments c
          WHERE c.post_id = $1
          AND c.board_id = $2
          AND c.parent_comment_id IS NULL
          ORDER BY c.created_at ASC;
      `;

      const commentValues = [post_id, board_id];
      const sql = formatQuery(commentQuery, commentValues);
      console.log('코멘트:'+sql);
      const commentResults = await pool.query(commentQuery, commentValues);

      const comments = commentResults.rows;

      // 각 기본 댓글에 대한 대댓글 조회
      for (let comment of comments) {
          const replyQuery = `
              SELECT r.comment_id, r.content, r.created_at, r.user_id
              FROM ${schema}.board_comments r
              WHERE r.parent_comment_id = $1
              ORDER BY r.created_at ASC;
          `;

          const replyValues = [comment.comment_id];
          const replyResults = await pool.query(replyQuery, replyValues);
          comment.replies = replyResults.rows; // 기본 댓글에 대댓글 추가
      }

      // 성공적으로 데이터를 조회했을 때
      console.log('Comments retrieved successfully: ', comments);
      res.status(200).send(comments);

  } catch (error) {
      // 오류 발생 시 로그 출력
      console.log('Error retrieving comments: ', error);
      res.status(500).send('An error occurred');
  }
});
// 리플 추가
router.post('/add_reply', async (req, res) => {
  console.log('[요청정보]/add_reply===========================================');
  console.log('Request Body: ', req.body);

  try {
    const { board_id,post_id,parent_comment_id, content } = req.body;

    if (!parent_comment_id || !content) {
      return res.status(400).send('parent_comment_id, content and author are required');
    }

    const schema = req.session.domain || 'crm';

    
    // 리플 삽입 쿼리
    const insertReplyQuery = `
      INSERT INTO ${schema}.board_comments (board_id,post_id,parent_comment_id, content, user_id, created_at)
      VALUES ($1, $2, $3,$4,$5,NOW())
      RETURNING comment_id;
    `;

    const insertValues = [board_id,post_id,parent_comment_id, content, req.session.userId];
    let sql=formatQuery(insertReplyQuery, insertValues);
    console.log('리플:'+sql);
    const insertResult = await pool.query(insertReplyQuery, insertValues);

    console.log('Reply added successfully: ', insertResult.rows[0]);
    res.status(201).send(insertResult.rows[0]); // 새로 추가된 리플 ID 반환

  } catch (error) {
    console.log('Error adding reply: ', error);
    res.status(500).send('An error occurred while adding reply');
  }
});
// 부분 취소 요청 처리
router.post('/partial_cancel', async (req, res) => {
  const { storeId, tid, cancelId, cancelCause, amt } = req.body;

  // URL-encoded 형식으로 데이터 생성
  const urlencodedData = new URLSearchParams({
    STOREID: storeId,             // 가맹점 번호
    TRAN_TYPE: 'MNUL',            // 거래 타입 기본값
    KIND: '0430',                 // 결제 전문 (부분 취소)
    TID: tid,                     // 페이누리 거래번호
    CANCEL_ID: cancelId,          // 취소자 아이디
    CANCEL_CAUSE: cancelCause,    // 취소 사유
    AMT: amt,                     // 부분 취소 금액
  });

  // 요청 데이터 로그 출력
  console.log('Partial Cancel Request Data:', urlencodedData.toString());

  try {
    const response = await fetch('https://pg.paynuri.com/paymentgateway/cancelPayment.do', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=EUC-KR'
      },
      body: urlencodedData.toString(),
    });

    // 응답 상태 코드와 헤더 로그 출력
    console.log('Response Status:', response.status);
    response.headers.forEach((value, name) => console.log(`Response Header: ${name} = ${value}`));

    const contentType = response.headers.get('content-type');

    // 응답이 JSON 형식인지 확인
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      // 응답 데이터 로그 출력
      console.log('Partial Cancel Response Data:', data);

      if (response.ok && data.REP_CODE === '0000') {
        // 성공적으로 부분 취소된 경우
        res.json({
          message: '부분 취소 성공',
          result: data,
        });
      } else {
        // 부분 취소 실패 처리
        res.status(400).json({
          message: '부분 취소 실패',
          result: data,
        });
      }
    } else {
      // JSON이 아닌 응답 처리
      const text = await response.text();
      console.error('Received non-JSON response:', text);
      res.status(500).json({
        message: '부분 취소 요청 실패 - 서버에서 올바르지 않은 응답을 받았습니다.',
        error: text,
      });
    }
  } catch (error) {
    console.error('Partial Cancellation Error:', error);
    res.status(500).json({
      message: '부분 취소 요청 실패',
      error: error.message,
    });
  }
});

// 리플 수정 라우터
router.put('/update_reply', async (req, res) => {
  console.log('[요청정보] /update_reply ===========================================');
  console.log('요청자: ' + req.session.domain);
  console.log('Request Body: ', req.body);

  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).send('Invalid JSON format');
    }

    const { reply_id, content } = req.body; // 리플 ID와 내용을 요청 본문에서 추출
    const schema = req.session.domain || 'crm'; // 스키마 설정

    // 리플을 수정하는 SQL 쿼리
    const query = `
      UPDATE ${schema}.board_comments
      SET content = $1, updated_at = NOW()
      WHERE comment_id = $2
      AND parent_comment_id IS NOT NULL;  -- 리플(대댓글)만 업데이트하도록 조건 추가
    `;

    const values = [content, reply_id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).send('Reply not found'); // 리플이 없을 때 404 반환
    }

    console.log('Reply updated successfully: ', reply_id);
    res.status(200).send('Reply updated successfully');
  } catch (error) {
    console.error('Error updating reply: ', error);
    res.status(500).send('An error occurred while updating the reply');
  }
});

router.post('/pay_cancel', async (req, res) => {
  const { row } = req.body;

  // row 객체의 모든 속성 키와 값을 출력
  if (row && typeof row === 'object') {
    console.log('Row Object Keys:', Object.keys(row));
    console.log('Row Object Entries:', Object.entries(row));
  } else {
    console.log('Row is not an object or is undefined');
  }

  let { store_id, tid, customer_name } = row;
  console.log('취소 파라미터:' + store_id, tid, customer_name);
  
  // URL-encoded 형식으로 데이터 생성
  const urlencodedData = new URLSearchParams({
    STOREID: store_id,            // 가맹점 번호
    TRAN_TYPE: 'MNUL',           // 거래 타입 기본값
    KIND: '0420',                // 결제 전문 기본값
    TID: tid,                    // 페이누리 거래번호
    CANCEL_ID: customer_name,    // 취소자 아이디
    CANCEL_CAUSE: '고객사정상 취소',   // 취소 사유
  });

  try {
    const response = await fetch('https://pg.paynuri.com/paymentgateway/cancelPayment.do', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=EUC-KR'
      },
      body: urlencodedData.toString(),
    });

    const contentType = response.headers.get('content-type');
    
    // 응답이 JSON 형식인지 확인
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();

      if (response.ok && data.REP_CODE === '0000') {
        // 성공적으로 취소된 경우
        res.json({
          message: '결제 취소 성공',
          result: data,
        });
      } else {
        // 취소 실패 처리
        res.status(400).json({
          message: '결제 취소 실패',
          result: data,
        });
      }
    } else {
      // JSON이 아닌 응답 처리
      const text = await response.text();
      console.error('Received non-JSON response:', text);
      res.status(500).json({
        message: '결제 취소 요청 실패 - 서버에서 올바르지 않은 응답을 받았습니다.',
        error: text,
      });
    }
  } catch (error) {
    console.error('Payment Cancellation Error:', error);
    res.status(500).json({
      message: '결제 취소 요청 실패',
      error: error.message,
    });
  }
});

router.post('/pay', async (req, res) => {
  const paymentData = req.body;

  // 결제 데이터 로깅
  console.log('Received Payment Data:', JSON.stringify(paymentData, null, 2));

  try {
    // 페이누리 결제 요청 URL
    const response = await fetch('https://pg.paynuri.com/paymentgateway/app/mnul/payment.do', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Charset': 'EUC-KR',
      },
      body: JSON.stringify({
        STOREID: paymentData.storeId,
        CRYPTO_KEY: paymentData.cryptoKey,
        TRAN_NO: paymentData.tranNo,
        PRODUCT_TYPE: paymentData.productType,
        TAX_FREE_CD: paymentData.taxFreeCd,
        BILL_TYPE: paymentData.billType,
        AMT: paymentData.amt,
        CARD_NO: paymentData.cardNo,
        EXPIRATION_DATE: paymentData.expirationDate,
        INSTALL: paymentData.install,
        TRAN_TYPE: 'MNUL',
        KIND: '0200',
        ENC_YN: 'N',
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Payment Successful:', JSON.stringify(data, null, 2)); // 결제 성공 시 응답 로그
      res.json(data); // 페이누리 결제 성공 응답 반환
    } else {
      console.error('Payment Failed:', JSON.stringify(data, null, 2)); // 결제 실패 시 오류 로그
      res.status(500).json({ message: '결제 실패', error: data });
    }
  } catch (error) {
    console.error('Payment Error:', error.message);
    res.status(500).json({ message: '결제 실패', error: error.message });
  }
});

router.post("/updateStdOptionOrder", async (req, res) => {
  const schema = req.session.domain || 'crm'; 
  const query = `
    UPDATE ${schema}."StandardInfoDtl"
    SET code_idx = $1
    WHERE code_group = $2 AND code_option = $3 AND code_value = $4
    RETURNING *
  `;
  const params = [req.body.code_idx, req.body.code_group, req.body.option_key, req.body.option_value];
  let sql= formatQuery(query,params);
  console.log('기준정보상세 업데이트'+ sql)
  try {
    const result = await pool.query(query, params);
    if (result.rowCount > 0) {
      res.send(result.rows[0]); 
    } else {
      res.status(404).send('해당 항목을 찾을 수 없습니다.');
    }
  } catch (error) {
    res.status(500).send('쿼리 실행 중 오류가 발생했습니다.');
  }
});
//환불접수
router.post('/order_refund', async (req, res) => {
  console.log('[요청정보]/order_refund===========================================');
  console.log('요청자: ' + req.body.domain);
  
  // req.body 데이터 로그로 확인
  console.log('Request Body: ', req.body);

  try {
      // JSON 데이터 유효성 검증
      if (!req.body || typeof req.body !== 'object') {
          return res.status(400).send('Invalid JSON format');
      }

      const { row, parameters } = req.body;
      const {id,title, created_at , user_name,order_state,movie_title  } = row;
      // 쿼리에서 사용할 스키마 설정
      const schema = req.session.domain || 'crm_pinecinema';

      const query = `
         INSERT INTO ${schema}."ants_refund_req" 
         (title, created_at, user_name,refund_status,order_info,order_number,refund_req_date)
         VALUES ($1, $2, $3, $4, $5, $6,$7);
      `;
      //const values = [issue_cnt, fran_type];
      const values = [title, created_at,user_name, order_state,movie_title,id, created_at ];
      // 쿼리 실행 전에 값 확인
      const formattedQuery =formatQuery(query, values);
      console.log('쿠폰통계:', formattedQuery);
      // 쿼리 실행
      const results = await pool.query(query, values);
      
      // 성공적으로 데이터를 조회했을 때
      console.log('Select successful: ', results.rows);
      res.status(200).send(results.rows);

  } catch (error) {
      // 오류 발생 시 로그 출력
      console.log('Select error: ', error);
      res.status(500).send('An error occurred');
  }
});

//취소접수
router.post('/order_cancel', async (req, res) => {
  console.log('[요청정보]/order_cancel===========================================');
  console.log('요청자: ' + req.body.domain);

  // req.body 데이터 로그로 확인
  console.log('요청취소: ', req.body);

  try {
      // JSON 데이터 유효성 검증
      if (!req.body || typeof req.body !== 'object') {
          return res.status(400).send('Invalid JSON format');
      }

      const { row, parameters } = req.body;
      const { title, content, id, user_name, created_at } = row;

      // 쿼리에서 사용할 스키마 설정
      const schema = req.session.domain || 'crm_pinecinema';

      const query = `
         INSERT INTO ${schema}."ants_cancel_list" 
         (title, content, order_number, user_name, order_cancel_state, order_cancel_date) 
         VALUES ($1,$2 , $3, $4, $5, $6);
      `;

      // 필요한 값들을 배열로 정리
      const values = [title, content, id, user_name, '대기', created_at];
      
      // 쿼리 실행 전에 값 확인
      console.log('Formatted Query:', query);
      console.log('Values:', values);
      
      // 쿼리 실행
      const results = await pool.query(query, values);
      
      // 성공적으로 데이터를 삽입했을 때
      console.log('Insert successful: ', results.rows);
      res.status(200).send(results.rows);

  } catch (error) {
      // 오류 발생 시 로그 출력
      console.log('Insert error: ', error);
      res.status(500).send('An error occurred');
  }
});



//사고접수
router.post('/accident_reg', async (req, res) => {
  console.log('[요청정보]/accident_reg===========================================');
  console.log('요청자: ' + req.body.domain);
  
  // req.body 데이터 로그로 확인
  console.log('Request Body: ', req.body);

  try {
      // JSON 데이터 유효성 검증
      if (!req.body || typeof req.body !== 'object') {
          return res.status(400).send('Invalid JSON format');
      }

      const { row, parameters } = req.body;
      const {title, content, user_name, user_additional_options, order_detail, created_at} = row;
      // 쿼리에서 사용할 스키마 설정
      const schema = req.body.domain || 'crm_pinecinema';

      
      const query = `
         INSERT INTO crm_pinecinema."ants_accident_list" (title, content, order_user_name, order_detail, order_type, order_state, order_accident_date) VALUES ($1, $2, $3, $4, $5, $6, $7);
      `;

      //const values = [issue_cnt, fran_type];
      const values = [title, content, user_name, user_additional_options , order_detail , '대기', created_at];
      // 쿼리 실행 전에 값 확인
      const formattedQuery =formatQuery(query, values);
      console.log('쿠폰통계:', formattedQuery);
      // 쿼리 실행
      const results = await pool.query(query, values);
      
      // 성공적으로 데이터를 조회했을 때
      console.log('Select successful: ', results.rows);
      res.status(200).send(results.rows);

  } catch (error) {
      // 오류 발생 시 로그 출력
      console.log('Select error: ', error);
      res.status(500).send('An error occurred');
  }
});

router.post('/statistic_down', async (req, res) => {
  console.log('[요청정보]/statistic_down===========================================');
  console.log('요청자: ' + req.body.domain);
  
  // req.body 데이터 로그로 확인
  console.log('Request Body: ', req.body);

  try {
      // JSON 데이터 유효성 검증
      if (!req.body || typeof req.body !== 'object') {
          return res.status(400).send('Invalid JSON format');
      }

      const { row, parameters } = req.body;
      // 쿼리에서 사용할 스키마 설정
      const schema = req.body.domain || 'crm_pinecinema';

      const query = `
         SELECT 
              B.fran_name,
              A.fran_type,
              A.coupon_type,
              TO_CHAR(a.reg_exp_period_e, 'YYYY-MM-DD') AS reg_exp_period_e,
              A.coupon_cnt,
              A.cert_cnt,
              A.cert_rate,
              A.used_cnt,
              A.booking_rate as used_rate,
              A.issue_cnt
          FROM
          crm_pinecinema.ants_coupon_set A
          INNER JOIN crm_pinecinema.ants_franchise_list B
           ON B.fran_code = A.fran_type
      `;

      //const values = [issue_cnt, fran_type];
      const values = [];
      // 쿼리 실행 전에 값 확인
      const formattedQuery =formatQuery(query, values);
      console.log('쿠폰통계:', formattedQuery);
      // 쿼리 실행
      const results = await pool.query(query, values);
      
      // 성공적으로 데이터를 조회했을 때
      console.log('Select successful: ', results.rows);
      res.status(200).send(results.rows);

  } catch (error) {
      // 오류 발생 시 로그 출력
      console.log('Select error: ', error);
      res.status(500).send('An error occurred');
  }
});


router.post('/select_coupon', async (req, res) => {
  console.log('[요청정보]/select_coupon===========================================');
  console.log('요청자: ' + req.body.domain);
  
  // req.body 데이터 로그로 확인
  console.log('Request Body: ', req.body);

  try {
      // JSON 데이터 유효성 검증
      if (!req.body || typeof req.body !== 'object') {
          return res.status(400).send('Invalid JSON format');
      }

      const { row, parameters } = req.body;
      const {issue_cnt,fran_type} = row;
      // 쿼리에서 사용할 스키마 설정
      const schema = req.body.domain || 'crm_pinecinema';

      const query = `
          SELECT 
              A.id, 
			        --TO_CHAR(B.created_at, 'YYYY-MM-DD') AS coupon_created_at,
			        B.coupon_code,
			        B.fran_type, 
			        --B.coupon_type,
			        --A.coupon_cnt, 
              --TO_CHAR(B.reg_exp_period_s, 'YYYY-MM-DD') AS reg_exp_period_s,
			        TO_CHAR(B.reg_exp_period_e, 'YYYY-MM-DD') AS reg_exp_period_e,
              --B.reg_exp_period,
              --A.time_group, 
			        --A.ticketing_limited, 
			        --A.max_order_cnt,
			        --A.min_order_cnt, 
              A.issue_cnt
          FROM 
              ${schema}.ants_coupon_set A
          INNER JOIN 
              ${schema}.ants_coupon_total B
          ON 
              B.fran_type = A.fran_type
          AND 
              B.coupon_code LIKE A.fran_type || '-' || LPAD(A.issue_cnt::TEXT, 4, '0') || '-%'
          WHERE 
              A.issue_cnt = $1
          AND 
              A.fran_type = $2;
      `;

      const values = [issue_cnt, fran_type];

      // 쿼리 실행 전에 값 확인
      console.log('Query Values: ', values);

      // 쿼리 실행
      const results = await pool.query(query, values);
      
      // 성공적으로 데이터를 조회했을 때
      console.log('Select successful: ', results.rows);
      res.status(200).send(results.rows);

  } catch (error) {
      // 오류 발생 시 로그 출력
      console.log('Select error: ', error);
      res.status(500).send('An error occurred');
  }
});
router.post('/insert_member', async (req, res) => {
  console.log('[요청정보]/insert_member===========================================');
  console.log('요청자:' + req.body.domain);
  Object.entries(req.body).forEach(([key, value]) => {
      console.log(`${key}: ${value !== undefined ? value : 'null'}`);
  });


  const {
      name, site_name, birth_date, mobile_phone, registration_date, grade, address,
      detailed_address, withdrawal_date, retained_points, dealer_stop, user_id, nickname,
      sex, real_name, auth_mobile_phone, real_name_email, email_confirmed, di, phone,
      parent_user_id, user_key, os, push_key, consultation_content, partner_code, member_grade,
      purchase_grade, franchise_name, recommender_code, profile_picture
  } = req.body;

  // req.session.domain 값이 존재하면 그 값을 사용하고, 그렇지 않으면 'crm' 스키마를 사용
  const schema = req.body.domain || 'crm';

  const query = `
      INSERT INTO ${schema}.member_all_list_tb (
          name, site_name, birth_date, mobile_phone, registration_date, grade, address,
          detailed_address, withdrawal_date, retained_points, dealer_stop, user_id, nickname,
          sex, real_name, auth_mobile_phone, real_name_email, email_confirmed, di, phone,
          parent_user_id, user_key, os, push_key, consultation_content, partner_code, member_grade,
          purchase_grade, franchise_name, recommender_code, profile_picture
      ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
          $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31
      ) RETURNING *;
  `;

  const values = [
      name, site_name, birth_date, mobile_phone, registration_date, grade, address,
      detailed_address, withdrawal_date, retained_points, dealer_stop, user_id, nickname,
      sex, real_name, auth_mobile_phone, real_name_email, email_confirmed, di, phone,
      parent_user_id, user_key, os, push_key, consultation_content, partner_code, member_grade,
      purchase_grade, franchise_name, recommender_code, profile_picture
  ];

  try {
      const results = await pool.query(query, values);
      console.log('Insert successful========================================================: ' + new Date().toISOString());
      res.status(201).send(results.rows[0]);
  } catch (error) {
      console.log('Insert error: ' + error);
      res.status(500).send('An error occurred');
  }
});

router.post('/create_board', async (req, res) => {
  console.log('[요청정보]/create_board===========================================');
  console.log('요청자:' + req.body.domain);
  Object.entries(req.body).forEach(([key, value]) => {
      console.log(`${key}: ${value !== undefined ? value : 'null'}`);
  });
  const {
      board_id, board_site_id, board_category, board_title, board_list_auth, board_read_auth, board_write_auth, board_comment, board_description, columns
  } = req.body;

  // req.session.domain 값이 존재하면 그 값을 사용하고, 그렇지 않으면 'crm' 스키마를 사용
  const schema = req.session.domain || 'crm';
  const tableName = `ants_${board_id}`;
  const fullTableName = `${schema}.${tableName}`;

  // 게시판 테이블 생성 쿼리
  const createBoardTableQuery = `
  CREATE TABLE ${fullTableName} (
      id SERIAL PRIMARY KEY,
      domain TEXT NOT NULL DEFAULT '-',
      title TEXT NOT NULL DEFAULT '-',
      content TEXT DEFAULT '-',
      upload TEXT DEFAULT '-',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  `;

  // 컬럼을 테이블에 추가하는 쿼리
  const addColumnQueries = columns.map(column => {
      const columnType = column.columnType === 'boolean' ? 'BOOLEAN' :
                         column.columnType === 'number' ? 'INT' :
                         column.columnType === 'date' ? 'DATE' :
                         'VARCHAR(255)';
      return `
          ALTER TABLE ${fullTableName} 
          ADD COLUMN "${'ants_' + column.columnName}" ${columnType} ${column.isRequired ? 'NOT NULL' : ''};
      `;
  });

  // 트리거 함수 및 트리거 생성 쿼리
  const createTriggerFunctionQuery = `
      CREATE OR REPLACE FUNCTION ${schema}.set_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
  `;

  const createTriggerQuery = `
      CREATE TRIGGER set_timestamp
      BEFORE UPDATE ON ${fullTableName}
      FOR EACH ROW
      EXECUTE FUNCTION ${schema}.set_updated_at();
  `;

  // 게시판 정보를 AntsBoardInfo 테이블에 삽입하는 쿼리
  const insertBoardInfoQuery = `
      INSERT INTO ${schema}."AntsBoardInfo" (board_id,board_site_id,board_title, board_category, board_list_auth, board_read_auth, board_write_auth, board_comment, board_description)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8 ,$9);
  `;

  try {
      // 트랜잭션 시작
      await pool.query('BEGIN');
      
      // 게시판 테이블 생성
      console.log(`Executing query: ${createBoardTableQuery}`);
      await pool.query(createBoardTableQuery);
      
      // 컬럼 추가
      for (const query of addColumnQueries) {
          await pool.query(query);
      }

      // 트리거 함수 및 트리거 생성
      await pool.query(createTriggerFunctionQuery);
      await pool.query(createTriggerQuery);

      // 게시판 정보 삽입
      await pool.query(insertBoardInfoQuery, [board_id,board_site_id,board_title, board_category, board_list_auth, board_read_auth, board_write_auth, board_comment, board_description]);

      // 트랜잭션 커밋
      await pool.query('COMMIT');
      console.log('create_board 응답 성공========================================================: ' + new Date().toISOString());
      res.status(201).send({ message: 'Board created successfully' });
  } catch (error) {
      await pool.query('ROLLBACK');
      res.status(500).send('An error occurred');
  }
});



router.get('/get_table_columns', async (req, res) => {
    console.log('요청자:get_table_columns'+req.session.domain);
    const { tableName } = req.query;

    if (!tableName) {
        return res.status(400).send('Table name is required');
    }

    // 테이블명이 스키마를 포함하도록 수정
    const tableParts = tableName.split('.');
    const schema = tableParts.length > 1 ? tableParts[0] : 'public';
    const table = tableParts.length > 1 ? tableParts[1] : tableParts[0];

    // 컬럼명을 조회하는 쿼리
    const getColumnNamesQuery = `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = $1 AND table_name = $2;
    `;

    try {
        const columnResults = await pool.query(getColumnNamesQuery, [schema, table]);
        const columns = columnResults.rows.map(row => row.column_name);

        // 조회된 컬럼명을 기반으로 모든 행을 가져오는 쿼리
        const getAllRowsQuery = `
            SELECT *
            FROM ${schema}.${table};
        `;

        const rowResults = await pool.query(getAllRowsQuery);
        const rows = rowResults.rows;

        res.status(200).json({
            columns,
            rows
        });
        console.log('요청자:get_table_columns'+req.session.domain);
    } catch (error) {
        console.error('Error fetching table columns or rows: ', error);
        res.status(500).send('An error occurred while fetching table columns or rows');
    }
});



router.get('/getBoardTables', async (req, res) => {
    console.log('요청자 : getBoardTables'+req.session.domain);
  // URL 쿼리스트링에서 category 파라미터 값 가져오기
  const category = req.query.category;

  // req.session.domain 값이 존재하면 그 값을 사용하고, 그렇지 않으면 'crm' 스키마를 사용
  const schema = req.session.domain || 'crm';

  const getBoardTablesQuery = `
      SELECT board_id, board_title 
      FROM ${schema}."AntsBoardInfo" 
      WHERE board_category LIKE $1
      ORDER BY board_idx;
  `;

  try {
      // 쿼리 실행, 매개변수화된 쿼리를 사용하여 SQL 주입 방지
      const result = await pool.query(getBoardTablesQuery, [category]);
      const tables = result.rows.map(row => ({
          boardId: row.board_id,
          boardTitle: row.board_title
      }));

      res.status(200).json(tables);
  } catch (error) {
      console.log('Get board tables error: ' + error);
      res.status(500).send('An error occurred');
  }
});

// /request/searchBoards 엔드포인트 정의
router.get('/searchBoards', async (req, res) => {
    console.log('요청자: searchBoards');
    const { keyword } = req.query;
  
    const schema = req.session?.domain || 'crm';
  
    const searchBoardsQuery = `
      SELECT board_id
      FROM ${schema}."AntsBoardInfo"
      WHERE board_id ILIKE $1;
    `;
  
    try {
      console.log(`Executing query: ${searchBoardsQuery.replace(/\$\d/g, (placeholder, index) => {
        const params = [`%${keyword}%`];
        return `'${params[index]}'`;
      })}`);
      const result = await pool.query(searchBoardsQuery, [`%${keyword}%`]);
      console.log('Query executed successfully.');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error searching boards:', error);
      res.status(500).send('An error occurred while searching boards');
    }
  });

  // /request/searchColumns 엔드포인트 정의
    router.get('/searchColumns', async (req, res) => {
    console.log('요청자: searchColumns');
    const { boardId, keyword } = req.query;
  
    const schema = req.session?.domain || 'crm';
    const tableName = `${schema}.ants_${boardId}`;
  
    const searchColumnsQuery = `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = $1 AND table_name = $2 AND column_name ILIKE $3;
    `;
  
    try {
      console.log(`Executing query: ${searchColumnsQuery.replace(/\$\d/g, (placeholder, index) => {
        const params = [schema, `ants_${boardId}`, `%${keyword}%`];
        return `'${params[index]}'`;
      })}`);
      const result = await pool.query(searchColumnsQuery, [schema, `ants_${boardId}`, `%${keyword}%`]);
      console.log('Query executed successfully.');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error searching columns:', error);
      res.status(500).send('An error occurred while searching columns');
    }
  });

  router.get('/getTableList', async (req, res) => {
    console.log('[요청정보]/getTableList===========================================');

    try {
      // req.session.domain 값이 존재하면 그 값을 사용하고, 그렇지 않으면 'crm' 스키마를 사용
      const schema = req.session.domain || 'crm';

      // Query to get all table names in the specified schema that start with 'ants'
      //그룹코드에서 사용하기 위해 별칭선언
      const getTablesQuery = `
          SELECT table_name as std_group_code
          FROM information_schema.tables
          WHERE table_schema = $1 AND table_name LIKE 'ants_%'
      `;

      const queryParameters = [schema];
      console.log(`Executing query: ${getTablesQuery.replace(/\$\d/g, (placeholder) => {
          const index = parseInt(placeholder.substring(1)) - 1;
          return `'${queryParameters[index]}'`;
      })}`);

      // Execute query
      const tableNamesResult = await pool.query({
          text: getTablesQuery,
          values: queryParameters
      });

      console.log('Query result:', tableNamesResult.rows); // 쿼리 결과 로그 출력
      console.log('getTableList==============================================');
      // Return the table names as JSON response
      res.json(tableNamesResult.rows);
  } catch (error) {
      console.error('Error fetching table names:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET 요청: board_id로 AntsBoardInfo 테이블에서 action_info 컬럼의 JSON 값을 받아오기
router.get('/getActionInfo', async (req, res) => {
  console.log('[요청정보]/api/get_action_info===========================================');
  
  try {
    const schema = req.session.domain || 'crm';
    const { board_id } = req.query;
    
    // Query to get action_info from the specified schema
    const getActionInfoQuery = `
      SELECT action_info
      FROM ${schema}."AntsBoardInfo"
      WHERE board_id = $1
    `;

    const queryParameters = [board_id];
    console.log(`Executing query: ${getActionInfoQuery.replace(/\$\d/g, (placeholder) => {
      const index = parseInt(placeholder.substring(1)) - 1;
      return `'${queryParameters[index]}'`;
    })}`);

    // Execute query
    const result = await pool.query({
      text: getActionInfoQuery,
      values: queryParameters
    });

    console.log('Query executed successfully.');
    console.log('Query result:', result.rows); // 쿼리 결과 로그 출력

    if (result.rows.length > 0) {
      res.json({ action_info: result.rows[0].action_info });
    } else {
      res.status(404).json({ error: 'Board not found' });
    }
  } catch (error) {
    console.error('Error fetching action info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/saveActionInfo', async (req, res) => {
  console.log('[요청정보]/api/saveActionInfo===========================================');

  try {
    const schema = req.session.domain || 'crm';
    const { board_id, action_info } = req.body;

    // Convert action_info object to JSON string
    const actionInfoJson = JSON.stringify(action_info);

    // Query to update action_info in the specified schema
    const updateActionInfoQuery = `
      UPDATE ${schema}."AntsBoardInfo"
      SET action_info = $1
      WHERE board_id = $2
    `;

  // Values to bind in the query
  const queryParameters = [actionInfoJson, board_id];

  // Log the actual query and parameters
  const boundQuery = updateActionInfoQuery
    .replace('$1', `'${queryParameters[0]}'`)
    .replace('$2', `'${queryParameters[1]}'`);

  console.log('Executing query with values:', boundQuery);

    // Execute query
    await pool.query({
      text: updateActionInfoQuery,
      values: queryParameters
    });

    res.status(200).json({ message: 'Action info updated successfully' });
  } catch (error) {
    console.error('Error updating action info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/saveAction', async (req, res) => {
  console.log('[요청정보]/api/save-action===========================================');

  try {
    const schema = req.session.domain || 'crm';
    const { query, values } = req.body;
    console.log('초기값:'+values);
    // 변환된 쿼리 및 값 설정
    const { formattedQuery, formattedValues } = formatQueryAndValues(query, values, schema);
    
    console.log(`Executing query: ${formattedQuery}`);
    console.log(`With values: ${JSON.stringify(formattedValues)}`);

    // Execute the query
    await pool.query({
      text: formattedQuery,
      values: formattedValues
    });

    res.status(200).json({ message: 'Action executed successfully' });
  } catch (error) {
    console.error('Error executing action:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


const formatQueryAndValues = (query, values, schema) => {
  let index = 1;
  const formattedValues = values;
  const formattedQuery = query.replace(/:([a-zA-Z_]+)/g, (match, p1) => {
    return `$${index++}`;
  }).replace(/AntsBoardInfo/g, `${schema}."AntsBoardInfo"`);

  console.log('변환된 쿼리:', formattedQuery);
  console.log('변환된 값:', formattedValues);

  return { formattedQuery, formattedValues };
};


router.get('/get_all_boards', async (req, res) => {
    console.log('[요청정보]/get_all_boards===========================================');
    console.log('쿼리:', req.query.search);
    Object.entries(req.body).forEach(([key, value]) => {
        console.log(`${key}: ${value !== undefined ? value : 'null'}`);
    });

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const search = req.query.search || ''; // 검색어 추가

        // req.session.domain 값이 존재하면 그 값을 사용하고, 그렇지 않으면 'crm' 스키마를 사용
        const schema = req.session.domain || 'crm';

        // Query to get paginated board info and corresponding table names
        const getTableNamesQuery = `
            SELECT 
                A.board_id, 
                A.board_site_id,
                A.board_title, 
                A.board_category, 
                A.board_list_auth, 
                A.board_read_auth, 
                A.board_write_auth, 
                A.board_comment, 
                A.board_description,
                A.board_columns,
                A.board_idx,
                B.table_name
            FROM 
                ${schema}."AntsBoardInfo" A
            LEFT JOIN 
                information_schema.tables B
            ON 
                B.table_schema = $1 
                AND B.table_name = CONCAT('ants_', A.board_id)
            WHERE 
                A.board_title ILIKE $4 OR A.board_id ILIKE $4
            ORDER BY 
                A.board_id
            LIMIT $2 OFFSET $3;
        `;

        const queryParameters = [schema, limit, offset, `%${search}%`];
        const tableNamesResult = await pool.query({
            text: getTableNamesQuery,
            values: queryParameters
        });

        const boardsInfo = tableNamesResult.rows;
        const boardData = [];

        for (const board of boardsInfo) {
            const tableName = `${schema}.${board.table_name}`;

            if (!board.table_name) {
                boardData.push({
                    ...board,
                    columns: [],
                    sampleRows: []
                });
                continue;
            }

            // Query to get column names for each table
            const getColumnNamesQuery = `
                SELECT column_name
                FROM information_schema.columns
                WHERE table_schema = $1 AND table_name = $2;
            `;
            const columnParameters = [schema, board.table_name];
            // console.log(`Executing getColumnNamesQuery: ${getColumnNamesQuery.replace(/\$\d/g, (placeholder) => {
            //     const index = parseInt(placeholder.substring(1)) - 1;
            //     return `'${columnParameters[index]}'`;
            // })}`);

            const columnResults = await pool.query({
                text: getColumnNamesQuery,
                values: columnParameters
            });

            const columns = columnResults.rows.map(row => row.column_name);

            // Query to get a sample row from the table
            const getSampleRowQuery = `
                SELECT *
                FROM ${tableName}
                LIMIT 2;
            `;
            // console.log(`Executing getSampleRowQuery: ${getSampleRowQuery}`);

            const sampleRowResults = await pool.query(getSampleRowQuery);

            const sampleRows = sampleRowResults.rows;

            boardData.push({
                ...board,
                columns,
                sampleRows
            });
        }

        const totalBoardCountQuery = `
            SELECT COUNT(*)
            FROM ${schema}."AntsBoardInfo"
            WHERE board_title ILIKE $1 OR board_id ILIKE $1;
        `;
        const totalCountParameters = [`%${search}%`];
        console.log(`Executing total count query: ${totalBoardCountQuery.replace(/\$\d/g, (placeholder) => {
            const index = parseInt(placeholder.substring(1)) - 1;
            return `'${totalCountParameters[index]}'`;
        })}`);

        const totalBoardCountResult = await pool.query({
            text: totalBoardCountQuery,
            values: totalCountParameters
        });

        console.log('Total count result:', totalBoardCountResult.rows);  // 총 개수 결과 로그 출력

        const totalBoardCount = parseInt(totalBoardCountResult.rows[0].count, 10);

        // Return paginated board data and total board count
        res.status(200).json({ boardData, total: totalBoardCount });
    } catch (error) {
        console.error('Error fetching board data: ', error);
        res.status(500).send('An error occurred while fetching board data');
    }
});




// /getControlInfo 엔드포인트 정의
// Helper function to interpolate the SQL query with parameters
function formatQuery(query, params) {
  return query.replace(/\$(\d+)/g, (_, index) => {
    const param = params[index - 1];
    return typeof param === 'string' ? `'${param}'` : param;
  });
}

// /getControlInfo 엔드포인트 정의
router.get('/getControlInfo', async (req, res) => {
  console.log('요청자: getControlInfo============================================================================');
  
  const { boardId, columnId } = req.query;
  
  const schema = req.session?.domain || 'crm';
  console.log("getControl Info : " + schema);

  // 기본 쿼리
  let getControlInfoQuery = `
    SELECT board_id, column_id, control_type, control_size, bind_key, bind_type, bind_option, bind_display, root_column, where_column
    FROM ${schema}."AntsControlInfo"
  `;

  // 조건을 위한 매개변수 배열
  const queryParams = [];

  // 검색 조건 추가
  if (boardId || columnId) {
    getControlInfoQuery += ' WHERE';
    if (boardId) {
      queryParams.push(`%${boardId}%`);
      getControlInfoQuery += ` board_id ILIKE $${queryParams.length}`;
    }
    if (columnId) {
      if (boardId) {
        getControlInfoQuery += ' AND';
      }
      queryParams.push(`%${columnId}%`);
      getControlInfoQuery += ` column_id ILIKE $${queryParams.length}`;
    }
  }

  // Add ORDER BY clause after WHERE conditions
  getControlInfoQuery += ' ORDER BY board_id, column_id';

  // Log the constructed query with parameters
  console.log('Executing Query:', formatQuery(getControlInfoQuery, queryParams));

  try {
    const result = await pool.query(getControlInfoQuery, queryParams);

    const controlInfo = result.rows;

    res.status(200).json(controlInfo);
  } catch (error) {
    console.error('Error fetching control info:', error);
    res.status(500).send('An error occurred while fetching control info');
  }
});


router.post('/updateControlInfo', async (req, res) => {
  console.log('요청: updateControlInfo=================================================');
  console.log('컬럼 정보 업데이트 시작');
  const controlData = req.body;
  
  // req.session.domain 값이 존재하면 그 값을 사용하고, 그렇지 않으면 'crm' 스키마를 사용
  const schema = req.session?.domain || 'crm';
  
  try {
    // 트랜잭션 시작
    await pool.query('BEGIN');

    // 각 컨트롤 데이터를 처리
    for (const control of controlData) {
      const updateControlInfoQuery = `
        INSERT INTO ${schema}."AntsControlInfo" (board_id, column_id, control_type, control_size, bind_key, bind_type, bind_option, bind_display, root_column, where_column)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (board_id, column_id)
        DO UPDATE SET 
          board_id = EXCLUDED.board_id,
          control_type = EXCLUDED.control_type,
          control_size = EXCLUDED.control_size,
          bind_key = EXCLUDED.bind_key,
          bind_type = EXCLUDED.bind_type,
          bind_option = EXCLUDED.bind_option,
          bind_display = EXCLUDED.bind_display,
          root_column = EXCLUDED.root_column,
          where_column = EXCLUDED.where_column;
      `;
      let queryParams =  [
        control.board_id,
        control.column_id, 
        control.control_type, 
        control.control_size, 
        control.bind_key, 
        control.bind_type, 
        control.bind_option, 
        control.bind_display, 
        control.root_column,
        control.where_column];
      console.log('실행쿼리:', formatQuery(updateControlInfoQuery, queryParams));

      // 쿼리 실행
      await pool.query(updateControlInfoQuery, queryParams);
    }

    // 트랜잭션 커밋
    await pool.query('COMMIT');
    res.status(200).send('Control info updated successfully');
  } catch (error) {
    // 트랜잭션 롤백
    await pool.query('ROLLBACK');
    console.error('Error updating control info:', error);
    res.status(500).send('An error occurred while updating control info');
  }
});

router.post('/delete_boards', async (req, res) => {
    console.log('요청자:/delete_boards/' + req.session.domain);
    console.log('[요청정보]/delete_boards===========================================');
    Object.entries(req.body).forEach(([key, value]) => {
        console.log(`${key}: ${value !== undefined ? value : 'null'}`);
    });
    console.log('/delete_boards====================================================');

    const { boardIds } = req.body;

    // req.session.domain 값이 존재하면 그 값을 사용하고, 그렇지 않으면 'crm' 스키마를 사용
    const schema = req.session.domain || 'crm';

    try {
        // 트랜잭션 시작
        await pool.query('BEGIN');

        for (const boardId of boardIds) {
            // 테이블 이름을 동적으로 생성
            const tableName = `ants_${boardId}`;
            const fullTableName = `${schema}.${tableName}`;

            // 게시판 테이블 삭제 쿼리
            const dropBoardTableQuery = `DROP TABLE IF EXISTS ${fullTableName};`;

            // 게시판 정보 삭제 쿼리
            const deleteBoardInfoQuery = `
                DELETE FROM ${schema}."AntsBoardInfo"
                WHERE board_id = $1;
            `;

            // 게시판 테이블 삭제
            console.log(`Executing query: ${dropBoardTableQuery}`);
            await pool.query(dropBoardTableQuery);

            // 게시판 정보 삭제
            console.log(`Executing query: ${deleteBoardInfoQuery}`);
            await pool.query(deleteBoardInfoQuery, [boardId]);
        }

        // 트랜잭션 커밋
        await pool.query('COMMIT');

        console.log('Board deletion successful: ' + new Date().toISOString());
        res.status(200).send({ message: 'Boards deleted successfully' });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.log('Delete board error: ' + error);
        res.status(500).send('An error occurred');
    }
});


router.get('/boardList', async (req, res) => {
    console.log('요청자/boardList:' + req.session.domain);
  const { page, limit, table } = req.query;
  const schema = req.session.domain || 'crm'; // 동적으로 스키마 설정

  try {
    // Calculate the offset for pagination
    const offset = (page - 1) * limit;

    // Fetch the column information for the specified table from the Information schema
    const columnsQuery = 'SELECT column_name FROM information_schema.columns WHERE table_name = $1 AND table_schema = $2';
    const columnsResult = await pool.query(columnsQuery, [table, schema]);

    // Fetch the data from the specified table with pagination
    const dataQuery = `SELECT * FROM ${schema}."${table}" LIMIT $1 OFFSET $2`;
    const dataResult = await pool.query(dataQuery, [parseInt(limit), parseInt(offset)]);

    // Fetch the total count of rows
    const countQuery = `SELECT COUNT(*) AS total FROM ${schema}."${table}"`;
    const countResult = await pool.query(countQuery);

    // Prepare the response
    const data = {
      posts: dataResult.rows,
      total: countResult.rows[0].total,
      columns: columnsResult.rows.map(row => row.column_name) // Column names added to the response
    };

    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  



router.post('/saveColumns', async (req, res) => {
  console.log('요청자:/saveColumns/:'+req.session.domain);

  const { boardId, columns, columnIds } = req.body;
  const schema = req.session.domain || 'crm'; // 동적으로 스키마 설정
  Object.entries(req.body).forEach(([key, value]) => {
      console.log(`${key}: ${JSON.stringify(value)}`);
  });

  const client = await pool.connect();

  try {
      await client.query('BEGIN');
      console.log('Transaction begun');

      // Fetch the current columns from AntsBoardInfo
      const fetchCurrentColumnsQuery = `
          SELECT board_columns
          FROM ${schema}."AntsBoardInfo"
          WHERE board_id = $1
      `;
      const result = await client.query(fetchCurrentColumnsQuery, [boardId]);
      const currentColumns = result.rows[0]?.board_columns ? result.rows[0].board_columns.split(',') : [];
      console.log(`Current columns for board ${boardId}: ${currentColumns.join(',')}`);

      // Combine current columns with new column IDs
      const updatedColumnIds = [...new Set([...currentColumns, ...columnIds])];
      console.log(`Updated column IDs for board ${boardId}: ${updatedColumnIds.join(',')}`);

      // Update AntsBoardInfo with the updated column IDs
      const updateBoardQuery = `
          UPDATE ${schema}."AntsBoardInfo"
          SET board_columns = $1
          WHERE board_id = $2
      `;
      await client.query(updateBoardQuery, [updatedColumnIds.join(','), boardId]);
      console.log(`Board ${boardId} updated with new column IDs: ${updatedColumnIds.join(',')}`);
      console.log('신규컬럼조회:'+JSON.stringify(columns));

      // Insert or update columns in AntsColumnInfo
      for (const column of columns) {
          const upsertColumnQuery = `
              INSERT INTO ${schema}."AntsColumnInfo" (board_id, column_id, column_title, column_size)
              VALUES ($1, $2, $3, $4)
              ON CONFLICT (board_id, column_id,column_title)
              DO UPDATE SET
                  column_title = EXCLUDED.column_title,
                  column_size = EXCLUDED.column_size
          `;

          await client.query(upsertColumnQuery, [
              boardId,
              column.columnId,
              column.columnName,
              column.columnSize
          ]);

          console.log(`컬럼 ${column.columnId} processed for board ${boardId}`);

          // Add the new column to the actual table
          const alterTableQuery = `
              ALTER TABLE ${schema}."ants_${boardId}"
              ADD COLUMN IF NOT EXISTS "${column.columnId}" ${getSQLColumnType(column.columnType)}
          `;
          await client.query(alterTableQuery);
          console.log(`Column ${column.columnId} added to table ants_${boardId}`);

          // Insert or update control_type in AntsControlInfo
          const upsertControlInfoQuery = `
              INSERT INTO ${schema}."AntsControlInfo" (board_id, column_id)
              VALUES ($1, $2)
              ON CONFLICT (board_id, column_id)
              DO UPDATE SET
                  control_type = EXCLUDED.control_type
          `;

          await client.query(upsertControlInfoQuery, [
              boardId,
              column.columnId
          ]);

          console.log(`Control info for column ${column.columnId} processed for board ${boardId}`);
      }

      await client.query('COMMIT');
      console.log('Transaction committed');
      res.status(200).json({ message: 'Columns saved successfully' });

  } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error during transaction, rolled back:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  } finally {
      client.release();
  }
});
  // Helper function to map column types to SQL types
  const getSQLColumnType = (columnType) => {
    switch (columnType) {
      case 'text':
        return 'TEXT';
      case 'number':
        return 'INTEGER'; // Or 'NUMERIC', depending on your needs
      case 'date':
        return 'DATE';
      case 'boolean':
        return 'BOOLEAN';
      case 'file':
        return 'TEXT';
      default:
        throw new Error(`Unknown column type: ${columnType}`);
    }
  };


  // Handle server shutdown properly
  process.on('SIGINT', async () => {
    await pool.end();
    process.exit(0);
  });

  router.post('/deleteColumn', async (req, res) => {
    console.log('요청자:/deleteColumn/'+req.session.domain);
    const { boardId, columnId } = req.body;

    // req.session.domain 값이 존재하면 그 값을 사용하고, 그렇지 않으면 'crm' 스키마를 사용
    const schema = req.session.domain || 'crm';

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 컬럼 정보 삭제
        const deleteColumnQuery = `
            DELETE FROM ${schema}."AntsColumnInfo"
            WHERE board_id = $1 AND column_id = $2
        `;
        await client.query(deleteColumnQuery, [boardId , columnId]);

        // AntsBoardInfo의 board_columns 업데이트
        const fetchBoardColumnsQuery = `
            SELECT board_columns
            FROM ${schema}."AntsBoardInfo"
            WHERE board_id = $1
        `;
        const result = await client.query(fetchBoardColumnsQuery, [boardId]);
        const currentColumns = result.rows[0]?.board_columns.split(',') || [];
        const updatedColumns = currentColumns.filter(col => col !== columnId);

        const updateBoardColumnsQuery = `
            UPDATE ${schema}."AntsBoardInfo"
            SET board_columns = $1
            WHERE board_id = $2
        `;
        await client.query(updateBoardColumnsQuery, [updatedColumns.join(','), boardId]);

        await client.query('COMMIT');
        res.status(200).json({ message: 'Column deleted successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error deleting column:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
});

router.post('/updateBoardInfo', async (req, res) => {
  // 세션에서 도메인 값을 받아옵니다.
  console.log('요청자:' + req.session.domain);
  
  // 클라이언트에서 전달된 데이터
  const { use_new, use_editer, use_modify, use_delete, use_excel, use_trigger , use_view ,use_upload,post_btn_type, search_type ,display_title,display_content,sort_order, board_id } = req.body;
  console.log('use_new:'+use_new+'  use_editer:'+use_editer+'  use_modify:'+use_modify+'  use_delete:'+use_delete+'  use_excel:'+use_excel+'  use_trigger:'+use_trigger+'  use_view:'+use_view+'   use_upload:'+use_upload,'  search_type:'+search_type,'    post_btn_type:'+post_btn_type       +'  display_title:'+display_title,'    display_content:'+display_content +' sort_order:'+sort_order);
  // req.session.domain 값이 존재하면 그 값을 사용하고, 그렇지 않으면 'crm' 스키마를 사용
  const schema = req.session.domain || 'crm';

  // PostgreSQL 클라이언트 연결
  const client = await pool.connect();

  try {
      // 트랜잭션 시작
      await client.query('BEGIN');
      // 업데이트 쿼리 작성
      const updateBoardInfoQuery = `
          UPDATE ${schema}."AntsBoardInfo"
          SET 
              use_new = $1,
              use_editer = $2,
              use_modify = $3,
              use_delete = $4,
              use_excel = $5,
              use_trigger = $6,
              use_view = $7,
              use_upload=$8,
              display_title=$9,
              display_content=$10,
              sort_order=$11,
              post_btn_type=$12,
              search_type = $13
          WHERE board_id = $14
      `;
      

      let sql = formatQuery(updateBoardInfoQuery,[
        use_new,
        use_editer,
        use_modify,
        use_delete,
        use_excel,
        use_trigger,
        use_view,
        use_upload,
        display_title,
        display_content,
        sort_order,
        post_btn_type,
        search_type,
        board_id
    ]);
    console.log(sql);
      // 쿼리 실행
      await client.query(updateBoardInfoQuery, [
          use_new,
          use_editer,
          use_modify,
          use_delete,
          use_excel,
          use_trigger,
          use_view,
          use_upload,
          display_title,
          display_content,
          sort_order,
          post_btn_type,
          search_type,
          board_id
      ]);

      // 트랜잭션 커밋
      await client.query('COMMIT');

      // 성공 응답 반환
      res.status(200).json({ message: 'Board info updated successfully' });
  } catch (error) {
      // 에러 발생 시 트랜잭션 롤백
      await client.query('ROLLBACK');
      console.error('Error updating board info:', error.stack);
      
      // 서버 에러 응답 반환
      res.status(500).json({ error: 'Internal Server Error' });
  } finally {
      // PostgreSQL 클라이언트 연결 해제
      client.release();
  }
});

router.post('/update_board', async (req, res) => {
  console.log('요청자:' + req.session.domain);
  const { board_id, board_site_id, board_category, board_title, board_list_auth, board_read_auth, board_write_auth, board_comment,board_idx, board_description } = req.body;
  

  // req.session.domain 값이 존재하면 그 값을 사용하고, 그렇지 않으면 'crm' 스키마를 사용
  const schema = req.session.domain || 'crm';

  const client = await pool.connect();

  try {
      await client.query('BEGIN');
      
      const updateBoardQuery = `
          UPDATE ${schema}."AntsBoardInfo"
          SET 
              board_site_id = $1,
              board_category = $2,
              board_title = $3,
              board_list_auth = $4,
              board_read_auth = $5,
              board_write_auth = $6,
              board_comment = $7,
              board_idx = $8,
              board_description = $9
          WHERE board_id = $10
      `;
      await client.query(updateBoardQuery, [
          board_site_id,
          board_category,
          board_title,
          board_list_auth,
          board_read_auth,
          board_write_auth,
          board_comment,
          board_idx,
          board_description,
          board_id
      ]);

      await client.query('COMMIT');

      res.status(200).json({ message: 'Board updated successfully' });
  } catch (error) {
      await client.query('ROLLBACK');
      res.status(500).json({ error: 'Internal Server Error' });
  } finally {
      client.release();
  }
});

router.get('/dynamicboardList', async (req, res) => {
  
  const { page = 1, limit = 10, table, from, to, orderby, sort,...searchParams } = req.query;
  console.log('orderby===================:'+orderby);
  try {
    const offset = (page - 1) * limit;
    const schema = req.session.domain || 'crm';

    // Helper function to format query with parameters
    const formatQuery = (query, params) => {
      return query.replace(/\$\d+/g, (match) => {
        const index = parseInt(match.substring(1)) - 1;
        return params[index] !== undefined ? `'${params[index]}'` : match;
      });
    };

    // Fetch board and column information
    const tableQuery = `
       SELECT 
          abi.board_id,
          abi.board_title,
          abi.board_description,
          abi.board_site_id,
          abi.board_category,
          abi.board_list_auth,
          abi.board_read_auth,
          abi.board_write_auth,
          abi.board_comment,
          abi.board_columns,
          abi.use_editer,
          abi.use_new,
          abi.use_editer,
          abi.use_modify,
          abi.use_delete,
          abi.use_excel,
          abi.use_trigger,
          abi.use_view,
          abi.use_upload,
          abi.display_title,
          abi.display_content,
          abi.sort_order,
          abi.post_btn_type,
          abi.search_type,
          aci.column_id,
          aci.column_title,
          coi.mapping_name,
          coi.control_type,
          coi.bind_key,
          coi.bind_option,
          coi.bind_display,
          coi.bind_type,
          aci.column_size,
          coi.column_idx,
          coi.column_align,
          coi.order_by_idx,
          coi.function,
          coi.result_action,
          coi.mask,
          coi.cell_width_size,
          coi.control_idx,
          coi.cell_visible,
          coi.read_only
      FROM
          ${schema}."AntsBoardInfo" abi
      LEFT JOIN
          ${schema}."AntsColumnInfo" aci
          ON abi.board_id = aci.board_id
      LEFT JOIN ${schema}."AntsControlInfo" coi
      ON aci.column_id = coi.column_id
      AND aci.board_id = coi.board_id
      WHERE
          aci.board_id = $1
      ORDER BY
          coi.column_idx;
    `;

    // Parameters for the table query
    const tableQueryParams = [table];

    // Log the query and parameters
    console.log('검색 시작:', formatQuery(tableQuery, tableQueryParams));
    console.log('실행 쿼리:', tableQueryParams);

    // Execute the query to retrieve table information
    const tableResult = await pool.query(tableQuery, tableQueryParams);

    // If no board information is found, return a 404 error
    if (tableResult.rows.length === 0) {
      return res.status(404).json({ error: 'Board not found' });
    }

    // Construct the board information object
    const boardInfo = {
      board_id: tableResult.rows[0].board_id,
      board_title: tableResult.rows[0].board_title,
      use_editer:tableResult.rows[0].use_editer,
      use_new:tableResult.rows[0].use_new,
      use_modify:tableResult.rows[0].use_modify,
      use_delete:tableResult.rows[0].use_delete,
      use_excel:tableResult.rows[0].use_excel,
      use_trigger:tableResult.rows[0].use_trigger,
      use_view:tableResult.rows[0].use_view,
      use_upload:tableResult.rows[0].use_upload,
      display_title:tableResult.rows[0].display_title,
      display_content:tableResult.rows[0].display_content,
      sort_order:tableResult.rows[0].sort_order,
      post_btn_type:tableResult.rows[0].post_btn_type,
      search_type:tableResult.rows[0].search_type,
      board_description: tableResult.rows[0].board_description,
      board_site_id: tableResult.rows[0].board_site_id,
      board_category: tableResult.rows[0].board_category,
      board_list_auth: tableResult.rows[0].board_list_auth,
      board_read_auth: tableResult.rows[0].board_read_auth,
      board_write_auth: tableResult.rows[0].board_write_auth,
      board_comment: tableResult.rows[0].board_comment,
      board_columns: tableResult.rows[0].board_columns,
      columns: tableResult.rows.map(row => ({
        column_id: row.column_id,
        column_title: row.column_title,
        mapping_name: row.mapping_name,
        control_type: row.control_type,
        function: row.function,
        mask: row.mask,
        result_action: row.result_action,
        column_size: row.column_size,
        column_idx: row.column_idx,
        column_align:row.column_align,
        order_by_idx:row.order_by_idx,
        column_width: row.cell_width_size,
        control_idx: row.control_idx,
        cell_visible : row.cell_visible,
        read_only : row.read_only,
        bind_key: row.bind_key,
        bind_option: row.bind_option,
        bind_display: row.bind_display,
        bind_type: row.bind_type
      }))
    };

    // Identify columns that need special joins (e.g., selectboxes)
    const selectboxColumns = boardInfo.columns.filter(col => col.column_type === 'selectbox' && (col.bind_type === 'S'|| col.bind_type === 'C'));

    // Construct the JOIN clauses for the selectbox columns
    const joinClauses = selectboxColumns.map((col, index) => `
        LEFT JOIN ${schema}."StandardInfo" AS si${index}
        ON main."${col.column_id}" = si${index}."std_key" AND si${index}."std_group_code" = '${col.bind_key}'
    `).join('\n');

    // Construct the SELECT clause including display names
    let selectClause = 'main.*';
    selectboxColumns.forEach((col, index) => {
      selectClause += `, si${index}."std_value" AS "${col.column_id}_display"`;
    });

    // Build the WHERE clause for search parameters
    const whereConditions = [];
    const queryParams = [parseInt(offset), parseInt(limit)];
    let paramIndex = 3;

    // Handle date range filtering using 'from' and 'to' for created_at
    if (from) {
      whereConditions.push(`main.created_at >= $${paramIndex++}`);
      queryParams.push(from);
    }
    if (to) {
      whereConditions.push(`main.created_at <= $${paramIndex++}`);
      queryParams.push(to);
    }

    // Handle other search parameters, excluding 'from' and 'to'
    Object.keys(searchParams).forEach(key => {
      if (key !== 'from' && key !== 'to' && searchParams[key]) {
        whereConditions.push(`main."${key}"::TEXT ILIKE $${paramIndex++}`);
        queryParams.push(`%${searchParams[key]}%`);
      }
    });

    const whereClause = whereConditions.length ? `WHERE ${whereConditions.join(' AND ')}` : '';




        // 'sort' 변수가 제공되고 유효한 값('asc' 또는 'desc')인지 확인
    if (sort && (sort.toLowerCase() === 'asc' || sort.toLowerCase() === 'desc')) {
      sortOrder = sort.toUpperCase();
    }

    // 기본 정렬 기준 설정
    let orderByClause = `ORDER BY main.created_at ${sortOrder}`;

    // 'orderby'가 유효한 문자열인지 확인
    if (typeof orderby === 'string' && orderby.trim().length > 0) {
      // 쉼표로 구분된 문자열을 배열로 변환
      const orderByArray = orderby.split(',').map(col => col.trim());
    
      // 정렬 기준이 있는 경우 'ORDER BY' 절 생성
      if (orderByArray.length > 0) {
          orderByClause = 'ORDER BY ' + orderByArray.map((col) => `main."${col}" ${sortOrder}`).join(', ');
      }
    } else {
      console.log('orderby is not a valid string or is empty: ' + JSON.stringify(orderby));
    }

    console.log('Order By Clause: ' + orderByClause);

    // 데이터 조회 쿼리 구성
    const dataQuery = `
      SELECT DISTINCT ${selectClause}
      FROM ${schema}."ants_${table}" AS main
      ${joinClauses}
      ${whereClause}
      ${orderByClause}
      OFFSET $1 LIMIT $2
    `;
    // Log the data retrieval query and parameters
    // console.log('Data Query:', formatQuery(dataQuery, queryParams));
    // console.log('조회 파라미터:', queryParams);

    // Execute the data retrieval query
    const dataResult = await pool.query(dataQuery, queryParams);

    // Process the results to include display names
    const boardData = dataResult.rows.map(row => {
      const newRow = { ...row };
      selectboxColumns.forEach(col => {
        newRow[col.column_id] = row[`${col.column_id}_display`] || row[col.column_id];
      });
      return newRow;
    });

    // Construct the query to count the total number of rows
    const countWhereConditions = [];
    const countQueryParams = [];
    paramIndex = 1;

    if (from) {
      countWhereConditions.push(`created_at >= $${paramIndex++}`);
      countQueryParams.push(from);
    }
    if (to) {
      countWhereConditions.push(`created_at <= $${paramIndex++}`);
      countQueryParams.push(to);
    }

    Object.keys(searchParams).forEach(key => {
      if (key !== 'from' && key !== 'to' && searchParams[key]) {
        countWhereConditions.push(`"${key}"::TEXT ILIKE $${paramIndex++}`);
        countQueryParams.push(`%${searchParams[key]}%`);
      }
    });

    const countWhereClause = countWhereConditions.length ? `WHERE ${countWhereConditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) AS total FROM ${schema}."ants_${table}" ${countWhereClause}`;

    // Log the count query and parameters
    console.log('Count Query:', formatQuery(countQuery, countQueryParams));
    console.log('Count Query Parameters:', countQueryParams);

    // Execute the query to count the total rows
    const countResult = await pool.query(countQuery, countQueryParams);

    // Prepare the response data
    const data = {
      boardData: [{
        ...boardInfo,
        sampleRows: boardData
      }],
      total: countResult.rows[0].total,
    };

    // Send the response
    res.json(data);
  } catch (error) {
    // Log and handle any errors
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get("/getMenuItems", async (req, res) => {
  console.log('요청자:' + req.session.domain);
  console.log('[getMenuItems] :: ' + new Date().toISOString());

  // req.session.domain 값이 존재하면 그 값을 사용하고, 그렇지 않으면 'crm' 스키마를 사용
  const schema = req.session.domain || 'crm';

  try {
      const query = `SELECT std_id, std_key, std_value, std_group_code, std_description
                     FROM ${schema}."StandardInfo"
                     WHERE std_group_code = 'root_category'`;

      const results = await pool.query(query);
      
      console.log('쿼리성공 : ' + '[' + JSON.stringify(results.rows) + ']' + new Date().toISOString());
      res.send(results.rows);
  } catch (error) {
      console.log('쿼리에러: ' + error);
      res.status(500).send('쿼리 실행 중 오류가 발생했습니다.');
  }
});



// /request/saveColumnSettings 엔드포인트 정의
router.post('/saveColumnSettings', async (req, res) => {
  console.log('요청: 테이블 컬럼 정보수정 :saveColumnSettings');
  const { board_id, columns } = req.body;

  if (!board_id || !Array.isArray(columns)) {
    console.error('Invalid input: board_id or columns are missing');
    return res.status(400).send('board_id and columns are required');
  }

  const schema = req.session?.domain || 'crm';
  console.log('사용자 스키마:', schema);
  console.log('보낸값' + JSON.stringify(columns));

  try {
    for (const column of columns) {
      // Convert empty strings or undefined values to null
      const toNull = (value) => (value === '' || value === undefined ? null : value);

      // Ensure valid boolean values or set default values
      const visible = column.cell_visible === true || column.cell_visible === 'true' || column.cell_visible === 1;
      const read_only = column.read_only === true || column.read_only === 'true' || column.read_only === 1;

      const upsertColumnQuery = `
        INSERT INTO ${schema}."AntsControlInfo" (
         board_id, column_id, mapping_name, cell_width_size ,function,result_action,mask, column_idx,column_align,order_by_idx, cell_visible ,read_only
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11,$12)
        ON CONFLICT (board_id,column_id) DO UPDATE
        SET
        mapping_name = EXCLUDED.mapping_name,  
        cell_width_size = EXCLUDED.cell_width_size,
        function = EXCLUDED.function,
        result_action = EXCLUDED.result_action,
        mask = EXCLUDED.mask,
        column_idx = EXCLUDED.column_idx,
        column_align= EXCLUDED.column_align,
        order_by_idx= EXCLUDED.order_by_idx,
        cell_visible = EXCLUDED.cell_visible,
        read_only = EXCLUDED.read_only;
          ;
      `;

      const queryParams = [
        toNull(board_id),
        toNull(column.column_id),
        toNull(column.mapping_name),
        toNull(column.cell_width_size),
        toNull(column.function),
        toNull(column.result_action),
        toNull(column.mask),
        toNull(column.column_idx),
        toNull(column.column_align),
        toNull(column.order_by_idx),
        visible,
        read_only,
      ];

      // Execute the query with parameter binding
      let log=formatQuery(upsertColumnQuery, queryParams);
      console.log(`테이블컬럼수정:`+log);
      await pool.query(upsertColumnQuery, queryParams);
    }

    res.status(200).send('Column settings saved successfully');
    console.log('Column settings saved successfully');
  } catch (error) {
    console.error('Error saving column settings:', error);
    res.status(500).send('An error occurred while saving column settings');
  }
});



// /request/saveControlSettings 엔드포인트 정의
router.post('/saveControlSettings', async (req, res) => {
  console.log('요청자: saveControlSettings');
  const { board_id, columns } = req.body;

  if (!board_id || !Array.isArray(columns)) {
    console.error('Invalid input: board_id or columns are missing');
    return res.status(400).send('board_id and columns are required');
  }

  const schema = req.session?.domain || 'crm';
  console.log('사용자 스키마:', schema);
  console.log('보낸값' + JSON.stringify(columns));

  try {
    for (const column of columns) {
      // Convert empty strings or undefined values to null
      const toNull = (value) => (value === '' || value === undefined ? null : value);

      // Ensure valid boolean values or set default values
      const visible = column.visible === true || column.visible === 'true' || column.visible === 1;
      const col_search = column.col_search === true || column.col_search === 'true' || column.col_search === 1;

      const upsertControlQuery = `
        INSERT INTO ${schema}."AntsControlInfo" (
          board_id, column_id, ctrl_pos_x, ctrl_pos_y, ctrl_width, ctrl_height, control_idx,  visible, col_search
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT ( board_id,column_id) DO UPDATE
        SET
          ctrl_pos_x = EXCLUDED.ctrl_pos_x,
          ctrl_pos_y = EXCLUDED.ctrl_pos_y,
          ctrl_width = EXCLUDED.ctrl_width,
          ctrl_height = EXCLUDED.ctrl_height,
          control_idx = EXCLUDED.control_idx,
          visible = EXCLUDED.visible,
          col_search = EXCLUDED.col_search;
          ;
      `;

      const queryParams = [
        toNull(board_id),
        toNull(column.column_id),
        toNull(column.ctrl_pos_x),
        toNull(column.ctrl_pos_y),
        toNull(column.ctrl_width),
        toNull(column.ctrl_height),
        toNull(column.control_idx),
        visible,
        col_search
      ];

      let log=formatQuery(upsertControlQuery, queryParams);
      console.log(`컨트롤 수정:`+log);
      // Execute the query with parameter binding
      await pool.query(upsertControlQuery, queryParams);
    }

    res.status(200).send('Column settings saved successfully');
    console.log('Column settings saved successfully');
  } catch (error) {
    console.error('Error saving column settings:', error);
    res.status(500).send('An error occurred while saving column settings');
  }
});



router.get('/getFormControls', async (req, res) => {
console.log('요청자:getFormControls:'+req.session.domain);
  const { table } = req.query;
  if (!table) {
      return res.status(400).send('boardId is required');
  }
  // req.session.domain 값이 존재하면 그 값을 사용하고, 그렇지 않으면 'crm' 스키마를 사용
  const schema = req.session.domain || 'crm';

  try {
      const getColumnInfoQuery = `
        SELECT 
        c.column_id, 
        c.column_title,
        ac.mapping_name,
        c.column_size, 
        ac.column_idx,
        ac.control_idx,
        c.board_id,
        ac.control_type AS control_type, 
        ac.bind_key AS bind_key,
        ac.bind_type AS bind_type,
        ac.bind_option AS bind_option,
        ac.bind_display AS bind_display,
        ac.ctrl_pos_x AS ctrl_pos_x,
        ac.ctrl_pos_y AS ctrl_pos_y,
        ac.ctrl_width AS ctrl_width,
        ac.ctrl_height AS ctrl_height,
        ac.column_idx AS column_idx,
        ac.column_align AS column_align,
        ac.order_by_idx AS order_by_idx,
        ac.mask AS mask,
        ac.visible  AS visible,
        ac.col_search AS col_search,  -- Aggregate boolean values
        ac.function AS function,
        ac.result_action AS result_action,
        ac.root_column AS root_column,
        ac.where_column AS where_column
    FROM 
        ${schema}."AntsColumnInfo" c
    LEFT JOIN 
        ${schema}."AntsControlInfo" ac 
    ON 
        c.board_id = ac.board_id AND c.column_id = ac.column_id
    WHERE 
        c.board_id = $1
    ORDER BY 
        ac.column_idx ASC;
      `;

      const result = await pool.query(getColumnInfoQuery, [table]);
      const columns = result.rows;

      res.status(200).json(columns);
  } catch (error) {
      console.error('Error fetching form controls:', error);
      res.status(500).send('An error occurred while fetching form controls');
  }
});


router.get('/getColumnsInfo', async (req, res) => {
  console.log('요청자: getColumnsInfo');
  const { boardId } = req.query;
  console.log('getColumnsInfo 요청테이블명:', boardId); // Ensure boardId is being logged correctly

  if (!boardId) {
    console.error('boardId is undefined or empty');
    return res.status(400).send('boardId is required');
  }

  const schema = req.session?.domain || 'crm';
  console.log('사용자 스키마:', schema);

  const getColumnsInfoQuery = `
 SELECT
    aci.board_id,
    aci.column_id,
    aci.column_title,
    coi.column_idx,
    coi.column_align,
    coi.order_by_idx,
    coi.mapping_name,
    coi.control_type,
    coi.control_size,
    coi.bind_key,
    coi.bind_type,
    coi.bind_option,
    coi.bind_display,
    coi.ctrl_pos_x,
    coi.ctrl_pos_y,
    coi.ctrl_width,
    coi.ctrl_height,
    coi.function,
    coi.result_action,
    coi.mask,
    coi.root_column,
    coi.where_column,
    coi.visible,
    coi.control_idx,
    coi.cell_visible,
    coi.cell_width_size,
    coi.read_only,
    coi.col_search
FROM
    ${schema}."AntsColumnInfo" aci
    LEFT OUTER JOIN ${schema}."AntsControlInfo" coi
ON
    aci.board_id = coi.board_id 
AND aci.column_id = coi.column_id
WHERE aci.board_id = $1
ORDER BY coi.column_idx
  `;

  try {
    const params = [boardId];
    console.log('Executing query with params:', params);

    // Construct the query string with parameters for logging
    const queryWithParams = getColumnsInfoQuery.replace('$1', `'${boardId}'`);
    console.log('Executing SQL:', queryWithParams);

    const result = await pool.query(getColumnsInfoQuery, params);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching columns info:', error);
    res.status(500).send('An error occurred while fetching columns info');
  }
});

router.post("/DeleteStdInfoCheck", async (req, res) => {
  console.log('요청자:' + req.session.domain);
  const { std_id } = req.body;

  // req.session.domain 값이 존재하면 그 값을 사용하고, 그렇지 않으면 'crm' 스키마를 사용
  const schema = req.session.domain || 'crm';
  const query = `
      DELETE FROM ${schema}."StandardInfo"
      WHERE std_id = $1
  `;

  const param = [std_id];

  try {
      const results = await pool.query(query, param);
      console.log('쿼리성공 : ' + new Date().toISOString());
      console.log(results);
      res.send(results);
  } catch (error) {
      console.log('쿼리에러' + error);
      console.log('std_id:' + std_id);
      res.status(500).send(error);
  }
});

// getFormMasterData 라우터 수정
router.get('/getFormMasterData', async (req, res) => {
  console.log('요청자:' + req.session.domain);
  const { bind_key, bind_option, bind_display, rootColumnValue, parent_column, where_column } = req.query;

  // req.session.domain 값이 존재하면 그 값을 사용하고, 그렇지 않으면 'crm' 스키마를 사용
  const schema = req.session.domain || 'crm';

  try {
      // bind_type이 M인 경우
      let optionsQuery = `
          SELECT ${bind_display} as std_key, ${bind_option} as std_value
          FROM ${schema}."${bind_key}"
      `;

      // rootColumnValue와 where_column이 있는 경우 조건 추가
      if (rootColumnValue && where_column) {
          optionsQuery += ` WHERE ${where_column} = $1`;
      }

      const queryParams = (rootColumnValue && where_column) ? [rootColumnValue] : [];
      const result = await pool.query(optionsQuery, queryParams);
      const options = result.rows;
      // console.log('마스터 데이터============', JSON.stringify(options));
      res.status(200).json(options);
  } catch (error) {
      console.error('Error fetching form control options:', error);
      res.status(500).send('An error occurred while fetching form control options');
  }
});

// getFormControlOptions 라우터 수정
router.get('/getFormControlOptions', async (req, res) => {
  console.log('요청자:' + req.session.domain);
  const { bind_key, bind_option, rootColumnValue,  where_column } = req.query;
  
  if (!bind_key) {
      return res.status(400).send('bind_key is required');
  }
  const table = (!bind_option) ? "StandardInfo" : "StandardInfoDtl";

  // req.session.domain 값이 존재하면 그 값을 사용하고, 그렇지 않으면 'crm' 스키마를 사용
  const schema = req.session.domain || 'crm';

  try {
      let getOptionsQuery;
      const queryParams = [bind_key];

      if (bind_option) {
          getOptionsQuery = `
              SELECT code_option as std_key, code_value as std_value ,code_desc
              FROM ${schema}."${table}"
              WHERE code_group = $1 AND target_code = $2
          `;
          queryParams.push(bind_option);
      } else {
          getOptionsQuery = `
              SELECT std_key, std_value
              FROM ${schema}."${table}"
              WHERE std_group_code = $1
          `;
      }

      // rootColumnValue와 where_column이 있는 경우 조건 추가
      if (rootColumnValue && where_column) {
          getOptionsQuery += ` AND ${where_column} = $${queryParams.length + 1}`;
          queryParams.push(rootColumnValue);
      }
      const executedQuery = getExecutedQuery(getOptionsQuery, queryParams);
      const result = await pool.query(getOptionsQuery, queryParams);
      const options = result.rows;
      console.log(JSON.stringify(options));
      res.status(200).json(options);
  } catch (error) {
      console.error('Error fetching form control options:', error);
      res.status(500).send('An error occurred while fetching form control options');
  }
});



router.post("/updateStdInfo", async (req, res) => {
    console.log('요청자:'+req.session.domain);
  // req.session.domain 값이 존재하면 그 값을 사용하고, 그렇지 않으면 'crm' 스키마를 사용
  const schema = req.session.domain || 'crm';

  const query = `
    UPDATE ${schema}."StandardInfo"
    SET std_group_code = $1, std_key = $2, std_value = $3, std_description = $4 
    WHERE std_id = $5`;

  const param = [req.body.group_code, req.body.key, req.body.value, req.body.description, req.body.id];

  try {
      const results = await pool.query(query, param);
      console.log('쿼리성공: ' + new Date().toISOString());
      console.log(results);
      res.send(results);
  } catch (error) {
      console.log('쿼리에러: ' + error);
      res.status(500).send(error);
  }
});

router.post('/deleteStdInfo', async (req, res) => {
    console.log('요청자:'+req.session.domain);
  console.log('===================================');
  console.log('기준정보관리 화면에서 DeleteStdInfo를 실행합니다.');
  const { group_code } = req.body;

  // req.session.domain 값이 존재하면 그 값을 사용하고, 그렇지 않으면 'crm' 스키마를 사용
  const schema = req.session.domain || 'crm';

  // Log the query with parameters bound
  const formattedQuery = format('DELETE FROM %I."StandardInfo" WHERE std_group_code = %L', schema, group_code);
  console.log('Executing query:', formattedQuery);

  try {
      const result = await pool.query(`DELETE FROM ${schema}."StandardInfo" WHERE std_group_code = $1`, [group_code]);
      if (result.rowCount === 0) {
          res.status(404).send('해당 그룹 코드를 찾을 수 없습니다.');
      } else {
          res.status(200).send('삭제 되었습니다.');
      }
  } catch (error) {
      console.error('쿼리에러: ', error);
      res.status(500).send('쿼리 실행 중 오류가 발생했습니다.');
  }
});
    // 인프라 이력조회
// 인프라 이력조회
router.get("/getCommonCodeGroup", async (req, res) => {
    console.log('요청자:'+req.session.domain);
  console.log('[getCommonCodeGroup] :: ' + new Date().toISOString());

  // req.session.domain 값이 존재하면 그 값을 사용하고, 그렇지 않으면 'crm' 스키마를 사용
  const schema = req.session.domain || 'crm';

  try {
      const query = `SELECT DISTINCT std_group_code FROM ${schema}."StandardInfo" ORDER BY std_group_code desc`;
      const results = await pool.query(query);
      console.log('쿼리성공 : ' + '[' + JSON.stringify(results.rows) + ']' + new Date().toISOString());
      res.send(results.rows);
  } catch (error) {
      console.log('쿼리에러: ' + error);
      res.status(500).send('쿼리 실행 중 오류가 발생했습니다.');
  }
});

router.get("/getStdDtl", async (req, res) => {
  console.log('[getStdDtl] :: ' + new Date().toISOString());
  console.log('group_code::: ' + req.query.std_group_code);
  console.log('요청자:'+req.session.domain);
  // req.session.domain 값이 존재하면 그 값을 사용하고, 그렇지 않으면 'crm' 스키마를 사용
  const schema = req.session.domain || 'crm';

  try {
      const query = `SELECT * FROM ${schema}."StandardInfo" WHERE std_group_code = $1 ORDER BY std_group_code DESC`;
      const results = await pool.query(query, [req.query.std_group_code]);
      console.log('쿼리성공 : ' + '[' + JSON.stringify(results.rows) + ']' + new Date().toISOString());
      res.send(results.rows);
  } catch (error) {
      console.log('쿼리에러: ' + error);
      res.status(500).send('쿼리 실행 중 오류가 발생했습니다.');
  }
});

router.get("/getStdOptions", async (req, res) => {
    console.log('[getStdOptions] :: ' + new Date().toISOString());
    console.log('group_code::: ' + req.query.std_group_code);
    console.log('group_code::: ' + req.query.std_value);
    console.log('요청자:' + req.session.domain);
    
    // req.session.domain 값이 존재하면 그 값을 사용하고, 그렇지 않으면 'crm' 스키마를 사용
    const schema = req.session.domain || 'crm';
  
    try {
        const query = `
          SELECT code_group, code_option, code_value, code_desc ,target_code
          FROM ${schema}."StandardInfoDtl" 
          WHERE code_group = $1
          AND target_code = $2
          ORDER BY code_idx ASC
        `;
        const results = await pool.query(query, [req.query.std_group_code,req.query.std_value]);
        console.log('쿼리성공 : ' + '[' + JSON.stringify(results.rows) + ']' + new Date().toISOString());
        res.send(results.rows);
    } catch (error) {
        console.log('쿼리에러: ' + error);
        res.status(500).send('쿼리 실행 중 오류가 발생했습니다.');
    }
  });
  router.post("/InsertStdInfoDtlOption", async (req, res) => {
    console.log('요청자:' + req.session.domain);
    const schema = req.session.domain || 'crm'; // 동적으로 스키마 설정
    const query = `
      INSERT INTO ${schema}."StandardInfoDtl" (code_group, code_option, code_value, code_desc,target_code) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;
    const params = [req.body.group_code, req.body.optionName, req.body.optionValue, req.body.optionDesc , req.body.target_code];
    console.log('결과==================:'+JSON.stringify(params));
  
    try {
      const result = await pool.query(query, params);
      console.log('쿼리성공 : ' + new Date().toISOString());
      console.log(result.rows[0]);
      res.send(result.rows[0]);
    } catch (error) {
      console.error('쿼리에러: ' + error);
      res.status(500).send('쿼리 실행 중 오류가 발생했습니다.');
    }
  });
  router.post("/deleteStdOption", async (req, res) => {
    console.log('요청자:' + req.session.domain);
    const schema = req.session.domain || 'crm'; // 동적으로 스키마 설정
    const query = `
      DELETE FROM ${schema}."StandardInfoDtl" 
      WHERE code_group = $1 AND code_option = $2 AND code_value = $3 AND target_code = $4
      RETURNING *
    `;
    const params = [req.body.code_group, req.body.option_key, req.body.option_value,req.body.target_code];
    console.log('삭제 요청 파라미터: ' + JSON.stringify(params));
  
    try {
      const result = await pool.query(query, params);
      console.log('쿼리 성공 : ' + new Date().toISOString());
      if (result.rowCount > 0) {
        console.log('삭제된 데이터: ', result.rows[0]);
        res.send(result.rows[0]); // 삭제된 데이터 반환
      } else {
        res.status(404).send('해당 항목을 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('쿼리 에러: ' + error);
      res.status(500).send('쿼리 실행 중 오류가 발생했습니다.');
    }
  });
  router.post('/saveResult', async (req, res) => {
    const schema = req.session.domain || 'crm'; // 동적으로 스키마 설정
  
    // 쿼리 문자열
    const query = `
      INSERT INTO ${schema}."InterfaceJsonStorage" (ret_json) 
      VALUES ($1) 
      RETURNING ret_no, ret_json
    `;
  
    // 요청에서 받은 데이터를 JSON 문자열로 변환 (필요시)
    let jsonData;
    try {
      jsonData = typeof req.body.result === 'object' ? JSON.stringify(req.body.result) : req.body.result;
    } catch (jsonError) {
      console.error('JSON 변환 오류:', jsonError);
      return res.status(400).send('Invalid JSON format.');
    }
  
    const params = [jsonData];
    console.log('Received JSON:', req.body.result);
    console.log('Serialized JSON:', jsonData);
  
    try {
      // 쿼리 실행
      const result = await pool.query(query, params);
      console.log('Insert successful:', result.rows[0]);
  
      // 성공 응답
      res.status(201).json(result.rows[0]);
    } catch (error) {
      // 쿼리 오류 처리
      console.error('Query error:', error);
      res.status(500).send('An error occurred while executing the query.');
    }
  });

      router.post("/InsertStdInfoDtl", async (req, res) => {
        console.log('요청자:'+req.session.domain);
        const schema = req.session.domain || 'crm'; // 동적으로 스키마 설정
        const query = `INSERT INTO ${schema}."StandardInfo" (std_group_code, std_key, std_value, std_description) VALUES ($1, $2, $3, $4) RETURNING *`;
        const params = [req.body.group_code, req.body.key, req.body.value, req.body.description];
      
        try {
          const result = await pool.query(query, params);
          console.log('쿼리성공 : ' + new Date().toISOString());
          console.log(result.rows[0]);
          res.send(result.rows[0]);
        } catch (error) {
          console.error('쿼리에러: ' + error);
          res.status(500).send('쿼리 실행 중 오류가 발생했습니다.');
        }
      });
      
      router.post("/InsertStdInfo", async (req, res) => {
        console.log('요청자:' + req.session.domain);
        const schema = req.session.domain || 'crm'; // 동적으로 스키마 설정
        const query = `INSERT INTO ${schema}."StandardInfo" (std_group_code) VALUES ($1) RETURNING *`;
        const params = [req.body.codeGroupInput];
      
        try {
          const result = await pool.query(query, params);
          console.log('쿼리성공 : ' + new Date().toISOString());
          console.log(result.rows[0]);
          res.send(result.rows[0]);
        } catch (error) {
          console.error('쿼리에러: ' + error);
          res.status(500).send('쿼리 실행 중 오류가 발생했습니다.');
        }
      });
    
    
    // /request/getBoards 엔드포인트 정의
    router.get('/getBoards', async (req, res) => {
    console.log('요청자: getBoards');
  
    const schema = req.session?.domain || 'crm';
  
    const getBoardsQuery = `
      SELECT board_id,board_title
      FROM ${schema}."AntsBoardInfo";
    `;
  
    try {
      console.log(`Executing query: ${getBoardsQuery}`);
      const result = await pool.query(getBoardsQuery);
      console.log('Query executed successfully.');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching boards:', error);
      res.status(500).send('An error occurred while fetching boards');
    }
  });
    // /request/getColumns 엔드포인트 정의
    router.get('/getColumns', async (req, res) => {
    console.log('요청자: getColumns');
    const { boardId } = req.query;
  
    const schema = req.session?.domain || 'crm';
  
    const getColumnsQuery = `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = $1 AND table_name = $2;
    `;
  
    try {
      console.log(`Executing query: ${getColumnsQuery.replace(/\$\d/g, (placeholder, index) => {
        const params = [schema, `ants_${boardId}`];
        return `'${params[index]}'`;
      })}`);
      const result = await pool.query(getColumnsQuery, [schema, `ants_${boardId}`]);
      console.log('Query executed successfully.');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching columns:', error);
      res.status(500).send('An error occurred while fetching columns');
    }
  });


   // /request/getColumns 엔드포인트 정의
   router.get('/getColumns', async (req, res) => {
    console.log('요청자: getColumns');
    const { boardId } = req.query;
  
    const schema = req.session?.domain || 'crm';
  
    const getColumnsQuery = `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = $1 AND table_name = $2;
    `;
  
    try {
      console.log(`Executing query: ${getColumnsQuery.replace(/\$\d/g, (placeholder, index) => {
        const params = [schema, `ants_${boardId}`];
        return `'${params[index]}'`;
      })}`);
      const result = await pool.query(getColumnsQuery, [schema, `ants_${boardId}`]);
      console.log('Query executed successfully.');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching columns:', error);
      res.status(500).send('An error occurred while fetching columns');
    }
  });
  
    router.post('/postings', async (req, res) => {
        console.log('요청자:'+req.session.domain);

      let { table, title, content, userId, ...dynamicFields } = req.body;
      title = title || '-';
      content = content || '-';
      const columns = ['title', 'content'];
      const values = [title, content];
      console.log('포스팅필드' + JSON.stringify(dynamicFields));
  
      // session에서 domain 값을 가져오고 없으면 기본값으로 'crm' 사용
      const domain = req.session.domain || 'crm';
  
      for (const [key, value] of Object.entries(dynamicFields)) {
        console.log(`key: ${key}, value: ${value}`); // 각 키-값 쌍을 출력
        columns.push(key);
        values.push(value);
        
        console.log(`키 after push: ${columns}`); // columns 배열 상태 출력
        console.log(`값 after push: ${values}`); // values 배열 상태 출력
    }
      
      const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
  
      // 도메인 값을 스키마로 사용하여 SQL 쿼리 생성
      const sql = `INSERT INTO ${domain}."ants_${table}" (${columns.join(', ')}) VALUES (${placeholders})`;
  
      try {
          const sqlQuery = formatQuery(sql,values);
          console.log('실행 쿼리:'+sqlQuery);
          await pool.query(sql, values);
          res.json({ success: true, message: 'Post created successfully' });
      } catch (error) {
          console.error('Error inserting data:', error);
          res.status(500).json({ error: 'Failed to create post' });
      }
  });
  

    router.get('/session', (req, res) => {
        console.log('요청자:'+req.session.domain);
        if (req.session.userId) {
          res.json({ userId: req.session.userId, userName: req.session.userName });
        } else {
          res.status(401).json({ message: 'No active session' });
        }
      });

      router.post('/register', async (req, res) => {
        const { user_id, user_name, user_pwd, gender, birth_y, birth_m, birth_d, email, phone, alias, domain } = req.body;
    
        try {
            // session에서 domain 값을 가져오고 없으면 기본값으로 'crm' 사용
            const sys_domain = domain || 'crm';
    
            // 먼저 user_id가 이미 존재하는지 확인
            const checkUserIdQuery = `SELECT * FROM ${sys_domain}.ants_usermaster WHERE USER_ID = $1`;
            const checkUserIdResult = await pool.query(checkUserIdQuery, [user_id]);
    
            if (checkUserIdResult.rows.length > 0) {
                // user_id가 이미 존재하는 경우
                return res.status(409).send('이미 존재하는 아이디입니다.'); // 409 Conflict
            }
    
            // 비밀번호 암호화
            const inputKey = encrypt(user_pwd, 'ANTS');
            console.log('호출');
    
            const insertQuery = `
                INSERT INTO ${sys_domain}.ants_usermaster (USER_ID, USER_NAME, USER_PWD, GENDER, DATE_OF_BIRTH, EMAIL_ADDRESS, USER_MOBILE, USER_ALIAS)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `;
    
            const param = [user_id, user_name, inputKey, gender, `${birth_y}${birth_m}${birth_d}`, email, phone, alias]; // 해시된 비밀번호 사용
            await pool.query(insertQuery, param);
            console.log('쿼리 성공 : ' + new Date().toISOString());
            res.status(201).send('사용자 등록 성공');
        } catch (error) {
            console.error('쿼리 에러', error);
            res.status(500).send('서버 오류 발생');
        }
    });
    
    router.post('/login', async (req, res) => {
        const { user_id, user_pwd, domain } = req.body;
        console.log('요청자:'+domain);
        // domain이 없으면 기본값으로 'crm'을 사용
        const schema = domain || 'crm';
    
        const query = `SELECT * FROM ${schema}."ants_usermaster" WHERE user_id = $1`;
        const param = [user_id];
    
        try {
            const result = await pool.query(query, param);
    
            if (result.rows.length === 0) {
                return res.status(401).send('사용자가 존재하지 않습니다.');
            }
    
            const user = result.rows[0];
    
            // 비밀번호 검증
            const orgKey = user.user_pwd;
            const inputKey = encrypt(user_pwd, 'ANTS');
    
            if (orgKey === inputKey) {
                req.session.userId = user.user_id;
                req.session.userName = user.user_name;
                req.session.domain = schema;
    
                // 사용자 정보 전송
                const responseData = {
                    id: user.user_id,
                    name: user.user_name,
                    class: user.user_class,
                    gender: user.gender,
                    birth: user.date_of_birth,
                    email: user.email_address,
                    receiving: user.receiving,
                    phone: user.user_mobile,
                    alias: user.user_alias,
                    domain: schema,
                };
                res.json(responseData);
                console.log('로그인 성공:세션정보:==============================');
                console.log(JSON.stringify(req.session));
                console.log('=================================================');
            } else {
                // 비밀번호가 틀린 경우
                return res.status(401).send('비밀번호가 틀립니다.');
            }
        } catch (error) {
            console.error('쿼리 에러', error);
            return res.status(500).send('서버 에러 발생');
        }
    });
    // /request/deleteControlInfo 엔드포인트 정의
router.post('/deleteControlInfo', async (req, res) => {
    console.log('요청자: deleteControlInfo');
    const controlData = req.body;
    
    // req.session.domain 값이 존재하면 그 값을 사용하고, 그렇지 않으면 'crm' 스키마를 사용
    const schema = req.session?.domain || 'crm';
  
    try {
      await pool.query('BEGIN');
  
      for (const control of controlData) {
        const deleteControlInfoQuery = `
          DELETE FROM ${schema}."AntsControlInfo"
          WHERE board_id = $1 AND column_id = $2;
        `;
  
        await pool.query(deleteControlInfoQuery, [
          control.board_id,
          control.column_id
        ]);
      }
      await pool.query('COMMIT');
      res.status(200).send('Control info deleted successfully');
    } catch (error) {
      await pool.query('ROLLBACK');
      console.error('Error deleting control info:', error);
      res.status(500).send('An error occurred while deleting control info');
    }
  });

    router.get('/logout', (req, res) => {
      req.session.destroy(); // 세션 파기
      res.send('로그아웃 되었습니다.');
    });



// 기존 옵션 데이터 가져오기
router.get('/getOptions', async (req, res) => {
  console.log('요청자:', req.session.domain);
  const { target_code, code_group } = req.query;
  const schema = req.session.domain || 'crm';

  const query = `SELECT code_option,code_value FROM ${schema}."StandardInfoDtl" WHERE target_code = $1 AND code_group = $2 
  order by code_idx
  `;
 // 실제 쿼리 로그 출력
  console.log('Executing query:', query);
  console.log('With parameters:', [target_code, code_group]);

  try {

    const result = await pool.query(query, [target_code, code_group]);
    // const options = result.rows.map(row => row.code_option);
    const options = result.rows.map(row => ({
      code_option: row.code_option,
      code_value: row.code_value
    }));
    console.log('겟옵션:'+JSON.stringify(result.rows));
    res.status(200).json({ options });
  } catch (error) {
    console.error('Error fetching options:', error);
    res.status(500).send('An error occurred while fetching options');
  }
});

router.get('/getApiParameters', async (req, res) => {
  console.log('전송된 target_code : ' + req.query.target_code);
  const schema = req.session.domain || 'crm';

  // SQL query to retrieve API function details
  const query = `
            SELECT 
            sid.code_option, 
            si.std_description,  -- New column from StandardInfo
            sid.code_value, 
            sid.target_code, 
            sid.code_desc
          FROM 
            ${schema}."StandardInfo" si  -- Main table
          LEFT JOIN 
            ${schema}."StandardInfoDtl" sid  -- Detail table as left join
          ON 
            si.std_value = sid.target_code
          WHERE 
            sid.code_group = 'api_function'
          AND 
            sid.target_code = $1;
  `;

  // Function to format the query with bound parameters
  function formatQuery(query, params) {
    return query.replace(/\$(\d+)/g, (_, index) => {
      const value = params[index - 1];
      return typeof value === 'string' ? `'${value}'` : value;
    });
  }

  // Log the formatted query with parameters
  const formattedQuery = formatQuery(query, [req.query.target_code]);
  console.log('Executing query with parameters:', formattedQuery);

  try {
    // Execute the query
    const result = await pool.query(query, [req.query.target_code]);

    // Log the raw result
    console.log('Raw API Parameters:', JSON.stringify(result.rows));

    // Send the raw result rows as a JSON response
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching API parameters:', error);
    res.status(500).send('An error occurred while fetching API parameters');
  }
});

// 새로운 옵션 데이터 저장
router.post('/saveOptions', async (req, res) => {
  const { code_group, target_code, options } = req.body;
  const schema = req.session.domain || 'crm';

  try {
    // 기존 데이터를 삭제
    const deleteQuery = `DELETE FROM ${schema}."StandardInfoDtl" WHERE target_code = $1 AND code_group = $2`;
    await pool.query(deleteQuery, [target_code, code_group]);

    // 새 데이터를 삽입
    const insertQuery = `INSERT INTO ${schema}."StandardInfoDtl" (target_code, code_group, code_option, code_value) VALUES ($1, $2, $3, $4)`;
    // const promises = options.map(option => pool.query(insertQuery, [target_code, code_group, option]));
    const promises = options.map(option => pool.query(insertQuery, [target_code, code_group, option.code_option, option.code_value]));
    await Promise.all(promises);

    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/getMasterDataMappings', async (req, res) => {
  console.log('[DynamicBoard] Component에서 컬럼 매핑정보를 호출합니다.======================');
  console.log('호출 서비스 :[get] getMasterDataMappings');
  const schema = req.session?.domain || 'crm';
  const tableName = req.query?.table; // Get the table name from query parameters
  const optionField = req.query?.option; // Get the option field name
  const displayField = req.query?.display; // Get the display field name
  const columnId = req.query?.columnId; // Get the display field name
  console.log(`전달받은 데이터: ${columnId} for table: ${tableName}, option field: ${optionField}, display field: ${displayField}`);
  
  

  // Validate input parameters
  if (!tableName || !optionField || !displayField) {
    console.error('Required query parameters are missing');
    return res.status(400).send('table, option, and display parameters are required');
  }

  try {
    // 지정된 테이블에서 데이터를 가져오는 쿼리 생성
    const query = `
      SELECT ${optionField} AS std_value, ${displayField} AS std_key
      FROM ${schema}."${tableName}"
    `;

    console.log(`실행쿼리: ${query}`);
    const result = await pool.query(query);
    const rows = result.rows;

    //조회결과 로그
    // console.log('Query result:', rows);

    // 결과를 기반으로 매핑 데이터 생성
    const codeDisplayMap = {};

    rows.forEach(row => {
      const { std_key, std_value } = row;

      // 테이블 이름을 기준으로 그룹핑
      if (!codeDisplayMap[tableName]) {
        codeDisplayMap[tableName] = {};
      }

      // 코드와 디스플레이 값 매핑
      codeDisplayMap[tableName][std_value] = std_key; // std_value를 키로, std_key를 값으로 사용
    });

    res.status(200).json(codeDisplayMap); // 결과를 테이블명으로 감싸서 반환
    console.log(`=============getMasterDataMappings 처리완료=======================`);
  } catch (error) {
    console.error(`=============getMasterDataMappings 오류발생!=======================: ${tableName}`, error);
    res.status(500).send('Error fetching master data mappings');
  }
});
//
router.get('/getCodeDisplayMappings', async (req, res) => {
  const schema = req.session?.domain || 'crm';
  const bind_key = req.query.bind_key; // 쿼리 파라미터로 bind_key 가져오기

  console.log(`Received request for bind_key: ${bind_key}`);

  if (!bind_key) {
    console.error('bind_key parameter is missing');
    return res.status(400).send('bind_key parameter is required');
  }

  try {
    // StandardInfo 테이블에서 필요한 데이터 가져오기
    const query = `
      SELECT std_group_code AS bind_key, std_value, std_key
      FROM ${schema}."StandardInfo"
      WHERE std_group_code = $1
    `;
    
    // console.log(`Executing SQL Query: ${query.replace('$1', `'${bind_key}'`)}`);
    
    const result = await pool.query(query, [bind_key]);
    const rows = result.rows;

    // console.log(`Query result for bind_key "${bind_key}":`, rows);

    // 결과를 기반으로 맵핑 데이터 생성
    const codeDisplayMap = {};

    rows.forEach(row => {
      const { std_key, std_value } = row;
      
      // bind_key를 기준으로 그룹핑
      if (!codeDisplayMap[bind_key]) {
        codeDisplayMap[bind_key] = {};
      }
      
      // 코드와 디스플레이 값 매핑
      codeDisplayMap[bind_key][std_value] = std_key;
    });


    res.status(200).json(codeDisplayMap);
  } catch (error) {
    console.error('Error fetching code display mappings:', error);
    res.status(500).send('Error fetching code display mappings');
  }
});

module.exports = router;