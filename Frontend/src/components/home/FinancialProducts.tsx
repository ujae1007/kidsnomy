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

// 계좌번호 포맷팅 함수
const formatAccountNumber = (accountId: string) => {
  if (!accountId) return '000-000-000000';
  // 실제 계좌번호 포맷팅 로직 (예: 000-000-000000)
  return `${accountId.slice(0, 3)}-${accountId.slice(3, 6)}-${accountId.slice(6)}`;
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
    } else if (product.rate_volume || product.one_time_volume) {
      console.log('적금 상품 클릭:', product.contract_id);
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
            className={`${styles.productCard} ${product.contract_id === "0" ? styles.emptyCard : ""}`}
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
                <div className={styles.emptyIcon}>
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#E8A5A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8V16" stroke="#E8A5A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 12H16" stroke="#E8A5A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className={styles.title}>
                  {product.title}
                </div>
                <div className={styles.content}>
                  {product.content}
                </div>
              </>
            ) : (
              <>
                <div className={styles.bankLogo}>
                  <span>BANK</span>
                </div>
                
                <div className={styles.accountNumberRow}>
                  <span className={styles.accountNumber}>
                    {formatAccountNumber(product.account_id)}
                  </span>
                </div>
                
                <div className={styles.title}>
                  {product.title}
                </div>
                
                <div className={styles.content}>
                  {product.content}
                </div>
                
                <div className={styles.balance}>
                  {product.balance.toLocaleString()}원
                </div>
                
                <div className={styles.additionalInfo}>
                  <span>
                    {product.total_volume ? '목표 금액 저축' : 
                     product.rate_volume ? '정기 저축' : '금융상품'}
                  </span>
                  <span>만기일: {formatDate(product.end_day)}</span>
                </div>
                
                <div className={styles.stampArea}>
                  Verified
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