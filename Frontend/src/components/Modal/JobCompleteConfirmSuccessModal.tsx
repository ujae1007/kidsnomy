import React from 'react';
import styles from './JobCompleteConfirmModal.module.css';

interface JobCompleteConfirmSuccessModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const JobCompleteConfirmSuccessModal: React.FC<JobCompleteConfirmSuccessModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>상품을 생성하시겠습니까?</h2>
        
        <div className={styles.iconContainer}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#E8A5A5" strokeWidth="2"/>
            <path d="M7 12L10 15L17 8" stroke="#E8A5A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <p className={styles.description}>
          생성 후에는 자녀들이 해당 상품에 가입할 수 있습니다.
        </p>

        <div className={styles.buttonContainer}>
          <button 
            className={`${styles.button} ${styles.confirmButton}`}
            onClick={onConfirm}
          >
            네
          </button>
          <button 
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={onCancel}
          >
            아니요
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCompleteConfirmSuccessModal; 