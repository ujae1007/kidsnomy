import React from 'react';
import styles from './AccountInfo.module.css';

interface AccountInfoProps {
  accountName: string;
  accountNumber: string;
  balance: number;
  bankCode: string;
  currency: string;
  createdDate: string;
  expiryDate: string;
}

const AccountInfo: React.FC<AccountInfoProps> = ({
  accountName,
  accountNumber,
  balance,
  bankCode,
  currency,
  createdDate,
  expiryDate
}) => {
  // 날짜 포맷 변환 함수
  const formatDate = (dateString: string) => {
    return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;
  };

  // 금액 포맷 변환 함수
  const formatBalance = (amount: number) => {
    return amount.toLocaleString('ko-KR');
  };

  return (
    <div className={styles.accountInfo}>
      <div className={styles.header}>
        <h2 className={styles.accountName}>{accountName}님의 계좌</h2>
        <p className={styles.bankInfo}>{bankCode} 은행</p>
      </div>
      
      <div className={styles.details}>
        <p className={styles.accountNumber}>계좌번호: {accountNumber}</p>
        <p className={styles.balance}>잔액: {formatBalance(balance)} {currency}</p>
        <div className={styles.dates}>
          <p>개설일: {formatDate(createdDate)}</p>
          <p>만기일: {formatDate(expiryDate)}</p>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo; 