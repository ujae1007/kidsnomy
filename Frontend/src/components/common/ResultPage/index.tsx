import React from 'react';
import styles from './ResultPage.module.css';

interface ResultPageProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
}

const ResultPage: React.FC<ResultPageProps> = ({
  title,
  description,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <div className={styles.icon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="190" height="192" viewBox="0 0 190 192" fill="none">
              <path d="M95 192C147.467 192 190 149.019 190 96C190 42.9807 147.467 0 95 0C42.5329 0 0 42.9807 0 96C0 149.019 42.5329 192 95 192Z" fill="#DB9999"/>
              <path
                d="M50 96L80 126L140 66"
                stroke="white"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {/* Decorative circles */}
          <svg className={styles.circle1} width="17.892" height="17.952" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="9" r="9" fill="#DB9999" fillOpacity="0.6"/>
          </svg>
          <svg className={styles.circle2} width="10.908" height="10.945" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="5.5" cy="5.5" r="5.5" fill="#DB9999" fillOpacity="0.25"/>
          </svg>
          <svg className={styles.circle3} width="10.908" height="10.945" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="5.5" cy="5.5" r="5.5" fill="#DB9999" fillOpacity="0.5"/>
          </svg>
        </div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
        <button className={styles.button} onClick={onButtonClick}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default ResultPage; 