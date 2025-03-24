import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ParentSignupPage.module.css';

interface SignupData {
  email: string;
  password: string;
  name: string;
  is_Parent: string;
  age: string;
  gender: string;
  parent_email: string | null;
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
    onVerify(verificationCode);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-80">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">이메일을 확인하세요.</h2>
          <button onClick={onClose} className="text-gray-500">
            ✕
          </button>
        </div>
        <p className="mb-4">이메일로 인증 코드를 발송해드렸습니다.</p>
        <p className="mb-4">코드를 입력해 주세요.</p>
        <div className="space-y-4">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="인증 코드를 입력하세요"
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleVerify}
            className="w-full p-2 bg-blue-500 text-white rounded"
          >
            인증하기
          </button>
        </div>
      </div>
    </div>
  );
};

const ParentSignupPage = () => {
  const navigate = useNavigate();
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailVerification = async () => {
    if (!formData.email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    try {
      const response = await fetch('api/auth/verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      if (response.ok) {
        setIsVerificationModalOpen(true);
      } else {
        alert('이메일 인증 요청에 실패했습니다.');
      }
    } catch (error) {
      console.error('이메일 인증 요청 에러:', error);
      alert('이메일 인증 요청 중 오류가 발생했습니다.');
    }
  };

  const handleVerificationCodeSubmit = async (code: string) => {
    try {
      const response = await fetch('api/auth/verification/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          code: code,
        }),
      });

      if (response.ok) {
        setIsEmailVerified(true);
        setIsVerificationModalOpen(false);
        alert('이메일 인증이 완료되었습니다.');
      } else {
        alert('인증 코드가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('인증 코드 확인 에러:', error);
      alert('인증 코드 확인 중 오류가 발생했습니다.');
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
      const response = await fetch('api/auth/signup/parent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          is_Parent: '1',
          age: formData.age,
          gender: formData.gender,
          parent_email: null
        }),
      });

      if (response.ok) {
        alert('회원가입이 완료되었습니다.');
        navigate('/login');
      } else {
        alert('회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 에러:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>회원가입</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label>이름</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            placeholder="이름을 입력하세요"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>아이디</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            className={styles.input}
            placeholder="아이디를 입력하세요"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>이메일</label>
          <div className={styles.emailGroup}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.emailInput}
              placeholder="이메일을 입력하세요"
            />
            <button
              type="button"
              onClick={handleEmailVerification}
              className={styles.verifyButton}
              disabled={isEmailVerified}
            >
              {isEmailVerified ? '인증완료' : '인증하기'}
            </button>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
            placeholder="비밀번호를 입력하세요"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>비밀번호 확인</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={styles.input}
            placeholder="비밀번호를 다시 입력하세요"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>나이</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className={styles.input}
            placeholder="나이를 입력하세요"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>성별</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleChange}
              />
              남자
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleChange}
              />
              여자
            </label>
          </div>
        </div>

        <button type="submit" className={styles.signupButton}>
          회원가입
        </button>
      </form>

      {isVerificationModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>이메일을 확인하세요</h2>
            <p>이메일로 인증 코드를 발송했습니다.</p>
            <input
              type="text"
              className={styles.input}
              placeholder="인증 코드를 입력하세요"
              onChange={(e) => handleVerificationCodeSubmit(e.target.value)}
            />
            <div className={styles.modalButtons}>
              <button
                className={styles.modalButton}
                onClick={() => setIsVerificationModalOpen(false)}
              >
                취소
              </button>
              <button
                className={styles.modalButton}
                onClick={() => handleVerificationCodeSubmit}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentSignupPage; 