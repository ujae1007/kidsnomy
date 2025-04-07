import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { apiCall } from '@/utils/api';
import styles from './CreateBankProductsPage.module.css';

interface ProductFormData {
  type: 'deposit' | 'saving';
  name: string;
  description: string;
  interestRate: number;
  period: number;
  monthlyPayment?: number;
  interestPaymentDate?: string;
  depositPaymentDate?: string;
}

interface DepositProductData {
  groupId: number;
  title: string;
  content: string;
  interestRate: number;
  dueDate: number;
}

const CreateBankProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const selectedGroupId = useSelector((state: RootState) => state.group.selectedGroupId);
  const [loading, setLoading] = useState(false);
  
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
    interestPaymentDate: '',
    depositPaymentDate: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.type === 'saving') {
      alert('현재 적금 상품 생성은 지원하지 않습니다.');
      return;
    }

    if (!selectedGroupId) {
      alert('그룹을 선택해주세요.');
      navigate('/group');
      return;
    }

    setLoading(true);

    try {
      console.log('📝 예금 상품 생성 시도:', {
        groupId: selectedGroupId,
        title: formData.name,
        content: formData.description,
        interestRate: formData.interestRate,
        dueDate: formData.period
      });

      const depositData: DepositProductData = {
        groupId: selectedGroupId,
        title: formData.name,
        content: formData.description,
        interestRate: Number(formData.interestRate),
        dueDate: Number(formData.period)
      };

      await apiCall('finance/deposit/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        auth: true,
        body: JSON.stringify(depositData)
      });

      console.log('✅ 예금 상품 생성 성공');
      alert('예금 상품이 성공적으로 생성되었습니다.');
      navigate('/bank/products');
    } catch (error: any) {
      console.error('❌ 예금 상품 생성 중 에러 발생:', error);
      
      // 에러 응답 상세 정보 로깅
      if (error.response) {
        try {
          const errorData = await error.response.json();
          console.error('상세 에러 정보:', errorData);
          
          if (error.response.status === 403) {
            alert('본인이 속한 그룹이 아닙니다.');
          } else if (error.response.status === 500) {
            alert('서버 오류가 발생했습니다. 다시 시도해주세요.');
          } else {
            alert(errorData.message || '예금 상품 생성에 실패했습니다.');
          }
        } catch (parseError) {
          console.error('에러 응답 파싱 실패:', parseError);
          alert('예금 상품 생성에 실패했습니다.');
        }
      } else {
        alert('네트워크 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
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
              required
            />
            <span className={styles.unit}>주</span>
          </div>
        </div>

        {formData.type === 'saving' && (
          <>
            <div className={styles.formGroup}>
              <label>이자 지급 주기</label>
              <div className={styles.inputWithUnit}>
                <input
                  type="text"
                  name="interestPaymentDate"
                  value={formData.interestPaymentDate}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="이자 지급일을 입력해주세요"
                />
                <span className={styles.unit}>일</span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>적금 납입 주기</label>
              <div className={styles.inputWithUnit}>
                <input
                  type="text"
                  name="depositPaymentDate"
                  value={formData.depositPaymentDate}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="적금 납입일을 입력해주세요"
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
    </div>
  );
};

export default CreateBankProductsPage; 