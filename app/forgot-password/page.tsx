'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (val: string) => {
    if (!val) {
      return 'Email address is required';
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(val)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    setEmailError(err);

    if (err) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

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
              <h1 className="text-xl font-serif font-bold text-white mb-2">Reset Your Password</h1>
              <p className="text-gray-text text-sm">Enter your registered email and we&rsquo;ll send you a link to reset your password.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-text uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Mail size={16} />
                  </span>
                  <input 
                    type="text" 
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    className={`w-full pl-10 pr-4 py-3 bg-[#04091A] rounded-xl border text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold transition-all ${
                      emailError ? 'border-red-500' : 'border-white/5'
                    }`}
                    placeholder="name@example.com"
                  />
                </div>
                {emailError && <p className="text-xs text-red-500 mt-1 font-medium">⚠️ {emailError}</p>}
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gold hover:bg-gold-light text-navy font-bold rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-75"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending Link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 mx-auto">
              <CheckCircle2 size={32} />
            </div>
            
            <div>
              <h2 className="text-xl font-serif font-bold text-white mb-2">Reset link sent!</h2>
              <p className="text-gray-text text-sm leading-relaxed">
                Check your email. We&rsquo;ve sent password reset instructions to <span className="text-white font-medium">{email}</span>.
              </p>
            </div>

            <div className="pt-2">
              <Link 
                href="/login" 
                className="inline-block px-6 py-2.5 bg-gold hover:bg-gold-light text-navy text-xs font-bold uppercase tracking-widest rounded-xl transition"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
