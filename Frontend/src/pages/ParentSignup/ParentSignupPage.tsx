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
  phone: string;
  gender: string;
  birth: string;
  age: string;
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

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerify,
}) => {
  const [verificationCode, setVerificationCode] = useState('');

  if (!isOpen) return null;

  const handleVerify = () => {
    console.log('이메일 인증 모달: 인증 코드 입력', verificationCode);
    onVerify(verificationCode);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>이메일을 확인하세요</h2>
        <p>이메일로 인증 코드를 발송했습니다.</p>
        <input
          type="text"
          className={styles.input}
          placeholder="인증 코드를 입력하세요"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <div className={styles.modalButtons}>
          <button className={styles.modalButton} onClick={onClose}>취소</button>
          <button className={styles.modalButton} onClick={handleVerify}>확인</button>
        </div>
      </div>
    </div>
  );
};

const ParentSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const verifiedEmail = useSelector((state: RootState) => state.auth.email);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(Boolean(verifiedEmail));
  const [verificationMessage, setVerificationMessage] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'success' | 'error'>('none');
  const [formData, setFormData] = useState<SignupFormData>({
    email: verifiedEmail || '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    gender: '',
    birth: '',
    age: ''
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
    console.log('부모 회원가입 페이지: 입력 필드 변경', { name, value });
    
    if (name === 'email') {
      setIsEmailVerified(false);
      setVerificationStatus('none');
      setVerificationMessage('');
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
      console.log('이메일 인증 코드 요청:', formData.email);
      
      const response = await apiCall<ApiResponse>('/auth/verification', {
        method: 'POST',
        body: JSON.stringify({ email: formData.email }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.success) {
        // 이메일을 Redux에 저장
        dispatch(setEmail(formData.email));
        
        console.log('이메일 인증 페이지로 이동');
        // 이메일 인증 페이지로 이동
        navigate('/signup/email-verification');
      } else {
        setVerificationError(response.message || '인증 코드 전송에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('인증 코드 전송 실패:', error);
      setVerificationError(error.message || '인증 코드 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerificationCodeSubmit = async (code: string) => {
    try {
      console.log('부모 회원가입 페이지: 인증 코드 확인 시도', code);
      
      const response = await apiCall<ApiResponse>('auth/verification/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain'
        },
        body: JSON.stringify({
          email: formData.email,
          verificationCode: code,
        }),
      });
      
      console.log('부모 회원가입 페이지: 인증 코드 확인 응답', response);
      
      if (response.success) {
        console.log('부모 회원가입 페이지: 이메일 인증 성공');
        setIsEmailVerified(true);
        setVerificationMessage('이메일 인증이 완료되었습니다.');
        setVerificationStatus('success');
        setIsVerificationModalOpen(false);
      } else {
        setVerificationMessage(response.message || '인증 코드가 일치하지 않습니다.');
        setVerificationStatus('error');
      }
    } catch (error) {
      console.error('부모 회원가입 페이지: 인증 코드 확인 에러', error);
      setVerificationMessage('인증 과정에서 오류가 발생했습니다.');
      setVerificationStatus('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEmailVerified) {
      console.log('부모 회원가입 페이지: 이메일 미인증 상태');
      alert('이메일 인증이 필요합니다.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      console.log('부모 회원가입 페이지: 비밀번호 불일치');
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    try {
      console.log('부모 회원가입 페이지: 회원가입 시도', formData);
      
      const signupData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        is_Parent: '1',
        age: formData.age,
        gender: formData.gender,
        parent_email: null,
      };
      
      const response = await apiCall<SignupResponse>('auth/signup/parent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain'
        },
        body: JSON.stringify(signupData),
      });

      console.log('부모 회원가입 페이지: 회원가입 응답', response);

      if (response.success) {
        alert('회원가입이 완료되었습니다.');
        navigate('/login');
      } else {
        alert(response.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('부모 회원가입 페이지: 회원가입 실패', error);
      alert('회원가입 처리 중 오류가 발생했습니다.');
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
              disabled={isEmailVerified}
            >
              {isEmailVerified ? '인증완료' : '이메일 인증'}
            </button>
          </div>
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
            <option value="MALE">남성</option>
            <option value="FEMALE">여성</option>
          </select>
        </div>
        
        <button type="submit" className={styles.submitButton}>
          회원가입
        </button>
      </form>

      <EmailVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onVerify={handleVerificationCodeSubmit}
      />
    </div>
  );
};

export default ParentSignupPage;
