import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AccountInfo.module.css';
import mastercardLogo from '../../assets/mastercard_logo.png';

interface AccountInfoProps {
  data?: {
    user_name: string;
    REC: {
      bankCode: string;
      accountNo: string;
      accountBalance: number;
      accountCreatedDate: string;
      accountExpiryDate: string;
      lastTransactionDate: string;
      currency: string;
    };
  } | null;
}

// 개발용 더미 데이터
const dummyData = {
  user_name: "홍길동",
  REC: {
    bankCode: "004",
    accountNo: "1234-5678-9012",
    accountBalance: 50000,
    accountCreatedDate: "2024-03-01",
    accountExpiryDate: "2025-03-01",
    lastTransactionDate: "2024-03-26",
    currency: "원"
  }
};

const formatAccountNumber = (accountNo: string) => {
  // 계좌번호를 그룹으로 나눠서 표시 (예: 1234-5678-9012)
  if (!accountNo) return '';
  
  // 4자리씩 나누기
  const parts = [];
  for (let i = 0; i < accountNo.length; i += 4) {
    parts.push(accountNo.slice(i, i + 4));
  }
  return parts.join(' ');
};

const formatExpiryDate = (date: string) => {
  const expiryDate = new Date(date);
  const month = String(expiryDate.getMonth() + 1).padStart(2, '0');
  const year = String(expiryDate.getFullYear()).slice(2);
  return `${month}/${year}`;
};

const AccountInfo: React.FC<AccountInfoProps> = ({ data = dummyData }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 480);

  // 화면 크기 변경 감지
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 480);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleCardClick = () => {
    navigate('/account/detail');
  };

  if (!data) {
    return (
      <div className={styles.container}>
        <div className={`${styles.card} ${styles.noAccount}`}>
          <div className={styles.noAccountMessage}>
            <h3>등록된 계좌가 없습니다</h3>
            <p>계좌를 등록하고 서비스를 이용해보세요!</p>
            <button 
              className={styles.registerButton}
              onClick={() => navigate('/account')}
            >
              계좌 등록하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 계좌번호 전체를 표시 (모바일에서도 전체 표시)
  const displayAccountNumber = formatAccountNumber(data.REC.accountNo);

  return (
    <div className={styles.container}>
      <div className={styles.card} onClick={handleCardClick}>
        <div className={styles.cardBackground}></div>
        
        <div className={styles.bankName}>
          <span>KIDSNOMY</span>
          <span className={styles.bankType}>DEBIT</span>
        </div>
        
        <div className={styles.chipContainer}>
          <div className={styles.chipIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="30" viewBox="0 0 40 30" fill="none">
              <path d="M3 5C3 3.34315 4.34315 2 6 2H34C35.6569 2 37 3.34315 37 5V25C37 26.6569 35.6569 28 34 28H6C4.34315 28 3 26.6569 3 25V5Z" fill="#F8F8F8" stroke="#E8A5A5" strokeWidth="1.5"/>
              <path d="M10 9H8V21H10V9Z" fill="#E8A5A5"/>
              <path d="M13 9H11V21H13V9Z" fill="#E8A5A5"/>
              <path d="M18 9H16V21H18V9Z" fill="#E8A5A5"/>
              <path d="M21 9H19V21H21V9Z" fill="#E8A5A5"/>
              <path d="M26 9H24V21H26V9Z" fill="#E8A5A5"/>
              <path d="M29 9H27V21H29V9Z" fill="#E8A5A5"/>
              <path d="M32 9H30V21H32V9Z" fill="#E8A5A5"/>
            </svg>
          </div>
        </div>
        
        <div className={styles.cardNumber}>
          {displayAccountNumber}
        </div>
        
        <div className={styles.cardholderInfo}>
          <div className={styles.expiryDate}>
            <span className={styles.expiryLabel}>VALID THRU</span>
            <span>{formatExpiryDate(data.REC.accountExpiryDate)}</span>
          </div>
        </div>
        
        <div className={styles.balance}>
          {data.REC.accountBalance.toLocaleString()} {data.REC.currency}
        </div>
        
        <div className={styles.cardBrand}>
          <img src={mastercardLogo} alt="Mastercard" />
        </div>
      </div>
    </div>
  );
};

export default AccountInfo; 