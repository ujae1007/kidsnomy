import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ResultPage.module.css';

interface ResultPageState {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const CheckIcon = () => (
  <svg className={styles.icon} width="190" height="192" viewBox="0 0 190 192" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="95" cy="96" r="95" fill="#E8A5A5"/>
    <path d="M52 96L82 126L138 66" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Circle = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="9" fill="#E8A5A5" fillOpacity="0.3"/>
  </svg>
);

const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ResultPageState;

  if (!state) {
    navigate('/');
    return null;
  }

  const { title, description, buttonText, buttonLink } = state;

  const handleButtonClick = () => {
    navigate(buttonLink);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <div className={styles.icon}>
            <CheckIcon />
          </div>
          <Circle className={styles.circle1} />
          <Circle className={styles.circle2} />
          <Circle className={styles.circle3} />
        </div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
        <button className={styles.button} onClick={handleButtonClick}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default ResultPage; 