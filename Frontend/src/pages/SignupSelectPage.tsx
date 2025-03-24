import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SignupSelectPage.module.css';
import kidsLogo from '../assets/kidsnomy-logo.png';

const SignupSelectPage: React.FC = () => {
  const navigate = useNavigate();

  const handleChildClick = () => {
    navigate('/signup/child');
  };

  const handleGuardianClick = () => {
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
          onClick={handleChildClick}
        >
          어린이
        </button>
        <button 
          className={styles.selectButton}
          onClick={handleGuardianClick}
        >
          보호자
        </button>
      </div>
    </div>
  );
};

export default SignupSelectPage; 