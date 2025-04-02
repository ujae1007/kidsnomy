import React from 'react';
import styles from './AmountInput.module.css';

interface AmountInputProps {
  amount: string;
  onAmountChange: (amount: string) => void;
}

const AmountInput: React.FC<AmountInputProps> = ({ amount, onAmountChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const value = rawValue.replace(/[^0-9]/g, '');
    
    console.log('💰 금액 입력 처리:', {
      rawInput: rawValue,
      sanitizedValue: value,
      isValid: /^[0-9]*$/.test(value)
    });
    
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
          aria-label="송금 금액 입력"
        />
        <span className={styles.currency}>원</span>
      </div>
    </div>
  );
};

export default AmountInput; 