import React from 'react';
import styles from './TransactionHistory.module.css';

interface Transaction {
  date: string;
  description: string;
  amount: number;
}

interface TransactionHistoryProps {
  transactions?: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ 
  transactions = [
    { date: '3월 12일', description: 'GS 25', amount: -3800 },
    { date: '3월 11일', description: '씨유용산전점', amount: -12000 },
    { date: '3월 10일', description: '설거지 보상', amount: 1000 }
  ] 
}) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>입출금 내역</h3>
      <div className={styles.transactionList}>
        {transactions.map((transaction, index) => (
          <div key={index} className={styles.transaction}>
            <div className={styles.transactionInfo}>
              <span className={styles.date}>{transaction.date}</span>
              <span className={styles.description}>{transaction.description}</span>
            </div>
            <span className={`${styles.amount} ${transaction.amount > 0 ? styles.positive : styles.negative}`}>
              {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}원
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory; 