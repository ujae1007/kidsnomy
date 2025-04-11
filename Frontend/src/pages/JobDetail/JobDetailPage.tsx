import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import styles from './JobDetailPage.module.css';
import { apiCall } from '@/utils/api';
import JobCompleteConfirmModal from '../../components/Modal/JobCompleteConfirmModal';
import JobCompleteConfirmFinishModal from '../../components/Modal/JobCompleteConfirmFinishModal';

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
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  
  // 페이지 로드 시 스크롤을 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const getStatusText = (status: number): string => {
    switch (status) {
      case 1: return '계약전';
      case 2: return '계약후';
      case 3: return '승인대기';
      case 4: return '최종완료';
      default: return '알 수 없음';
    }
  };
  
  // 상태에 따른 클래스 이름 반환
  const getStatusBadgeClass = (status: number): string => {
    // 클래스 이름을 직접 문자열로 지정
    switch (status) {
      case 1:
        return `${styles.badge} statusBadge1`;
      case 2:
        return `${styles.badge} statusBadge2`;
      case 3:
        return `${styles.badge} statusBadge3`;
      case 4:
        return `${styles.badge} statusBadge4`;
      default:
        return styles.badge;
    }
  };
  
  // 상태에 따른 인라인 스타일 반환
  const getStatusStyle = (status: number): React.CSSProperties => {
    switch (status) {
      case 1: // 계약전
        return {
          backgroundColor: '#FF9800', // 주황색으로 변경
          color: 'white',
          fontWeight: 'bold',
          padding: '4px 8px',
          borderRadius: '4px',
          display: 'inline-block'
        };
      case 2: // 계약후
        return {
          backgroundColor: '#BBDEFB',
          color: '#1976D2'
        };
      case 3: // 승인대기
        return {
          backgroundColor: '#FFF9C4',
          color: '#FBC02D'
        };
      case 4: // 최종완료
        return {
          backgroundColor: '#C8E6C9',
          color: '#4CAF50'
        };
      default:
        return {};
    }
  };
  
  // 루틴 여부에 따른 클래스 이름 반환
  const getRoutineBadgeClass = (isPermanent: boolean): string => {
    // 클래스 이름을 직접 문자열로 지정
    return isPermanent 
      ? `${styles.badge} routineBadge`
      : `${styles.badge} oneTimeBadge`;
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
  
  // 승인 시작을 위한 모달 표시
  const handleApproveClick = () => {
    setIsApproveModalOpen(true);
  };
  
  // 승인 모달에서 확인 버튼 클릭
  const handleApproveConfirm = async () => {
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
      setIsApproveModalOpen(false);
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
      setIsApproveModalOpen(false);
    }
  };
  
  // 승인 모달에서 취소
  const handleApproveCancel = () => {
    setIsApproveModalOpen(false);
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
      // 최종완료 상태가 아닐 때만 삭제 버튼 표시
      const buttons = [];
      
      // 상태별 버튼 추가
      if (job.status === 3) {
        buttons.push(
          <button 
            key="approve"
            onClick={handleApproveClick} 
            className={`${styles.button} ${styles.primaryButton}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            승인
          </button>
        );
      }
      
      // 최종완료 상태가 아닐 때만 삭제 버튼 표시
      if (job.status !== 4) {
        buttons.push(
          <button 
            key="delete"
            onClick={handleDeleteJob} 
            className={`${styles.button} ${styles.warningButton}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
              <path d="M3 6h18"></path>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            삭제
          </button>
        );
      }
      
      return buttons;
    } else {
      // 자녀인 경우
      if (job.status === 1) {
        return (
          <button 
            onClick={handleAcceptJob} 
            className={`${styles.button} ${styles.primaryButton}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            수락
          </button>
        );
      } else if (job.status === 2) {
        return (
          <button 
            onClick={handleCompleteClick} 
            className={`${styles.button} ${styles.primaryButton}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
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
      <div className={styles.content} style={{ position: job.status === 4 ? 'relative' : 'static' }}>
        <h1 className={styles.title}>{job.title}</h1>
        
        {job.status === 4 && (
          <div className={styles.completedStamp}>
            완료
          </div>
        )}
        
        <div className={styles.formGroup}>
          <label>상태</label>
          <div className={styles.value}>
            <span 
              className={styles.badge}
              style={getStatusStyle(job.status)}
            >
              {getStatusText(job.status)}
            </span>
          </div>
        </div>
        
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

        <div className={styles.formGroup}>
          <label>루틴 여부</label>
          <div className={styles.value}>
            {job.isPermanent ? (
              <span className={getRoutineBadgeClass(true)}>루틴</span>
            ) : (
              <span className={getRoutineBadgeClass(false)}>일회성</span>
            )}
          </div>
        </div>

        <div className={styles.buttonContainer}>
          {renderActionButton()}
        </div>

        {!isParent && job.status === 3 && (
          <div className={styles.pendingMessage}>
            승인 대기 중입니다.
          </div>
        )}
      </div>
      
      {/* 일 완료 확인 모달 */}
      <JobCompleteConfirmModal
        isOpen={isCompleteModalOpen}
        onConfirm={handleConfirmComplete}
        onCancel={handleCancelComplete}
      />
      
      {/* 승인 확인 모달 */}
      <JobCompleteConfirmFinishModal
        isOpen={isApproveModalOpen}
        onConfirm={handleApproveConfirm}
        onCancel={handleApproveCancel}
      />
    </div>
  );
};

export default JobDetailPage; 