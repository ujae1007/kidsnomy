import React, { useState } from 'react';
import styles from './DepositContractModalPage.module.css';

interface DepositContractModalProps {
  productId: number;
  productName: string;
  interestRate: number;
  period: number;
  onClose: () => void;
  onContract: (contractData: ContractData) => void;
}

interface ContractData {
  amount: number;
  agreed: boolean;
}

const DepositContractModalPage: React.FC<DepositContractModalProps> = ({
  productId,
  productName,
  interestRate,
  period,
  onClose,
  onContract
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [agreed, setAgreed] = useState<boolean>(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value.replace(/[^0-9]/g, ''));
    setAmount(value);
  };

  const handleAgreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreed(e.target.checked);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('계약 동의를 해주세요.');
      return;
    }
    onContract({ amount, agreed });
  };

  const calculateExpectedInterest = () => {
    return Math.floor(amount * (interestRate / 100) * (period / 12));
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>예금 계약</h2>
        <div className={styles.productInfo}>
          <h3>{productName}</h3>
          <p>이자율: {interestRate}%</p>
          <p>기간: {period}개월</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="amount">계약 금액</label>
            <input
              type="text"
              id="amount"
              value={amount.toLocaleString()}
              onChange={handleAmountChange}
              placeholder="금액을 입력하세요"
              required
            />
          </div>

          <div className={styles.interestInfo}>
            <h4>예상 이자</h4>
            <p>{calculateExpectedInterest().toLocaleString()}원</p>
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
              disabled={!agreed || amount === 0}
            >
              계약하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepositContractModalPage; 