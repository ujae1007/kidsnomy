import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './SavingProductDetailPage.module.css';

interface SavingProduct {
  id: number;
  name: string;
  description: string;
  interestRate: number;
  period: number;
  monthlyPayment: number;
  features: string[];
  benefits: string[];
}

const SavingProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<SavingProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: API 호출로 실제 데이터 가져오기
    const fetchProduct = async () => {
      // 임시 데이터
      setProduct({
        id: Number(id),
        name: '일주일에 3,000원 모으기',
        description: '매주 조금씩 저축하는 습관을 길러요',
        interestRate: 10,
        period: 24,
        monthlyPayment: 12000,
        features: [
          '매주 일정 금액을 저축하는 습관 형성',
          '높은 이자율로 더 많은 돈을 모을 수 있어요',
          '자동 이체로 편리하게 저축'
        ],
        benefits: [
          '높은 이자율 10%',
          '매월 자동 이체 시 추가 혜택',
          '저축 목표 달성 시 특별 혜택'
        ]
      });
      setIsLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleContract = () => {
    // TODO: 계약 모달 열기
    console.log('계약하기');
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!product) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{product.name}</h1>
        <p className={styles.description}>{product.description}</p>
      </div>

      <div className={styles.infoSection}>
        <div className={styles.infoCard}>
          <h2>상품 정보</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>이자율</span>
              <span className={styles.value}>{product.interestRate}%</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>기간</span>
              <span className={styles.value}>{product.period}개월</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>월 납입금</span>
              <span className={styles.value}>{product.monthlyPayment.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        <div className={styles.featuresCard}>
          <h2>상품 특징</h2>
          <ul className={styles.featuresList}>
            {product.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>

        <div className={styles.benefitsCard}>
          <h2>혜택</h2>
          <ul className={styles.benefitsList}>
            {product.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.actionSection}>
        <button 
          className={styles.contractButton}
          onClick={handleContract}
        >
          계약하기
        </button>
      </div>
    </div>
  );
};

export default SavingProductDetailPage; 