import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import styles from './DepositProductDetailChildPage.module.css';
import DepositContractModal from '@/components/Modal/DepositContractModal';
import { apiCall } from '@/utils/api';

interface DepositProduct {
  id: number;
  groupId: number;
  userId: number;
  title: string;
  content: string;
  interestRate: number;
  dueDate: number;
  productType: number;
}

const DepositProductDetailChildPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [product, setProduct] = useState<DepositProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  console.log('자녀용 예금 상세 페이지 - Product ID:', id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching deposit product data...');
        const response = await apiCall<DepositProduct>(`finance/deposit/${id}`, {
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

  const handleContract = () => {
    console.log('Contract button clicked, opening modal');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setShowModal(false);
  };

  const handleDelete = () => {
    console.log('Delete button clicked');
    // TODO: 삭제 API 호출
    console.log('삭제하기');
  };

  const handleReceive = () => {
    console.log('Receive button clicked');
    // TODO: 원금과 이자받기 API 호출
    console.log('원금과 이자받기');
  };

  const renderButton = () => {
    if (!product) return null;

    console.log('Product Type:', product.productType);

    if (product.productType === 0 || product.productType === 1) {
      console.log('Rendering Contract Button for Child');
      return (
        <button className={styles.contractButton} onClick={handleContract}>
          계약하기
        </button>
      );
    }
    return <div className={styles.statusMessage}>계약한 상품입니다</div>;
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!product) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>은행 상품 상세보기 (자녀용)</h1>
        
        <div className={styles.formGroup}>
          <label>상품 종류</label>
          <div className={styles.value}>예금</div>
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

        <div className={styles.buttonWrapper}>
          {renderButton()}
        </div>
      </div>

      <DepositContractModal
        isOpen={showModal}
        onClose={handleCloseModal}
        productId={product.id}
        productName={product.title}
      />
    </div>
  );
};

export default DepositProductDetailChildPage; 