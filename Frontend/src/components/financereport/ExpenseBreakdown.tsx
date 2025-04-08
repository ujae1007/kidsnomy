import React from 'react';
import styles from './ExpenseBreakdown.module.css';

interface ExpenseBreakdownProps {
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

const ExpenseBreakdown: React.FC<ExpenseBreakdownProps> = ({ totalExpense }) => {
  // 총 지출액 계산
  const total = Object.values(totalExpense).reduce((acc, curr) => acc + curr, 0);

  // 각 카테고리별 비율 계산 및 정렬
  const expenseItems = Object.entries(totalExpense)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / total) * 100
    }))
    .sort((a, b) => b.amount - a.amount); // 금액이 큰 순서대로 정렬

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>소비 패턴 분석</h3>
      <div className={styles.totalAmount}>총 소비 : {total.toLocaleString()}원</div>
      
      <div className={styles.breakdownList}>
        {expenseItems.map(({ category, amount, percentage }) => (
          <div key={category} className={styles.expenseItem}>
            <div className={styles.categoryInfo}>
              <span className={styles.category}>{category}</span>
              <span className={styles.amount}>{amount.toLocaleString()}원</span>
            </div>
            <div className={styles.barContainer}>
              <div 
                className={styles.bar}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseBreakdown;
