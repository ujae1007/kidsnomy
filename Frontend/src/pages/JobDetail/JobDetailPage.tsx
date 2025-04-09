import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import styles from './JobDetailPage.module.css';
import { apiCall } from '@/utils/api';
import JobCompleteConfirmModal from '../../components/Modal/JobCompleteConfirmModal';

interface Job {
  jobId: number;
  groupId: number;
  groupCode: string;
  employerId: number;
  employeeId: number | null;
  employerName: string;
  employeeName: string | null;
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
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  
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
    
    const fetchJobDetail = async () => {
      console.log(`🔍 일자리 상세 정보 조회 시도 (jobId: ${jobId})`);
      setLoading(true);
      setError(null);
      
      try {
        const data = await apiCall<Job>(`work/check/detail/${jobId}`, {
          method: 'GET',
          auth: true
        });
        
        console.log('✅ 일자리 상세 정보 조회 성공:', data);
        setJob(data);
      } catch (error) {
        console.error('❌ 일자리 상세 정보 조회 중 에러 발생:', error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    
    if (jobId) {
      fetchJobDetail();
    }
    
    return () => {
      console.log('📄 일자리 상세 페이지 언마운트');
    };
  }, [jobId]);
  
  const handleDeleteJob = async () => {
    if (!confirm('정말로 이 일자리를 삭제하시겠습니까?')) {
      return;
    }
    
    console.log(`🗑️ 일자리 삭제 시도 (jobId: ${jobId})`);
    
    try {
      await apiCall(`work/delete/${jobId}`, {
        method: 'DELETE',
        auth: true
      });
      
      console.log('✅ 일자리 삭제 성공');
      alert('일자리가 삭제 되었습니다.');
      navigate('/parent/jobs');
    } catch (error) {
      console.error('❌ 일자리 삭제 중 에러 발생:', error);
      alert((error as Error).message);
    }
  };
  
  const handleAcceptJob = async () => {
    console.log(`👍 일자리 수락(계약) 시도 (jobId: ${jobId})`);
    
    if (!confirm('이 일자리를 수락하시겠습니까? 수락하면 계약이 체결됩니다.')) {
      console.log('❌ 일자리 수락 취소됨');
      return;
    }
    
    try {
      await apiCall(`work/child/contract/${jobId}`, {
        method: 'PUT',
        auth: true
      });
      
      console.log('✅ 일자리 수락(계약) 성공');
      alert('일자리가 성공적으로 계약되었습니다.');
      window.location.reload();
    } catch (error) {
      console.error('❌ 일자리 수락(계약) 중 에러 발생:', error);
      alert((error as Error).message);
    }
  };
  
  const handleCompleteJob = async () => {
    console.log(`🏁 일자리 완료 요청 시도 (jobId: ${jobId})`);
    
    if (!confirm('정말로 이 일자리를 완료로 표시하시겠습니까? 완료 후에는 취소할 수 없습니다.')) {
      console.log('❌ 일자리 완료 요청 취소됨');
      return;
    }
    
    try {
      console.log(`📤 API 요청: PUT /work/child/complete/${jobId}`);
      const response = await fetch(`/work/child/complete/${jobId}`, {
        method: 'PUT',
        headers: {
          // 'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      console.log(`🔄 일자리 완료 요청 응답 상태: ${response.status} ${response.statusText}`);
      console.log(`🔑 인증 토큰 사용됨: ${accessToken ? 'Bearer ' + accessToken.substring(0, 10) + '...' : '없음'}`);
      
      // 응답 상태에 따른 처리
      if (response.ok) {
        console.log('✅ 일자리 완료 요청 성공');
        alert('일자리 완료 요청이 정상적으로 처리되었습니다.');
        window.location.reload();
        return;
      }
      
      // 오류 상태에 따른 처리
      let errorText = '';
      try {
        // JSON 응답 시도
        const errorJson = await response.json();
        errorText = errorJson.message || errorJson.error || JSON.stringify(errorJson);
        console.error('❌ 일자리 완료 요청 실패 (JSON):', errorJson);
      } catch {
        // 일반 텍스트 응답
        errorText = await response.text();
        console.error('❌ 일자리 완료 요청 실패 (Text):', errorText);
      }
      
      switch (response.status) {
        case 403:
          if (errorText.includes('자녀만')) {
            throw new Error('자녀만 완료 요청을 할 수 있습니다.');
          } else if (errorText.includes('본인이 계약한')) {
            throw new Error('본인이 계약한 일자리가 아닙니다.');
          } else {
            throw new Error(`접근이 거부되었습니다: ${errorText}`);
          }
        case 404:
          if (errorText.includes('사용자')) {
            throw new Error('사용자를 찾을 수 없습니다.');
          } else {
            throw new Error('일자리를 찾을 수 없습니다.');
          }
        case 400:
          throw new Error('진행 중인 일자리만 완료 요청이 가능합니다.');
        case 401:
          throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
        default:
          throw new Error(`일자리 완료 요청에 실패했습니다 (${response.status}): ${errorText}`);
      }
    } catch (error) {
      console.error('❌ 일자리 완료 요청 중 에러 발생:', error);
      alert((error as Error).message);
    }
  };
  
  const handleApproveJob = async () => {
    console.log(`✓ 일자리 승인 시도 (jobId: ${jobId})`);
    
    try {
      const response = await apiCall<{ message: string }>(
        `/work/parent/complete/${jobId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ 일자리 승인 성공:', response);
      alert('일자리가 승인되었습니다.');
      window.location.reload();
    } catch (error: any) {
      console.error('❌ 일자리 승인 중 에러 발생:', error);
      if (error.status === 403) {
        alert('부모만 승인할 수 있습니다.');
      } else if (error.status === 404) {
        alert('일자리를 찾을 수 없습니다.');
      } else {
        alert('일자리 승인에 실패했습니다.');
      }
    }
  };
  
  const handleCompleteClick = () => {
    setIsCompleteModalOpen(true);
  };

  const handleConfirmComplete = async () => {
    console.log(`🏁 일자리 완료 요청 시도 (jobId: ${jobId})`);
    
    try {
      const response = await apiCall(`work/child/complete/${jobId}`, {
        method: 'PUT',
        auth: true
      });
      
      console.log('✅ 일자리 완료 요청 성공');
      alert('일자리 완료 요청이 정상적으로 처리되었습니다.');
      setIsCompleteModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('❌ 일자리 완료 요청 중 에러 발생:', error);
      
      // 에러 메시지 처리
      const errorMessage = (error as any).message;
      if (errorMessage.includes('사용자를 찾을 수 없습니다.')) {
        alert('사용자를 찾을 수 없습니다.');
      } else if (errorMessage.includes('자녀만 완료 요청을 할 수 있습니다.')) {
        alert('자녀만 완료 요청을 할 수 있습니다.');
      } else if (errorMessage.includes('본인이 계약한 일자리가 아닙니다.')) {
        alert('본인이 계약한 일자리가 아닙니다.');
      } else if (errorMessage.includes('진행 중인 일자리만 완료 요청이 가능합니다.')) {
        alert('진행 중인 일자리만 완료 요청이 가능합니다.');
      } else if (errorMessage.includes('일자리를 찾을 수 없습니다.')) {
        alert('일자리를 찾을 수 없습니다.');
      } else {
        alert('일자리 완료 요청 중 오류가 발생했습니다.');
      }
      setIsCompleteModalOpen(false);
    }
  };

  const handleCancelComplete = () => {
    setIsCompleteModalOpen(false);
  };
  
  const renderActionButton = () => {
    if (!job) return null;
    
    if (isParent) {
      // 부모인 경우
      if (job.status === 1) {
        return (
          <button 
            onClick={handleDeleteJob} 
            className={`${styles.button} ${styles.warningButton}`}
          >
            삭제
          </button>
        );
      } else if (job.status === 3) {
        return (
          <button 
            onClick={handleApproveJob} 
            className={`${styles.button} ${styles.primaryButton}`}
          >
            승인
          </button>
        );
      }
    } else {
      // 자녀인 경우
      if (job.status === 1) {
        return (
          <button 
            onClick={handleAcceptJob} 
            className={`${styles.button} ${styles.primaryButton}`}
          >
            수락
          </button>
        );
      } else if (job.status === 2) {
        return (
          <button 
            onClick={handleCompleteClick} 
            className={`${styles.button} ${styles.primaryButton}`}
          >
            일을 다 끝냈어요
          </button>
        );
      }
    }
    
    return null;
  };
  
  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }
  
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }
  
  if (!job) {
    return <div className={styles.error}>일자리 정보를 찾을 수 없습니다.</div>;
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>{job.title}</h1>
        
        <div className={styles.formGroup}>
          <label>시작일</label>
          <div className={styles.value}>{formatDate(job.startAt)}</div>
        </div>

        <div className={styles.formGroup}>
          <label>종료일</label>
          <div className={styles.value}>{formatDate(job.endAt)}</div>
        </div>

        <div className={styles.formGroup}>
          <label>내용</label>
          <div className={styles.value}>{job.content}</div>
        </div>

        <div className={styles.formGroup}>
          <label>용돈</label>
          <div className={styles.value}>{job.salary.toLocaleString()}원</div>
        </div>

        {job.rewardText && (
          <div className={styles.formGroup}>
            <label>추가 보상</label>
            <div className={styles.value}>{job.rewardText}</div>
          </div>
        )}

        <div className={styles.buttonWrapper}>
          {renderActionButton()}
        </div>

        {isParent && job.status >= 2 && (
          <div className={styles.warningMessage}>
            계약이 완료되어 삭제하실 수 없습니다.
          </div>
        )}

        {!isParent && job.status === 3 && (
          <div className={styles.pendingMessage}>
            승인 대기 중입니다.
          </div>
        )}
      </div>
      
      <JobCompleteConfirmModal
        isOpen={isCompleteModalOpen}
        onConfirm={handleConfirmComplete}
        onCancel={handleCancelComplete}
      />
    </div>
  );
};

export default JobDetailPage; 