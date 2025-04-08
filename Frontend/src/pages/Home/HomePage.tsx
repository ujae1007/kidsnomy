import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '@/hooks/useAuth';
import AccountInfo from '@/components/home/AccountInfo';
import FinancialProducts from '@/components/home/FinancialProducts';
import { apiCall } from '@/utils/api';
import styles from './HomePage.module.css';
import WeeklyCalendar from '@/components/calendar/WeeklyCalendar';

// RootState 타입 정의
interface RootState {
  group: {
    selectedGroupId: number | null;
  };
}

// AccountInfo 컴포넌트에 맞는 타입 정의
interface AccountInfoData {
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

interface MainPageResponse {
  account: {
    id: number;
    userId: number;
    accountNo: string;
    accountPassword: number;
    balance: number;
    createdAt: string;
  };
  jobs: Array<{
    id: number;
    groupId: number;
    employerId: number;
    employeeId: number | null;
    title: string;
    content: string;
    salary: number;
    rewardText: string;
    isPermanent: number;
    startAt: string;
    endAt: string;
    status: number;
  }>;
  deposits: Array<{
    id: number;
    groupId: number;
    userId: number;
    title: string;
    content: string;
    interestRate: number;
    dueDate: number;
    productType: number;
  }>;
  depositContracts: Array<{
    id: number;
    groupId: number;
    userId: number;
    productId: number;
    startDay: string;
    endDay: string;
    accountNo: string;
    balance: number;
    totalVolume: number;
  }>;
  savings: Array<{
    id: number;
    groupId: number;
    userId: number;
    title: string;
    content: string;
    interestRate: number;
    dueDate: number;
    rateDate: number;
    payDate: number;
    productType: number;
  }>;
  savingsContracts: Array<{
    id: number;
    groupId: number;
    userId: number;
    productId: number;
    startDay: string;
    endDay: string;
    accountNo: string;
    balance: number;
    oneTimeVolume: number;
    rateVolume: number;
  }>;
}

const HomePage: React.FC = () => {
  const auth = useAuth();
  const { selectedGroupId } = useSelector((state: RootState) => state.group);
  const [accountData, setAccountData] = useState<AccountInfoData | null>(null);
  const [contractData, setContractData] = useState<any[]>([]);
  const [financialProductsData, setFinancialProductsData] = useState<any>(undefined);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!selectedGroupId) {
      setError('그룹이 선택되지 않았습니다.');
      return;
    }

    if (!auth.isAuthenticated || !auth.accessToken) {
      console.error('인증 정보가 없습니다.');
      setError('로그인이 필요합니다.');
      return;
    }

    console.log('📊 홈 페이지 데이터 로딩 시작');
    try {
      console.log('요청 정보:', {
        groupId: selectedGroupId,
        isAuthenticated: auth.isAuthenticated,
        hasToken: !!auth.accessToken,
        tokenLength: auth.accessToken?.length
      });
      
      const response = await apiCall<MainPageResponse>({
        url: `auth/main/${selectedGroupId}`,
        method: 'GET',
        auth: true,
        data: null
      });

      if (!response) {
        throw new Error('서버로부터 응답을 받지 못했습니다.');
      }

      console.log('서버 응답:', response);

      // 계좌 정보 변환 (계좌가 없는 경우 null 처리)
      const transformedAccountData = response.account ? {
        user_name: "사용자",
        REC: {
          bankCode: "004",
          accountNo: response.account.accountNo,
          accountBalance: response.account.balance,
          accountCreatedDate: response.account.createdAt,
          accountExpiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
          lastTransactionDate: response.account.createdAt,
          currency: "원"
        }
      } : null;
      setAccountData(transformedAccountData);

      // 일자리 정보 변환 (jobs가 없는 경우 빈 배열 처리)
      const transformedJobs = (response.jobs || []).map(job => ({
        user_id: job.employerId,
        user_name: "사용자",
        start_day: job.startAt.split('T')[0],
        end_day: job.endAt.split('T')[0],
        title: job.title,
        content: job.content,
        salary: job.salary,
        is_permanent: job.isPermanent === 1,
        reward_text: job.rewardText,
        status: job.status,
        contract_id: job.id,
        contractor_name: "계약자"
      }));
      setContractData(transformedJobs);

      // 금융 상품 정보 변환 (deposits나 savings가 없는 경우 빈 배열 처리)
      const transformedProducts = [
        ...(response.depositContracts || []).map(contract => ({
          contract_id: String(contract.id),
          title: response.deposits?.find(d => d.id === contract.productId)?.title || "예금 상품",
          content: response.deposits?.find(d => d.id === contract.productId)?.content || "",
          account_id: contract.accountNo,
          balance: contract.balance,
          interest_rate: response.deposits?.find(d => d.id === contract.productId)?.interestRate || 0,
          end_day: contract.endDay,
          total_volume: contract.totalVolume
        })),
        ...(response.savingsContracts || []).map(contract => ({
          contract_id: String(contract.id),
          title: response.savings?.find(s => s.id === contract.productId)?.title || "적금 상품",
          content: response.savings?.find(s => s.id === contract.productId)?.content || "",
          account_id: contract.accountNo,
          balance: contract.balance,
          interest_rate: response.savings?.find(s => s.id === contract.productId)?.interestRate || 0,
          end_day: contract.endDay,
          one_time_volume: contract.oneTimeVolume,
          rate_volume: contract.rateVolume
        }))
      ];
      setFinancialProductsData({ contracts: transformedProducts });

      setError(null);
      console.log('✅ 홈 페이지 데이터 로딩 완료');
    } catch (error: any) {
      console.error('❌ 홈 페이지 데이터 조회 중 에러 발생:', error);
      setError(error.message || '데이터를 불러오는데 실패했습니다.');
    }
  };

  useEffect(() => {
    console.log('🏠 홈 페이지 마운트');
    return () => {
      console.log('🏠 홈 페이지 언마운트');
    };
  }, []);

  useEffect(() => {
    if (auth.isAuthenticated && auth.accessToken) {
      console.log('🔐 인증 상태 확인됨 - 데이터 로드 시작');
      fetchData();
    } else {
      console.warn('⚠️ 인증 상태 없음 - 데이터 로드 건너뜀');
    }
  }, [auth.isAuthenticated, auth.accessToken, selectedGroupId]);

  return (
    <div className={styles.container}>
      {error ? (
        <div className={styles.error}>
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => {
              setError(null);
              if (auth.isAuthenticated && auth.accessToken && selectedGroupId) {
                fetchData();
              }
            }}
          >
            다시 시도
          </button>
        </div>
      ) : (
        <>
          {/* 계좌 정보 컴포넌트 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">나의 통장</h2>
            <AccountInfo data={accountData} />
          </div>

          {/* 달력 컴포넌트 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">일정</h2>
            <WeeklyCalendar contracts={contractData} />
          </div>

          {/* 금융 상품 컴포넌트 */}
          <div>
            <h2 className="text-xl font-semibold mb-2">금융 상품</h2>
            <FinancialProducts data={financialProductsData} />
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage; 
