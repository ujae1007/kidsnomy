import React from 'react';
import styles from './WeeklyExpenseChart.module.css';

interface WeeklyExpenseChartProps {
  weekExpense: {
    week1: number;
    week2: number;
    week3: number;
    week4: number;
    week5: number;
  };
}

const WeeklyExpenseChart: React.FC<WeeklyExpenseChartProps> = ({ weekExpense }) => {
  // 이전 주와 현재 주의 지출 차이 계산
  const calculateExpenseChange = () => {
    const currentWeek = weekExpense.week5;
    const lastWeek = weekExpense.week4;
    const difference = currentWeek - lastWeek;
    const percentageChange = ((difference / lastWeek) * 100).toFixed(0);
    return {
      difference: Math.abs(difference),
      isIncrease: difference > 0,
      percentage: percentageChange
    };
  };

  const expenseChange = calculateExpenseChange();

  // 최대 지출액 찾기 (그래프 스케일링용)
  const maxExpense = Math.max(...Object.values(weekExpense));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>이번 주 소비 : {weekExpense.week5.toLocaleString()}원</h2>
        <p className={styles.subtitle}>
          지난 주보다 {expenseChange.difference.toLocaleString()}원 더 {expenseChange.isIncrease ? '소비했어요' : '절약했어요'}
        </p>
        <span className={`${styles.percentage} ${expenseChange.isIncrease ? styles.increase : styles.decrease}`}>
          {expenseChange.isIncrease ? '+' : '-'}{Math.abs(Number(expenseChange.percentage))}%
        </span>
      </div>

      <div className={styles.chartContainer}>
        {[
          { week: 'week1', label: '2월1주' },
          { week: 'week2', label: '2월2주' },
          { week: 'week3', label: '2월3주' },
          { week: 'week4', label: '2월4주' },
          { week: 'week5', label: '현재주' }
        ].map(({ week, label }) => {
          const amount = weekExpense[week as keyof typeof weekExpense];
          const barHeight = `${(amount / maxExpense) * 100}%`;
          
          return (
            <div key={week} className={styles.barGroup}>
              <div 
                className={`${styles.bar} ${week === 'week5' ? styles.currentWeek : ''}`}
                style={{ height: barHeight }}
              >
                <span className={styles.amountLabel}>
                  {amount.toLocaleString()}원
                </span>
              </div>
              <span className={styles.label}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyExpenseChart;
