import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import styles from './SavingProductDetailChildPage.module.css';
import SavingContractModal from '@/components/Modal/SavingContractModal';
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

// 이 컴포넌트는 자녀용 적금 상세 페이지입니다
const SavingProductDetailChildPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [product, setProduct] = useState<SavingProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  console.log('자녀용 적금 상세 페이지 - Rendering with id:', id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching saving product data in CHILD page...');
        const response = await apiCall<SavingProduct>(`finance/savings/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setProduct(response);
        console.log('Product data loaded successfully in CHILD page:', response);
      } catch (error) {
        console.error('Error fetching product in CHILD page:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, accessToken]);

  const handleContract = () => {
    console.log('Contract button clicked, opening modal in CHILD page');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log('Closing modal in CHILD page');
    setShowModal(false);
  };

  const handleReceive = () => {
    console.log('Receive button clicked in CHILD page');
    // TODO: 원금과 이자받기 API 호출
    console.log('원금과 이자받기');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const renderButton = () => {
    if (!product) return null;

    // 자녀인 경우 productType에 따라 버튼 표시
    switch (product.productType) {
      case 1:
        return (
          <button className={styles.contractButton} onClick={handleContract}>
            계약하기
          </button>
        );
      case 2:
        return <div className={styles.statusMessage}>계약한 상품입니다</div>;
      case 3:
        return (
          <button className={styles.contractButton} onClick={handleReceive}>
            원금과 이자받기
          </button>
        );
      default:
        return null;
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
          <div className={styles.value}>
            <span className={styles.highlight}>{product.interestRate}%</span>
          </div>
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
          {renderButton()}
        </div>
      </div>

      <SavingContractModal
        isOpen={showModal}
        onClose={handleCloseModal}
        productId={product.id}
        productName={product.title}
      />
    </div>
  );
};

export default SavingProductDetailChildPage; 