import React, { useEffect, useState } from 'react';
import AccountInfo from '../components/home/AccountInfo';
import Calendar from '../components/home/Calendar';
import FinancialProducts from '../components/home/FinancialProducts';
import styles from './HomePage.module.css';

interface AccountData {
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
}

interface ContractData {
  user_id: number;
  user_name: string;
  start_day: string;
  end_day: string;
  title: string;
  content: string;
  salary: number;
  is_permanent: boolean;
  reward_text: string;
  status: number;
  contract_id: number;
  contractor_name: string;
}

interface FinancialProduct {
  contract_id: number;
  product_type: number;
  title: string;
  content: string;
  interest_rate: number;
  due_date: number;
  start_day: string;
  end_day: string;
  account_id: string;
  balance: number;
  total_volume?: number;
  one_time_volume?: number;
  rate_volume?: number;
}

interface FinancialProductsData {
  user_id: number;
  contracts: FinancialProduct[];
}

const HomePage = () => {
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [contractData, setContractData] = useState<ContractData[]>([]);
  const [financialProductsData, setFinancialProductsData] = useState<FinancialProductsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 계좌 정보 조회
        const token = localStorage.getItem('jwt');
        const accountResponse = await fetch('api/account/check', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('계좌 정보 조회 응답:', accountResponse.status);
        if (accountResponse.ok) {
          const accountData = await accountResponse.json();
          setAccountData(accountData);
        }

        // 계약 정보 조회
        const contractResponse = await fetch('api/work/child/contracted', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('계약 정보 조회 응답:', contractResponse.status);
        if (contractResponse.ok) {
          const contractData = await contractResponse.json();
          setContractData(contractData);
        }

        // 금융 상품 정보 조회
        const productResponse = await fetch('api/product/child/contracted', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('금융 상품 정보 조회 응답:', productResponse.status);
        if (productResponse.ok) {
          const productData = await productResponse.json();
          setFinancialProductsData(productData);
        }
      } catch (error) {
        console.error('데이터 조회 중 에러 발생:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.chipIcon} />
          <div className={styles.cardInfo}>
            <div className={styles.cardTitle}>이승민의 통장</div>
            <div className={styles.balance}>10,000원</div>
          </div>
          <div className={styles.mastercard}>
            <img src="/mastercard-logo.png" alt="Mastercard" />
          </div>
        </div>
        <div className={styles.accountNumber}>1234 1234 1234(계좌번호)</div>
        <button className={styles.sendButton}>송금하기</button>
      </div>

      <div className={styles.calendar}>
        <div className={styles.calendarHeader}>
          <div className={styles.dayButton}>월</div>
          <div className={styles.dayButton}>화</div>
          <div className={styles.dayButton}>수</div>
        </div>
        <div className={styles.transactionList}>
          {/* 거래 내역은 추후 데이터와 연동하여 표시 */}
        </div>
      </div>

      <div className={styles.actionButtons}>
        <button className={styles.actionButton}>백덤블링 하기</button>
        <button className={styles.actionButton}>학원갔다가 비행기</button>
      </div>
    </div>
  );
};

export default HomePage; 