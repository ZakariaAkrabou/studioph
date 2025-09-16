import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useCheckAuthQuery } from '../../store/services/authApi.jsx';
import { logout } from '../../store/slices/authSlice.jsx';

const ProtectedRoute = ({ children, fallback = '/auth/login' }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!token) {
    return <Navigate to={fallback} state={{ from: location }} replace />;
  }

  const { data, error, isLoading } = useCheckAuthQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (error && (error.status === 401 || error.originalStatus === 401)) {
      dispatch(logout());
    }
  }, [error, dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (error || !isAuthenticated) {
    return <Navigate to={fallback} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
