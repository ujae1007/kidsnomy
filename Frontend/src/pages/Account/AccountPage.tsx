import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './AccountPage.module.css';
import ResultPage from '@/components/common/ResultPage';
import { RESULT_MESSAGES } from '@/constants/messages';
import { apiCall } from '@/utils/api';
import { RootState } from '@/store';

interface AccountResponse {
  accountNo: string;
  balance: number;
}

const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [formData, setFormData] = useState({
    accountPassword: '',
    confirmAccountPassword: ''
  });
  const [showResult, setShowResult] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // 숫자만 입력 가능하도록 처리
    if (name.includes('accountPassword') && !/^\d*$/.test(value)) {
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessToken) {
      setErrorMessage('로그인이 필요합니다.');
      setIsSuccess(false);
      setShowResult(true);
      return;
    }

    // 비밀번호 확인
    if (formData.accountPassword !== formData.confirmAccountPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 비밀번호가 숫자인지 확인
    if (!/^\d+$/.test(formData.accountPassword)) {
      setErrorMessage('비밀번호는 숫자만 입력 가능합니다.');
      return;
    }

    try {
      const response = await apiCall<AccountResponse>('account/create', {
        method: 'POST',
        auth: true,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accountPassword: parseInt(formData.accountPassword)
        })
      });

      setIsSuccess(true);
      setShowResult(true);
      // 성공 시 응답 데이터 저장 또는 처리
      console.log('계좌 생성 성공:', response);
    } catch (error: any) {
      console.error('계좌 생성 실패:', error);
      setIsSuccess(false);
      if (error.status === 403) {
        setErrorMessage('접근 권한이 없습니다. 다시 로그인해주세요.');
      } else if (error.status === 500) {
        setErrorMessage('서버 오류가 발생했습니다.');
      } else {
        setErrorMessage('계좌 등록에 실패했습니다.');
      }
      setShowResult(true);
    }
  };

  const handleAccountInfo = () => {
    navigate('/myaccount');
  };

  const handleResultConfirm = () => {
    if (isSuccess) {
      navigate('/home');
    } else {
      setShowResult(false);
    }
  };

  if (showResult) {
    return (
      <ResultPage
        title={isSuccess ? RESULT_MESSAGES.REGISTER_PRODUCT.title : '계좌 등록 실패'}
        description={isSuccess ? RESULT_MESSAGES.REGISTER_PRODUCT.description : errorMessage}
        buttonText={isSuccess ? RESULT_MESSAGES.REGISTER_PRODUCT.buttonText : '다시 시도'}
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
            placeholder="계좌 비밀번호 (숫자만 입력)"
            className={styles.input}
            maxLength={4}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            name="confirmAccountPassword"
            value={formData.confirmAccountPassword}
            onChange={handleChange}
            placeholder="비밀번호 확인 (숫자만 입력)"
            className={styles.input}
            maxLength={4}
            required
          />
        </div>

        {errorMessage && (
          <div className={styles.errorMessage}>
            {errorMessage}
          </div>
        )}

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