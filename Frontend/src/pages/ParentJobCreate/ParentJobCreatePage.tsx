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
    groupId: 1,
    title: '',
    content: '',
    salary: 0,
    rewardText: '',
    isPermanent: false,
    startAt: '',
    endAt: ''
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
    const { name, value, type } = e.target;
    console.log('📝 입력 필드 변경:', { name, value });
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : 
              type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              value
    }));
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
          type="number"
          onChange={handleInputChange}
          required
        />
        
        <JobInputField
          label="루틴 여부"
          name="isPermanent"
          value={formData.isPermanent ? 'true' : 'false'}
          type="checkbox"
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

        <JobInputField
          label="추가 보상 (선택사항)"
          name="rewardText"
          value={formData.rewardText || ''}
          onChange={handleInputChange}
        />
        
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