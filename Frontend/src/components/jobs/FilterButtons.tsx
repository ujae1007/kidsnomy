import React from 'react';
import styles from './FilterButtons.module.css';

interface FilterButtonsProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  type?: 'jobs' | 'products';
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ selectedFilter, onFilterChange, type = 'jobs' }) => {
  const filters = type === 'products' ? [
    { id: 'all', label: '전체 상품' },
    { id: 'deposit', label: '예금 상품' },
    { id: 'saving', label: '적금 상품' },
    { id: 'latest', label: '최신순' },
  ] : [
    { id: 'all', label: '전체 일자리' },
    { id: '4', label: '완료' },
    { id: 'contracted', label: '계약 후' },
    { id: 'latest', label: '최신순' },
  ];

  return (
    <div className={styles.filterContainer}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          className={`${styles.filterButton} ${selectedFilter === filter.id ? styles.active : ''}`}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons; 