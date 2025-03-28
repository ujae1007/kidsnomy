import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

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
    groupId: 1, // 임시 그룹 ID
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
    
    // 권한 체크
    if (!isAuthenticated) {
      console.log('❌ 인증되지 않은 사용자');
      navigate('/login');
      return;
    }
    
    if (!isParent) {
      console.log('❌ 부모 계정이 아님');
      setError('부모 계정만 접근할 수 있습니다.');
      return;
    }
    
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
      const response = await fetch('https://j12b207.p.ssafy.io/api/work/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      console.log(`🔄 일자리 생성 응답 상태: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ 일자리 생성 실패:', errorText);
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
    <div>
      <h1>일자리 만들기</h1>
      
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            제목
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        
        <div>
          <label>
            상세내용
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        
        <div>
          <label>
            급여
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        
        <div>
          <label>
            추가 보상
            <input
              type="text"
              name="rewardText"
              value={formData.rewardText}
              onChange={handleInputChange}
            />
          </label>
        </div>
        
        <div>
          <label>
            루틴 여부
            <input
              type="checkbox"
              name="isPermanent"
              checked={formData.isPermanent}
              onChange={handleInputChange}
            />
          </label>
        </div>
        
        <div>
          <label>
            시작일
            <input
              type="date"
              name="startAt"
              value={formData.startAt}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        
        <div>
          <label>
            종료일
            <input
              type="date"
              name="endAt"
              value={formData.endAt}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? '생성 중...' : '만들기'}
        </button>
      </form>
    </div>
  );
};

export default ParentJobCreatePage; 