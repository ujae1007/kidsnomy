import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChildBankProductsPage.module.css';
import JobCard from '@/components/jobs/JobCard';
import SearchBar from '@/components/jobs/SearchBar';
import FilterButtons from '@/components/jobs/FilterButtons';

interface BankProduct {
  id: number;
  name: string;
  description: string;
  interestRate: number;
  period: number;
  type: 'deposit' | 'saving';
  monthlyPayment?: number;
}

const ChildBankProductsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [products] = useState<BankProduct[]>([
    {
      id: 1,
      name: '설 세배 용돈 모으기 통장',
      description: '설날까지 용돈을 모아보아요',
      interestRate: 10,
      period: 12,
      type: 'deposit',
    },
    {
      id: 2,
      name: '일주일에 3,000원 모으기',
      description: '매주 조금씩 저축하는 습관을 길러요',
      interestRate: 10,
      period: 24,
      type: 'saving',
      monthlyPayment: 12000,
    }
  ]);
  const navigate = useNavigate();

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const handleProductClick = (product: BankProduct) => {
    if (product.type === 'deposit') {
      navigate(`deposit/${product.id}`);
    } else {
      navigate(`saving/${product.id}`);
    }
  };

  const filteredProducts = products.filter(product => {
    // 검색어 필터링
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // 상품 유형 필터링
    switch (selectedFilter) {
      case 'deposit':
        return product.type === 'deposit';
      case 'saving':
        return product.type === 'saving';
      case 'contracted':
        // TODO: 계약된 상품 필터링 로직 추가
        return true;
      default:
        return true;
    }
  }).sort((a, b) => {
    // 최신순 정렬
    if (selectedFilter === 'latest') {
      return b.id - a.id;
    }
    return 0;
  });

  return (
    <div className={styles.container}>
      <SearchBar 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />
      
      <FilterButtons
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
        type="products"
      />

      <div className={styles.productList}>
        {filteredProducts.map(product => (
          <JobCard
            key={product.id}
            status={product.type === 'deposit' ? '예금' : '적금'}
            title={product.name}
            salary={product.type === 'deposit' ? product.period * 10000 : product.monthlyPayment || 0}
            onClick={() => handleProductClick(product)}
            onMoreClick={() => handleProductClick(product)}
          >
            <div className={styles.productInfo}>
              <div className={styles.infoRow}>
                <span className={styles.label}>이자율</span>
                <span className={styles.value}>{product.interestRate}%</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>기간</span>
                <span className={styles.value}>{product.period}개월</span>
              </div>
              {product.type === 'saving' && (
                <div className={styles.infoRow}>
                  <span className={styles.label}>월 납입금</span>
                  <span className={styles.value}>{product.monthlyPayment?.toLocaleString()}원</span>
                </div>
              )}
            </div>
          </JobCard>
        ))}
      </div>
    </div>
  );
};

export default ChildBankProductsPage; 