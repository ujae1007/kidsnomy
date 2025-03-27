import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyAccountInfo.module.css';

const MyAccountInfo: React.FC = () => {
  const navigate = useNavigate();

  const handleDelete = () => {
    // TODO: 계좌 삭제 로직 구현
    console.log('계좌 삭제');
    navigate('/account'); // 삭제 후 계좌 등록 페이지로 이동
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>나의 계좌 정보</h1>
      <div className={styles.content}>
        {/* 계좌 정보 내용은 추후 구현 */}
        <div className={styles.accountCard}>
          <div className={styles.accountHeader}>
            <h2>계좌 상세</h2>
          </div>
          <div className={styles.accountDetails}>
            <div className={styles.detailItem}>
              <span className={styles.label}>예금주</span>
              <span className={styles.value}>홍길동</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>계좌번호</span>
              <span className={styles.value}>123-456-789</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>은행</span>
              <span className={styles.value}>키즈노미 은행</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>잔액</span>
              <span className={styles.value}>50,000원</span>
            </div>
          </div>
        </div>
        <button 
          className={styles.deleteButton}
          onClick={handleDelete}
        >
          삭제하기
        </button>
      </div>
    </div>
  );
};

export default MyAccountInfo; 