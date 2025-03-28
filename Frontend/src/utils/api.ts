import { store } from '@/store';
import { reissueToken } from '@/store/slices/authSlice';
import * as jwtDecode from 'jwt-decode';

// API 기본 URL (환경 변수에서 가져옴)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://j12b207.p.ssafy.io/api';
console.log('API_BASE_URL 설정됨:', API_BASE_URL);

// 기본 API 요청 옵션
interface RequestOptions extends RequestInit {
  auth?: boolean;
}

export const apiCall = async <T>(url: string, options: RequestOptions = {}): Promise<T> => {
  const { auth = false, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers);
  console.log(`🔍 API 요청 시작: ${url}`, { auth, method: fetchOptions.method });

  // 인증 필요한 요청이라면 헤더에 토큰 추가
  // if (auth) {
  //   const state = store.getState();
  //   const { accessToken } = state.auth;

  //   if (accessToken) {
  //     headers.set('Authorization', `Bearer ${accessToken}`);
  //     console.log('🔐 인증 토큰 헤더에 추가됨', { tokenLength: accessToken.length });
      
  //     try {
  //       // 토큰 디코딩 정보 로깅 (디버깅용)
  //       const decoded = jwtDecode.jwtDecode(accessToken);
  //       const expTime = new Date((decoded as any).exp * 1000);
  //       const timeLeft = ((decoded as any).exp * 1000 - Date.now()) / 1000 / 60;
  //       console.log('🔐 토큰 정보:', {
  //         subject: (decoded as any).sub,
  //         만료시간: expTime.toLocaleString(),
  //         남은시간: `${timeLeft.toFixed(2)}분`
  //       });
  //     } catch (error) {
  //       console.error('❌ 토큰 디코딩 실패:', error);
  //     }
  //   } else {
  //     console.warn('⚠️ 인증 토큰이 필요하지만 존재하지 않음');
  //   }
  // }

  // Content-Type 기본값 설정
  if (!headers.has('Content-Type') && !fetchOptions.body) {
    headers.set('Content-Type', 'application/json');
  }
  
  // URL에 기본 URL 추가 (상대 경로일 경우만)
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}/${url.startsWith('/') ? url.substring(1) : url}`;
  console.log(`🌐 API 요청 URL: ${fullUrl}`);
  console.log('📋 요청 헤더:', Object.fromEntries(headers.entries()));
  
  try {
    console.time(`⏱️ API 요청 시간 - ${url}`);
    const response = await fetch(fullUrl, {
      ...fetchOptions,
      headers,
      credentials: 'include', // 쿠키 포함
    });
    console.timeEnd(`⏱️ API 요청 시간 - ${url}`);
    
    console.log(`🔄 API 응답 상태: ${response.status} ${response.statusText}`);
    console.log('📋 응답 헤더:', Object.fromEntries(response.headers.entries()));

    // 401 에러일 경우 토큰 재발급 시도
    // if (response.status === 401) {
    //   console.warn('⚠️ 401 인증 오류 - 토큰 재발급 시도');
    //   try {
    //     // 토큰 재발급 요청
    //     console.log('🔄 토큰 재발급 요청 시작');
    //     await store.dispatch(reissueToken());
        
    //     // 토큰 재발급 후 상태 확인
    //     const newState = store.getState();
    //     const { accessToken } = newState.auth;
        
    //     if (accessToken) {
    //       console.log('✅ 토큰 재발급 성공, 원본 요청 재시도');
    //       // 새로운 토큰으로 다시 요청
    //       headers.set('Authorization', `Bearer ${accessToken}`);
    //       console.time(`⏱️ API 재요청 시간 - ${url}`);
    //       const retryResponse = await fetch(fullUrl, {
    //         ...fetchOptions,
    //         headers,
    //         credentials: 'include',
    //       });
    //       console.timeEnd(`⏱️ API 재요청 시간 - ${url}`);
        
    //       console.log(`🔄 API 재요청 응답 상태: ${retryResponse.status} ${retryResponse.statusText}`);
        
    //       if (retryResponse.ok) {
    //         const data = await retryResponse.json();
    //         console.log('✅ API 재요청 성공:', { dataPreview: JSON.stringify(data).substring(0, 100) + '...' });
    //         return data;
    //       } else {
    //         console.error('❌ API 재요청 실패');
    //       }
    //     } else {
    //       console.error('❌ 토큰 재발급 실패 - 새 토큰 없음');
    //     }
    //   } catch (error) {
    //     console.error('❌ 토큰 재발급 과정 에러:', error);
    //   }
    // }

    if (!response.ok) {
      console.error(`❌ API 요청 실패: ${response.status} ${response.statusText}`);
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API 요청 성공:', { 
      url, 
      dataPreview: JSON.stringify(data).substring(0, 100) + '...'
    });
    return data;
  } catch (error) {
    console.error(`❌ API 요청 예외 발생 (${url}):`, error);
    throw error;
  }
}; 