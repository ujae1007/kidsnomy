export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  email: string | null;
  isAuthenticated: boolean;
  userRole: string | null;
  userId: number | null;
  isParent: boolean;
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
  userRole: string;
  userId: number;
  isParent: boolean;
  groupId: number | null;
}

export interface TokenPayload {
  sub: string; // 이메일
  iat: number; // 발급 시간
  exp: number; // 만료 시간
} 