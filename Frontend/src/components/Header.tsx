import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import kidsLogo from '@assets/kidsnomy_logo.png';
import { useLogout } from '@/hooks/useAuth';
import { apiCall } from '@/utils/api';       

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logoutUser } = useLogout();

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

  const handleLogout = async () => {
    try {
      await apiCall('auth/logout', {
        method: 'POST',
        auth: true
      });
      alert('로그아웃 되었습니다.');
      logoutUser();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('403')) {
          alert('유효하지 않은 토큰입니다.');
        } else if (error.message.includes('404')) {
          alert('해당 사용자가 존재하지 않습니다.');
        } else {
          alert('로그아웃 중 오류가 발생했습니다.');
        }
      }
    }
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
          <button className={styles.menuItem} onClick={() => handleNavigation('/group')}>그룹 관리</button>
          <button className={styles.menuItem} onClick={() => handleNavigation('/account')}>계좌 등록</button>
          <button className={styles.menuItem} onClick={handleLogout}>로그아웃</button>
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