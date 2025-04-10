import React from 'react';
import styles from './FilterButtons.module.css';

interface FilterButtonsProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  type: 'jobs' | 'products';
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ selectedFilter, onFilterChange, type }) => {
  if (type === 'jobs') {
    return (
      <div className={styles.filterButtons}>
        <button
          className={`${styles.filterButton} ${selectedFilter === 'all' ? styles.active : ''}`}
          onClick={() => onFilterChange('all')}
        >
          전체
        </button>
        <button
          className={`${styles.filterButton} ${selectedFilter === '1' ? styles.active : ''}`}
          onClick={() => onFilterChange('1')}
        >
          계약전
        </button>
        <button
          className={`${styles.filterButton} ${selectedFilter === '2' ? styles.active : ''}`}
          onClick={() => onFilterChange('2')}
        >
          계약후
        </button>
        <button
          className={`${styles.filterButton} ${selectedFilter === '3' ? styles.active : ''}`}
          onClick={() => onFilterChange('3')}
        >
          승인대기
        </button>
        <button
          className={`${styles.filterButton} ${selectedFilter === '4' ? styles.active : ''}`}
          onClick={() => onFilterChange('4')}
        >
          최종완료
        </button>
      </div>
    );
  }

  // products type일 경우의 기존 버튼들
  return (
    <div className={styles.filterButtons}>
      <button
        className={`${styles.filterButton} ${selectedFilter === 'all' ? styles.active : ''}`}
        onClick={() => onFilterChange('all')}
      >
        전체 상품
      </button>
      <button
        className={`${styles.filterButton} ${selectedFilter === 'deposit' ? styles.active : ''}`}
        onClick={() => onFilterChange('deposit')}
      >
        예금 상품
      </button>
      <button
        className={`${styles.filterButton} ${selectedFilter === 'saving' ? styles.active : ''}`}
        onClick={() => onFilterChange('saving')}
      >
        적금 상품
      </button>
    </div>
  );
};

export default FilterButtons; 