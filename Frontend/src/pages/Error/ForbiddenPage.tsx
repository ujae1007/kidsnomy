import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ErrorPage.module.css';

const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    console.log('🏠 홈으로 이동');
    navigate('/home');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>⛔</div>
        <h1 className={styles.title}>접근 권한이 없습니다</h1>
        <p className={styles.description}>
          죄송합니다. 이 페이지에 접근할 수 있는 권한이 없습니다.
          <br />
          홈으로 돌아가서 다른 기능을 이용해주세요.
        </p>
        <button 
          className={styles.button}
          onClick={handleHomeClick}
        >
          홈으로 이동
        </button>
      </div>
    </div>
  );
};

export default ForbiddenPage; 