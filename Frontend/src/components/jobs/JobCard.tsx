import React from 'react';
import styles from './JobCard.module.css';

interface JobCardProps {
  status: string;
  title: string;
  salary: number;
  onMoreClick?: () => void;
  onClick?: () => void;
  children?: React.ReactNode;
}

const JobCard: React.FC<JobCardProps> = ({ status, title, salary, onMoreClick, onClick, children }) => {
  return (
    <div 
      className={styles.card} 
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className={styles.statusBadge}>
        {status}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.salary}>{salary.toLocaleString()}원</p>
        {children}
      </div>
      <button 
        className={styles.moreButton} 
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
      >
        ⋮
      </button>
    </div>
  );
};

export default JobCard; 