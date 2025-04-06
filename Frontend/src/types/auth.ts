export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  email: string | null;
  isAuthenticated: boolean;
  userRole: string | null;
  userId: string | null;
  isParent: boolean | null;
  groupId: number | null;
  loading: boolean;
  error: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  isParent: boolean;
  userRole: string;
  userId: number;
  groupId: number;
  success?: boolean;
  message?: string;
}

export interface TokenPayload {
  sub: string; // 이메일
  iat: number; // 발급 시간
  exp: number; // 만료 시간
} 