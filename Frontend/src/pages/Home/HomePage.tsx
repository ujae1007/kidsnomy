<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLogout } from '@/hooks/useAuth';
=======
<<<<<<<< HEAD:Frontend/src/pages/HomePage.tsx
========
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLogout } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
>>>>>>> 04db0fed3efbcd3dd59059253db1330f0f86d929
import AccountInfo from '@/components/home/AccountInfo';
import Calendar from '@/components/home/Calendar';
import FinancialProducts from '@/components/home/FinancialProducts';
import { apiCall } from '@/utils/api';
import styles from './HomePage.module.css';
<<<<<<< HEAD
import WeeklyCalendar from '@/components/calendar/WeeklyCalendar';
=======
>>>>>>> 04db0fed3efbcd3dd59059253db1330f0f86d929

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
<<<<<<< HEAD
  // const auth = useAuth();
  // const { logoutUser } = useLogout();
  
  const [accountData, setAccountData] = useState<AccountData | undefined>(undefined);
=======
  const auth = useAuth();
  const { logoutUser } = useLogout();
  const navigate = useNavigate();
  
  const [accountData, setAccountData] = useState<AccountData | null>(null);
>>>>>>> 04db0fed3efbcd3dd59059253db1330f0f86d929
  const [contractData, setContractData] = useState<ContractData[]>([]);
  const [financialProductsData, setFinancialProductsData] = useState<FinancialProductsData | undefined>(undefined);

  useEffect(() => {
    console.log('🏠 홈 페이지 마운트');
    
    return () => {
      console.log('🏠 홈 페이지 언마운트');
    };
  }, []);

  useEffect(() => {
    console.log('🔐 인증 상태 변경 감지:', { 
<<<<<<< HEAD
      // isAuthenticated: auth.isAuthenticated, 
      // hasToken: !!auth.accessToken 
=======
      isAuthenticated: auth.isAuthenticated, 
      hasToken: !!auth.accessToken 
>>>>>>> 04db0fed3efbcd3dd59059253db1330f0f86d929
    });
    
    const fetchData = async () => {
      console.log('📊 홈 페이지 데이터 로딩 시작');
      try {
        console.group('🏦 계좌 정보 조회');
        // 계좌 정보 조회
        const accountData = await apiCall<AccountData>('account/check', {
          method: 'GET',
        });
        console.log('🏦 계좌 정보 조회 완료:', {
          userName: accountData.user_name,
          accountNo: accountData.REC.accountNo,
          balance: accountData.REC.accountBalance
        });
        setAccountData(accountData);
        console.groupEnd();

        console.group('📅 일정 정보 조회');
        // 계약 정보 조회
        const contractData = await apiCall<ContractData[]>('work/child/contracted', {
          method: 'GET',
        });
        console.log('📅 일정 정보 조회 완료:', {
          일정수: contractData.length,
          일정목록: contractData.map(c => ({ 
            제목: c.title, 
            시작일: c.start_day, 
            종료일: c.end_day 
          }))
        });
        setContractData(contractData);
        console.groupEnd();

        // 금융 상품 정보 조회
        const productData = await apiCall<FinancialProductsData>('product/child/contracted', {
          method: 'GET',
        });
        console.group('💰 금융 상품 정보 조회');
        console.log('💰 금융 상품 정보 조회 완료:', {
          userId: productData.user_id,
          상품수: productData.contracts.length,
          상품목록: productData.contracts.map(p => ({
            제목: p.title,
            유형: p.product_type,
            이자율: p.interest_rate
          }))
        });
        setFinancialProductsData(productData);
        console.groupEnd();

        console.log('✅ 홈 페이지 데이터 로딩 완료');
      } catch (error) {
        console.error('❌ 홈 페이지 데이터 조회 중 에러 발생:', error);
<<<<<<< HEAD
        // 에러가 발생해도 undefined로 설정 (null 대신)
        setAccountData(undefined);
        setContractData([]);
        setFinancialProductsData(undefined);
      }
    };

    // if (auth.isAuthenticated && auth.accessToken) {
    //   console.log('🔐 인증 상태 확인됨 - 데이터 로드 시작');
    //   fetchData();
    // } else {
    //   console.warn('⚠️ 인증 상태 없음 - 데이터 로드 건너뜀');
    // }
    
    // 인증 체크 없이 바로 데이터 로드
    console.log('🔐 인증 체크 없이 데이터 로드 시작');
    fetchData();
  }, [/* auth.isAuthenticated, auth.accessToken */]);  // 의존성 배열의 값들만 주석 처리
=======
      }
    };

    if (auth.isAuthenticated && auth.accessToken) {
      console.log('🔐 인증 상태 확인됨 - 데이터 로드 시작');
      fetchData();
    } else {
      console.warn('⚠️ 인증 상태 없음 - 데이터 로드 건너뜀');
    }
  }, [auth.isAuthenticated, auth.accessToken]);
>>>>>>> 04db0fed3efbcd3dd59059253db1330f0f86d929

  // 금융 상품 데이터를 FinancialProducts 컴포넌트가 기대하는 형식으로 변환
  const formattedFinancialData = financialProductsData ? {
    contracts: financialProductsData.contracts.map(product => ({
      ...product,
      contract_id: String(product.contract_id) // number를 string으로 변환
    }))
  } : undefined;

<<<<<<< HEAD
  return (
    <div className={styles.container}>
      <section className={styles.accountSection}>
        <AccountInfo />
      </section>
      <section className={styles.calendarSection}>
        <WeeklyCalendar />
      </section>
      <div className={styles.calendarSection}>
        <h2 className={styles.sectionTitle}>일정</h2>
        <Calendar contracts={contractData} />
      </div>

      <div>
        <h2 className={styles.sectionTitle}>금융 상품</h2>
=======
  // 일자리 조회 페이지로 이동하는 함수
  const handleJobListClick = () => {
    console.log('🏠 홈 페이지: 일자리 조회 페이지로 이동');
    navigate('/parent/jobs');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">홈</h1>
        <div>
          {auth.isParent && (
            <button
              onClick={handleJobListClick}
              className="px-4 py-2 mr-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              일자리 조회
            </button>
          )}
          <button
            onClick={logoutUser}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            로그아웃
          </button>
        </div>
      </div>
      
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
>>>>>>> 04db0fed3efbcd3dd59059253db1330f0f86d929
        <FinancialProducts data={formattedFinancialData} />
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default HomePage; 
=======
export default HomePage; 
>>>>>>>> 04db0fed3efbcd3dd59059253db1330f0f86d929:Frontend/src/pages/Home/HomePage.tsx
>>>>>>> 04db0fed3efbcd3dd59059253db1330f0f86d929
