import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreateBankProductsPage.module.css';

interface ProductFormData {
  type: 'deposit' | 'saving';
  name: string;
  description: string;
  interestRate: number;
  period: number;
  monthlyPayment?: number;
  interestPaymentDate?: string;
  depositPaymentDate?: string;
}

const CreateBankProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductFormData>({
    type: 'deposit',
    name: '',
    description: '',
    interestRate: 0,
    period: 0,
    interestPaymentDate: '',
    depositPaymentDate: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('상품 생성:', formData);
    navigate('/bank/products');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>은행 상품 만들기</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>상품 종류</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className={styles.select}
          >
            <option value="deposit">예금</option>
            <option value="saving">적금</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>상품 제목</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="상품 제목을 입력해주세요"
          />
        </div>

        <div className={styles.formGroup}>
          <label>이자</label>
          <div className={styles.inputWithUnit}>
            <input
              type="number"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="이자율을 입력해주세요"
              step="0.1"
            />
            <span className={styles.unit}>%</span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>상세내용</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={styles.textarea}
            placeholder="상세내용을 입력해주세요"
          />
        </div>

        <div className={styles.formGroup}>
          <label>만기일</label>
          <div className={styles.inputWithUnit}>
            <input
              type="number"
              name="period"
              value={formData.period}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="만기일을 입력해주세요"
            />
            <span className={styles.unit}>주</span>
          </div>
        </div>

        {formData.type === 'saving' && (
          <>
            <div className={styles.formGroup}>
              <label>이자 지급 주기</label>
              <div className={styles.inputWithUnit}>
                <input
                  type="text"
                  name="interestPaymentDate"
                  value={formData.interestPaymentDate}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="이자 지급일을 입력해주세요"
                />
                <span className={styles.unit}>일</span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>적금 납입 주기</label>
              <div className={styles.inputWithUnit}>
                <input
                  type="text"
                  name="depositPaymentDate"
                  value={formData.depositPaymentDate}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="적금 납입일을 입력해주세요"
                />
                <span className={styles.unit}>일</span>
              </div>
            </div>
          </>
        )}

        <button type="submit" className={styles.submitButton}>
          만들기
        </button>
      </form>
    </div>
  );
};

export default CreateBankProductsPage; 