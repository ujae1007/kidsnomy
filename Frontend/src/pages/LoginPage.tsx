import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '@/pages/LoginPage.module.css';

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M6.87354 8.9375L9.55633 10.5915C10.4416 11.1373 11.5589 11.1373 12.4442 10.5915L15.127 8.9375" stroke="#A2A2A7" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.74658 7.58203C2.74658 5.92518 4.08973 4.58203 5.74658 4.58203H16.2535C17.9103 4.58203 19.2535 5.92518 19.2535 7.58203V14.4207C19.2535 16.0776 17.9103 17.4207 16.2535 17.4207H5.74658C4.08973 17.4207 2.74658 16.0776 2.74658 14.4207V7.58203Z" stroke="#A2A2A7" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M7 9V7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7V9" stroke="#A2A2A7" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M5.5 9C4.67157 9 4 9.67157 4 10.5V16.5C4 17.3284 4.67157 18 5.5 18H16.5C17.3284 18 18 17.3284 18 16.5V10.5C18 9.67157 17.3284 9 16.5 9H5.5Z" stroke="#A2A2A7" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M11 5C6.52166 5 3.23457 7.94668 2 11C3.23457 14.0533 6.52166 17 11 17C15.4783 17 18.7654 14.0533 20 11C18.7654 7.94668 15.4783 5 11 5Z" stroke="#A2A2A7" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 14C12.6569 14 14 12.6569 14 11C14 9.34315 12.6569 8 11 8C9.34315 8 8 9.34315 8 11C8 12.6569 9.34315 14 11 14Z" stroke="#A2A2A7" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M4 4L18 18" stroke="#A2A2A7" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M11 5C6.52166 5 3.23457 7.94668 2 11C3.23457 14.0533 6.52166 17 11 17C15.4783 17 18.7654 14.0533 20 11" stroke="#A2A2A7" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 14C12.6569 14 14 12.6569 14 11C14 9.34315 12.6569 8 11 8" stroke="#A2A2A7" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    console.log('로그인 페이지: 입력 필드 변경', { name, value });
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('로그인 페이지: 로그인 시도', formData);
    
    try {
      const response = await fetch('api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('로그인 페이지: API 응답 상태', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('로그인 페이지: 로그인 성공', data);
        localStorage.setItem('jwt', data.token);
        navigate('/home');
      } else {
        console.log('로그인 페이지: 로그인 실패');
        alert('로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 페이지: 에러 발생', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  const handleSignupClick = () => {
    console.log('로그인 페이지: 회원가입 페이지로 이동 시도');
    navigate('/signup');
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <span>로그인</span>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>아이디</label>
          <div className={styles.inputContainer}>
            <span className={styles.inputIcon}>
              <EmailIcon />
            </span>
            <input
              type="text"
              name="id"
              className={styles.input}
              value={formData.id}
              onChange={handleInputChange}
              placeholder=""
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>비밀번호</label>
          <div className={styles.inputContainer}>
            <span className={styles.inputIcon}>
              <LockIcon />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className={styles.input}
              value={formData.password}
              onChange={handleInputChange}
              placeholder=""
            />
            <span 
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </span>
          </div>
        </div>

        <button type="submit" className={styles.loginButton}>
          로그인
        </button>
      </form>

      <div className={styles.signupLink} onClick={handleSignupClick}>
        아이디가 없어요 회원가입하러가기
      </div>
    </div>
  );
};

export default LoginPage; 