// import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import styles from './FinanceReportPage.module.css';
// import WeeklyExpenseChart from '@/components/financereport/WeeklyExpenseChart';
// import ExpenseComparison from '@/components/financereport/ExpenseComparison';
// import ExpenseBreakdown from '@/components/financereport/ExpenseBreakdown';
// import { RootState } from '@/store';
// import { apiCall } from '@/utils/api';
// import { reissueToken } from '@/store/slices/authSlice'; // reissueToken은 현재 사용되지 않지만 import 유지

// // 실제 API 응답 형식
// interface FinanceApiResponse {
//   averageWithdrawalRate: number;
//   weekExpense: {
//     week1: number;
//     week2: number;
//     week3: number;
//     week4: number;
//     week5: number;
//   };
//   totalExpense: {
//     교육?: number;
//     의료?: number;
//     취미?: number;
//     식비?: number;
//     카페_간식?: number;
//     쇼핑?: number;
//     문구?: number;
//     미용?: number;
//     문화?: number;
//     도서?: number;
//     생활?: number;
//     교통?: number;
//     [key: string]: number | undefined;
//   };
// }

// // 애플리케이션에서 사용할 데이터 형식
// interface FinanceReportData {
//   weekExpense: {
//     week1: number;
//     week2: number;
//     week3: number;
//     week4: number;
//     week5: number;
//     weeklyChange: number;
//   };
//   userAverageExpense: {
//     myExpense: number;
//     averageExpense: number;
//   };
//   totalExpense: {
//     교육: number;
//     의료: number;
//     취미: number;
//     식비: number;
//     "카페/간식": number; // 컴포넌트에서 사용할 키 이름
//     쇼핑: number;
//     문구: number;
//     미용: number;
//     문화: number;
//     도서: number;
//     생활: number;
//     교통: number;
//     total: number;
//   };
// }

// export default function FinanceReportPage() {
//   const [reportData, setReportData] = useState<FinanceReportData | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const accessToken = useSelector((state: RootState) => state.auth.accessToken);
//   const dispatch = useDispatch(); // dispatch는 현재 사용되지 않지만 유지

//   // *** 수정된 fetchReportData 함수 ***
//   const fetchReportData = async () => {
//     if (!accessToken) {
//       setError('로그인이 필요합니다.');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError(null); // 요청 시작 시 에러 상태 초기화
//       console.log('=== API 요청 시작 ===');

//       const response = await apiCall<FinanceApiResponse>('report/finance', {
//         method: 'POST',
//         auth: true,
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         }
//       });

//       console.log('=== API 응답 전체 데이터 ===');
//       console.log(JSON.stringify(response, null, 2));

//       if (!response) {
//         throw new Error('API 응답이 비어있습니다');
//       }

//       // 응답 구조 확인: 필수 필드가 있는지 확인
//       if (!response.weekExpense || !response.totalExpense || response.averageWithdrawalRate === undefined || response.averageWithdrawalRate === null) {
//         console.error('API 응답 데이터 필수 필드 누락:', response);
//         throw new Error('API 응답 데이터 형식이 올바르지 않습니다 (필수 필드 누락)');
//       }

//       // 기본 카테고리 값 설정
//       const defaultCategories = {
//         교육: 0, 의료: 0, 취미: 0, 식비: 0, 카페_간식: 0, 쇼핑: 0,
//         문구: 0, 미용: 0, 문화: 0, 도서: 0, 생활: 0, 교통: 0
//       };

//       // totalExpense 처리 (API 응답 값과 기본값 병합)
//       let expenseCategories = defaultCategories;
//       if (typeof response.totalExpense === 'object' && response.totalExpense !== null) {
//         // API 응답에 있는 카테고리 값으로 기본값을 덮어씁니다.
//         // API 응답에 없는 카테고리는 기본값(0)을 유지합니다.
//         expenseCategories = Object.keys(defaultCategories).reduce((acc, key) => {
//           // API 응답의 키 ('카페_간식')와 defaultCategories 키 ('카페_간식')가 일치하는지 확인
//           const apiValue = response.totalExpense![key as keyof typeof response.totalExpense];
//           acc[key as keyof typeof defaultCategories] = typeof apiValue === 'number' ? apiValue : 0;
//           return acc;
//         }, {} as typeof defaultCategories);
//       } else {
//          // totalExpense가 객체가 아니거나 null이면 모든 카테고리를 0으로 처리
//          console.warn('API 응답의 totalExpense가 객체가 아니거나 null입니다. 모든 카테고리를 0으로 설정합니다.');
//          expenseCategories = defaultCategories;
//       }


//       // 총액 계산
//       const total = Object.values(expenseCategories).reduce((sum, value) => sum + (value || 0), 0);

//       // weekExpense가 null 또는 undefined일 경우를 대비한 기본값
//        const safeWeekExpense = response.weekExpense || { week1: 0, week2: 0, week3: 0, week4: 0, week5: 0 };

//       // 주간 변화율 계산 (week4가 0이 아닐 때만)
//        const weeklyChange = safeWeekExpense.week4 !== 0 && typeof safeWeekExpense.week4 === 'number' && typeof safeWeekExpense.week5 === 'number'
//          ? ((safeWeekExpense.week5 - safeWeekExpense.week4) / safeWeekExpense.week4) * 100
//          : 0;


//       // 최종적으로 사용할 데이터(FinanceReportData)로 변환
//       const transformedData: FinanceReportData = {
//         weekExpense: {
//           ...safeWeekExpense,
//           weeklyChange: isNaN(weeklyChange) ? 0 : weeklyChange // NaN 방지
//         },
//         userAverageExpense: {
//           // averageWithdrawalRate는 0~100 사이 값으로 가정
//           myExpense: 100 - (response.averageWithdrawalRate || 0),
//           averageExpense: response.averageWithdrawalRate || 0
//         },
//         totalExpense: {
//           ...expenseCategories, // 계산된 카테고리별 지출
//            "카페/간식": expenseCategories.카페_간식 || 0, // 키 이름 '카페_간식' -> '카페/간식'으로 변경 및 할당
//           total: total // 계산된 총 지출
//         }
//       };

//       console.log('=== 변환된 데이터 ===');
//       console.log(JSON.stringify(transformedData, null, 2));

//       setReportData(transformedData);
//       // 에러 상태는 이미 위에서 null로 설정됨

//     } catch (err) {
//       console.error('=== API 호출 또는 데이터 처리 에러 ===');
//       console.error('에러 객체:', err);

//       if (err instanceof Error) {
//         setError(`금융 리포트 데이터 처리 중 오류: ${err.message}`);
//       } else {
//         setError('금융 리포트 데이터를 불러오는데 실패했습니다.');
//       }
//       setReportData(null); // 에러 발생 시 기존 데이터 초기화
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   // *** fetchReportData 함수 끝 ***

//   useEffect(() => {
//     // accessToken이 변경될 때마다 데이터를 다시 가져옵니다.
//     // 컴포넌트 마운트 시 accessToken이 있으면 즉시 호출됩니다.
//     if (accessToken) {
//         fetchReportData();
//     } else {
//         // accessToken이 없으면 로딩 상태 종료 및 로그인 필요 메시지 표시
//         setIsLoading(false);
//         setError('로그인이 필요합니다.');
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [accessToken]); // accessToken이 변경될 때만 실행

//   // 로딩 상태 표시
//   if (isLoading) {
//     return (
//       <div className={styles.loadingContainer}>
//         <div className={styles.loadingSpinner}></div>
//         <p className={styles.loadingText}>금융 리포트를 불러오는 중입니다...</p>
//       </div>
//     );
//   }

//   // 에러 상태 표시
//   if (error) {
//     return (
//       <div className={styles.errorContainer}>
//         <p className={styles.errorText}>{error}</p>
//         {/* 로그인 필요 에러가 아닐 경우에만 재시도 버튼 표시 */}
//         {error !== '로그인이 필요합니다.' && (
//             <button
//               className={styles.retryButton}
//               onClick={fetchReportData}
//             >
//               다시 시도
//             </button>
//         )}
//       </div>
//     );
//   }

//   // 데이터가 성공적으로 로드되지 않은 경우 (이론상 발생하기 어려움)
//   if (!reportData) {
//     return (
//         <div className={styles.errorContainer}>
//            <p className={styles.errorText}>리포트 데이터를 표시할 수 없습니다.</p>
//            <button
//              className={styles.retryButton}
//              onClick={fetchReportData}
//            >
//              다시 시도
//            </button>
//         </div>
//     );
//   }
//   // 성공적으로 데이터를 받아와 리포트 렌더링
//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>금융 리포트</h1>
//       <div className={styles.content}>
//         {/* 각 컴포넌트에 필요한 데이터를 props로 전달 */}
//         <WeeklyExpenseChart weekExpense={reportData.weekExpense} />
//         <ExpenseComparison userAverageExpense={reportData.userAverageExpense} />
//         <ExpenseBreakdown totalExpense={reportData.totalExpense} />
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './FinanceReportPage.module.css';
import WeeklyExpenseChart from '@/components/financereport/WeeklyExpenseChart';
import ExpenseComparison from '@/components/financereport/ExpenseComparison';
import ExpenseBreakdown from '@/components/financereport/ExpenseBreakdown';
import { RootState } from '@/store';
import { apiCall } from '@/utils/api';
import { reissueToken } from '@/store/slices/authSlice'; // reissueToken은 현재 사용되지 않지만 import 유지

// 실제 API 응답 형식
interface FinanceApiResponse {
  averageWithdrawalRate: number;
  weekExpense: {
    week1: number;
    week2: number;
    week3: number;
    week4: number;
    week5: number;
  };
  totalExpense: {
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
    카페_간식: number; // 키 이름 변경 (카페/간식 -> 카페_간식)
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
  const dispatch = useDispatch(); // dispatch는 현재 사용되지 않지만 유지

  // *** 수정된 fetchReportData 함수 ***
  const fetchReportData = async () => {
    if (!accessToken) {
      setError('로그인이 필요합니다.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null); // 요청 시작 시 에러 상태 초기화
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
        throw new Error('API 응답이 비어있습니다');
      }

      // 응답 구조 확인: 필수 필드가 있는지 확인
      if (!response.weekExpense || !response.totalExpense || response.averageWithdrawalRate === undefined || response.averageWithdrawalRate === null) {
        console.error('API 응답 데이터 필수 필드 누락:', response);
        throw new Error('API 응답 데이터 형식이 올바르지 않습니다 (필수 필드 누락)');
      }

      // 기본 카테고리 값 설정
      const defaultCategories = {
        교육: 0, 의료: 0, 취미: 0, 식비: 0, 카페_간식: 0, 쇼핑: 0,
        문구: 0, 미용: 0, 문화: 0, 도서: 0, 생활: 0, 교통: 0
      };

      // totalExpense 처리 (API 응답 값과 기본값 병합)
      let expenseCategories = defaultCategories;
      if (typeof response.totalExpense === 'object' && response.totalExpense !== null) {
        // API 응답에 있는 카테고리 값으로 기본값을 덮어씁니다.
        // API 응답에 없는 카테고리는 기본값(0)을 유지합니다.
        expenseCategories = Object.keys(defaultCategories).reduce((acc, key) => {
          // API 응답의 키 ('카페_간식')와 defaultCategories 키 ('카페_간식')가 일치하는지 확인
          const apiValue = response.totalExpense![key as keyof typeof response.totalExpense];
          acc[key as keyof typeof defaultCategories] = typeof apiValue === 'number' ? apiValue : 0;
          return acc;
        }, {} as typeof defaultCategories);
      } else {
         // totalExpense가 객체가 아니거나 null이면 모든 카테고리를 0으로 처리
         console.warn('API 응답의 totalExpense가 객체가 아니거나 null입니다. 모든 카테고리를 0으로 설정합니다.');
         expenseCategories = defaultCategories;
      }


      // 총액 계산
      const total = Object.values(expenseCategories).reduce((sum, value) => sum + (value || 0), 0);

      // weekExpense가 null 또는 undefined일 경우를 대비한 기본값
       const safeWeekExpense = response.weekExpense || { week1: 0, week2: 0, week3: 0, week4: 0, week5: 0 };

      // 주간 변화율 계산 (week4가 0이 아닐 때만)
       const weeklyChange = safeWeekExpense.week4 !== 0 && typeof safeWeekExpense.week4 === 'number' && typeof safeWeekExpense.week5 === 'number'
         ? ((safeWeekExpense.week5 - safeWeekExpense.week4) / safeWeekExpense.week4) * 100
         : 0;

      // 최종적으로 사용할 데이터(FinanceReportData)로 변환
      const transformedData: FinanceReportData = {
        weekExpense: {
          ...safeWeekExpense,
          weeklyChange: isNaN(weeklyChange) ? 0 : weeklyChange // NaN 방지
        },
        userAverageExpense: {
          // averageWithdrawalRate는 0~100 사이 값으로 가정
          myExpense: 100 - (response.averageWithdrawalRate || 0),
          averageExpense: response.averageWithdrawalRate || 0
        },
        totalExpense: {
          ...expenseCategories, // 계산된 카테고리별 지출
          total: total // 계산된 총 지출
        }
      };

      console.log('=== 변환된 데이터 ===');
      console.log(JSON.stringify(transformedData, null, 2));

      setReportData(transformedData);
      // 에러 상태는 이미 위에서 null로 설정됨

    } catch (err) {
      console.error('=== API 호출 또는 데이터 처리 에러 ===');
      console.error('에러 객체:', err);

      if (err instanceof Error) {
        setError(`금융 리포트 데이터 처리 중 오류: ${err.message}`);
      } else {
        setError('금융 리포트 데이터를 불러오는데 실패했습니다.');
      }
      setReportData(null); // 에러 발생 시 기존 데이터 초기화
    } finally {
      setIsLoading(false);
    }
  };
  // *** fetchReportData 함수 끝 ***

  useEffect(() => {
    // accessToken이 변경될 때마다 데이터를 다시 가져옵니다.
    // 컴포넌트 마운트 시 accessToken이 있으면 즉시 호출됩니다.
    if (accessToken) {
        fetchReportData();
    } else {
        // accessToken이 없으면 로딩 상태 종료 및 로그인 필요 메시지 표시
        setIsLoading(false);
        setError('로그인이 필요합니다.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]); // accessToken이 변경될 때만 실행

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>금융 리포트를 불러오는 중입니다...</p>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>{error}</p>
        {/* 로그인 필요 에러가 아닐 경우에만 재시도 버튼 표시 */}
        {error !== '로그인이 필요합니다.' && (
            <button
              className={styles.retryButton}
              onClick={fetchReportData}
            >
              다시 시도
            </button>
        )}
      </div>
    );
  }

  // 데이터가 성공적으로 로드되지 않은 경우 (이론상 발생하기 어려움)
  if (!reportData) {
    return (
        <div className={styles.errorContainer}>
           <p className={styles.errorText}>리포트 데이터를 표시할 수 없습니다.</p>
           <button
             className={styles.retryButton}
             onClick={fetchReportData}
           >
             다시 시도
           </button>
        </div>
    );
  }
  // 성공적으로 데이터를 받아와 리포트 렌더링
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>금융 리포트</h1>
      <div className={styles.content}>
        {/* 각 컴포넌트에 필요한 데이터를 props로 전달 */}
        <WeeklyExpenseChart weekExpense={reportData.weekExpense} />
        <ExpenseComparison userAverageExpense={reportData.userAverageExpense} />
        <ExpenseBreakdown totalExpense={reportData.totalExpense} />
      </div>
    </div>
  );
}
