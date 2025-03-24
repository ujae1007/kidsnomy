import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log('로그인 페이지: 입력 필드 변경', { name, value });
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('로그인 페이지: 로그인 시도', loginData);
    
    try {
      const response = await fetch('api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      console.log('로그인 페이지: API 응답 상태', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('로그인 페이지: 로그인 성공', data);
        localStorage.setItem('jwt', data.token);
        navigate('/home');
      } else {
        console.log('로그인 페이지: 로그인 실패');
        alert('로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 페이지: 에러 발생', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  const handleSignupClick = () => {
    console.log('로그인 페이지: 회원가입 페이지로 이동 시도');
    navigate('/signup');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-center text-2xl mb-8">로그인</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleInputChange}
              placeholder="이메일"
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
              placeholder="비밀번호"
              required
            />
          </div>

          <button type="submit">
            로그인
          </button>
        </form>

        <div className="text-center mt-4">
          <button onClick={handleSignupClick}>
            아이디가 없으요 회원가입하러가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 