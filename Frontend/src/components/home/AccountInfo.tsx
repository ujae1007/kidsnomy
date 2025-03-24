import React from 'react';

interface AccountInfoProps {
  data: {
    user_name: string;
    REC: {
      bankCode: string;
      accountNo: string;
      accountBalance: number;
      accountCreatedDate: string;
      accountExpiryDate: string;
      lastTransactionDate: string;
      currency: string;
    };
  } | null;
}

const AccountInfo: React.FC<AccountInfoProps> = ({ data }) => {
  if (!data) {
    return <div>계좌 정보를 불러오는 중...</div>;
  }

  return (
    <div>
      <div>
        <p>이름: {data.user_name}</p>
        <p>계좌번호: {data.REC.accountNo}</p>
        <p>잔액: {data.REC.accountBalance.toLocaleString()} {data.REC.currency}</p>
        <p>계좌 개설일: {new Date(data.REC.accountCreatedDate).toLocaleDateString()}</p>
        <p>계좌 만기일: {new Date(data.REC.accountExpiryDate).toLocaleDateString()}</p>
        <p>최종 거래일: {new Date(data.REC.lastTransactionDate).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default AccountInfo; 