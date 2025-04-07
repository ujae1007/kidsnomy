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
import ResultPage from '@/components/common/ResultPage/ResultPage';
import { RESULT_MESSAGES } from '@/constants';
import { useNavigate } from 'react-router-dom';
import MyAccountInfo from '@/pages/MyAccount/MyAccountInfo';
import AccountDetailPage from './pages/AccountDetail/AccountDetailPage';
import ParentJobListPage from '@/pages/ParentJobList/ParentJobListPage';
import ParentJobCreatePage from '@/pages/ParentJobCreate/ParentJobCreatePage';
import JobDetailPage from '@/pages/JobDetail/JobDetailPage';
import ParentBankProductsPage from '@/pages/ParentBankProducts/ParentBankProductsPage';
import CreateBankProductsPage from '@/pages/CreateBankProducts/CreateBankProductsPage';
import ChildBankProductsPage from '@/pages/ChildBankProducts/ChildBankProductsPage';
import ChildJobListPage from '@/pages/ChildJobList/ChildJobListPage';
import DepositProductDetailPage from '@/pages/DepositProductDetail/DepositProductDetailPage';
import SavingProductDetailPage from '@/pages/SavingProductDetail/SavingProductDetailPage';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import ChildJobButtonPage from '@/pages/ChildJobButton/ChildJobButtonPage';

const SendMoneyCompletePage = () => {
  const navigate = useNavigate();
  return (
    <ResultPage />
  );
};

const App: React.FC = () => {
  const selectedGroupId = useSelector((state: RootState) => state.group.selectedGroupId);

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
          <Route path="home" element={<HomePage />} />
          <Route path="work" element={<div>Coming Soon: Work Page</div>} />
          <Route path="bank" element={<div>Coming Soon: Bank Page</div>} />
          <Route path="bank/products" element={<ParentBankProductsPage />} />
          <Route path="bank/products/create" element={<CreateBankProductsPage />} />
          <Route path="bank/products/deposit/:id" element={<DepositProductDetailPage />} />
          <Route path="bank/products/saving/:id" element={<SavingProductDetailPage />} />
          <Route path="child/bank/products" element={<ChildBankProductsPage />} />
          <Route path="child/bank/products/deposit/:id" element={<DepositProductDetailPage />} />
          <Route path="child/bank/products/saving/:id" element={<SavingProductDetailPage />} />
          <Route path="group" element={<GroupPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="account/send" element={<SendMoneyPage />} />
          <Route path="myaccount" element={<MyAccountInfo />} />
          <Route path="account/detail" element={<AccountDetailPage />} />
          <Route path="parent/jobs" element={<ParentJobListPage />} />
          <Route path="parent/jobs/create" element={<ParentJobCreatePage />} />
          <Route path="child/jobs" element={<ChildJobListPage />} />
          <Route path="childjobbutton" element={<ChildJobButtonPage />} />
          <Route path="jobs/:jobId" element={<JobDetailPage />} />
        </Route>
        
        {/* Result pages - without layout */}
        <Route path="/account/send/complete" element={<SendMoneyCompletePage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  );
};

export default App; 


/* 수정중중 */
/* 수정중중 */