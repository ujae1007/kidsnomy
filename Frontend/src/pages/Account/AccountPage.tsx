import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AccountPage.module.css';
import ResultPage from '@/components/common/ResultPage';
import { RESULT_MESSAGES } from '@/constants/messages';

const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    accountNumber: '',
    confirmAccountNumber: ''
  });
  const [showResult, setShowResult] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 계좌 등록 로직 구현
    console.log('계좌 등록:', formData);
    setShowResult(true);
  };

  const handleAccountInfo = () => {
    // 나의 계좌 정보 페이지로 이동
    navigate('/myaccount');
  };

  const handleResultConfirm = () => {
    navigate('/home');  // 홈으로 이동
  };

  if (showResult) {
    return (
      <ResultPage
        title={RESULT_MESSAGES.REGISTER_PRODUCT.title}
        description={RESULT_MESSAGES.REGISTER_PRODUCT.description}
        buttonText={RESULT_MESSAGES.REGISTER_PRODUCT.buttonText}
        onButtonClick={handleResultConfirm}
      />
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>계좌 등록</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="이름"
            className={styles.input}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            placeholder="계좌 비밀번호"
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type="text"
            name="confirmAccountNumber"
            value={formData.confirmAccountNumber}
            onChange={handleChange}
            placeholder="비밀번호 확인"
            className={styles.input}
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          계좌 등록하기
        </button>

        <button 
          type="button" 
          className={styles.infoButton}
          onClick={handleAccountInfo}
        >
          나의 계좌 정보
        </button>
      </form>
    </div>
  );
};

export default AccountPage; 