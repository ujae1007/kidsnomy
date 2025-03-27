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
import ResultPage from '@/components/common/ResultPage';
import { RESULT_MESSAGES } from '@/constants';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import MyAccountInfo from '@/pages/MyAccount/MyAccountInfo';
import AccountDetailPage from './pages/AccountDetail/AccountDetailPage';
=======
import ParentJobListPage from '@/pages/ParentJobList/ParentJobListPage';
import ParentJobCreatePage from '@/pages/ParentJobCreate/ParentJobCreatePage';
import JobDetailPage from '@/pages/JobDetail/JobDetailPage';
>>>>>>> 04db0fed3efbcd3dd59059253db1330f0f86d929

const SendMoneyCompletePage = () => {
  const navigate = useNavigate();
  return (
    <ResultPage
      title={RESULT_MESSAGES.SEND_MONEY.title}
      description={RESULT_MESSAGES.SEND_MONEY.description}
      buttonText={RESULT_MESSAGES.SEND_MONEY.buttonText}
      onButtonClick={() => navigate('/home')}
    />
  );
};

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
          <Route path="/account/send" element={<SendMoneyPage />} />
<<<<<<< HEAD
          <Route path="/myaccount" element={<MyAccountInfo />} />
          <Route path="/account/detail" element={<AccountDetailPage />} />
          <Route path="/account/send/complete" element={<SendMoneyCompletePage />} />
=======
          <Route path="/parent/jobs" element={<ParentJobListPage />} />
          <Route path="/parent/jobs/create" element={<ParentJobCreatePage />} />
          <Route path="/jobs/:jobId" element={<JobDetailPage />} />
>>>>>>> 04db0fed3efbcd3dd59059253db1330f0f86d929
        </Route>
      </Routes>
    </Router>
  );
};

export default App; 


/* 수정중중 */
/* 수정중중 */