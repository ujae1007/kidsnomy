import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './AccountDetailPage.module.css';
import AccountInfo from '../../components/AccountDetail/AccountInfo';
import TransactionHistory from '../../components/AccountDetail/TransactionHistory';
import accountDetailImage from '../../assets/accout_detail.png';
import { apiCall } from '@/utils/api';
import { RootState } from '@/store';

interface AccountDetailResponse {
  user_name: string;
  bankCode: string;
  accountNo: string;
  accountBalance: number;
  accountCreatedDate: string;
  accountExpiryDate: string;
  lastTransactionDate: string;
  currency: string;
}

const AccountDetailPage: React.FC = () => {
  const [accountDetail, setAccountDetail] = useState<AccountDetailResponse | null>(null);
  const [error, setError] = useState<string>('');
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const fetchAccountDetail = async () => {
      if (!accessToken) {
        setError('로그인이 필요합니다.');
        return;
      }

      try {
        const response = await apiCall<AccountDetailResponse>('/account/check', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        setAccountDetail(response);
      } catch (error: any) {
        console.error('계좌 정보 조회 실패:', error);
        if (error.status === 403) {
          setError('접근 권한이 없습니다. 다시 로그인해주세요.');
        } else {
          setError('계좌 정보를 불러오는데 실패했습니다.');
        }
      }
    };

    fetchAccountDetail();
  }, [accessToken]);

  return (
    <div className={styles.container}>
      <img 
        src={accountDetailImage} 
        alt="Account Detail" 
        className={styles.image}
      />
      <div className={styles.content}>
        {error ? (
          <div className={styles.errorMessage}>{error}</div>
        ) : accountDetail ? (
          <>
            <AccountInfo 
              accountName={accountDetail.user_name}
              accountNumber={accountDetail.accountNo}
              balance={accountDetail.accountBalance}
              bankCode={accountDetail.bankCode}
              currency={accountDetail.currency}
              createdDate={accountDetail.accountCreatedDate}
              expiryDate={accountDetail.accountExpiryDate}
            />
            <button className={styles.button}>
              금융 리포트 보러가기
            </button>
            <TransactionHistory />
          </>
        ) : (
          <div className={styles.loading}>로딩 중...</div>
        )}
      </div>
    </div>
  );
};

export default AccountDetailPage; 