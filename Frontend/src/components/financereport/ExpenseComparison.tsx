import React from 'react';
import styles from './ExpenseComparison.module.css';

interface ExpenseComparisonProps {
  userAverageExpense: {
    myExpense: number;
    averageExpense: number;
  };
}

const ExpenseComparison: React.FC<ExpenseComparisonProps> = ({ userAverageExpense }) => {
  const { myExpense, averageExpense } = userAverageExpense;
  
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>사용자 평균 소비 비율 비교</h3>
      
      <div className={styles.comparisonContainer}>
        <div className={styles.expenseItem}>
          <span className={styles.label}>당신의 소비 비율</span>
          <span className={styles.percentage}>{myExpense.toFixed(1)}%</span>
          <div className={styles.barContainer}>
            <div 
              className={styles.bar} 
              style={{ 
                width: `${myExpense}%`,
                backgroundColor: '#914F4F'
              }} 
            />
          </div>
        </div>

        <div className={styles.expenseItem}>
          <span className={styles.label}>사용자의 평균 소비 비율</span>
          <span className={styles.percentage}>{averageExpense.toFixed(1)}%</span>
          <div className={styles.barContainer}>
            <div 
              className={styles.bar} 
              style={{ 
                width: `${averageExpense}%`,
                backgroundColor: '#F8E6E6'
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseComparison;
