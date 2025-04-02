import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from '@/pages/Start/StartPage';
import LoginPage from '@/pages/Login/LoginPage';
import SignupSelectPage from '@/pages/SignupSelect/SignupSelectPage';
import ParentSignupPage from '@/pages/ParentSignup/ParentSignupPage';
import ChildSignupPage from '@/pages/ChildSignup/ChildSignupPage';
import HomePage from '@/pages/Home/HomePage';
import GroupPage from '@/pages/Group/GroupPage';
import AccountPage from '@/pages/Account/AccountPage';
import MainLayout from '@/layouts/MainLayout';
import SendMoneyPage from '@/pages/SendMoney/SendMoneyPage';
import SendMoneyResultPage from '@/pages/SendMoney/SendMoneyResultPage';
import MyAccountInfo from '@/pages/MyAccount/MyAccountInfo';
import AccountDetailPage from './pages/AccountDetail/AccountDetailPage';
import ParentJobListPage from '@/pages/ParentJobList/ParentJobListPage';
import ParentJobCreatePage from '@/pages/ParentJobCreate/ParentJobCreatePage';
import JobDetailPage from '@/pages/JobDetail/JobDetailPage';
import ParentBankProductsPage from '@/pages/ParentBankProducts/ParentBankProductsPage';
import CreateBankProductsPage from '@/pages/CreateBankProducts/CreateBankProductsPage';
import ChildBankProductsPage from '@/pages/ChildBankProducts/ChildBankProductsPage';
import ChildJobListPage from '@/pages/ChildJobList/ChildJobListPage';
import PrivateRoute from '@/components/auth/PrivateRoute';
import NotFoundPage from '@/pages/Error/NotFoundPage';
import EmailVerification from '@/pages/Signup/EmailVerification';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 공개 페이지 - 인증 불필요 */}
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupSelectPage />} />
        <Route path="/signup/child" element={<ChildSignupPage />} />
        <Route path="/signup/parent" element={<ParentSignupPage />} />
        <Route path="/signup/verify-email" element={<EmailVerification />} />

        {/* 인증이 필요한 페이지 */}
        <Route element={<MainLayout />}>
          {/* 공통 접근 가능 페이지 */}
          <Route path="/home" element={
            <PrivateRoute element={<HomePage />} />
          } />
          <Route path="/account" element={
            <PrivateRoute element={<AccountPage />} />
          } />
          <Route path="/myaccount" element={
            <PrivateRoute element={<MyAccountInfo />} />
          } />
          <Route path="/account/detail" element={
            <PrivateRoute element={<AccountDetailPage />} />
          } />
          <Route path="/group" element={
            <PrivateRoute element={<GroupPage />} />
          } />

          {/* 부모 전용 페이지 */}
          <Route path="/bank/products" element={
            <PrivateRoute element={<ParentBankProductsPage />} allowedRoles={['PARENT']} />
          } />
          <Route path="/bank/products/create" element={
            <PrivateRoute element={<CreateBankProductsPage />} allowedRoles={['PARENT']} />
          } />
          <Route path="/parent/jobs" element={
            <PrivateRoute element={<ParentJobListPage />} allowedRoles={['PARENT']} />
          } />
          <Route path="/parent/jobs/create" element={
            <PrivateRoute element={<ParentJobCreatePage />} allowedRoles={['PARENT']} />
          } />
          <Route path="/send-money" element={
            <PrivateRoute element={<SendMoneyPage />} allowedRoles={['PARENT']} />
          } />
          <Route path="/send-money/result" element={
            <PrivateRoute element={<SendMoneyResultPage />} allowedRoles={['PARENT']} />
          } />

          {/* 자녀 전용 페이지 */}
          <Route path="/child/bank/products" element={
            <PrivateRoute element={<ChildBankProductsPage />} allowedRoles={['CHILD']} />
          } />
          <Route path="/child/jobs" element={
            <PrivateRoute element={<ChildJobListPage />} allowedRoles={['CHILD']} />
          } />

          {/* 공통 접근 가능한 상세 페이지 */}
          <Route path="/jobs/:jobId" element={
            <PrivateRoute element={<JobDetailPage />} />
          } />
        </Route>

        {/* 404 페이지 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App; 


/* 수정중중 */
/* 수정중중 */