import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignupSelectPage: React.FC = () => {
  const navigate = useNavigate();

  const handleChildSignup = () => {
    console.log('회원가입 선택 페이지: 아이 회원가입 선택');
    console.log('회원가입 선택 페이지: /signup/child 페이지로 이동 시도');
    navigate('/signup/child');
  };

  const handleParentSignup = () => {
    console.log('회원가입 선택 페이지: 부모 회원가입 선택');
    console.log('회원가입 선택 페이지: /signup/parent 페이지로 이동 시도');
    navigate('/signup/parent');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-center text-2xl mb-8">회원가입</h1>
        
        <div className="space-y-4">
          <button
            onClick={handleChildSignup}
            className="w-full p-4 text-center"
          >
            아이 회원가입
          </button>
          
          <button
            onClick={handleParentSignup}
            className="w-full p-4 text-center"
          >
            어른 회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupSelectPage; 