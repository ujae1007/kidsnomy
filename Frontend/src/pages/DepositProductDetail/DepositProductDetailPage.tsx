import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import styles from './DepositProductDetailPage.module.css';
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

const DepositProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isParent = useSelector((state: RootState) => state.auth.is_Parent === "1");
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [product, setProduct] = useState<DepositProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // API 경로 수정 - 앞에 /api/ 추가
        const response = await apiCall<DepositProduct>(`/finance/deposit/${id}`, {
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

  const handleContract = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const renderButton = () => {
    if (!product) return null;

    // 명확하게 부모/자녀 구분 로직 개선
    if (isParent) {
      // 부모인 경우 - 버튼 표시하지 않음
      return <div className={styles.statusMessage}>부모 계정에서는 계약할 수 없습니다</div>;
    } else {
      // 자녀인 경우
      if (product.productType === 0 || product.productType === 1) {
        return (
          <button className={styles.contractButton} onClick={handleContract}>
            계약하기
          </button>
        );
      }
      return <div className={styles.statusMessage}>계약한 상품입니다</div>;
    }
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
        <h1 className={styles.title}>은행 상품 상세보기</h1>
        
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

export default DepositProductDetailPage;
