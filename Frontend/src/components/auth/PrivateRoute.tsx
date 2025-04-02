import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import UnauthorizedPage from '@/pages/Error/UnauthorizedPage';
import ForbiddenPage from '@/pages/Error/ForbiddenPage';

interface PrivateRouteProps {
  element: React.ReactElement;
  allowedRoles?: ('PARENT' | 'CHILD')[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, allowedRoles }) => {
  const location = useLocation();
  const { isAuthenticated, userRole } = useSelector((state: RootState) => state.auth);

  console.log('🔒 접근 권한 체크:', {
    path: location.pathname,
    isAuthenticated,
    userRole,
    allowedRoles
  });

  // TODO: 토큰 검증 로직 주석 처리
  // if (!isAuthenticated) {
  //   console.warn('⚠️ 인증되지 않은 사용자의 접근 시도');
  //   // /home으로의 접근 시도는 로그인 페이지로 리다이렉트
  //   if (location.pathname === '/home') {
  //     return <Navigate to="/login" replace />;
  //   }
  //   return <UnauthorizedPage />;
  // }

  // if (allowedRoles && !allowedRoles.includes(userRole as 'PARENT' | 'CHILD')) {
  //   console.warn('⚠️ 권한이 없는 사용자의 접근 시도:', {
  //     userRole,
  //     requiredRoles: allowedRoles
  //   });
  //   return <ForbiddenPage />;
  // }

  return element;
};

export default PrivateRoute; 