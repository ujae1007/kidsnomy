import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import kidsLogo from '@assets/kidsnomy_logo.png';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const goToHome = () => {
    navigate('/home');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false); // 네비게이션 후 메뉴 닫기
  };

  return (
    <header className={styles.header}>
      <img 
        src={kidsLogo} 
        alt="KIDSNOMY" 
        className={styles.logo} 
        onClick={goToHome}
      />
      <div className={styles.titleGroup} onClick={goToHome}>
        <h1 className={styles.title}>
          <span className={styles.kidsText}>K<span className={styles.yellowText}>I</span>DS</span>
          <span className={styles.nomyText}>NOMY</span>
        </h1>
        <p className={styles.subtitle}>FINANCIAL EDUCATION</p>
      </div>
      <button className={styles.menuButton} onClick={toggleMenu}>
        <div className={styles.menuIcon} />
        <div className={styles.menuIcon} />
        <div className={styles.menuIcon} />
      </button>
      
      {/* Sliding Menu */}
      <div className={`${styles.menuDrawer} ${isMenuOpen ? styles.open : ''}`}>
        <nav className={styles.menuList}>
          <button className={styles.menuItem}>이름</button>
          <button className={styles.menuItem}>아이디</button>
          <button className={styles.menuItem} onClick={() => handleNavigation('/group')}>그룹 관리</button>
          <button className={styles.menuItem} onClick={() => handleNavigation('/account')}>계좌 등록</button>
          <button className={styles.menuItem}>로그아웃</button>
        </nav>
      </div>
      
      {/* Backdrop */}
      {isMenuOpen && (
        <div className={styles.backdrop} onClick={toggleMenu} />
      )}
    </header>
  );
};

export default Header; 