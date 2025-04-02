import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginRequest, LoginResponse } from '@/types/auth';
import * as jwtDecode from 'jwt-decode';

// 초기 상태 정의
const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  email: null,
  isAuthenticated: false,
  userRole: null,
  userId: null,
  loading: false,
  error: null,
};

console.log('🔐 인증 슬라이스 초기화됨');

// 로그인 비동기 액션 정의
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      console.log('🔑 로그인 요청 시작:', { email: credentials.email, passwordLength: credentials.password.length });
      console.time('⏱️ 로그인 요청 시간');
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(credentials),
        credentials: 'include', // 쿠키 포함
      });
      
      console.timeEnd('⏱️ 로그인 요청 시간');
      console.log(`🔄 로그인 응답 상태: ${response.status} ${response.statusText}`);
      console.log('📋 응답 헤더:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        if (response.status === 403) {
          console.error('❌ 로그인 거부됨: 회원정보가 올바르지 않음');
          return rejectWithValue('회원정보가 올바르지 않습니다.');
        }
        console.error(`❌ 로그인 실패: HTTP 상태 ${response.status}`);
        return rejectWithValue('로그인에 실패했습니다.');
      }

      const data: LoginResponse = await response.json();
      console.log('✅ 로그인 성공:', { 
        tokenReceived: !!data.accessToken,
        tokenLength: data.accessToken?.length,
        userType: data.isParent ? '부모' : '자녀'
      });
      
      // 토큰 정보 디코딩 및 로깅 (디버깅용)
      try {
        const decoded = jwtDecode.jwtDecode(data.accessToken);
        const expTime = new Date((decoded as any).exp * 1000);
        const timeLeft = ((decoded as any).exp * 1000 - Date.now()) / 1000 / 60;
        
        console.log('🔐 받은 토큰 정보:', {
          subject: (decoded as any).sub,
          만료시간: expTime.toLocaleString(),
          남은시간: `${timeLeft.toFixed(2)}분`,
          사용자유형: data.isParent ? '부모' : '자녀'
        });
      } catch (error) {
        console.error('❌ 토큰 디코딩 실패:', error);
      }
      
      return data;
    } catch (error) {
      console.error('❌ 로그인 요청 중 예외 발생:', error);
      return rejectWithValue('네트워크 오류가 발생했습니다.');
    }
  }
);

// 토큰 재발급 비동기 액션 정의
export const reissueToken = createAsyncThunk(
  'auth/reissue',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      
      if (!auth.accessToken) {
        console.error('❌ 토큰 재발급 실패: 토큰이 없음');
        return rejectWithValue('토큰이 없습니다.');
      }

      console.log('🔄 토큰 재발급 요청 시작');
      console.time('⏱️ 토큰 재발급 요청 시간');
      
      const response = await fetch('/api/auth/reissue', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.accessToken}`,
          'Accept': 'application/json'
        },
        credentials: 'include', // 쿠키를 포함하도록 설정
      });
      
      console.timeEnd('⏱️ 토큰 재발급 요청 시간');
      console.log(`🔄 토큰 재발급 응답 상태: ${response.status} ${response.statusText}`);
      console.log('📋 응답 헤더:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        console.error(`❌ 토큰 재발급 실패: HTTP 상태 ${response.status}`);
        return rejectWithValue('토큰 재발급에 실패했습니다.');
      }

      const data: LoginResponse = await response.json();
      console.log('✅ 토큰 재발급 성공:', { 
        tokenReceived: !!data.accessToken,
        tokenLength: data.accessToken?.length
      });

      // isParent 필드가 없으면 기존 값 사용
      if (data.isParent === undefined && auth.isParent !== null) {
        console.log('ℹ️ 토큰 재발급 응답에 isParent 필드가 없어 기존 값을 유지합니다:', auth.isParent);
        data.isParent = auth.isParent;
      }
      
      return data;
    } catch (error) {
      console.error('❌ 토큰 재발급 요청 중 예외 발생:', error);
      return rejectWithValue('네트워크 오류가 발생했습니다.');
    }
  }
);

// 토큰의 유효성 체크 및 만료 시간 가져오기
export const checkTokenExpiration = () => (dispatch: any, getState: any) => {
  const { auth } = getState();
  if (!auth.accessToken) {
    console.warn('⚠️ 토큰 유효성 검사 실패: 토큰이 없음');
    return false;
  }

  try {
    const decodedToken: any = jwtDecode.jwtDecode(auth.accessToken);
    const currentTime = Date.now() / 1000;
    const expTime = new Date(decodedToken.exp * 1000);
    const timeLeft = (decodedToken.exp - currentTime) / 60;
    
    console.log('🔍 토큰 유효성 검사:', {
      만료시간: expTime.toLocaleString(),
      남은시간: `${timeLeft.toFixed(2)}분`,
      유효함: decodedToken.exp > currentTime
    });
    
    // 토큰 만료 5분 전에 재발급 요청
    if (decodedToken.exp - currentTime < 300) {
      console.log('⚠️ 토큰 만료 임박 (5분 이내) - 토큰 재발급 시도');
      dispatch(reissueToken());
    }
    
    return decodedToken.exp > currentTime;
  } catch (error) {
    console.error('❌ 토큰 유효성 검사 중 에러 발생:', error);
    return false;
  }
};

// 로그아웃 액션
export const logout = () => (dispatch: any) => {
  console.log('🚪 로그아웃 요청');
  dispatch(authSlice.actions.logoutSuccess());
  console.log('✅ 로그아웃 완료');
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutSuccess: (state) => {
      console.log('🚪 로그아웃 처리 중...');
      state.accessToken = null;
      state.refreshToken = null;
      state.email = null;
      state.isAuthenticated = false;
      state.userRole = null;
      state.userId = null;
      state.error = null;
    },
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    clearAuth: (state) => {
      console.log('🔒 인증 정보 초기화');
      state.accessToken = null;
      state.refreshToken = null;
      state.email = null;
      state.isAuthenticated = false;
      state.userRole = null;
      state.userId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 로그인 처리
      .addCase(loginUser.pending, (state) => {
        console.log('🔄 로그인 진행 중...');
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        console.log('✅ 로그인 성공 - Redux 상태 업데이트');
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.userRole = action.payload.isParent ? 'PARENT' : 'CHILD';
        state.userId = (jwtDecode.jwtDecode(action.payload.accessToken) as any).sub;
        state.isAuthenticated = true;
        state.email = action.payload.email;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.error('❌ 로그인 실패 - Redux 상태 업데이트', action.payload);
        state.loading = false;
        state.error = action.payload as string;
      })
      // 토큰 재발급 처리
      .addCase(reissueToken.pending, (state) => {
        console.log('🔄 토큰 재발급 진행 중...');
        state.loading = true;
      })
      .addCase(reissueToken.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        console.log('✅ 토큰 재발급 성공 - Redux 상태 업데이트');
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        // isParent 필드가 전달되었으면 업데이트, 아니면 기존 값 유지
        if (action.payload.isParent !== undefined) {
          state.userRole = action.payload.isParent ? 'PARENT' : 'CHILD';
        }
        state.isAuthenticated = true;
        state.email = action.payload.email;
      })
      .addCase(reissueToken.rejected, (state, action) => {
        console.error('❌ 토큰 재발급 실패 - Redux 상태 업데이트', action.payload);
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.userRole = null;
        state.userId = null;
        state.email = null;
        // isParent는 유지 (로그아웃해도 사용자 유형 정보는 유지함)
      });
  },
});

export const { setTokens, setEmail, clearAuth } = authSlice.actions;
export default authSlice.reducer; 