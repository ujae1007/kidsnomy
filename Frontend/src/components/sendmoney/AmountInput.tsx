import React from 'react';
import styles from './AmountInput.module.css';

interface AmountInputProps {
  amount: string;
  onAmountChange: (amount: string) => void;
}

const AmountInput: React.FC<AmountInputProps> = ({ amount, onAmountChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    onAmountChange(value);
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>송금하실 금액</label>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={amount}
          onChange={handleChange}
          className={styles.input}
          placeholder="0"
        />
        <span className={styles.currency}>원</span>
      </div>
    </div>
  );
};

export default AmountInput; 