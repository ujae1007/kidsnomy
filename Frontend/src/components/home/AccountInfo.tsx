import React from 'react';
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

const AccountInfo: React.FC<AccountInfoProps> = ({ data = dummyData }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/account/detail');
  };

  const handleSendMoney = (e: React.MouseEvent) => {
    e.stopPropagation();  // 이벤트 전파 중지
    navigate('/account/send');
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

  return (
    <div className={styles.container}>
      <div className={styles.card} onClick={handleCardClick} style={{ cursor: 'pointer' }}>
        <div className={styles.chipIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" width="35" height="27" viewBox="0 0 35 27" fill="none">
            <path d="M17.0287 16.3418C17.0287 18.4411 16.9415 20.1279 14.6797 21.4341" stroke="currentColor"/>
            <path d="M17.1161 10.0098C17.0462 6.50309 16.9625 4.64219 18.7905 4.12024" stroke="currentColor"/>
            <path d="M0.5 4.55468C0.5 2.62169 2.067 1.05469 4 1.05469H30.0574C31.9904 1.05469 33.5574 2.62169 33.5574 4.55469V22.0165C33.5574 23.9495 31.9904 25.5165 30.0574 25.5165H4C2.067 25.5165 0.5 23.9494 0.5 22.0165V4.55468Z" stroke="currentColor"/>
            <path d="M4.02295 5.60938C4.02295 4.78095 4.69452 4.10938 5.52295 4.10938H28.534C29.3624 4.10938 30.034 4.78095 30.034 5.60938V19.9418C30.034 20.7703 29.3624 21.4418 28.534 21.4418H5.52295C4.69452 21.4418 4.02295 20.7703 4.02295 19.9418V5.60938Z" stroke="currentColor"/>
            <path d="M4.02295 8.18359H12.4181V17.3683H4.02295V8.18359Z" stroke="currentColor"/>
            <path d="M4.02295 13.2773H12.4181V17.3697H4.02295V13.2773Z" stroke="currentColor"/>
            <path d="M11.7441 9.7207H22.3137M22.3137 15.8315H11.7441" stroke="currentColor"/>
            <path d="M21.6392 13.2773H30.0343V17.3697H21.6392V13.2773Z" stroke="currentColor"/>
            <path d="M21.6392 8.18359H30.0343V17.3683H21.6392V8.18359Z" stroke="currentColor"/>
          </svg>
        </div>
        <div className={styles.cardTitle}>{data.user_name}의 통장</div>
        <div className={styles.balance}>
          {data.REC.accountBalance.toLocaleString()} {data.REC.currency}
        </div>
        <div className={styles.accountNumber}>
          {data.REC.accountNo}
        </div>
        <div className={styles.mastercard}>
          <img src={mastercardLogo} alt="Mastercard" />
        </div>
        <button className={styles.sendButton} onClick={handleSendMoney}>송금하기</button>
      </div>
    </div>
  );
};

export default AccountInfo; 