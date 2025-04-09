import React, { useState, useEffect } from 'react';
import styles from './AccountDetailPage.module.css';
import AccountInfo from '../../components/AccountDetail/AccountInfo';
import TransactionHistory from '../../components/AccountDetail/TransactionHistory';
import accountDetailImage from '../../assets/accout_detail.png';

import { useSelector } from 'react-redux';
import { apiCall } from '@/utils/api';
import { RootState } from '@/store';

interface AccountTransaction {
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
  name: string;
  accountNo: string;
  balance: number;
  createdAt: string;
  transactions: AccountTransaction[];
}

const AccountDetailPage: React.FC = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [accountData, setAccountData] = useState<AccountDetail>({
    name: '-',
    accountNo: '-',
    balance: 0,
    createdAt: '-',
    transactions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiCall<AccountDetail>('/account/detail',{
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setAccountData(response);
      } catch (error: any) {
        console.error('API 호출 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
  }, [accessToken]);

  // console.log('accountData', accountData);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    alert(`계좌 정보를 불러오는 데 실패했습니다: ${error}`);
  }

  if (!accountData) {
    alert("계좌 정보가 없습니다.");
  }

  return (
    <div className={styles.container}>
      <img
        src={accountDetailImage}
        alt="Account Detail"
        className={styles.image}
      />
      <div className={styles.content}>
        <AccountInfo
          accountName={(accountData?.name || "이름 없음") + "-의 통장"}
          accountNumber={accountData?.accountNo || '-'}
          balance={accountData?.balance || 0}
        />
        <button className={styles.button}>
          금융 리포트 보러가기
        </button>
        <TransactionHistory/>
      </div>
    </div>
  );
};

export default AccountDetailPage;