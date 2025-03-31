import React from 'react';
import styles from './CreateJobButton.module.css';

interface CreateJobButtonProps {
  onClick: () => void;
}

const CreateJobButton: React.FC<CreateJobButtonProps> = ({ onClick }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      일자리 만들기
    </button>
  );
};

export default CreateJobButton; 