import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCheckAuthQuery } from '../../store/services/authApi.jsx';

const ProtectedRoute = ({ children, fallback = '/auth/login' }) => {
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const location = useLocation();

  // If no token, redirect to login
  if (!token) {
    return <Navigate to={fallback} state={{ from: location }} replace />;
  }

  // Check if token is valid
  const { data, error, isLoading } = useCheckAuthQuery(undefined, {
    skip: !token,
  });

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

  // If token is invalid or expired, redirect to login
  if (error || !isAuthenticated) {
    return <Navigate to={fallback} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
