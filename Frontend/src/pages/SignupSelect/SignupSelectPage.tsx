import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SignupSelectPage.module.css';
import kidsLogo from '@/assets/kidsnomy_logo.png';

const SignupSelectPage: React.FC = () => {
  const navigate = useNavigate();

  const handleChildSignup = () => {
    console.log('회원가입 선택 페이지: 아이 회원가입 선택');
    console.log('회원가입 선택 페이지: /signup/child 페이지로 이동 시도');
    navigate('/signup/child');
  };

  const handleParentSignup = () => {
    console.log('회원가입 선택 페이지: 부모 회원가입 선택');
    console.log('회원가입 선택 페이지: /signup/parent 페이지로 이동 시도');
    navigate('/signup/parent');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>회원가입</h1>
      
      <div className={styles.logoSection}>
        <img src={kidsLogo} alt="KIDSNOMY" className={styles.logo} />
      </div>

      <div className={styles.buttonContainer}>
        <button 
          className={styles.selectButton} 
          onClick={handleChildSignup}
        >
          어린이
        </button>
        <button 
          className={styles.selectButton}
          onClick={handleParentSignup}
        >
          보호자
        </button>
      </div>
    </div>
  );
};

export default SignupSelectPage; 