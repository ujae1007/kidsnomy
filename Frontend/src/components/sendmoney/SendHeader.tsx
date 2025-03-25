import React from 'react';
import styles from './SendHeader.module.css';

const SendHeader: React.FC = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>송금하실 상품을 선택해 주세요</h1>
    </header>
  );
};

export default SendHeader; 