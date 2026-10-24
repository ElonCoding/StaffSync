
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Info, Send, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid work email address.');
      return;
    }
    setError('');
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#EAE9DF] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
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
          to="/login"
          className="text-xs font-semibold text-[#173D32] hover:text-[#102820] flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-[#173D32]/15 shadow-xl">
        <div className="text-center mb-6">
          <h2 className="font-serif-display text-2xl sm:text-3xl text-[#102820]">
            Password Recovery
          </h2>
          <p className="text-xs sm:text-sm text-[#7E8980] mt-1.5">
            Enter your registered company email to receive reset instructions.
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-[#C24141]/10 border border-[#C24141]/30 text-xs text-[#C24141]">
                {error}
              </div>
            )}

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
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#173D32] text-[#EAE9DF] font-semibold text-sm hover:bg-[#102820] shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Verify & Send Instructions</span>
              <Send className="w-4 h-4 text-[#C7F36B]" />
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#173D32]/10 text-[#173D32] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#34785B]" />
            </div>
            <h3 className="font-semibold text-[#102820] text-base">
              Verification Request Received
            </h3>
            <div className="p-4 rounded-2xl bg-[#F7F8F5] border border-[#E6EBE5] text-left text-xs text-[#34443A] leading-relaxed">
              <div className="flex items-start gap-2 mb-2 text-[#B7791F] font-semibold">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Backend Integration Notice:</span>
              </div>
              <p>
                In this frontend prototype phase, outbound SMTP email dispatch requires integration with the
                Google Antigravity backend service. For demo testing, you can sign in directly using the
                pre-configured 1-click accounts on the login screen.
              </p>
            </div>
            <Link
              to="/login"
              className="block w-full py-2.5 rounded-xl bg-[#173D32] text-[#EAE9DF] text-xs font-semibold hover:bg-[#102820]"
            >
              Return to Login Screen
            </Link>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-[#E6EBE5] text-center">
          <Link
            to="/login"
            className="text-xs font-semibold text-[#173D32] hover:text-[#102820] transition-colors"
          >
            Remember your password? Sign In
          </Link>
        </div>
      </div>

      <div className="text-center text-xs text-[#7E8980] mt-8">
        StaffSync Workforce Platform
      </div>
    </div>
  );
}
