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

// 더미 데이터 추가
const dummyData = {
  contracts: [
    {
      contract_id: "1",
      title: "설 세배 용돈 모으기 통장",
      content: "설날까지 용돈을 모아보아요",
      account_id: "1234",
      balance: 150000,
      interest_rate: 5.5,
      end_day: "2024-05-01",
      total_volume: 500000
    },
    {
      contract_id: "2",
      title: "일주일에 3,000원 모으기",
      content: "매주 조금씩 저축하는 습관을 길러요",
      account_id: "5678",
      balance: 36000,
      interest_rate: 3.8,
      end_day: "2024-06-15",
      rate_volume: 3000
    },
    {
      contract_id: "3",
      title: "방학 여행 자금 모으기",
      content: "여름 방학 여행을 위한 저축",
      account_id: "9012",
      balance: 250000,
      interest_rate: 4.2,
      end_day: "2024-07-30",
      total_volume: 800000
    }
  ]
};

const FinancialProducts: React.FC<FinancialProductsProps> = ({ data = dummyData }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
        {data.contracts.map(product => (
          <div 
            key={product.contract_id} 
            className={styles.productCard}
            onClick={() => handleCardClick(product)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCardClick(product);
              }
            }}
          >
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