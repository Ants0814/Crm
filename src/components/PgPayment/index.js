import React, { useState } from 'react';

function PgPayment() {
  const [paymentData, setPaymentData] = useState({
    storeId: '2400000058',
    cryptoKey: '4032EA1609A6C35FFAF15944571F625C',
    tranNo: 'q11111111',
    productType: '1',
    taxFreeCd: '01',
    billType: '18',
    amt: '100',
    cardNo: '9491351288573375',
    expirationDate: '202428',
    install: '00',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prevData) => ({ ...prevData, [name]: value }));
  };

  const fetchApiParameters = async () => {
    try {
      const response = await fetch('/request/pay', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({paymentData:paymentData}),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const result = await response.json();
      console.log(result); // 서버 응답 처리
    } catch (error) {
      alert("Failed to fetch API parameters: " + error.message);
    }
  };

  return (
    <div>
      {/* 결제 정보를 입력할 폼 */}
      <input name="storeId" value={paymentData.storeId} onChange={handleInputChange} placeholder="Store ID" />
      <input name="cryptoKey" value={paymentData.cryptoKey} onChange={handleInputChange} placeholder="Crypto Key" />
      <input name="tranNo" value={paymentData.tranNo} onChange={handleInputChange} placeholder="Transaction No" />
      <input name="productType" value={paymentData.productType} onChange={handleInputChange} placeholder="Product Type" />
      <input name="taxFreeCd" value={paymentData.taxFreeCd} onChange={handleInputChange} placeholder="Tax Free Code" />
      <input name="billType" value={paymentData.billType} onChange={handleInputChange} placeholder="Bill Type" />
      <input name="amt" value={paymentData.amt} onChange={handleInputChange} placeholder="Amount" />
      <input name="cardNo" value={paymentData.cardNo} onChange={handleInputChange} placeholder="Card Number" />
      <input name="expirationDate" value={paymentData.expirationDate} onChange={handleInputChange} placeholder="Expiration Date" />
      <input name="install" value={paymentData.install} onChange={handleInputChange} placeholder="Installment" />
      <button type="button" onClick={fetchApiParameters}>Submit Payment</button>
    </div>
  );
}

export default PgPayment;
