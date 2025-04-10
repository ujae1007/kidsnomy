import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './FinanceReportPage.module.css';
import WeeklyExpenseChart from '@/components/financereport/WeeklyExpenseChart';
import ExpenseComparison from '@/components/financereport/ExpenseComparison';
import ExpenseBreakdown from '@/components/financereport/ExpenseBreakdown';
import { RootState } from '@/store';
import { apiCall } from '@/utils/api';
import { reissueToken } from '@/store/slices/authSlice';

// 실제 API 응답 형식 (콘솔 로그에서 확인된 형식)
interface FinanceApiResponse {
  averageWithdrawalRate: number;
  response: {
    weekExpense: {
      week1: number;
      week2: number;
      week3: number;
      week4: number;
      week5: number;
    };
    totalExpense: number | {
      교육?: number;
      의료?: number;
      취미?: number;
      식비?: number;
      카페_간식?: number;
      쇼핑?: number;
      문구?: number;
      미용?: number;
      문화?: number;
      도서?: number;
      생활?: number;
      교통?: number;
      [key: string]: number | undefined;
    };
  };
}

// 애플리케이션에서 사용할 데이터 형식
interface FinanceReportData {
  weekExpense: {
    week1: number;
    week2: number;
    week3: number;
    week4: number;
    week5: number;
    weeklyChange: number;
  };
  userAverageExpense: {
    myExpense: number;
    averageExpense: number;
  };
  totalExpense: {
    교육: number;
    의료: number;
    취미: number;
    식비: number;
    "카페/간식": number;
    쇼핑: number;
    문구: number;
    미용: number;
    문화: number;
    도서: number;
    생활: number;
    교통: number;
    total: number;
  };
}

export default function FinanceReportPage() {
  const [reportData, setReportData] = useState<FinanceReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const dispatch = useDispatch();

  const fetchReportData = async () => {
    if (!accessToken) {
      setError('로그인이 필요합니다.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('=== API 요청 시작 ===');
      
      const response = await apiCall<FinanceApiResponse>('report/finance', {
        method: 'POST',
        auth: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('=== API 응답 전체 데이터 ===');
      console.log(JSON.stringify(response, null, 2));

      if (!response) {
        throw new Error('응답이 비어있습니다');
      }

      // 응답 구조 확인
      if (!response.response || !response.response.weekExpense) {
        throw new Error('응답 데이터 형식이 올바르지 않습니다');
      }

      // 빈 데이터 안전 처리를 위한 기본값 설정
      const defaultCategories = {
        교육: 0,
        의료: 0,
        취미: 0,
        식비: 0,
        카페_간식: 0,
        쇼핑: 0,
        문구: 0,
        미용: 0,
        문화: 0,
        도서: 0,
        생활: 0,
        교통: 0
      };

      // totalExpense가 객체가 아닌 경우(숫자) 처리
      let expenseCategories = defaultCategories;
      
      if (typeof response.response.totalExpense === 'object' && response.response.totalExpense !== null) {
        // 객체인 경우, 각 카테고리 값 사용
        expenseCategories = {
          ...defaultCategories,
          ...response.response.totalExpense
        };
      }
      
      // 데이터 변환 및 총액 계산
      const total = Object.values(expenseCategories).reduce((sum, value) => sum + (value || 0), 0);
      
      const transformedData: FinanceReportData = {
        weekExpense: {
          ...response.response.weekExpense,
          weeklyChange: response.response.weekExpense.week4 !== 0 
            ? ((response.response.weekExpense.week5 - response.response.weekExpense.week4) / response.response.weekExpense.week4) * 100 
            : 0
        },
        userAverageExpense: {
          myExpense: 100 - response.averageWithdrawalRate,
          averageExpense: response.averageWithdrawalRate
        },
        totalExpense: {
          ...expenseCategories,
          "카페/간식": expenseCategories.카페_간식 || 0,
          total: total
        }
      };

      console.log('=== 변환된 데이터 ===');
      console.log(JSON.stringify(transformedData, null, 2));

      setReportData(transformedData);
      setError(null);

    } catch (err) {
      console.error('=== API 호출 에러 ===');
      console.error('에러 객체:', err);
      
      if (err instanceof Error) {
        setError(`금융 리포트 데이터 형식이 올바르지 않습니다: ${err.message}`);
      } else {
        setError('금융 리포트 데이터를 불러오는데 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [accessToken]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>금융 리포트를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>{error}</p>
        <button 
          className={styles.retryButton}
          onClick={fetchReportData}
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!reportData) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>금융 리포트</h1>
      <div className={styles.content}>
        <WeeklyExpenseChart weekExpense={reportData.weekExpense} />
        <ExpenseComparison userAverageExpense={reportData.userAverageExpense} />
        <ExpenseBreakdown totalExpense={reportData.totalExpense} />
      </div>
    </div>
  );
}
