import React, { useState } from 'react';
import styles from './SavingContractModalPage.module.css';

interface SavingContractModalProps {
  productId: number;
  productName: string;
  interestRate: number;
  period: number;
  monthlyPayment: number;
  onClose: () => void;
  onContract: (contractData: ContractData) => void;
}

interface ContractData {
  agreed: boolean;
}

const SavingContractModalPage: React.FC<SavingContractModalProps> = ({
  productId,
  productName,
  interestRate,
  period,
  monthlyPayment,
  onClose,
  onContract
}) => {
  const [agreed, setAgreed] = useState<boolean>(false);

  const handleAgreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreed(e.target.checked);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('계약 동의를 해주세요.');
      return;
    }
    onContract({ agreed });
  };

  const calculateTotalAmount = () => {
    return monthlyPayment * period;
  };

  const calculateExpectedInterest = () => {
    const totalAmount = calculateTotalAmount();
    return Math.floor(totalAmount * (interestRate / 100) * (period / 12));
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>적금 계약</h2>
        <div className={styles.productInfo}>
          <h3>{productName}</h3>
          <p>이자율: {interestRate}%</p>
          <p>기간: {period}개월</p>
          <p>월 납입금: {monthlyPayment.toLocaleString()}원</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.summaryInfo}>
            <div className={styles.summaryItem}>
              <h4>총 납입금액</h4>
              <p>{calculateTotalAmount().toLocaleString()}원</p>
            </div>
            <div className={styles.summaryItem}>
              <h4>예상 이자</h4>
              <p>{calculateExpectedInterest().toLocaleString()}원</p>
            </div>
          </div>

          <div className={styles.agreement}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={handleAgreeChange}
                required
              />
              <span>계약 내용에 동의합니다.</span>
            </label>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              취소
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!agreed}
            >
              계약하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SavingContractModalPage; 