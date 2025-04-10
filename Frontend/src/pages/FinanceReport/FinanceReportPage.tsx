import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './FinanceReportPage.module.css';
import WeeklyExpenseChart from '@/components/financereport/WeeklyExpenseChart';
import ExpenseComparison from '@/components/financereport/ExpenseComparison';
import ExpenseBreakdown from '@/components/financereport/ExpenseBreakdown';
import { RootState } from '@/store';
import { apiCall } from '@/utils/api';
import { reissueToken } from '@/store/slices/authSlice';

interface FinanceApiResponse {
  weekExpense: {
    week1: number;
    week2: number;
    week3: number;
    week4: number;
    week5: number;
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
  };
  averageWithdrawalRate: number;
}

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

  useEffect(() => {
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

        if (!response.weekExpense || !response.totalExpense) {
          throw new Error('응답 데이터 형식이 올바르지 않습니다');
        }

        // 데이터 변환
        const transformedData: FinanceReportData = {
          weekExpense: {
            ...response.weekExpense,
            weeklyChange: response.weekExpense.week4 !== 0 
              ? ((response.weekExpense.week5 - response.weekExpense.week4) / response.weekExpense.week4) * 100 
              : 0
          },
          userAverageExpense: {
            myExpense: 100 - response.averageWithdrawalRate,
            averageExpense: response.averageWithdrawalRate
          },
          totalExpense: {
            ...response.totalExpense,
            total: Object.values(response.totalExpense).reduce((sum, value) => sum + value, 0)
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
          setError(err.message);
        } else {
          setError('금융 리포트 데이터를 불러오는데 실패했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

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
