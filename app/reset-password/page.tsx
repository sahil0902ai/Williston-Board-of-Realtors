'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check if user has a valid active session (Supabase sets session automatically from recovery link)
  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // If no recovery session, redirect them to forgot-password page
        setSubmitError('Password reset link is invalid or has expired. Please request a new one.');
      }
    }
    checkSession();
  }, []);

  const getPasswordStrength = (pass: string) => {
    if (!pass) return '';
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    switch (score) {
      case 0:
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Strong';
      case 4:
        return 'Very Strong';
      default:
        return 'Weak';
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Weak': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'Fair': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'Strong': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Very Strong': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-500 bg-white/5 border-white/5';
    }
  };

  const validatePassword = (val: string) => {
    if (!val) {
      return 'Password is required';
    }
    if (val.length < 8) {
      return 'Password must be at least 8 characters';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setPasswordError('');
    setConfirmPasswordError('');

    const pErr = validatePassword(password);
    let cpErr = '';
    if (password !== confirmPassword) {
      cpErr = 'Passwords do not match';
    }

    setPasswordError(pErr);
    setConfirmPasswordError(cpErr);

    if (pErr || cpErr) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setSubmitError(error.message);
      } else {
        setIsSuccess(true);
        // Clear Supabase session on success
        await supabase.auth.signOut();
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to update password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="min-h-screen bg-[#04091A] text-white flex items-center justify-center p-6 relative">
      
      {/* Back to Login (Top Left) */}
      <Link 
        href="/login" 
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-text hover:text-gold transition-colors bg-navy-mid/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/5"
      >
        <ArrowLeft size={14} /> Back to Login
      </Link>

      <div className="bg-[#0e162f]/45 backdrop-blur-md border border-white/5 p-8 md:p-10 rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-500">
        
        {/* Logo */}
        <div className="flex flex-col mb-8 items-center text-center">
          <Link href="/" className="flex flex-col items-center">
            <span className="font-serif text-2xl font-bold tracking-widest text-gold">WILLISTON</span>
            <span className="text-[8px] uppercase tracking-[0.25em] text-gray-text mt-1">Board of Realtors & Investments</span>
          </Link>
        </div>

        {!isSuccess ? (
          <>
            <div className="mb-6">
              <h1 className="text-xl font-serif font-bold text-white mb-2">Create New Password</h1>
              <p className="text-gray-text text-sm">Please choose a secure password for your investor profile.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {submitError && (
                <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold">
                  ⚠️ {submitError}
                </div>
              )}

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-text uppercase tracking-wider block">New Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Lock size={16} />
                  </span>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    className={`w-full pl-10 pr-10 py-3 bg-[#04091A] rounded-xl border text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold transition-all ${
                      passwordError ? 'border-red-500' : 'border-white/5'
                    }`}
                    placeholder="At least 8 characters"
                    suppressHydrationWarning
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
                    suppressHydrationWarning
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {password && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-gray-text">Strength:</span>
                    <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${getStrengthColor(strength)}`}>
                      {strength}
                    </span>
                  </div>
                )}
                {passwordError && <p className="text-xs text-red-500 mt-1 font-medium">⚠️ {passwordError}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-text uppercase tracking-wider block">Confirm Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Lock size={16} />
                  </span>
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (confirmPasswordError) setConfirmPasswordError('');
                    }}
                    className={`w-full pl-10 pr-10 py-3 bg-[#04091A] rounded-xl border text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold transition-all ${
                      confirmPasswordError ? 'border-red-500' : 'border-white/5'
                    }`}
                    placeholder="Confirm password"
                    suppressHydrationWarning
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
                    suppressHydrationWarning
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmPasswordError && <p className="text-xs text-red-500 mt-1 font-medium">⚠️ {confirmPasswordError}</p>}
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gold hover:bg-gold-light text-navy font-bold rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-75"
                suppressHydrationWarning
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4 space-y-5 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 mx-auto">
              <CheckCircle2 size={32} />
            </div>
            
            <div>
              <h2 className="text-xl font-serif font-bold text-white mb-2">Password Updated!</h2>
              <p className="text-gray-text text-sm leading-relaxed font-light">
                Your password has been changed successfully. You can now sign in using your new credentials.
              </p>
            </div>

            <div className="pt-2">
              <Link 
                href="/login" 
                className="w-full inline-block text-center py-3.5 bg-gold hover:bg-gold-light text-navy font-bold text-sm rounded-xl transition shadow-lg"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
