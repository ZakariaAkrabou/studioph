import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useCheckAuthQuery } from '../../store/services/authApi.jsx';
import { logout } from '../../store/slices/authSlice.jsx';

const ProtectedRoute = ({ children, fallback = '/auth/login' }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  // If we know user is not authenticated, redirect immediately
  if (!isAuthenticated) {
    return <Navigate to={fallback} state={{ from: location }} replace />;
  }

  const { error, isLoading } = useCheckAuthQuery(undefined, {
    skip: !isAuthenticated,
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

  if (error) {
    return <Navigate to={fallback} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
