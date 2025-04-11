// import React from 'react';
// import styles from './ExpenseBreakdown.module.css';

// interface ExpenseBreakdownProps {
//   totalExpense: {
//     교육: number;
//     의료: number;
//     취미: number;
//     식비: number;
//     "카페/간식": number;
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

// const ExpenseBreakdown: React.FC<ExpenseBreakdownProps> = ({ totalExpense }) => {
//   // 총액을 제외한 카테고리별 지출만 필터링
//   const { total, ...categories } = totalExpense;

//   // 각 카테고리별 비율 계산 및 정렬
//   const expenseItems = Object.entries(categories)
//     .map(([category, amount]) => ({
//       category,
//       amount,
//       percentage: total > 0 ? (amount / total) * 100 : 0
//     }))
//     .sort((a, b) => b.amount - a.amount); // 금액이 큰 순서대로 정렬

//   return (
//     <div className={styles.container}>
//       <h3 className={styles.title}>소비 패턴 분석</h3>
//       <div className={styles.totalAmount}>총 소비 : {total.toLocaleString()}원</div>
      
//       <div className={styles.breakdownList}>
//         {expenseItems.map(({ category, amount, percentage }) => (
//           <div key={category} className={styles.expenseItem}>
//             <div className={styles.categoryInfo}>
//               <span className={styles.category}>{category}</span>
//               <span className={styles.amount}>{amount.toLocaleString()}원</span>
//             </div>
//             <div className={styles.barContainer}>
//               <div 
//                 className={styles.bar}
//                 style={{ width: `${percentage}%` }}
//               />
//               <span className={styles.percentage}>{percentage.toFixed(1)}%</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ExpenseBreakdown;



import React from 'react';
import styles from './ExpenseBreakdown.module.css';

interface ExpenseBreakdownProps {
  totalExpense: {
    교육: number;
    의료: number;
    취미: number;
    식비: number;
    카페_간식: number; // "카페/간식"에서 "카페_간식"으로 변경
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

const ExpenseBreakdown: React.FC<ExpenseBreakdownProps> = ({ totalExpense }) => {
  // 총액을 제외한 카테고리별 지출만 필터링
  const { total, ...categories } = totalExpense;

  // 각 카테고리별 비율 계산 및 정렬
  const expenseItems = Object.entries(categories)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0
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
              <span className={styles.percentage}>{percentage.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseBreakdown;
