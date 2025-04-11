import React from 'react';
import styles from './JobCompleteConfirmModal.module.css';

interface JobCompleteConfirmFinishModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const JobCompleteConfirmFinishModal: React.FC<JobCompleteConfirmFinishModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>일자리를 승인하시겠습니까?</h2>
        
        <div className={styles.iconContainer}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#E8A5A5" strokeWidth="2"/>
            <path d="M7 12L10 15L17 8" stroke="#E8A5A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <p className={styles.description}>
          승인 후에는 취소할 수 없으며, 자녀에게 보상이 지급됩니다.
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

export default JobCompleteConfirmFinishModal; 