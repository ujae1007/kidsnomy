import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AccountDetailPage.module.css';
import AccountInfo from '../../components/AccountDetail/AccountInfo';
import TransactionHistory from '../../components/AccountDetail/TransactionHistory';
import accountDetailImage from '../../assets/accout_detail.png';

const AccountDetailPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <img 
        src={accountDetailImage} 
        alt="Account Detail" 
        className={styles.image}
      />
      <div className={styles.content}>
        <AccountInfo 
          accountName="통장이름"
          accountNumber="123-456-7890"
          balance={1234567}
        />
        <button 
          className={styles.button}
          onClick={() => navigate('/financereport')}
        >
          금융 리포트 보러가기
        </button>
        <TransactionHistory />
      </div>
    </div>
  );
};

export default AccountDetailPage; 