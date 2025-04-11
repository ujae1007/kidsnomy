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
  const [isDeleting, setIsDeleting] = useState(false);

  // 페이지 로드 시 스크롤을 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiCall<SavingProduct>(`finance/savings/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setProduct(response);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, accessToken]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 적금 상품을 삭제하시겠습니까?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await apiCall(`finance/savings/delete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      alert('적금 상품이 성공적으로 삭제되었습니다.');
      navigate('/bank/products');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('상품 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.errorContainer}>
        <p>상품을 찾을 수 없습니다.</p>
        <button className={styles.backButton} onClick={handleGoBack}>
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backIcon} onClick={handleGoBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className={styles.title}>은행 상품 상세보기</h1>
      </div>
      
      <div className={styles.productBadge}>적금 상품</div>
      
      <div className={styles.content}>
        <div className={styles.formGroup}>
          <label>상품 제목</label>
          <div className={styles.value}>{product.title}</div>
        </div>

        <div className={styles.formGroup}>
          <label>이자율</label>
          <div className={styles.value}>
            <span className={styles.highlight}>{product.interestRate}%</span>
            <span className={styles.rateTag}>연 이자율</span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>상세내용</label>
          <div className={styles.value}>{product.content}</div>
        </div>

        <div className={styles.formGroup}>
          <label>만기 기간</label>
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
      </div>
    </div>
  );
};

export default SavingProductDetailPage; 