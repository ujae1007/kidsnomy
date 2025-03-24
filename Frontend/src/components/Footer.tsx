import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

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
        onClick={() => navigate('/work')}
      >
        <WorkIcon />
        <span>일자리</span>
      </button>
      <button 
        className={`${styles.navButton} ${isActive('/bank') ? styles.active : ''}`}
        onClick={() => navigate('/bank')}
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
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="24" viewBox="0 0 32 24" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M2.1875 10H5.375V18H3.25C2.6632 18 2.1875 18.4477 2.1875 19C2.1875 19.5523 2.6632 20 3.25 20H28.75C29.3368 20 29.8125 19.5523 29.8125 19C29.8125 18.4477 29.3368 18 28.75 18H26.625V10H29.8125C30.2875 9.99955 30.7045 9.70241 30.8338 9.27223C30.9631 8.84205 30.7733 8.38335 30.369 8.14875L16.5565 0.14875C16.2152 -0.0487539 15.7848 -0.0487539 15.4435 0.14875L1.63102 8.14875C1.22667 8.38335 1.03689 8.84205 1.1662 9.27223C1.29551 9.70241 1.71249 9.99955 2.1875 10V10ZM7.5 10H11.75V18H7.5V10ZM18.125 10V18H13.875V10H18.125ZM24.5 18H20.25V10H24.5V18ZM16 2.17375L26.0592 8H5.94078L16 2.17375ZM31.9375 23C31.9375 23.5523 31.4618 24 30.875 24H1.125C0.538197 24 0.0625 23.5523 0.0625 23C0.0625 22.4477 0.538197 22 1.125 22H30.875C31.4618 22 31.9375 22.4477 31.9375 23V23Z" fill="currentColor"/>
  </svg>
);

export default Footer; 