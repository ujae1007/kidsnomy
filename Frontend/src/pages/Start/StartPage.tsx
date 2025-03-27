import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StartPage.module.css';
import logo from '@/assets/kidsnomy_logo.png';

const StartPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    console.log('시작 페이지: 로고 클릭됨');
    console.log('시작 페이지: /login 페이지로 이동 시도');
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <div 
        onClick={handleLogoClick}
        className={styles.logoContainer}
      >
        <img 
          src={logo}
          alt="Kidsnomy Logo" 
          className={styles.logo}
        />
        <h1 className={styles.title}>
          <span className={styles.kidsText}>
            <span>K</span>
            <span>I</span>
            <span>DS</span>
          </span>
          <span className={styles.nomyText}>NOMY</span>
        </h1>
        <p className={styles.subtitle}>FINANCIAL EDUCATION</p>
      </div>
    </div>
  );
};

export default StartPage;