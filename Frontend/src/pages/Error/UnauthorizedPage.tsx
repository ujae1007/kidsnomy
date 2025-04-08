import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ErrorPage.module.css';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    console.log('🔑 로그인 페이지로 이동');
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>🔒</div>
        <h1 className={styles.title}>로그인이 필요합니다</h1>
        <p className={styles.description}>
          이 페이지에 접근하기 위해서는 로그인이 필요합니다.
          <br />
          로그인 후 다시 시도해주세요.
        </p>
        <button 
          className={styles.button}
          onClick={handleLoginClick}
        >
          로그인하기
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage; 