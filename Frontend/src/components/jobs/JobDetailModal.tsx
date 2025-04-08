const handleCompleteJob = async () => {
  if (!jobId) return;
  
  try {
    console.log('✅ 일자리 완료 처리 시작:', jobId);
    
    const response = await apiCall<{ message: string }>(
      `/api/work/parent/complete/${jobId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ 일자리 완료 처리 성공:', response);
    alert('일자리가 최종 완료 처리되었습니다.');
    onClose();
    onJobCompleted();
  } catch (error: any) {
    console.error('❌ 일자리 완료 처리 실패:', error);
    if (error.status === 403) {
      alert('권한이 없습니다.');
    } else {
      alert('일자리 완료 처리에 실패했습니다.');
    }
  }
}; 