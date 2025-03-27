import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface Job {
  jobId: number;
  groupId: number;
  groupCode: string;
  employerId: number;
  employeeId: number;
  employerName: string;
  employeeName: string;
  title: string;
  content: string;
  salary: number;
  rewardText: string;
  isPermanent: boolean;
  startAt: string;
  endAt: string;
  status: number;
}

const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { accessToken, isAuthenticated, isParent } = useSelector((state: RootState) => state.auth);
  
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const getStatusText = (status: number): string => {
    switch (status) {
      case 1: return '계약전';
      case 2: return '계약후';
      case 3: return '승인대기';
      case 4: return '최종완료';
      default: return '알 수 없음';
    }
  };
  
  useEffect(() => {
    console.log('📄 일자리 상세 페이지 마운트, jobId:', jobId);
    
    if (!isAuthenticated) {
      console.log('❌ 인증되지 않은 사용자');
      navigate('/login');
      return;
    }
    
    const fetchJobDetail = async () => {
      console.log(`🔍 일자리 상세 정보 조회 시도 (jobId: ${jobId})`);
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`https://j12b207.p.ssafy.io/api/work/check/detail/${jobId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        console.log(`🔄 일자리 상세 정보 응답 상태: ${response.status}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('일자리를 찾을 수 없습니다.');
          } else if (response.status === 403) {
            throw new Error('해당 일자리에 접근할 권한이 없습니다.');
          } else {
            throw new Error('일자리 정보를 불러오는데 실패했습니다.');
          }
        }
        
        const data = await response.json();
        console.log('✅ 일자리 상세 정보 조회 성공:', data);
        setJob(data);
      } catch (error) {
        console.error('❌ 일자리 상세 정보 조회 중 에러 발생:', error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobDetail();
    
    return () => {
      console.log('📄 일자리 상세 페이지 언마운트');
    };
  }, [jobId, accessToken, isAuthenticated, navigate]);
  
  const handleDeleteJob = async () => {
    if (!confirm('정말로 이 일자리를 삭제하시겠습니까?')) {
      return;
    }
    
    console.log(`🗑️ 일자리 삭제 시도 (jobId: ${jobId})`);
    
    try {
      const response = await fetch(`https://j12b207.p.ssafy.io/api/work/delete/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`🔄 일자리 삭제 응답 상태: ${response.status}`);
      
      if (!response.ok) {
        throw new Error('일자리 삭제에 실패했습니다.');
      }
      
      console.log('✅ 일자리 삭제 성공');
      navigate('/parent/jobs');
    } catch (error) {
      console.error('❌ 일자리 삭제 중 에러 발생:', error);
      alert((error as Error).message);
    }
  };
  
  const handleAcceptJob = async () => {
    console.log(`👍 일자리 수락 시도 (jobId: ${jobId})`);
    
    try {
      const response = await fetch(`https://j12b207.p.ssafy.io/api/work/accept/${jobId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`🔄 일자리 수락 응답 상태: ${response.status}`);
      
      if (!response.ok) {
        throw new Error('일자리 수락에 실패했습니다.');
      }
      
      console.log('✅ 일자리 수락 성공');
      window.location.reload(); // 페이지 새로고침
    } catch (error) {
      console.error('❌ 일자리 수락 중 에러 발생:', error);
      alert((error as Error).message);
    }
  };
  
  const handleCompleteJob = async () => {
    console.log(`🏁 일자리 완료 요청 시도 (jobId: ${jobId})`);
    
    try {
      const response = await fetch(`https://j12b207.p.ssafy.io/api/work/complete/${jobId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`🔄 일자리 완료 요청 응답 상태: ${response.status}`);
      
      if (!response.ok) {
        throw new Error('일자리 완료 요청에 실패했습니다.');
      }
      
      console.log('✅ 일자리 완료 요청 성공');
      window.location.reload(); // 페이지 새로고침
    } catch (error) {
      console.error('❌ 일자리 완료 요청 중 에러 발생:', error);
      alert((error as Error).message);
    }
  };
  
  const handleApproveJob = async () => {
    console.log(`✓ 일자리 승인 시도 (jobId: ${jobId})`);
    
    try {
      const response = await fetch(`https://j12b207.p.ssafy.io/api/work/approve/${jobId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`🔄 일자리 승인 응답 상태: ${response.status}`);
      
      if (!response.ok) {
        throw new Error('일자리 승인에 실패했습니다.');
      }
      
      console.log('✅ 일자리 승인 성공');
      window.location.reload(); // 페이지 새로고침
    } catch (error) {
      console.error('❌ 일자리 승인 중 에러 발생:', error);
      alert((error as Error).message);
    }
  };
  
  const renderActionButton = () => {
    if (!job) return null;
    
    if (isParent) {
      // 부모인 경우
      if (job.status === 1) {
        return <button onClick={handleDeleteJob}>삭제</button>;
      } else if (job.status === 3) {
        return <button onClick={handleApproveJob}>승인</button>;
      }
    } else {
      // 자녀인 경우
      if (job.status === 1) {
        return <button onClick={handleAcceptJob}>수락</button>;
      } else if (job.status === 2) {
        return <button onClick={handleCompleteJob}>일을 다 끝냈어요</button>;
      }
    }
    
    return null;
  };
  
  if (loading) {
    return <div>로딩 중...</div>;
  }
  
  if (error) {
    return <div>{error}</div>;
  }
  
  if (!job) {
    return <div>일자리 정보를 찾을 수 없습니다.</div>;
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };
  
  return (
    <div>
      <h1>일자리 상세보기</h1>
      
      <div>
        <h2>{job.title}</h2>
        <p>상태: {getStatusText(job.status)}</p>
        
        <div>
          <h3>날짜</h3>
          <p>{formatDate(job.startAt)} ~ {formatDate(job.endAt)}</p>
        </div>
        
        <div>
          <h3>상세내용</h3>
          <p>{job.content}</p>
        </div>
        
        <div>
          <h3>급여</h3>
          <p>{job.salary.toLocaleString()}원</p>
        </div>
        
        {job.rewardText && (
          <div>
            <h3>추가보상</h3>
            <p>{job.rewardText}</p>
          </div>
        )}
        
        <div>
          <h3>정보</h3>
          <p>고용주: {job.employerName}</p>
          {job.employeeId && <p>근로자: {job.employeeName}</p>}
          <p>그룹 코드: {job.groupCode}</p>
          <p>루틴 여부: {job.isPermanent ? '예' : '아니오'}</p>
        </div>
        
        <div>
          {renderActionButton()}
          <button onClick={() => navigate(-1)}>뒤로 가기</button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage; 