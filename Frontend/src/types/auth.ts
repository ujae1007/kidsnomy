export interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  isParent: boolean | null;
  loading: boolean;
  error: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  isParent: boolean;
}

export interface TokenPayload {
  sub: string; // 이메일
  iat: number; // 발급 시간
  exp: number; // 만료 시간
} 