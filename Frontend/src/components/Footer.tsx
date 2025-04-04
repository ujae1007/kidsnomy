import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleWorkClick = () => {
    if (auth.isParent) {
      navigate('/parent/jobs');
    } else {
      navigate('/child/jobs');
    }
  };

  const handleBankClick = () => {
    if (auth.isParent) {
      navigate('/bank/products');
    } else {
      navigate('/child/bank/products');
    }
  };

  return (
    <footer className={styles.footer}>
      <button 
        className={`${styles.navButton} ${isActive('/home') ? styles.active : ''}`}
        onClick={() => navigate('/home')}
      >
        <HomeIcon />
        <span>홈</span>
      </button>
      <button 
        className={`${styles.navButton} ${isActive('/work') ? styles.active : ''}`}
        onClick={handleWorkClick}
      >
        <WorkIcon />
        <span>일자리</span>
      </button>
      <button 
        className={`${styles.navButton} ${isActive('/bank') ? styles.active : ''}`}
        onClick={handleBankClick}
      >
        <BankIcon />
        <span>은행</span>
      </button>
    </footer>
  );
};

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M27.125 12.7975V25.4371C27.125 26.6453 26.1456 27.6246 24.9375 27.6246H19.4688C18.2606 27.6246 17.2812 26.6453 17.2812 25.4371V19.9684C17.2812 19.3643 16.7916 18.8746 16.1875 18.8746H11.8125C11.2084 18.8746 10.7188 19.3643 10.7188 19.9684V25.4371C10.7188 26.6453 9.73937 27.6246 8.53125 27.6246H3.0625C1.85438 27.6246 0.875 26.6453 0.875 25.4371V12.7975C0.874907 12.1854 1.13127 11.6012 1.58184 11.1869L12.5193 0.867401L12.5344 0.852362C13.3688 0.0934834 14.6435 0.0934834 15.4779 0.852362C15.4826 0.857712 15.4876 0.862737 15.493 0.867401L26.4305 11.1869C26.8765 11.6034 27.1283 12.1873 27.125 12.7975Z" fill="currentColor"/>
  </svg>
);

const WorkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BankIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="29" height="27" viewBox="0 0 29 27" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M26.5312 4.65625H21.0625V3.5625C21.0625 1.75032 19.5934 0.28125 17.7812 0.28125H11.2188C9.40657 0.28125 7.9375 1.75032 7.9375 3.5625V4.65625H2.46875C1.26063 4.65625 0.28125 5.63563 0.28125 6.84375V24.3438C0.28125 25.5519 1.26063 26.5312 2.46875 26.5312H26.5312C27.7394 26.5312 28.7188 25.5519 28.7188 24.3438V6.84375C28.7188 5.63563 27.7394 4.65625 26.5312 4.65625ZM10.125 3.5625C10.125 2.95844 10.6147 2.46875 11.2188 2.46875H17.7812C18.3853 2.46875 18.875 2.95844 18.875 3.5625V4.65625H10.125V3.5625ZM26.5312 6.84375V12.5326C22.8395 14.5421 18.7032 15.5945 14.5 15.5938C10.297 15.5945 6.16074 14.5426 2.46875 12.534V6.84375H26.5312ZM26.5312 24.3438H2.46875V14.9977C6.21474 16.83 10.3299 17.7821 14.5 17.7812C18.6702 17.7813 22.7853 16.8288 26.5312 14.9963V24.3438ZM11.2188 12.3125C11.2188 11.7084 11.7084 11.2188 12.3125 11.2188H16.6875C17.2916 11.2188 17.7812 11.7084 17.7812 12.3125C17.7812 12.9166 17.2916 13.4062 16.6875 13.4062H12.3125C11.7084 13.4062 11.2188 12.9166 11.2188 12.3125Z" fill="currentColor"/>
  </svg>
);

export default Footer; 