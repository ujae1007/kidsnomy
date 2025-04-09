import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AccountDetailPage.module.css';

const AccountDetailPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* ... existing code ... */}
      <button 
        className={styles.reportButton}
        onClick={() => navigate('/financereport')}
      >
        금융 리포트 보러가기
      </button>
      {/* ... existing code ... */}
    </div>
  );
};

export default AccountDetailPage; 