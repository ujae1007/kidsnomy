import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { apiCall } from '@/utils/api';
import styles from './TransactionHistory.module.css';

interface Transaction {
  transactionUniqueNo: string;
  transactionDate: string;
  transactionTime: string;
  transactionType: string;
  transactionAccountNo: string;
  transactionBalance: number;
  transactionAfterBalance: number;
  transactionSummary: string;
  transactionMemo: string;
}

interface AccountDetail {
  accountNo: string;
  balance: number;
  createdAt: string;
  transactions: Transaction[];
}

const TransactionHistory: React.FC = () => {
  const [accountDetail, setAccountDetail] = useState<AccountDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        console.log('📊 거래내역 조회 시작');
        const response = await apiCall<AccountDetail>('/account/detail', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('✅ 거래내역 조회 성공:', response);
        setAccountDetail(response);
      } catch (error) {
        console.error('❌ 거래내역 조회 실패:', error);
        setError('거래내역을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [accessToken]);

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!accountDetail?.transactions || accountDetail.transactions.length === 0) {
    return <div className={styles.empty}>거래내역이 없습니다.</div>;
  }

  const formatDate = (dateStr: string, timeStr: string) => {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const hour = timeStr.substring(0, 2);
    const minute = timeStr.substring(2, 4);
    
    return `${month}월 ${day}일 ${hour}:${minute}`;
  };

  const formatAmount = (type: string, amount: number) => {
    // 입금(1)인 경우 양수, 출금(2)인 경우 음수로 표시
    const signedAmount = type === '1' ? amount : -amount;
    return signedAmount;
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>입출금 내역</h3>
      <div className={styles.transactionList}>
        {accountDetail.transactions.map((transaction) => (
          <div key={transaction.transactionUniqueNo} className={styles.transaction}>
            <div className={styles.transactionInfo}>
              <span className={styles.date}>
                {formatDate(transaction.transactionDate, transaction.transactionTime)}
              </span>
              <span className={styles.description}>{transaction.transactionSummary}</span>
            </div>
            <span className={`${styles.amount} ${transaction.transactionType === '1' ? styles.positive : styles.negative}`}>
              {transaction.transactionType === '1' ? '+' : '-'}
              {transaction.transactionBalance.toLocaleString()}원
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory; 