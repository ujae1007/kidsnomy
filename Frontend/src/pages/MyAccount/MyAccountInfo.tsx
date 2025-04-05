import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './MyAccountInfo.module.css';
import { apiCall } from '@/utils/api';
import { RootState } from '@/store';

interface AccountInfo {
  user_name: string;
  bankCode: string;
  accountNo: string;
  accountBalance: number;
  accountCreatedDate: string;
  accountExpiryDate: string;
  lastTransactionDate: string;
  currency: string;
}

interface CloseAccountResponse {
  status: string;
  accountNo: string;
  refundAccountNo: string;
  accountBalance: number;
}

const MyAccountInfo: React.FC = () => {
  const navigate = useNavigate();
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      if (!accessToken) {
        setError('로그인이 필요합니다.');
        return;
      }

      try {
        const response = await apiCall<AccountInfo>('/account/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
        setAccountInfo(response);
      } catch (error) {
        console.error('계좌 정보 조회 중 에러 발생:', error);
        setError('계좌 정보를 불러오는데 실패했습니다.');
      }
    };

    fetchAccountInfo();
  }, [accessToken]);

  const handleDelete = async () => {
    if (!accountInfo) return;
    
    if (!window.confirm('정말로 계좌를 해지하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await apiCall<CloseAccountResponse>('account/delete', {
        method: 'DELETE',
        auth: true
      });
      alert('계좌가 정상적으로 해지되었습니다.');
      navigate('/account');
    } catch (error) {
      console.error('계좌 삭제 중 에러 발생:', error);
      alert('계좌 해지에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>나의 계좌 정보</h1>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    );
  }

  if (!accountInfo) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>나의 계좌 정보</h1>
        <div className={styles.loadingMessage}>로딩 중...</div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>나의 계좌 정보</h1>
      <div className={styles.content}>
        <div className={styles.accountCard}>
          <div className={styles.accountHeader}>
            <h2>{accountInfo.user_name}님의 계좌</h2>
          </div>
          <div className={styles.accountDetails}>
            <div className={styles.detailItem}>
              <span className={styles.label}>계좌번호</span>
              <span className={styles.value}>{accountInfo.accountNo}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>잔액</span>
              <span className={styles.value}>{accountInfo.accountBalance.toLocaleString()}원</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>개설일</span>
              <span className={styles.value}>{formatDate(accountInfo.accountCreatedDate)}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>만기일</span>
              <span className={styles.value}>{formatDate(accountInfo.accountExpiryDate)}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>최종 거래일</span>
              <span className={styles.value}>{formatDate(accountInfo.lastTransactionDate)}</span>
            </div>
          </div>
        </div>
        <button 
          className={styles.deleteButton}
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? '삭제 중...' : '삭제하기'}
        </button>
      </div>
    </div>
  );
};

export default MyAccountInfo; 