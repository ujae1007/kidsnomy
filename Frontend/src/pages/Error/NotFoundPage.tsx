import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ErrorPage.module.css';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    console.log('🏠 홈으로 이동');
    navigate('/home');
  };

  const handleBackClick = () => {
    console.log('⬅️ 이전 페이지로 이동');
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>🔍</div>
        <h1 className={styles.title}>페이지를 찾을 수 없습니다</h1>
        <p className={styles.description}>
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          <br />
          URL을 다시 확인해주세요.
        </p>
        <div className={styles.buttonGroup}>
          <button 
            className={`${styles.button} ${styles.secondary}`}
            onClick={handleBackClick}
          >
            이전으로
          </button>
          <button 
            className={styles.button}
            onClick={handleHomeClick}
          >
            홈으로 이동
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 