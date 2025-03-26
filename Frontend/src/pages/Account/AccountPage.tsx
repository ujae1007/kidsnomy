import React from 'react';
import styles from './AccountPage.module.css';

const AccountPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>계좌 등록</h1>
      <div className={styles.content}>
        {/* 계좌 등록 컨텐츠는 추후 구현 */}
        <p>계좌 등록 페이지입니다.</p>
      </div>
    </div>
  );
};

export default AccountPage; 