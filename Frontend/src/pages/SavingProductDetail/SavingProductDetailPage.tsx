import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import styles from './SavingProductDetailPage.module.css';
import { apiCall } from '@/utils/api';

interface SavingProduct {
  id: number;
  groupId: number;
  userId: number;
  title: string;
  content: string;
  interestRate: number;
  dueDate: number;
  rateDate: number;
  payDate: number;
  productType: number;
}

const SavingProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [product, setProduct] = useState<SavingProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching saving product data...');
        const response = await apiCall<SavingProduct>(`finance/savings/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setProduct(response);
        console.log('Product data loaded successfully:', response);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, accessToken]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!product) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>은행 상품 상세보기</h1>
        
        <div className={styles.formGroup}>
          <label>상품 종류</label>
          <div className={styles.value}>적금</div>
        </div>

        <div className={styles.formGroup}>
          <label>상품 제목</label>
          <div className={styles.value}>{product.title}</div>
        </div>

        <div className={styles.formGroup}>
          <label>이자</label>
          <div className={styles.value}>{product.interestRate}%</div>
        </div>

        <div className={styles.formGroup}>
          <label>상세내용</label>
          <div className={styles.value}>{product.content}</div>
        </div>

        <div className={styles.formGroup}>
          <label>만기일</label>
          <div className={styles.value}>{product.dueDate}주</div>
        </div>

        <div className={styles.formGroup}>
          <label>이자 지급 주기</label>
          <div className={styles.value}>{product.rateDate}일</div>
        </div>

        <div className={styles.formGroup}>
          <label>적금 납입 주기</label>
          <div className={styles.value}>{product.payDate}일</div>
        </div>
        
        <div className={styles.buttonWrapper}>
          <div className={styles.statusMessage}>부모 계정에서는 계약할 수 없습니다</div>
        </div>
      </div>
    </div>
  );
};

export default SavingProductDetailPage; 