import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { apiCall } from '@/utils/api';
import styles from './CreateBankProductsPage.module.css';
import JobCompleteConfirmSuccessModal from '@/components/Modal/JobCompleteConfirmSuccessModal';

interface ProductFormData {
  type: 'deposit' | 'saving';
  name: string;
  description: string;
  interestRate: number;
  period: number;
  rateDate: number;
  payDate: number;
}

interface DepositProductData {
  groupId: number;
  title: string;
  content: string;
  interestRate: number;
  dueDate: number;
}

interface SavingProductData {
  groupId: number;
  title: string;
  content: string;
  interestRate: number;
  dueDate: number;
  rateDate: number;
  payDate: number;
}

const CreateBankProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const selectedGroupId = useSelector((state: RootState) => state.group.selectedGroupId);
  const [loading, setLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productToCreate, setProductToCreate] = useState<DepositProductData | SavingProductData | null>(null);
  
  useEffect(() => {
    if (!selectedGroupId) {
      alert('그룹을 먼저 선택해주세요.');
      navigate('/group');
    }
  }, [selectedGroupId, navigate]);

  const [formData, setFormData] = useState<ProductFormData>({
    type: 'deposit',
    name: '',
    description: '',
    interestRate: 0,
    period: 0,
    rateDate: 0,
    payDate: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // 숫자 입력 필드인 경우 특별 처리
    if (['interestRate', 'period', 'rateDate', 'payDate'].includes(name)) {
      // 사용자가 새 숫자를 입력할 때 초기값 0을 대체
      const currentValue = formData[name as keyof ProductFormData];
      
      // 현재 값이 0이고, 새로운 입력값이 있으면 0을 대체
      if (currentValue === 0 && value !== '') {
        setFormData(prev => ({
          ...prev,
          [name]: value.startsWith('0') ? value.slice(1) : value
        }));
        return;
      }
    }
    
    // 일반적인 입력 처리
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedGroupId) {
      alert('그룹을 선택해주세요.');
      navigate('/group');
      return;
    }

    // 값 유효성 검증
    if (Number(formData.period) < 1) {
      alert('만기일은 1주 이상이어야 합니다.');
      return;
    }

    // 적금 유효성 검증
    if (formData.type === 'saving') {
      if (Number(formData.rateDate) < 1 || Number(formData.rateDate) > 31) {
        alert('이자 지급일은 1일부터 31일 사이여야 합니다.');
        return;
      }
      
      if (Number(formData.payDate) < 1 || Number(formData.payDate) > 31) {
        alert('적금 납입일은 1일부터 31일 사이여야 합니다.');
        return;
      }
    }

    // 상품 데이터 준비
    if (formData.type === 'saving') {
      const savingData: SavingProductData = {
        groupId: selectedGroupId,
        title: formData.name,
        content: formData.description,
        interestRate: Number(formData.interestRate),
        dueDate: Number(formData.period),
        rateDate: Number(formData.rateDate),
        payDate: Number(formData.payDate)
      };
      
      console.log('📝 적금 상품 데이터 준비:', savingData);
      setProductToCreate(savingData);
    } else {
      const depositData: DepositProductData = {
        groupId: selectedGroupId,
        title: formData.name,
        content: formData.description,
        interestRate: Number(formData.interestRate),
        dueDate: Number(formData.period)
      };
      
      console.log('📝 예금 상품 데이터 준비:', depositData);
      setProductToCreate(depositData);
    }

    // 확인 모달 열기
    setIsConfirmModalOpen(true);
  };

  // 모달에서 확인 버튼 클릭 시 실제 상품 생성 처리
  const handleConfirmCreate = async () => {
    if (!productToCreate) return;
    
    setLoading(true);
    
    try {
      if ('rateDate' in productToCreate) {
        // 적금 상품 생성
        await apiCall('finance/savings/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          auth: true,
          body: JSON.stringify(productToCreate)
        });

        console.log('✅ 적금 상품 생성 성공');
        alert('적금 상품이 성공적으로 생성되었습니다.');
      } else {
        // 예금 상품 생성
        await apiCall('finance/deposit/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          auth: true,
          body: JSON.stringify(productToCreate)
        });

        console.log('✅ 예금 상품 생성 성공');
        alert('예금 상품이 성공적으로 생성되었습니다.');
      }
      
      // 생성 후 상품 목록 페이지로 이동
      navigate('/bank/products');
    } catch (error: any) {
      console.error('❌ 상품 생성 중 에러 발생:', error);
      
      if (error.response) {
        try {
          const errorData = await error.response.json();
          console.error('상세 에러 정보:', errorData);
          
          if (error.response.status === 403) {
            alert('본인이 속한 그룹이 아닙니다.');
          } else if (error.response.status === 500) {
            alert('서버 오류가 발생했습니다. 다시 시도해주세요.');
          } else {
            alert(errorData.message || '상품 생성에 실패했습니다.');
          }
        } catch (parseError) {
          console.error('에러 응답 파싱 실패:', parseError);
          alert('상품 생성에 실패했습니다.');
        }
      } else {
        alert('네트워크 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
      setIsConfirmModalOpen(false);
    }
  };

  // 모달에서 취소 버튼 클릭 시 처리
  const handleCancelCreate = () => {
    setIsConfirmModalOpen(false);
    setProductToCreate(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>은행 상품 만들기</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>상품 종류</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className={styles.select}
          >
            <option value="deposit">예금</option>
            <option value="saving">적금</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>상품 제목</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="상품 제목을 입력해주세요"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>이자</label>
          <div className={styles.inputWithUnit}>
            <input
              type="number"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="이자율을 입력해주세요"
              step="0.1"
              required
            />
            <span className={styles.unit}>%</span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>상세내용</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={styles.textarea}
            placeholder="상세내용을 입력해주세요"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>만기일</label>
          <div className={styles.inputWithUnit}>
            <input
              type="number"
              name="period"
              value={formData.period}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="만기일을 입력해주세요"
              min="1"
              required
            />
            <span className={styles.unit}>주</span>
          </div>
        </div>

        {formData.type === 'saving' && (
          <>
            <div className={styles.formGroup}>
              <label>이자 지급일</label>
              <p className={styles.fieldDescription}>
                매월 이자가 지급되는 날짜입니다. 1일부터 31일 사이로 설정하세요.
              </p>
              <div className={styles.inputWithUnit}>
                <input
                  type="number"
                  name="rateDate"
                  value={formData.rateDate}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="이자 지급일을 입력해주세요 (1-31)"
                  min="1"
                  max="31"
                  required
                />
                <span className={styles.unit}>일</span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>적금 납입일</label>
              <p className={styles.fieldDescription}>
                매월 적금을 납입해야 하는 날짜입니다. 1일부터 31일 사이로 설정하세요.
              </p>
              <div className={styles.inputWithUnit}>
                <input
                  type="number"
                  name="payDate"
                  value={formData.payDate}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="적금 납입일을 입력해주세요 (1-31)"
                  min="1"
                  max="31"
                  required
                />
                <span className={styles.unit}>일</span>
              </div>
            </div>
          </>
        )}

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? '생성 중...' : '만들기'}
        </button>
      </form>

      {/* 상품 생성 확인 모달 */}
      <JobCompleteConfirmSuccessModal
        isOpen={isConfirmModalOpen}
        onConfirm={handleConfirmCreate}
        onCancel={handleCancelCreate}
      />
    </div>
  );
};

export default CreateBankProductsPage; 