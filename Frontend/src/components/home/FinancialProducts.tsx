import React, { useState, useRef } from 'react';
import styles from './FinancialProducts.module.css';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  // 데이터가 없거나 contracts 배열이 비어있을 때 빈 카드 표시
  const contracts = data?.contracts?.length ? data.contracts : [{
    contract_id: "0",
    title: "금융 상품이 없습니다",
    content: "새로운 금융 상품을 만들어보세요",
    account_id: "",
    balance: 0,
    interest_rate: 0,
    end_day: new Date().toISOString(),
    total_volume: 0
  }];

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

  const handleCardClick = (product: Contract) => {
    if (product.total_volume) {
      navigate(`/bank/products/deposit/${product.contract_id}`);
    } else if (product.rate_volume) {
      navigate(`/bank/products/saving/${product.contract_id}`);
    }
  };

  return (
    <div className={styles.container}>
      <div 
        className={styles.carousel}
        ref={carouselRef}
        onScroll={handleScroll}
      >
        {contracts.map(product => (
          <div 
            key={product.contract_id} 
            className={styles.productCard}
            onClick={() => product.contract_id !== "0" && handleCardClick(product)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && product.contract_id !== "0") {
                handleCardClick(product);
              }
            }}
          >
            {product.contract_id === "0" ? (
              <>
                <div className={styles.title}>
                  {product.title}
                </div>
                <div className={styles.content}>
                  {product.content}
                </div>
              </>
            ) : (
              <>
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
                  <span>
                    {product.total_volume ? '목표 금액 저축' : 
                     product.rate_volume ? '정기 저축' : '금융상품'}
                  </span>
                  <span>만기일: {formatDate(product.end_day)}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <div className={styles.dots}>
        {contracts.map((_, index) => (
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