import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreateBankProductsPage.module.css';

interface ProductFormData {
  type: 'deposit' | 'saving';
  name: string;
  description: string;
  interestRate: number;
  period: number;
  monthlyPayment?: number; // 적금의 경우에만 사용
}

const CreateBankProductsPage: React.FC = () => {
  const navigate = useNavigate();
  // 상태 관리
  const [formData, setFormData] = useState<ProductFormData>({
    type: 'deposit',
    name: '',
    description: '',
    interestRate: 0,
    period: 0,
    monthlyPayment: 0
  });
  
  // 핸들러 함수들
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'type' ? value : 
              name === 'interestRate' || name === 'period' || name === 'monthlyPayment' ? 
              Number(value) : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // API 호출 및 처리
    console.log('상품 생성:', formData);
    navigate('/bank/products');
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>금융상품 생성</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 상품 유형 선택 */}
        <div className={styles.formGroup}>
          <label htmlFor="type">상품 유형</label>
          <select 
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className={styles.select}
          >
            <option value="deposit">예금</option>
            <option value="saving">적금</option>
          </select>
        </div>
        
        {/* 상품명 */}
        <div className={styles.formGroup}>
          <label htmlFor="name">상품명</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>
        
        {/* 상품 설명 */}
        <div className={styles.formGroup}>
          <label htmlFor="description">상품 설명</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={styles.textarea}
            required
          />
        </div>
        
        {/* 이자율 */}
        <div className={styles.formGroup}>
          <label htmlFor="interestRate">이자율 (%)</label>
          <input
            type="number"
            id="interestRate"
            name="interestRate"
            value={formData.interestRate}
            onChange={handleInputChange}
            className={styles.input}
            required
            min="0"
            step="0.1"
          />
        </div>
        
        {/* 기간 */}
        <div className={styles.formGroup}>
          <label htmlFor="period">기간 (개월)</label>
          <input
            type="number"
            id="period"
            name="period"
            value={formData.period}
            onChange={handleInputChange}
            className={styles.input}
            required
            min="1"
          />
        </div>
        
        {/* 월 납입금 (적금의 경우에만 표시) */}
        {formData.type === 'saving' && (
          <div className={styles.formGroup}>
            <label htmlFor="monthlyPayment">월 납입금 (원)</label>
            <input
              type="number"
              id="monthlyPayment"
              name="monthlyPayment"
              value={formData.monthlyPayment}
              onChange={handleInputChange}
              className={styles.input}
              required
              min="0"
            />
          </div>
        )}
        
        <div className={styles.buttonGroup}>
          <button type="button" onClick={() => navigate('/bank/products')} className={styles.cancelButton}>
            취소
          </button>
          <button type="submit" className={styles.submitButton}>
            상품 생성
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBankProductsPage; 