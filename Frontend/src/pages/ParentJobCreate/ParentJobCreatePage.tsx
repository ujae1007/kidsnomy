import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import JobInputField from '@/components/jobs/JobInputField';
import ChatbotButton from '@/components/jobs/ChatbotButton';
import styles from './ParentJobCreatePage.module.css';

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

const ParentJobCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { accessToken, isAuthenticated, isParent } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState<JobCreateData>({
    title: '',
    content: '',
    salary: 0,
    rewardText: '',
    startAt: '',
    endAt: '',
    isPermanent: false,
    groupId: 1
  });
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    console.log('📝 일자리 생성 페이지 마운트');
    return () => {
      console.log('📝 일자리 생성 페이지 언마운트');
    };
  }, [isAuthenticated, isParent, navigate]);
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    console.log('📝 일자리 생성 시도:', formData);
    
    try {
      const response = await fetch('http://localhost:8080/api/work/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '일자리 생성에 실패했습니다.');
      }
      
      console.log('✅ 일자리 생성 성공');
      navigate('/parent/jobs');
    } catch (error) {
      console.error('❌ 일자리 생성 중 에러 발생:', error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
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
            상시 일자리
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

      <ChatbotButton />
    </div>
  );
};

export default ParentJobCreatePage; 