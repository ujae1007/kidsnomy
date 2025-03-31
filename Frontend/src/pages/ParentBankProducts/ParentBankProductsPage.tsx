import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ParentBankProductsPage.module.css';

interface BankProduct {
  id: number;
  name: string;
  description: string;
  interestRate: number;
  period: number;
  type: 'deposit' | 'saving';
}

const ParentBankProductsPage: React.FC = () => {
  const navigate = useNavigate();
  // 상태 관리
  const [products, setProducts] = useState<BankProduct[]>([]);
  const [selectedType, setSelectedType] = useState<'deposit' | 'saving'>('deposit');
  
  // 핸들러 함수들
  const handleCreateProduct = () => {
    navigate('/bank/products/create');
  };
  
  const handleProductClick = (productId: number) => {
    // 상세 페이지로 이동
    console.log('상품 클릭:', productId);
  };
  
  return (
    <div className={styles.container}>
      {/* 상단 탭 (예금/적금) */}
      <div className={styles.tabContainer}>
        <button 
          className={`${styles.tabButton} ${selectedType === 'deposit' ? styles.active : ''}`}
          onClick={() => setSelectedType('deposit')}
        >
          예금
        </button>
        <button 
          className={`${styles.tabButton} ${selectedType === 'saving' ? styles.active : ''}`}
          onClick={() => setSelectedType('saving')}
        >
          적금
        </button>
      </div>
      
      {/* 상품 생성 버튼 */}
      <button 
        className={styles.createButton}
        onClick={handleCreateProduct}
      >
        상품 생성
      </button>
      
      {/* 상품 목록 */}
      <div className={styles.productList}>
        {products.map(product => (
          <div 
            key={product.id} 
            className={styles.productCard}
            onClick={() => handleProductClick(product.id)}
          >
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className={styles.productInfo}>
              <span>이자율: {product.interestRate}%</span>
              <span>기간: {product.period}개월</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParentBankProductsPage; 