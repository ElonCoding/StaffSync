import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Building,
} from 'lucide-react';
import { ApiClient } from '../../services/apiClient.js';

export default function SignupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Employee');
  const [department, setDepartment] = useState('Engineering');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Please fill in all required registration fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await ApiClient.register({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        department,
      });

      setIsLoading(false);

      if (res && res.success) {
        setSuccessMessage('Account created successfully! Redirecting...');
        const userObj = res.user || {
          name,
          email,
          role: role.toLowerCase(),
          department,
          designation: `${role} Member`,
        };
        const userRole = (userObj.role || 'employee').toLowerCase();
        setTimeout(() => {
          if (userRole === 'hr') navigate('/hr/dashboard');
          else if (userRole === 'manager') navigate('/manager/dashboard');
          else navigate('/employee/dashboard');
        }, 1000);
      } else {
        setErrorMessage(res?.message || 'Registration failed. Email may already be registered.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.data?.message || err?.message || 'Registration failed. Please try again.');
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
          <img
            src="/image copy.svg"
            alt="StaffSync Logo"
            className="w-8 h-8 rounded-lg object-contain shadow-xs"
          />
          <span className="font-serif-display text-xl font-bold text-[#102820]">StaffSync</span>
        </Link>
        <Link
          to="/login"
          className="text-xs font-semibold text-[#173D32] hover:text-[#102820] transition-colors"
        >
          Already have an account? Sign in →
        </Link>
      </div>

      {/* Main Registration Card */}
      <div className="max-w-md w-full mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-[#173D32]/15 shadow-xl relative z-10">
        <div className="text-center mb-6">
          <h2 className="font-serif-display text-2xl sm:text-3xl text-[#102820]">
            Create an Account
          </h2>
          <p className="text-xs sm:text-sm text-[#7E8980] mt-1.5">
            Join StaffSync workforce workspace and start collaborating.
          </p>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-[#C24141]/10 border border-[#C24141]/30 text-xs text-[#C24141] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-[#34785B]/15 border border-[#34785B]/30 text-xs text-[#34785B] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#102820] mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#7E8980] absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E6EBE5] focus:border-[#173D32] focus:ring-1 focus:ring-[#173D32] text-sm text-[#102820] outline-none transition-all placeholder:text-[#7E8980]/60"
                required
              />
            </div>
          </div>

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
                placeholder="jane.doe@syncworks.io"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E6EBE5] focus:border-[#173D32] focus:ring-1 focus:ring-[#173D32] text-sm text-[#102820] outline-none transition-all placeholder:text-[#7E8980]/60"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#102820] mb-1.5">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E6EBE5] focus:border-[#173D32] focus:ring-1 focus:ring-[#173D32] text-sm text-[#102820] outline-none bg-white transition-all cursor-pointer"
              >
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
                <option value="HR">HR Administrator</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#102820] mb-1.5">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E6EBE5] focus:border-[#173D32] focus:ring-1 focus:ring-[#173D32] text-sm text-[#102820] outline-none bg-white transition-all cursor-pointer"
              >
                <option value="Engineering">Engineering</option>
                <option value="Product & Design">Product & Design</option>
                <option value="People Operations">People Operations</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance & Legal">Finance & Legal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#102820] mb-1.5">
              Password (min. 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#7E8980] absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E6EBE5] focus:border-[#173D32] focus:ring-1 focus:ring-[#173D32] text-sm text-[#102820] outline-none transition-all placeholder:text-[#7E8980]/60"
                required
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 py-3 rounded-xl bg-[#173D32] text-[#EAE9DF] font-semibold text-sm hover:bg-[#102820] shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-75"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[#C7F36B] border-t-transparent rounded-full animate-spin" />
                <span>Registering Account...</span>
              </span>
            ) : (
              <>
                <span>Complete Sign Up</span>
                <ArrowRight className="w-4 h-4 text-[#C7F36B]" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#E6EBE5] text-center">
          <p className="text-xs text-[#7E8980]">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-[#173D32] hover:underline">
              Sign In to your workspace
            </Link>
          </p>
        </div>
      </div>

      {/* Footer Notice */}
      <div className="text-center text-xs text-[#7E8980] mt-8">
        StaffSync HRMS • Designed &amp; Created by Parikshit Sharma
      </div>
    </div>
  );
}
