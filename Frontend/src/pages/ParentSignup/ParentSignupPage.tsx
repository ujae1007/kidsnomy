import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ParentSignupPage.module.css';
import { apiCall } from '@/utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { setEmail, clearEmail } from '@/store/slices/authSlice';
import { RootState } from '@/store';

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  age: string;
  gender: string;
}

// API 응답 타입 정의
interface ApiResponse {
  message: string;
  success: boolean;
}

interface SignupResponse extends ApiResponse {
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
}

const ParentSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const verifiedEmail = useSelector((state: RootState) => state.auth.email);
  const [isEmailVerified, setIsEmailVerified] = useState(Boolean(verifiedEmail));
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'success' | 'error'>('none');
  const [formData, setFormData] = useState<SignupFormData>({
    email: verifiedEmail || '',
    password: '',
    confirmPassword: '',
    name: '',
    age: '',
    gender: ''
  });
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  // 컴포넌트가 언마운트될 때 이메일 정보 초기화
  useEffect(() => {
    return () => {
      dispatch(clearEmail());
    };
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'email') {
      setIsEmailVerified(false);
      setVerificationStatus('none');
      setVerificationMessage('');
      setVerificationCode('');
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleSendVerificationCode = async () => {
    if (!formData.email) {
      setVerificationError('이메일을 입력해주세요.');
      return;
    }

    try {
      setIsSendingCode(true);
      setVerificationError('');
      
      const response = await apiCall<ApiResponse>('/auth/verification', {
        method: 'POST',
        body: JSON.stringify({ email: formData.email }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setVerificationMessage('인증 코드가 전송되었습니다.');
      setVerificationStatus('none');
      
    } catch (error: any) {
      if (error.status === 409) {
        setVerificationError('이미 가입된 이메일입니다.');
      } else {
        setVerificationError(error.message || '인증 코드 전송에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setVerificationError('인증 코드를 입력해주세요.');
      return;
    }

    try {
      const response = await apiCall<ApiResponse>('/auth/verification/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          verificationCode: parseInt(verificationCode)
        })
      });

      if (response.success) {
        setIsEmailVerified(true);
        setVerificationMessage('이메일 인증이 완료되었습니다.');
        setVerificationStatus('success');
        dispatch(setEmail(formData.email));
      } else {
        setVerificationMessage(response.message);
        setVerificationStatus('error');
      }
    } catch (error: any) {
      setVerificationMessage('인증 코드가 일치하지 않습니다.');
      setVerificationStatus('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEmailVerified) {
      alert('이메일 인증이 필요합니다.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    try {
      const signupData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender
      };
      
      const response = await apiCall<SignupResponse>('/auth/signup/parent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupData)
      });

      if (response.success) {
        alert('회원가입이 완료되었습니다.');
        navigate('/login');
      } else {
        alert(response.message || '회원가입에 실패했습니다.');
      }
    } catch (error: any) {
      if (error.status === 400) {
        alert('이메일 인증이 필요합니다.');
      } else if (error.status === 403) {
        alert('이메일이 인증되지 않았습니다.');
      } else if (error.status === 409) {
        alert('해당 이메일은 이미 사용 중입니다.');
      } else if (error.status === 502) {
        alert('외부 API 응답이 비정상입니다.');
      } else {
        alert('회원가입 처리 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>회원가입</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <label className={styles.label}>이름</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>
        
        <div>
          <label className={styles.label}>이메일</label>
          <div className={styles.emailContainer}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={styles.emailInput}
              required
              placeholder="이메일"
              disabled={isEmailVerified}
            />
            <button
              type="button"
              onClick={handleSendVerificationCode}
              className={styles.verificationButton}
              disabled={isEmailVerified || isSendingCode}
            >
              {isEmailVerified ? '인증완료' : isSendingCode ? '전송 중...' : '인증코드 받기'}
            </button>
          </div>
          {verificationMessage && (
            <div className={`${styles.message} ${styles[verificationStatus]}`}>
              {verificationMessage}
            </div>
          )}
          {!isEmailVerified && verificationStatus !== 'success' && (
            <div className={styles.verificationCodeContainer}>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className={styles.verificationCodeInput}
                placeholder="인증 코드 입력"
              />
              <button
                type="button"
                onClick={handleVerifyCode}
                className={styles.verifyButton}
                disabled={!verificationCode}
              >
                인증하기
              </button>
            </div>
          )}
          {verificationError && (
            <div className={styles.errorMessage}>
              {verificationError}
            </div>
          )}
        </div>
        
        <div>
          <label className={styles.label}>비밀번호</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>
        
        <div>
          <label className={styles.label}>비밀번호 확인</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>
        
        <div>
          <label className={styles.label}>나이</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>
        
        <div>
          <label className={styles.label}>성별</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className={styles.select}
            required
          >
            <option value="">선택하세요</option>
            <option value="Male">남성</option>
            <option value="Female">여성</option>
          </select>
        </div>
        
        <button type="submit" className={styles.submitButton}>
          회원가입
        </button>
      </form>
    </div>
  );
};

export default ParentSignupPage;
