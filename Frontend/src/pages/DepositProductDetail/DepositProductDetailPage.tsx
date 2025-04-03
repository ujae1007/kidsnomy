import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './DepositProductDetailPage.module.css';

interface DepositProduct {
  id: number;
  name: string;
  description: string;
  interestRate: number;
  period: number;
  features: string[];
  benefits: string[];
}

const DepositProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<DepositProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: API 호출로 실제 데이터 가져오기
    const fetchProduct = async () => {
      // 임시 데이터
      setProduct({
        id: Number(id),
        name: '설 세배 용돈 모으기 통장',
        description: '설날까지 용돈을 모아보아요',
        interestRate: 10,
        period: 12,
        features: [
          '설날까지 용돈을 모아보는 특별한 통장',
          '높은 이자율로 더 많은 돈을 모을 수 있어요',
          '기간 동안 자유롭게 입금 가능'
        ],
        benefits: [
          '높은 이자율 10%',
          '설날에 한 번에 큰 돈을 받을 수 있어요',
          '매월 입금 시 추가 혜택'
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

export default DepositProductDetailPage; 