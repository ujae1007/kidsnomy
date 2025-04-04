import React from 'react';
import styles from './JobCompleteConfirmModal.module.css';
import Complete from '@/assets/complete.png';

interface JobCompleteConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const JobCompleteConfirmModal: React.FC<JobCompleteConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>업무가 확실히 끝났습니까?</h2>
        
        <div className={styles.imageContainer}>
          <img src={Complete} alt="완료" className={styles.image} />
        </div>

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

export default JobCompleteConfirmModal; 