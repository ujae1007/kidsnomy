// API 응답의 기본 구조
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// 계좌 정보 응답
export interface AccountResponse {
  id: string;
  accountNumber: string;
  type: string;
  balance: number;
}

// 송금 요청 데이터
export interface SendMoneyRequest {
  accountId: string;
  amount: number;
  description?: string;
}

// 송금 응답 데이터
export interface SendMoneyResponse {
  transactionId: string;
  fromAccount: string;
  amount: number;
  timestamp: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
}

// API 에러 타입
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// API 에러 코드
export enum ApiErrorCode {
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  INVALID_ACCOUNT = 'INVALID_ACCOUNT',
  INVALID_AMOUNT = 'INVALID_AMOUNT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  SERVER_ERROR = 'SERVER_ERROR',
} 