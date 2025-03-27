import React from 'react';
import styles from './AccountInfo.module.css';

interface AccountInfoProps {
  accountName: string;
  accountNumber: string;
  balance: number;
}

const AccountInfo: React.FC<AccountInfoProps> = ({
  accountName = "통장이름",
  accountNumber = "123-456-7890",
  balance = 1234567
}) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.accountName}>{accountName}</h2>
      <p className={styles.accountNumber}>계좌번호: {accountNumber}</p>
      <p className={styles.balance}>잔액: {balance.toLocaleString()}원</p>
    </div>
  );
};

export default AccountInfo; 