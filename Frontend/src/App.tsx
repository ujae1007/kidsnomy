import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import MainLayout from './layouts/MainLayout';
import StartPage from './pages/StartPage';
import LoginPage from './pages/LoginPage';
import SignupSelectPage from './pages/SignupSelectPage';
import ParentSignupPage from './pages/ParentSignupPage';
import ChildSignupPage from './pages/ChildSignupPage';
import HomePage from './pages/HomePage';
import GroupPage from './pages/GroupPage';
import AccountPage from './pages/AccountPage';
=======
import StartPage from '@/pages/StartPage';
import LoginPage from '@/pages/LoginPage';
import SignupSelectPage from '@/pages/SignupSelectPage';
import ParentSignupPage from '@/pages/ParentSignupPage';
import ChildSignupPage from '@/pages/ChildSignupPage';
import HomePage from '@/pages/HomePage';
>>>>>>> 23bca6e601af425c641ace16bafebcac3fcb315f

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Auth pages - without header and footer */}
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupSelectPage />} />
        <Route path="/signup/child" element={<ChildSignupPage />} />
        <Route path="/signup/parent" element={<ParentSignupPage />} />

        {/* Main pages - with header and footer */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/work" element={<div>Coming Soon: Work Page</div>} />
          <Route path="/bank" element={<div>Coming Soon: Bank Page</div>} />
          <Route path="/group" element={<GroupPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App; 