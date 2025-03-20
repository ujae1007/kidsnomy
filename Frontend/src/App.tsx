import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import LoginPage from './pages/LoginPage';
import SignupSelectPage from './pages/SignupSelectPage';
import ParentSignupPage from './pages/ParentSignupPage';
import ChildSignupPage from './pages/ChildSignupPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<div>Home Page (Coming Soon)</div>} />
        <Route path="/signup" element={<SignupSelectPage />} />
        <Route path="/signup/child" element={<ChildSignupPage />} />
        <Route path="/signup/parent" element={<ParentSignupPage />} />
      </Routes>
    </Router>
  );
};

export default App; 