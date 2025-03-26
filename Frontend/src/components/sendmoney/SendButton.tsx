import React from 'react';
import styles from './SendButton.module.css';

interface SendButtonProps {
  isValid: boolean;
  onSend: () => void;
}

const SendButton: React.FC<SendButtonProps> = ({ isValid, onSend }) => {
  return (
    <button
      className={`${styles.button} ${isValid ? styles.valid : styles.invalid}`}
      onClick={onSend}
      disabled={!isValid}
    >
      송금하기
    </button>
  );
};

export default SendButton; 