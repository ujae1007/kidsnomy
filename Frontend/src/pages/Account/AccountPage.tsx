import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AccountPage.module.css';
import ResultPage from '@/components/common/ResultPage';
import { RESULT_MESSAGES } from '@/constants/messages';
import { apiCall }from '@/utils/api';

interface AccountResponse {
  accountNo: string;
  balance: number;
}

const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accountPassword: '',
    confirmAccountPassword: ''
  });
  const [showResult, setShowResult] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 비밀번호 확인
    if (formData.accountPassword !== formData.confirmAccountPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await apiCall<AccountResponse>('account/create', {
        method: 'POST',
        auth: true,
        body: JSON.stringify({
          accountPassword: formData.accountPassword
        })
      });

      if (response) {
        setIsSuccess(true);
        setShowResult(true);
      }
    } catch (error) {
      setIsSuccess(false);
      setErrorMessage('계좌 등록에 실패했습니다.');
      setShowResult(true);
    }
  };

  const handleAccountInfo = () => {
    navigate('/myaccount');
  };

  const handleResultConfirm = () => {
    navigate('/home');
  };

  if (showResult) {
    return (
      <ResultPage
        title={isSuccess ? RESULT_MESSAGES.REGISTER_PRODUCT.title : '계좌 등록 실패'}
        description={isSuccess ? RESULT_MESSAGES.REGISTER_PRODUCT.description : errorMessage}
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
            type="password"
            name="accountPassword"
            value={formData.accountPassword}
            onChange={handleChange}
            placeholder="계좌 비밀번호"
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            name="confirmAccountPassword"
            value={formData.confirmAccountPassword}
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