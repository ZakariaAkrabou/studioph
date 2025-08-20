import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterAdminMutation } from '../../../store/services/authApi.jsx';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false, confirmPassword: false });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterAdminMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      const result = await register({ email: formData.email, password: formData.password }).unwrap();
      setSuccess(result.message || 'Registration successful! Please check your email for verification.');
      
      // Clear form
      setFormData({ email: '', password: '', confirmPassword: '' });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
    } catch (err) {
      const msg = err?.data?.message || err?.error || 'Registration failed';
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-950">
      {/* Left visual panel */}
      <div className="relative hidden md:flex flex-col p-10 overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[28rem] h-[28rem] rounded-full bg-gradient-to-tr from-blue-500/10 via-indigo-500/20 to-purple-500/10 blur-3xl" />

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur border border-white/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 7h3l2-2h6l2 2h3v12H4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="13" r="4" strokeWidth="2" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">StudioPH Admin</h1>
          </div>

          <div className="mt-10">
            <h2 className="text-4xl font-bold leading-tight">Join the Studio</h2>
            <p className="mt-3 text-white/70 max-w-md">Create your admin account to start managing your photography business.</p>
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/50">© {new Date().getFullYear()} StudioPH</div>
      </div>

      {/* Right form panel */}
      <div className="relative flex items-center justify-center p-6 sm:p-10 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl rounded-2xl p-8">
            <div className="flex items-center gap-3 justify-center">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 7h3l2-2h6l2 2h3v12H4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="13" r="4" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Create Account</h2>
                <p className="text-sm text-gray-500">Sign up to access admin panel</p>
              </div>
            </div>

            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <svg className="h-5 w-5 mt-0.5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="mt-6 bg-green-50 border border-green-200 text-green-700 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <svg className="h-5 w-5 mt-0.5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm">{success}</p>
                </div>
              </div>
            )}

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 6h16v12H4z" strokeWidth="2"/><path d="M22 6l-10 7L2 6" strokeWidth="2"/></svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                      className="block w-full rounded-lg border border-gray-300 bg-white/70 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="you@studio.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="11" width="18" height="10" rx="2" strokeWidth="2"/><path d="M7 11V8a5 5 0 0110 0v3" strokeWidth="2"/></svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                      className="block w-full rounded-lg border border-gray-300 bg-white/70 pl-10 pr-10 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3l18 18" strokeWidth="2"/><path d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-3.42" strokeWidth="2"/><path d="M17.94 17.94C16.23 19 14.21 19.6 12 19.6 6 19.6 2 12 2 12a18.37 18.37 0 014.43-5.49" strokeWidth="2"/><path d="M14.12 5.52A9.61 9.61 0 0112 4.4C6 4.4 2 12 2 12a18.31 18.31 0 003.17 4.24" strokeWidth="2"/></svg>
                      ) : (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M1 12s4-7.6 11-7.6S23 12 23 12s-4 7.6-11 7.6S1 12 1 12z" strokeWidth="2"/><circle cx="12" cy="12" r="3" strokeWidth="2"/></svg>
                      )}
                    </button>
                  </div>
                  {touched.password && formData.password.length < 8 && (
                    <p className="mt-1 text-xs text-red-600">Password must be at least 8 characters.</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="11" width="18" height="10" rx="2" strokeWidth="2"/><path d="M7 11V8a5 5 0 0110 0v3" strokeWidth="2"/></svg>
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
                      className="block w-full rounded-lg border border-gray-300 bg-white/70 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                  {touched.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">Passwords do not match.</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : 'Create Account'}
              </button>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
