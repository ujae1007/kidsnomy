import React from 'react';
import styles from './WeeklyExpenseChart.module.css';

interface WeeklyExpenseChartProps {
  weekExpense: {
    week1: number;
    week2: number;
    week3: number;
    week4: number;
    week5: number;
    weeklyChange: number;
  };
}

const WeeklyExpenseChart: React.FC<WeeklyExpenseChartProps> = ({ weekExpense }) => {
  // 최대 지출액 찾기 (그래프 스케일링용)
  const maxExpense = Math.max(
    weekExpense.week1,
    weekExpense.week2,
    weekExpense.week3,
    weekExpense.week4,
    weekExpense.week5
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>이번 주 소비 : {weekExpense.week5.toLocaleString()}원</h2>
        <p className={styles.subtitle}>
          지난 주보다 {Math.abs(weekExpense.week5 - weekExpense.week4).toLocaleString()}원 
          더 {weekExpense.weeklyChange > 0 ? '소비했어요' : '절약했어요'}
        </p>
        <span className={`${styles.percentage} ${weekExpense.weeklyChange > 0 ? styles.increase : styles.decrease}`}>
          {weekExpense.weeklyChange > 0 ? '+' : ''}{weekExpense.weeklyChange.toFixed(0)}%
        </span>
      </div>

      <div className={styles.chartContainer}>
        {[
          { week: 'week1', label: '4주 전' },
          { week: 'week2', label: '3주 전' },
          { week: 'week3', label: '2주 전' },
          { week: 'week4', label: '1주 전' },
          { week: 'week5', label: '이번 주' }
        ].map(({ week, label }) => {
          const amount = weekExpense[week as keyof typeof weekExpense];
          const barHeight = maxExpense > 0 ? `${(amount / maxExpense) * 100}%` : '0%';
          
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
