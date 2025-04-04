import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { checkTokenExpiration, logout } from '@/store/slices/authSlice';

/**
 * 인증 상태를 확인하고 토큰의 유효성을 검사하는 커스텀 훅
 * @param redirectTo 인증되지 않았을 때 리디렉션할 경로 (기본값: '/login')
 * @returns 인증 상태 정보 (accessToken, isAuthenticated, loading, error)
 */
export const useAuth = (redirectTo = '/login') => {
  console.log('🔒 useAuth 훅 호출됨');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const { accessToken, isAuthenticated } = auth;

  useEffect(() => {
    console.log('🔒 useAuth 인증 상태 확인 시작');
    // 인증 상태 확인
    if (!isAuthenticated || !accessToken) {
      console.warn('⚠️ 인증되지 않음 - 로그인 페이지로 리디렉션');
      navigate(redirectTo);
      return;
    }

    // 토큰 만료 체크
    console.log('🔍 토큰 유효성 검사 실행');
    const isValid = dispatch(checkTokenExpiration());
    if (!isValid) {
      console.warn('⚠️ 토큰이 만료됨 - 로그아웃 후 로그인 페이지로 리디렉션');
      dispatch(logout());
      navigate(redirectTo);
    } else {
      console.log('✅ 토큰 유효성 확인됨');
    }

    // 토큰 유효성 정기 검사 (5분마다)
    console.log('⏰ 토큰 정기 검사 인터벌 설정 (5분마다)');
    const tokenCheckInterval = setInterval(() => {
      console.log('⏰ 토큰 정기 검사 실행 중');
      dispatch(checkTokenExpiration());
    }, 300000); // 5분 = 300,000ms

    return () => {
      console.log('⏰ 토큰 정기 검사 인터벌 정리');
      clearInterval(tokenCheckInterval);
    };
  }, [isAuthenticated, accessToken, navigate, redirectTo, dispatch]);

  return auth;
};

/**
 * 로그아웃 기능을 제공하는 커스텀 훅
 * @param redirectTo 로그아웃 후 리디렉션할 경로 (기본값: '/login')
 * @returns logoutUser 함수
 */
export const useLogout = (redirectTo = '/login') => {
  console.log('🚪 useLogout 훅 호출됨');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const logoutUser = () => {
    console.log('🚪 로그아웃 함수 호출됨');
    dispatch(logout());
    console.log('🚪 로그인 페이지로 리디렉션');
    navigate(redirectTo);
  };

  return { logoutUser };
}; 