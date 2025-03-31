import React from 'react';
import styles from './JobStatusBadge.module.css';

interface JobStatusBadgeProps {
  text: string;
  color: string;
}

const JobStatusBadge: React.FC<JobStatusBadgeProps> = ({ text, color }) => {
  return (
    <div 
      className={styles.badge}
      style={{ backgroundColor: color }}
    >
      {text}
    </div>
  );
};

export default JobStatusBadge; 