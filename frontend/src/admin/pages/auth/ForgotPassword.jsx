import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForgotPasswordMutation } from '../../../store/services/authApi.jsx';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [touched, setTouched] = useState(false);
  const [forgotPassword, { isLoading: isSending }] = useForgotPasswordMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }
    
    setIsLoading(true);
    forgotPassword({ email })
      .unwrap()
      .then(() => {
        setMessage({ type: 'success', text: 'If an account exists with this email, you will receive a password reset link.' });
      })
      .catch((err) => {
        const msg = err?.data?.message || 'Unable to send reset link';
        setMessage({ type: 'error', text: msg });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-950">
      {/* Left visual panel */}
      <div className="relative hidden md:flex flex-col p-10 overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
        <div className="absolute -top-24 -right-20 w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-[32rem] h-[32rem] rounded-full bg-gradient-to-tr from-blue-500/10 via-indigo-500/20 to-purple-500/10 blur-3xl" />

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
            <h2 className="text-4xl font-bold leading-tight">Reset access to your studio</h2>
            <p className="mt-3 text-white/70 max-w-md">We’ll send you a link to reset your password and get you back to curating categories.</p>
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
                <h2 className="text-xl font-semibold text-gray-900">Forgot your password?</h2>
                <p className="text-sm text-gray-500">We’ll email you a reset link</p>
              </div>
            </div>

            {message.text && (
              <div className={`mt-6 rounded-md p-3 border ${message.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                <div className="flex items-start gap-2">
                  {message.type === 'error' ? (
                    <svg className="h-5 w-5 mt-0.5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 mt-0.5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            )}

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched(true)}
                    aria-invalid={touched && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                    className={`block w-full rounded-lg border bg-white/70 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm ${
                      touched && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                    placeholder="you@studio.com"
                  />
                </div>
                {touched && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                  <p className="mt-1 text-xs text-red-600">Please enter a valid email address.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || isSending}
                className={`w-full inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md ${(isLoading || isSending) ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {(isLoading || isSending) ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : 'Send Reset Link'}
              </button>

              <div className="text-center text-sm text-gray-600">
                Remember your password?{' '}
                <Link to="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">Back to Sign in</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
