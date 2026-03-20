import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate slight delay for feel
    await new Promise((r) => setTimeout(r, 600));

    if (phone === '1234567890' && pin === '1234') {
      localStorage.setItem('adminLoggedIn', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid phone number or PIN');
    }
    setIsLoading(false);
  };

  return (
    <>
      {/* Ambient blobs matching app */}
     
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">

        
        <div className='text-center p-5 text-3xl tracking-wide'>Admin</div>
          {/* Card */}
          <div className="bg-white border-2 border-blue rounded-lg p-6 backdrop-blur-sm shadow-2xl">
            <h2 className="text-white text-lg font-semibold text-center mb-6 tracking-wide">
              Sign In
            </h2>

            {error && (
              <div className="mb-4 flex items-start gap-2 bg-red-950/30 border border-red-500/50 rounded-md px-3 py-2">
                <span className="text-red-400 text-sm mt-0.5">⚠</span>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-black mb-1">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setError(''); }}
                  required
                  className="w-full px-3 py-3 text-sm bg-white border-2 border-blue backdrop-blur-sm font-thin text-black tracking-wide rounded-md focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label htmlFor="pin" className="block text-sm font-medium text-black mb-1">
                  PIN <span className="text-red-400">*</span>
                </label>
                <input
                  id="pin"
                  type="password"
                  value={pin}
                  onChange={(e) => { setPin(e.target.value); setError(''); }}
                  required
                  maxLength={6}
                  className="w-full px-3 py-3 text-sm bg-white border-2 border-blue backdrop-blur-sm font-thin text-black tracking-widest rounded-md focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200"
                  placeholder="••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-gradient-to-r from-[#000000] via-[#111111] to-[#333333] text-white font-semibold py-3 px-4 rounded-md transition-all backdrop-blur-sm duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="text-xs text-gray-600 text-center mt-5">
              Demo: <span className="text-gray-500">1234567890</span> / PIN <span className="text-gray-500">1234</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;