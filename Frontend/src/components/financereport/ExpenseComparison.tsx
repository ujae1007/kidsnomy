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
  
  // 비율 계산
  const myExpensePercentage = Math.round((myExpense / (myExpense + averageExpense)) * 100);
  const averageExpensePercentage = Math.round((averageExpense / (myExpense + averageExpense)) * 100);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>사용자 평균 소비 비율 비교</h3>
      
      <div className={styles.comparisonContainer}>
        <div className={styles.expenseItem}>
          <span className={styles.label}>당신의 소비 비율</span>
          <span className={styles.percentage}>{myExpensePercentage}%</span>
          <div className={styles.barContainer}>
            <div 
              className={styles.bar} 
              style={{ 
                width: '100%',
                backgroundColor: '#914F4F'
              }} 
            />
          </div>
        </div>

        <div className={styles.expenseItem}>
          <span className={styles.label}>사용자의 평균 소비 비율</span>
          <span className={styles.percentage}>{averageExpensePercentage}%</span>
          <div className={styles.barContainer}>
            <div 
              className={styles.bar} 
              style={{ 
                width: `${(averageExpensePercentage / myExpensePercentage) * 100}%`,
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
