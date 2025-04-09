// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useAuth } from '@/hooks/useAuth';
// import styles from './DepositProductDetailPage.module.css';
// import DepositContractModal from '@/components/Modal/DepositContractModal';

// interface DepositProduct {
//   id: number;
//   name: string;
//   description: string;
//   interestRate: number;
//   period: number;
//   features: string[];
//   benefits: string[];
//   status: number; // 1: 계약전, 2: 계약후, 3: 만기완료
// }

// const DepositProductDetailPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { isParent } = useAuth();
//   const [product, setProduct] = useState<DepositProduct | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);

//   console.log('Auth State:', { isParent });
//   console.log('Product ID:', id);

//   useEffect(() => {
//     // TODO: API 호출로 실제 데이터 가져오기
//     const fetchProduct = async () => {
//       try {
//         console.log('Fetching deposit product data...');
//         // TODO: 실제 API 호출로 변경
//         // const response = await axios.get(`/api/deposit-products/${id}`);
//         // setProduct(response.data);
        
//         // 임시 데이터
//         setProduct({
//           id: Number(id),
//           name: '설 세배 용돈 모으기 통장',
//           description: '설날까지 용돈을 모아보아요',
//           interestRate: 10,
//           period: 12,
//           features: [
//             '설날까지 용돈을 모아보는 특별한 통장',
//             '높은 이자율로 더 많은 돈을 모을 수 있어요',
//             '기간 동안 자유롭게 입금 가능'
//           ],
//           benefits: [
//             '높은 이자율 10%',
//             '설날에 한 번에 큰 돈을 받을 수 있어요',
//             '매월 입금 시 추가 혜택'
//           ],
//           status: 1
//         });
//         console.log('Product data loaded successfully');
//       } catch (error) {
//         console.error('Error fetching product:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   const handleContract = () => {
//     console.log('Contract button clicked, opening modal');
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     console.log('Closing modal');
//     setShowModal(false);
//   };

//   const handleDelete = () => {
//     console.log('Delete button clicked');
//     // TODO: 삭제 API 호출
//     console.log('삭제하기');
//   };

//   const handleReceive = () => {
//     console.log('Receive button clicked');
//     // TODO: 원금과 이자받기 API 호출
//     console.log('원금과 이자받기');
//   };

//   const renderButton = () => {
//     if (!product) return null;

//     if (!isParent) {
//       // 자녀인 경우
//       switch (product.status) {
//         case 1:
//           return (
//             <button className={styles.contractButton} onClick={handleContract}>
//               계약하기
//             </button>
//           );
//         case 2:
//           return <div className={styles.statusMessage}>계약한 상품입니다</div>;
//         case 3:
//           return (
//             <button className={styles.contractButton} onClick={handleReceive}>
//               원금과 이자받기
//             </button>
//           );
//         default:
//           return null;
//       }
//     } else {
//       // 부모인 경우
//       switch (product.status) {
//         case 1:
//           return (
//             <button className={styles.deleteButton} onClick={handleDelete}>
//               삭제하기
//             </button>
//           );
//         case 2:
//           return <div className={styles.statusMessage}>계약이 된 상품입니다</div>;
//         case 3:
//           return <div className={styles.statusMessage}>만기된 상품입니다</div>;
//         default:
//           return null;
//       }
//     }
//   };

//   if (isLoading) {
//     return <div>로딩 중...</div>;
//   }

//   if (!product) {
//     return <div>상품을 찾을 수 없습니다.</div>;
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.content}>
//         <h1 className={styles.title}>은행 상품 상세보기</h1>
        
//         <div className={styles.formGroup}>
//           <label>상품 종류</label>
//           <div className={styles.value}>예금</div>
//         </div>

//         <div className={styles.formGroup}>
//           <label>상품 제목</label>
//           <div className={styles.value}>{product.name}</div>
//         </div>

//         <div className={styles.formGroup}>
//           <label>이자</label>
//           <div className={styles.value}>{product.interestRate}%</div>
//         </div>

//         <div className={styles.formGroup}>
//           <label>상세내용</label>
//           <div className={styles.value}>{product.description}</div>
//         </div>

//         <div className={styles.formGroup}>
//           <label>만기일</label>
//           <div className={styles.value}>{product.period}주</div>
//         </div>

//         <div className={styles.buttonWrapper}>
//           {renderButton()}
//         </div>
//       </div>

//       <DepositContractModal
//         isOpen={showModal}
//         onClose={handleCloseModal}
//         productId={product.id}
//         productName={product.name}
//       />
//     </div>
//   );
// };

// export default DepositProductDetailPage; 



import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { apiCall } from '@/utils/api';
import styles from './DepositProductDetailPage.module.css';
import DepositContractModal from '@/components/Modal/DepositContractModal';

interface DepositProduct {
  id: number;
  groupId: number;
  userId: number;
  title: string;
  content: string;
  interestRate: number;
  dueDate: number;
  productType: number;
  status?: number; // 1: 계약전, 2: 계약후, 3: 만기완료
}

const DepositProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<DepositProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Redux에서 인증 정보 가져오기
  const { accessToken, is_Parent } = useSelector((state: RootState) => state.auth);

  console.log('Auth State:', { is_Parent });
  console.log('Product ID:', id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('📊 예금상품 상세 조회 시작');
        const response = await apiCall<DepositProduct>(`/finance/deposit/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('✅ 예금상품 상세 조회 성공:', response);
        setProduct({
          ...response,
          status: response.status || 1 // 기본값 설정
        });
      } catch (error) {
        console.error('❌ 예금상품 상세 조회 실패:', error);
        setError('상품 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
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

    const productStatus = product.status || 1;

    if (is_Parent === "0") { // 아이
      switch (productStatus) {
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
    } else { // 어른 (is_Parent === "1")
      switch (productStatus) {
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
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!product) {
    return <div className={styles.empty}>상품을 찾을 수 없습니다.</div>;
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
