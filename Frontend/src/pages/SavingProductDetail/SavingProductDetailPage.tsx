import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import styles from './SavingProductDetailPage.module.css';
import SavingContractModal from '@/components/Modal/SavingContractModal';

interface SavingProduct {
  id: number;
  name: string;
  description: string;
  interestRate: number;
  period: number;
  monthlyPayment: number;
  features: string[];
  benefits: string[];
  status: number; // 1: 계약전, 2: 계약후, 3: 만기완료
}

const SavingProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isParent } = useAuth();
  const [product, setProduct] = useState<SavingProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  console.log('Auth State:', { isParent });
  console.log('Product ID:', id);

  useEffect(() => {
    // TODO: API 호출로 실제 데이터 가져오기
    const fetchProduct = async () => {
      try {
        console.log('Fetching saving product data...');
        // TODO: 실제 API 호출로 변경
        // const response = await axios.get(`/api/saving-products/${id}`);
        // setProduct(response.data);
        
        // 임시 데이터
        setProduct({
          id: Number(id),
          name: '일주일에 3,000원 모으기',
          description: '매주 조금씩 저축하는 습관을 길러요',
          interestRate: 10,
          period: 24,
          monthlyPayment: 12000,
          features: [
            '매주 조금씩 저축하는 습관 형성',
            '높은 이자율로 더 많은 돈을 모을 수 있어요',
            '정기적인 저축으로 안정적인 자산 형성'
          ],
          benefits: [
            '높은 이자율 10%',
            '매월 정기 저축 시 추가 혜택',
            '저축 목표 달성 시 특별 보너스'
          ],
          status: 1 // 임시 상태 설정
        });
        console.log('Product data loaded successfully');
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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

    if (!isParent) {
      // 자녀인 경우
      switch (product.status) {
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
    } else {
      // 부모인 경우
      switch (product.status) {
        case 1:
          return (
            <button className={styles.deleteButton} onClick={handleDelete}>
              삭제하기
            </button>
          );
        case 2:
          return <div className={styles.statusMessage}>계약이 된 상품입니다</div>;
        case 3:
          return <div className={styles.statusMessage}>만기된 상품입니다</div>;
        default:
          return null;
      }
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
          <div className={styles.value}>적금</div>
        </div>

        <div className={styles.formGroup}>
          <label>상품 제목</label>
          <div className={styles.value}>{product.name}</div>
        </div>

        <div className={styles.formGroup}>
          <label>이자</label>
          <div className={styles.value}>{product.interestRate}%</div>
        </div>

        <div className={styles.formGroup}>
          <label>상세내용</label>
          <div className={styles.value}>{product.description}</div>
        </div>

        <div className={styles.formGroup}>
          <label>만기일</label>
          <div className={styles.value}>{product.period}주</div>
        </div>

        <div className={styles.formGroup}>
          <label>이자 지급 주기</label>
          <div className={styles.value}>30일</div>
        </div>

        <div className={styles.formGroup}>
          <label>적금 납입 주기</label>
          <div className={styles.value}>{product.monthlyPayment.toLocaleString()}원</div>
        </div>

        <div className={styles.buttonWrapper}>
          {renderButton()}
        </div>
      </div>

      <SavingContractModal
        isOpen={showModal}
        onClose={handleCloseModal}
        productId={product.id}
        productName={product.name}
      />
    </div>
  );
};

export default SavingProductDetailPage; 