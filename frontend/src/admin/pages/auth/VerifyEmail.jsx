import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLazyVerifyEmailQuery } from '../../../store/services/authApi.jsx';

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [trigger, { isFetching, isError, isSuccess }] = useLazyVerifyEmailQuery();

  useEffect(() => {
    if (token) {
      trigger({ token })
        .unwrap()
        .then(() => setTimeout(() => navigate('/auth/login'), 1500))
        .catch(() => {});
    }
  }, [token, trigger, navigate]);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-950">
      <div className="relative hidden md:flex flex-col p-10 overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h1 className="text-3xl font-semibold">StudioPH Admin</h1>
          <p className="text-white/70 mt-4 max-w-md">Verifying your email to unlock your studio dashboard.</p>
        </div>
        <div className="relative z-10 text-xs text-white/50">© {new Date().getFullYear()} StudioPH</div>
      </div>

      <div className="relative flex items-center justify-center p-6 sm:p-10 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl rounded-2xl p-8 text-center">
            {isFetching && <p className="text-gray-700">Verifying...</p>}
            {isSuccess && (
              <div>
                <p className="text-green-700">Email verified! Redirecting to login...</p>
                <Link to="/auth/login" className="mt-3 inline-block text-indigo-600">Go to login</Link>
              </div>
            )}
            {isError && (
              <div>
                <p className="text-red-700">Verification failed or link expired.</p>
                <Link to="/auth/register" className="mt-3 inline-block text-indigo-600">Create account</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


