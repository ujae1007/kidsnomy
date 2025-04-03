import React, { useEffect, useState } from 'react';
import styles from './FinanceReportPage.module.css';
import WeeklyExpenseChart from '@/components/financereport/WeeklyExpenseChart';
import ExpenseComparison from '@/components/financereport/ExpenseComparison';
import ExpenseBreakdown from '@/components/financereport/ExpenseBreakdown';

interface FinanceReportData {
  weekExpense: {
    week1: number;
    week2: number;
    week3: number;
    week4: number;
    week5: number;
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
  };
}

const FinanceReportPage: React.FC = () => {
  const [reportData, setReportData] = useState<FinanceReportData | null>(null);

  useEffect(() => {
    // TODO: API 연동 시 실제 데이터로 교체
    const dummyData: FinanceReportData = {
      weekExpense: {
        week1: 15000,
        week2: 18000,
        week3: 16000,
        week4: 15000,
        week5: 20000
      },
      userAverageExpense: {
        myExpense: 40000,
        averageExpense: 30000
      },
      totalExpense: {
        교육: 50000,
        의료: 10000,
        취미: 30000,
        식비: 100000,
        "카페/간식": 25000,
        쇼핑: 45000,
        문구: 15000,
        미용: 20000,
        문화: 35000,
        도서: 25000,
        생활: 40000,
        교통: 20000
      }
    };

    setReportData(dummyData);
  }, []);

  if (!reportData) {
    return <div>Loading...</div>;
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
};

export default FinanceReportPage;
