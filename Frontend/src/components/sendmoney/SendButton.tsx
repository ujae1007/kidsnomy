import React from 'react';
import styles from './SendButton.module.css';

interface SendButtonProps {
  isValid: boolean;
  onSend: () => void;
}

const SendButton: React.FC<SendButtonProps> = ({ isValid, onSend }) => {
  const handleClick = () => {
    console.log('🔄 송금 버튼 클릭:', {
      isValid,
      timestamp: new Date().toISOString()
    });
    onSend();
  };

  return (
    <button
      className={`${styles.button} ${isValid ? styles.valid : styles.invalid}`}
      onClick={handleClick}
      disabled={!isValid}
      aria-disabled={!isValid}
    >
      송금하기
    </button>
  );
};

export default SendButton; 