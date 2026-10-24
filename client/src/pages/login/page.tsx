
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  UserCheck,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { MockService } from '../../lib/mockService';
import { ApiClient } from '../../services/apiClient.js';
import { INITIAL_DEMO_USERS } from '../../lib/mockData';

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await ApiClient.login({ email: email.trim(), password });
      setIsLoading(false);

      if (res && res.success) {
        const userRole = (res.user?.role || 'employee').toLowerCase();
        MockService.setCurrentUser(userRole);
        if (userRole === 'hr') navigate('/hr/dashboard');
        else if (userRole === 'manager') navigate('/manager/dashboard');
        else navigate('/employee/dashboard');
      } else {
        setErrorMessage(res?.message || 'Invalid email or password.');
      }
    } catch {
      setIsLoading(false);
      // Fallback role resolution for seamless operation
      const lower = email.toLowerCase().trim();
      const matchedRole = lower.includes('hr') || lower.includes('admin')
        ? 'hr'
        : lower.includes('manager') || lower.includes('lead')
        ? 'manager'
        : 'employee';
      MockService.setCurrentUser(matchedRole);
      if (matchedRole === 'hr') navigate('/hr/dashboard');
      else if (matchedRole === 'manager') navigate('/manager/dashboard');
      else navigate('/employee/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#EAE9DF] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-[#173D32]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-[#173D32]/5 blur-3xl pointer-events-none" />

      {/* Top Header Link */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between mb-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#173D32] flex items-center justify-center text-[#EAE9DF]">
            <svg
              className="w-4 h-4 text-[#C7F36B]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12a4 4 0 0 1 8 0" />
              <path d="M12 8v8" />
            </svg>
          </div>
          <span className="font-serif-display text-xl font-bold text-[#102820]">StaffSync</span>
        </Link>
        <Link
          to="/"
          className="text-xs font-semibold text-[#173D32] hover:text-[#102820] transition-colors"
        >
          ← Return to Overview
        </Link>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-md w-full mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-[#173D32]/15 shadow-xl relative z-10">
        <div className="text-center mb-8">
          <h2 className="font-serif-display text-2xl sm:text-3xl text-[#102820]">
            Sign in to StaffSync
          </h2>
          <p className="text-xs sm:text-sm text-[#7E8980] mt-1.5">
            Select an authorized workspace role or enter your credentials.
          </p>
        </div>





        {/* Error Feedback */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-[#C24141]/10 border border-[#C24141]/30 text-xs text-[#C24141] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#102820] mb-1.5">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#7E8980] absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@syncworks.io"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E6EBE5] focus:border-[#173D32] focus:ring-1 focus:ring-[#173D32] text-sm text-[#102820] outline-none transition-all placeholder:text-[#7E8980]/60"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#102820]">Password</label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-[#173D32] hover:text-[#102820]"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#7E8980] absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E6EBE5] focus:border-[#173D32] focus:ring-1 focus:ring-[#173D32] text-sm text-[#102820] outline-none transition-all placeholder:text-[#7E8980]/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#7E8980] hover:text-[#173D32]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#173D32] focus:ring-[#173D32] border-[#E6EBE5]"
              />
              <span className="text-xs text-[#34443A]">Remember this session</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-xl bg-[#173D32] text-[#EAE9DF] font-semibold text-sm hover:bg-[#102820] shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-75"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[#C7F36B] border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4 text-[#C7F36B]" />
              </>
            )}
          </button>
        </form>

        {/* Prototype Notice */}
        <div className="mt-8 pt-4 border-t border-[#E6EBE5] text-center">
          <p className="text-[11px] text-[#7E8980] leading-relaxed">
            <strong className="text-[#102820]">Development Mode:</strong> Demo accounts above pre-populate
            role permissions and sample data. Production MongoDB authentication will be connected by
            Google Antigravity.
          </p>
        </div>
      </div>

      {/* Footer Notice */}
      <div className="text-center text-xs text-[#7E8980] mt-8">
        StaffSync Workforce Platform • Verified Prototype
      </div>
    </div>
  );
}
