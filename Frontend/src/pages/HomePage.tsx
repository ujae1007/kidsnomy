import React, { useEffect, useState } from 'react';
import AccountInfo from '@/components/home/AccountInfo';
import Calendar from '@/components/home/Calendar';
import FinancialProducts from '@/components/home/FinancialProducts';

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

const HomePage: React.FC = () => {
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">홈</h1>
      
      {/* 계좌 정보 컴포넌트 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">나의 통장</h2>
        <AccountInfo data={accountData} />
      </div>

      {/* 달력 컴포넌트 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">일정</h2>
        <Calendar contracts={contractData} />
      </div>

      {/* 금융 상품 컴포넌트 */}
      <div>
        <h2 className="text-xl font-semibold mb-2">금융 상품</h2>
        <FinancialProducts data={financialProductsData} />
      </div>
    </div>
  );
};

export default HomePage; 