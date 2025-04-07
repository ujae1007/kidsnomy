import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, setGroupId } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store';
import { apiCall } from '@/utils/api';

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
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
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isParent, error, loading } = useSelector((state: RootState) => state.auth);

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // 이미 인증된 사용자는 홈으로 리디렉션
    if (isAuthenticated) {
      console.log(`로그인 페이지: 인증된 사용자 (${isParent ? '부모' : '자녀'}) 홈으로 리디렉션`);
      navigate('/home');
    }
  }, [isAuthenticated, isParent, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log('로그인 페이지: 입력 필드 변경', { name, value });
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('로그인 페이지: 로그인 시도', loginData);
    
    try {
      // Redux 액션 디스패치
      const resultAction = await dispatch(loginUser(loginData));
      
      if (loginUser.fulfilled.match(resultAction)) {
        const userType = resultAction.payload.isParent ? '부모' : '자녀';
        console.log(`로그인 페이지: 로그인 성공 (${userType})`);

        // 그룹 정보 가져오기
        try {
          const groupResponse = await apiCall<{ groupId: number }[]>('group/check', {
            method: 'GET',
            auth: true
          });
          
          console.log('그룹 정보 조회 성공:', groupResponse);
          
          if (groupResponse && groupResponse.length > 0) {
            // 첫 번째 그룹의 ID를 저장
            localStorage.setItem('groupId', String(groupResponse[0].groupId));
            // Redux 상태 업데이트
            dispatch(setGroupId(groupResponse[0].groupId));
          }
        } catch (error) {
          console.error('그룹 정보 조회 실패:', error);
        }

        navigate('/home');
      }
    } catch (error) {
      console.error('로그인 페이지: 에러 발생', error);
    }
  };

  const handleSignupClick = () => {
    console.log('로그인 페이지: 회원가입 페이지로 이동 시도');
    navigate('/signup');
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h1 className={styles.title}>로그인</h1>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>
              <EmailIcon />
            </div>
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleInputChange}
              placeholder="이메일"
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>
              <LockIcon />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
              placeholder="비밀번호"
              className={styles.input}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.passwordToggle}
            >
              {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
          
          <button 
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        
        <div className={styles.signup}>
          <span className={styles.signupText}>계정이 없으신가요?</span>
          <button onClick={handleSignupClick} className={styles.signupButton}>회원가입하러가기</button>
        </div>

      </div>
    </div>
  );
};

export default LoginPage; 


/* 주석석 */
/* 주석석 */
