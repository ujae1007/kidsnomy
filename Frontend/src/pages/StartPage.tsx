import React from 'react';
import { useNavigate } from 'react-router-dom';

const StartPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div 
        onClick={handleLogoClick}
        className="cursor-pointer"
      >
        <img 
          src="/kidsnomy-logo.png" 
          alt="Kidsnomy Logo" 
          className="w-64 h-64"
        />
        <h1 className="text-center mt-4 text-3xl font-bold">
          <span className="text-pink-400">KIDS</span>
          <span className="text-black">NOMY</span>
        </h1>
        <p className="text-center mt-2">FINANCIAL EDUCATION</p>
      </div>
    </div>
  );
};

export default StartPage; 