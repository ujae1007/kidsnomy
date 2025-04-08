// "코드 1안"

// import { store } from '@/store';
// import { reissueToken } from '@/store/slices/authSlice';
// import * as jwtDecode from 'jwt-decode';

// // API 기본 URL (개발 환경에 따라 다르게 설정)
// const isDevelopment = import.meta.env.MODE === 'development';
// const API_BASE_URL = isDevelopment 
//   ? 'http://localhost:8080/api'  // 개발 환경에서는 직접 8080 포트로 요청
//   : 'https://j12b207.p.ssafy.io/api';

// console.log('API_BASE_URL 설정됨:', API_BASE_URL);
// console.log('현재 환경:', isDevelopment ? '개발' : '프로덕션');

// // 기본 API 요청 옵션
// interface RequestOptions extends RequestInit {
//   auth?: boolean;
// }

// export const apiCall = async <T>(url: string, options: RequestOptions = {}): Promise<T> => {
//   const { auth = false, ...fetchOptions } = options;
//   const headers = new Headers(fetchOptions.headers);
  
//   // CORS 디버깅을 위한 요청 정보 로깅
//   console.log('🔍 API 요청 디버깅 정보:', {
//     url: `${API_BASE_URL}/${url}`,
//     method: fetchOptions.method || 'GET',
//     headers: Object.fromEntries(headers.entries()),
//     credentials: fetchOptions.credentials,
//     mode: fetchOptions.mode || 'cors'
//   });

//   // 인증 필요한 요청이라면 헤더에 토큰 추가
//   if (auth) {
//     const state = store.getState();
//     const { accessToken } = state.auth;

//     if (accessToken) {
//       headers.set('Authorization', `Bearer ${accessToken}`);
//       console.log('🔐 인증 토큰 헤더에 추가됨', { tokenLength: accessToken.length });
      
//       try {
//         // 토큰 디코딩 정보 로깅 (디버깅용)
//         const decoded = jwtDecode.jwtDecode(accessToken);
//         const expTime = new Date((decoded as any).exp * 1000);
//         const timeLeft = ((decoded as any).exp * 1000 - Date.now()) / 1000 / 60;
//         console.log('🔐 토큰 정보:', {
//           subject: (decoded as any).sub,
//           만료시간: expTime.toLocaleString(),
//           남은시간: `${timeLeft.toFixed(2)}분`
//         });
//       } catch (error) {
//         console.error('❌ 토큰 디코딩 실패:', error);
//       }
//     } else {
//       console.warn('⚠️ 인증 토큰이 필요하지만 존재하지 않음');
//     }
//   }

//   // Content-Type 기본값 설정
//   if (!headers.has('Content-Type') && !fetchOptions.body) {
//     headers.set('Content-Type', 'application/json');
//   }
  
//   // URL에 기본 URL 추가 (상대 경로일 경우만)
//   const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}/${url.startsWith('/') ? url.substring(1) : url}`;
  
//   try {
//     console.time(`⏱️ API 요청 시간 - ${url}`);
//     const response = await fetch(fullUrl, {
//       ...fetchOptions,
//       headers,
//       credentials: 'include', // 쿠키 포함
//       mode: 'cors', // CORS 모드 명시적 설정
//     });
//     console.timeEnd(`⏱️ API 요청 시간 - ${url}`);
    
//     // CORS 디버깅을 위한 응답 헤더 로깅
//     console.log('📋 응답 헤더 전체:', {
//       status: response.status,
//       statusText: response.statusText,
//       headers: Object.fromEntries(response.headers.entries()),
//       type: response.type,
//       url: response.url
//     });

//     // 401 에러일 경우 토큰 재발급 시도
//     if (response.status === 401) {
//       console.warn('⚠️ 401 인증 오류 - 토큰 재발급 시도');
//       try {
//         // 토큰 재발급 요청
//         console.log('🔄 토큰 재발급 요청 시작');
//         await store.dispatch(reissueToken());
        
//         // 토큰 재발급 후 상태 확인
//         const newState = store.getState();
//         const { accessToken } = newState.auth;
        
//         if (accessToken) {
//           console.log('✅ 토큰 재발급 성공, 원본 요청 재시도');
//           // 새로운 토큰으로 다시 요청
//           headers.set('Authorization', `Bearer ${accessToken}`);
//           console.time(`⏱️ API 재요청 시간 - ${url}`);
//           const retryResponse = await fetch(fullUrl, {
//             ...fetchOptions,
//             headers,
//             credentials: 'include',
//           });
//           console.timeEnd(`⏱️ API 재요청 시간 - ${url}`);
        
//           console.log(`🔄 API 재요청 응답 상태: ${retryResponse.status} ${retryResponse.statusText}`);
        
//           if (retryResponse.ok) {
//             const data = await retryResponse.json();
//             console.log('✅ API 재요청 성공:', { dataPreview: JSON.stringify(data).substring(0, 100) + '...' });
//             return data;
//           } else {
//             console.error('❌ API 재요청 실패');
//           }
//         } else {
//           console.error('❌ 토큰 재발급 실패 - 새 토큰 없음');
//         }
//       } catch (error) {
//         console.error('❌ 토큰 재발급 과정 에러:', error);
//       }
//     }

//     if (!response.ok) {
//       console.error(`❌ API 요청 실패:`, {
//         status: response.status,
//         statusText: response.statusText,
//         url: fullUrl
//       });
//       throw new Error(`API 요청 실패: ${response.status}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error(`❌ API 요청 예외 발생 (${url}):`, {
//       error,
//       url: fullUrl,
//       method: fetchOptions.method
//     });
//     throw error;
//   }
// }; 



import { store } from '@/store';
import { reissueToken } from '@/store/slices/authSlice';
import * as jwtDecode from 'jwt-decode';

// API 기본 URL (개발 환경에 따라 다르게 설정)
const isDevelopment = import.meta.env.MODE === 'development';
// const API_BASE_URL = isDevelopment 
//   ? 'http://localhost:8080/api'  // 개발 환경에서는 직접 8080 포트로 요청
//   : 'https://j12b207.p.ssafy.io/api';
const API_BASE_URL = 'https://j12b207.p.ssafy.io/api'

console.log('API_BASE_URL 설정됨:', API_BASE_URL);
console.log('현재 환경:', isDevelopment ? '개발' : '프로덕션');

// 기본 API 요청 옵션
interface RequestOptions extends RequestInit {
  auth?: boolean;
}

export const apiCall = async <T>(url: string, options: RequestOptions = {}): Promise<T> => {
  const { auth = false, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers);
  
  // CORS 디버깅을 위한 요청 정보 로깅
  console.log('🔍 API 요청 디버깅 정보:', {
    url: `${API_BASE_URL}/${url}`,
    method: fetchOptions.method || 'GET',
    headers: Object.fromEntries(headers.entries()),
    credentials: fetchOptions.credentials,
    mode: fetchOptions.mode || 'cors'
  });

  // 인증 필요한 요청이라면 헤더에 토큰 추가
  if (auth) {
    const state = store.getState();
    const { accessToken } = state.auth;

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
      console.log('🔐 인증 토큰 헤더에 추가됨', { tokenLength: accessToken.length });
      
      try {
        // 토큰 디코딩 정보 로깅 (디버깅용)
        const decoded = jwtDecode.jwtDecode(accessToken);
        const expTime = new Date((decoded as any).exp * 1000);
        const timeLeft = ((decoded as any).exp * 1000 - Date.now()) / 1000 / 60;
        console.log('🔐 토큰 정보:', {
          subject: (decoded as any).sub,
          만료시간: expTime.toLocaleString(),
          남은시간: `${timeLeft.toFixed(2)}분`
        });
      } catch (error) {
        console.error('❌ 토큰 디코딩 실패:', error);
      }
    } else {
      console.warn('⚠️ 인증 토큰이 필요하지만 존재하지 않음');
    }
  }

  // Content-Type 기본값 설정
  if (!headers.has('Content-Type') && !fetchOptions.body) {
    headers.set('Content-Type', 'application/json');
  }
  
  // URL에 기본 URL 추가 (상대 경로일 경우만)
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}/${url.startsWith('/') ? url.substring(1) : url}`;
  
  try {
    console.time(`⏱️ API 요청 시간 - ${url}`);
    const response = await fetch(fullUrl, {
      ...fetchOptions,
      headers,
      credentials: 'include', // 쿠키 포함
      mode: 'cors', // CORS 모드 명시적 설정
    });
    console.timeEnd(`⏱️ API 요청 시간 - ${url}`);
    
    // CORS 디버깅을 위한 응답 헤더 로깅
    console.log('📋 응답 헤더 전체:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      type: response.type,
      url: response.url
    });

    // 401 에러일 경우 토큰 재발급 시도
    if (response.status === 401) {
      console.warn('⚠️ 401 인증 오류 - 토큰 재발급 시도');
      try {
        // 토큰 재발급 요청
        console.log('🔄 토큰 재발급 요청 시작');
        await store.dispatch(reissueToken());
        
        // 토큰 재발급 후 상태 확인
        const newState = store.getState();
        const { accessToken } = newState.auth;
        
        if (accessToken) {
          console.log('✅ 토큰 재발급 성공, 원본 요청 재시도');
          // 새로운 토큰으로 다시 요청
          headers.set('Authorization', `Bearer ${accessToken}`);
          console.time(`⏱️ API 재요청 시간 - ${url}`);
          const retryResponse = await fetch(fullUrl, {
            ...fetchOptions,
            headers,
            credentials: 'include',
          });
          console.timeEnd(`⏱️ API 재요청 시간 - ${url}`);
        
          console.log(`🔄 API 재요청 응답 상태: ${retryResponse.status} ${retryResponse.statusText}`);
        
          if (retryResponse.ok) {
            // 응답 형식에 따라 적절히 처리
            const contentType = retryResponse.headers.get('content-type');
            let data;
            if (contentType && contentType.includes('application/json')) {
              data = await retryResponse.json();
            } else {
              const text = await retryResponse.text();
              data = { message: text, success: retryResponse.ok };
            }
            console.log('✅ API 재요청 성공:', { dataPreview: JSON.stringify(data).substring(0, 100) + '...' });
            return data as T;
          } else {
            console.error('❌ API 재요청 실패');
          }
        } else {
          console.error('❌ 토큰 재발급 실패 - 새 토큰 없음');
        }
      } catch (error) {
        console.error('❌ 토큰 재발급 과정 에러:', error);
      }
    }

    if (!response.ok) {
      console.error(`❌ API 요청 실패:`, {
        status: response.status,
        statusText: response.statusText,
        url: fullUrl
      });
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    // 응답 형식에 따라 적절히 처리
    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text, success: response.ok };
    }
    return data as T;
  } catch (error) {
    console.error(`❌ API 요청 예외 발생 (${url}):`, {
      error,
      url: fullUrl,
      method: fetchOptions.method
    });
    throw error;
  }
};
