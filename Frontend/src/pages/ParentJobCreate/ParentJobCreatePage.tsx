import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import JobInputField from '@/components/jobs/JobInputField';
import ChatbotButton from '@/components/jobs/ChatbotButton';
import styles from './ParentJobCreatePage.module.css';
import { apiCall } from '@/utils/api';
import modalStyles from '@/components/Modal/JobCompleteConfirmModal.module.css';

interface JobCreateData {
  groupId: number;
  title: string;
  content: string;
  salary: number;
  rewardText?: string;
  isPermanent: boolean;
  startAt: string;
  endAt: string;
}

// 모달 컴포넌트 내장 (일자리 생성용 텍스트로 수정)
interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const JobCreateConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className={modalStyles.modalOverlay}>
      <div className={modalStyles.modalContent}>
        <h2 className={modalStyles.title}>일자리를 생성하시겠습니까?</h2>
        
        <div className={modalStyles.iconContainer}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#E8A5A5" strokeWidth="2"/>
            <path d="M7 12L10 15L17 8" stroke="#E8A5A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <p className={modalStyles.description}>
          생성 후에는 자녀들이 해당 일자리에 지원할 수 있습니다.
        </p>

        <div className={modalStyles.buttonContainer}>
          <button 
            className={`${modalStyles.button} ${modalStyles.confirmButton}`}
            onClick={onConfirm}
          >
            네
          </button>
          <button 
            className={`${modalStyles.button} ${modalStyles.cancelButton}`}
            onClick={onCancel}
          >
            아니요
          </button>
        </div>
      </div>
    </div>
  );
};

const ParentJobCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { accessToken, isAuthenticated, isParent } = useSelector((state: RootState) => state.auth);
  const selectedGroupId = useSelector((state: RootState) => state.group.selectedGroupId);
  
  // 모달 상태 추가
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  useEffect(() => {
    if (!selectedGroupId) {
      alert('그룹을 먼저 선택해주세요.');
      navigate('/group');
      return;
    }
  }, [selectedGroupId, navigate]);

  const [formData, setFormData] = useState<JobCreateData>({
    title: '',
    content: '',
    salary: 0,
    rewardText: '',
    startAt: '',
    endAt: '',
    isPermanent: false,
    groupId: selectedGroupId || 0
  });

  // 그룹 ID가 변경될 때마다 formData 업데이트
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      groupId: selectedGroupId || 0
    }));
  }, [selectedGroupId]);
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    console.log('📝 일자리 생성 페이지 마운트');
    return () => {
      console.log('📝 일자리 생성 페이지 언마운트');
    };
  }, [isAuthenticated, isParent, navigate]);
  
  useEffect(() => {
    console.log('현재 상태:', {
      isParent,
      selectedGroupId,
      accessToken: !!accessToken
    });
  }, [isParent, selectedGroupId, accessToken]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'salary') {
      // 숫자만 입력 가능하도록
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue ? parseInt(numericValue) : 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 폼 유효성 검사
    if (!formData.title || !formData.content || !formData.startAt || !formData.endAt) {
      setError('모든 필수 항목을 입력해주세요.');
      return;
    }
    
    // 모달 표시
    setIsConfirmModalOpen(true);
  };
  
  // 모달에서 확인 버튼 클릭 시 실제 일자리 생성 처리
  const handleConfirmCreate = async () => {
    setLoading(true);
    setError(null);
    
    console.log('📝 일자리 생성 시도:', formData);
    
    try {
      await apiCall('work/create', {
        method: 'POST',
        auth: true,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      console.log('✅ 일자리 생성 성공');
      alert('일자리가 성공적으로 생성되었습니다.');
      navigate('/parent/jobs');
    } catch (err) {
      console.error('❌ 일자리 생성 중 에러 발생:', err);
      const error = err as any;
      if (error?.status === 403 || (error?.message && error.message.includes('403'))) {
        alert('그룹을 선택해 주세요.');
        navigate('/group');
      } else {
        setError((err as Error).message);
      }
    } finally {
      setLoading(false);
      setIsConfirmModalOpen(false);
    }
  };
  
  // 모달에서 취소 버튼 클릭 시 처리
  const handleCancelCreate = () => {
    setIsConfirmModalOpen(false);
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>일자리 만들기</h1>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <JobInputField
          label="제목"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        
        <JobInputField
          label="상세내용"
          name="content"
          value={formData.content}
          type="textarea"
          onChange={handleInputChange}
          required
        />
        
        <JobInputField
          label="급여"
          name="salary"
          value={formData.salary}
          type="text"
          inputMode="numeric"
          onChange={handleInputChange}
          required
        />
        
        <JobInputField
          label="추가 보상 (선택사항)"
          name="rewardText"
          value={formData.rewardText || ''}
          onChange={handleInputChange}
        />
        
        <JobInputField
          label="시작일"
          name="startAt"
          value={formData.startAt}
          type="date"
          onChange={handleInputChange}
          required
        />
        
        <JobInputField
          label="종료일"
          name="endAt"
          value={formData.endAt}
          type="date"
          onChange={handleInputChange}
          required
        />

        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              name="isPermanent"
              checked={formData.isPermanent}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                isPermanent: e.target.checked
              }))}
            />
            루틴 일자리
          </label>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? '생성 중...' : '만들기'}
        </button>
      </form>
      
      {/* 일자리 생성 확인 모달 */}
      <JobCreateConfirmModal
        isOpen={isConfirmModalOpen}
        onConfirm={handleConfirmCreate}
        onCancel={handleCancelCreate}
      />
    </div>
  );
};

export default ParentJobCreatePage; 