import React, { useEffect } from 'react';
import styles from './FilterButtons.module.css';

interface FilterButtonsProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  type: 'jobs' | 'products';
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ selectedFilter, onFilterChange, type }) => {
  // 컴포넌트 마운트/업데이트 시 props 확인
  useEffect(() => {
    console.log('FilterButtons component received selectedFilter:', selectedFilter);
  }, [selectedFilter]);

  // 필터 변경 함수
  const handleFilterChange = (filter: string) => {
    console.log('FilterButtons - filter button clicked:', filter);
    // 중복 선택 방지 (이미 선택된 필터와 동일한 경우 변경하지 않음)
    if (selectedFilter !== filter) {
      console.log('FilterButtons - calling onFilterChange with:', filter);
      onFilterChange(filter);
    } else {
      console.log('FilterButtons - filter already selected, not changing');
    }
  };

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
        onClick={() => handleFilterChange('all')}
      >
        전체 상품
      </button>
      <button
        className={`${styles.filterButton} ${selectedFilter === 'deposit' ? styles.active : ''}`}
        onClick={() => handleFilterChange('deposit')}
      >
        예금 상품
      </button>
      <button
        className={`${styles.filterButton} ${selectedFilter === 'saving' ? styles.active : ''}`}
        onClick={() => handleFilterChange('saving')}
      >
        적금 상품
      </button>
    </div>
  );
};

export default React.memo(FilterButtons); // React.memo로 불필요한 리렌더링 방지 