import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { apiCall } from '@/utils/api';
import { RootState } from '@/store';
import { setEmail, clearEmail } from '@/store/slices/authSlice';

interface VerificationResponse {
  success: boolean;
  message: string;
}

const EmailVerification: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  
  // Redux에서 이메일 가져오기
  const email = useSelector((state: RootState) => state.auth.email);

  // 이메일이 없으면 회원가입 페이지로 리다이렉트
  useEffect(() => {
    if (!email) {
      navigate('/signup/parent');
    }
  }, [email, navigate]);

  // 컴포넌트가 언마운트될 때 이메일 정보 초기화 (회원가입 완료 전에 페이지를 벗어날 경우)
  useEffect(() => {
    return () => {
      // 회원가입 페이지로 이동하는 경우는 제외
      if (window.location.pathname !== '/signup/parent') {
        dispatch(clearEmail());
      }
    };
  }, [dispatch]);

  const handleVerify = async () => {
    if (!email) {
      setError('이메일 정보가 없습니다. 다시 시도해주세요.');
      navigate('/signup/parent');
      return;
    }

    if (!verificationCode) {
      setError('인증 코드를 입력해주세요.');
      return;
    }

    try {
      setIsVerifying(true);
      setError('');
      
      console.log('인증 요청 데이터:', { email, verificationCode });
      
      const response = await apiCall<VerificationResponse>('/auth/verification/email', {
        method: 'POST',
        body: JSON.stringify({ 
          email: email,
          verificationCode: parseInt(verificationCode)
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('인증 응답:', response);

      if (response.success) {
        dispatch(setEmail(email));
        alert(response.message);
        navigate('/signup/parent');
      } else {
        setError(response.message);
      }
    } catch (error: any) {
      console.error('인증 에러:', error);
      setError(error.message || '인증 코드가 일치하지 않습니다.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    navigate('/signup/parent');
  };

  if (!email) {
    return null; // 이메일이 없으면 아무것도 렌더링하지 않음
  }

  return (
    <div>
      <div>
        <button onClick={handleClose}>X</button>
        <h2>이메일을 확인하세요.</h2>
        <p>이메일로 인증 코드를 발송해드렸습니다.</p>
        <p>코드를 입력해 주세요.</p>
        <p>인증 대기 이메일: {email}</p>
        
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="인증 코드 입력"
        />
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <button 
          onClick={handleVerify}
          disabled={isVerifying}
        >
          {isVerifying ? '인증 중...' : '인증하기'}
        </button>
      </div>
    </div>
  );
};

export default EmailVerification; 