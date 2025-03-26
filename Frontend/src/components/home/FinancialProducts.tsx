import React, { useState, useRef } from 'react';
import styles from './FinancialProducts.module.css';

interface Contract {
  contract_id: string;
  title: string;
  content: string;
  account_id: string;
  balance: number;
  interest_rate: number;
  end_day: string;
  total_volume?: number;
  one_time_volume?: number;
  rate_volume?: number;
}

interface FinancialProductsProps {
  data?: {
    contracts: Contract[];
  };
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}주 후`;
};

const FinancialProducts: React.FC<FinancialProductsProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  if (!data) {
    return <div className={styles.container}>금융 상품 정보를 불러오는 중...</div>;
  }

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollPosition = carouselRef.current.scrollLeft;
      const cardWidth = carouselRef.current.offsetWidth;
      const newIndex = Math.round(scrollPosition / cardWidth);
      setActiveIndex(newIndex);
    }
  };

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  return (
    <div className={styles.container}>
      <div 
        className={styles.carousel}
        ref={carouselRef}
        onScroll={handleScroll}
      >
        {data.contracts.map(product => (
          <div key={product.contract_id} className={styles.productCard}>
            <div className={styles.interestRate}>
              이자율 : {product.interest_rate}%
            </div>
            <div className={styles.balance}>
              모은 돈 : {product.balance.toLocaleString()}원
            </div>
            <div className={styles.title}>
              {product.title}
            </div>
            <div className={styles.content}>
              {product.content}
            </div>
            <div className={styles.additionalInfo}>
              <span>정기 적금 (금융상품 종류)</span>
              <span>만기일: {formatDate(product.end_day)}</span>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.dots}>
        {data.contracts.map((_, index) => (
          <div
            key={index}
            className={`${styles.dot} ${index === activeIndex ? styles.active : ''}`}
            onClick={() => scrollToIndex(index)}
            role="button"
            tabIndex={0}
            aria-label={`${index + 1}번째 상품으로 이동`}
          />
        ))}
      </div>
    </div>
  );
};

export default FinancialProducts; 