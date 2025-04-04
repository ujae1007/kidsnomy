import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { apiCall } from '@/utils/api';
import styles from './SendMoneyPage.module.css';
import { RESULT_MESSAGES } from '@/constants';

import SendHeader from '@/components/sendmoney/SendHeader';
import AmountInput from '@/components/sendmoney/AmountInput';
import AccountSelection from '@/components/sendmoney/AccountSelection';
import SendButton from '@/components/sendmoney/SendButton';
import { Account } from '@/types/account';
import { 
  ApiResponse, 
  AccountResponse, 
  SendMoneyRequest, 
  SendMoneyResponse, 
  ApiError, 
  ApiErrorCode 
} from '@/types/api';

const SendMoneyPage: React.FC = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      console.log('💰 계좌 목록 조회 시작');
      try {
        const response = await apiCall<ApiResponse<AccountResponse[]>>('accounts', {
          method: 'GET',
          auth: true
        });

        if (!response.success) {
          throw new Error(response.message);
        }

        console.log('✅ 계좌 목록 조회 성공:', {
          accountCount: response.data?.length,
          accounts: response.data?.map(acc => ({
            id: acc.id,
            accountNumber: acc.accountNumber,
            type: acc.type,
            balance: acc.balance
          }))
        });

        setAccounts(response.data || []);
      } catch (error) {
        console.error('❌ 계좌 목록 조회 중 에러 발생:', error);
        const apiError = error as ApiError;
        setError(getErrorMessage(apiError));
      } finally {
        console.log('📊 계좌 목록 조회 완료');
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const handleAmountChange = (newAmount: string) => {
    console.log('💵 송금 금액 변경:', newAmount);
    setAmount(newAmount);
  };

  const handleAccountSelect = (accountId: string) => {
    console.log('🏦 선택된 계좌 변경:', accountId);
    setSelectedAccountId(accountId);
  };

  const getErrorMessage = (error: ApiError): string => {
    switch (error.code) {
      case ApiErrorCode.INSUFFICIENT_BALANCE:
        return '잔액이 부족합니다.';
      case ApiErrorCode.INVALID_ACCOUNT:
        return '유효하지 않은 계좌입니다.';
      case ApiErrorCode.INVALID_AMOUNT:
        return '유효하지 않은 금액입니다.';
      case ApiErrorCode.UNAUTHORIZED:
        return '인증이 필요합니다.';
      case ApiErrorCode.SERVER_ERROR:
        return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      default:
        return '송금 처리 중 오류가 발생했습니다.';
    }
  };

  const handleSend = async () => {
    if (!selectedAccountId || !amount) {
      console.warn('⚠️ 송금 시도: 필수 정보 누락', {
        hasAccountId: !!selectedAccountId,
        hasAmount: !!amount
      });
      return;
    }

    console.log('💸 송금 처리 시작', {
      accountId: selectedAccountId,
      amount: amount
    });

    try {
      const request: SendMoneyRequest = {
        accountId: selectedAccountId,
        amount: parseInt(amount, 10)
      };

      const response = await apiCall<ApiResponse<SendMoneyResponse>>('money/send', {
        method: 'POST',
        auth: true,
        body: JSON.stringify(request)
      });

      console.log('✅ 송금 요청 응답 수신:', {
        success: response.success,
        data: response.data
      });

      if (response.success && response.data) {
        console.log('🎉 송금 처리 완료:', {
          transactionId: response.data.transactionId,
          status: response.data.status
        });
        
        navigate('/account/send/complete', {
          state: {
            title: RESULT_MESSAGES.SEND_MONEY.title,
            description: RESULT_MESSAGES.SEND_MONEY.description,
            buttonText: RESULT_MESSAGES.SEND_MONEY.buttonText,
            buttonLink: '/home'
          }
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('❌ 송금 처리 중 에러 발생:', error);
      const apiError = error as ApiError;
      const errorMessage = getErrorMessage(apiError);
      
      navigate('/send-money/result', {
        state: {
          status: 'FAILED',
          amount: parseInt(amount, 10),
          transactionId: '',
          fromAccount: '',
          timestamp: new Date().toISOString(),
          errorMessage
        }
      });
    }
  };

  const isValid = amount !== '' && selectedAccountId !== null;

  if (loading) {
    return <div className={styles.loading}>계좌 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <SendHeader />
      <main className={styles.main}>
        <AmountInput amount={amount} onAmountChange={handleAmountChange} />
        <AccountSelection
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          onAccountSelect={handleAccountSelect}
        />
      </main>
      <footer className={styles.footer}>
        <SendButton isValid={isValid} onSend={handleSend} />
      </footer>
    </div>
  );
};

export default SendMoneyPage; 