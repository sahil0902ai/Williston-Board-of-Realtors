'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { loginUser } from '@/lib/auth';

export default function Login() {
  const router = useRouter();
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // 2FA state
  const [totpToken, setTotpToken] = useState('');
  const [twoFaRequired, setTwoFaRequired] = useState(false);
  
  // Validation & Loading states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    setLoginError('');
    
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    
    setEmailError(eErr);
    setPasswordError(pErr);
    
    if (eErr || pErr) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      const data = await loginUser({
        email,
        password,
        totpToken: twoFaRequired ? totpToken : undefined,
      });

      if (data.two_fa_required) {
        setTwoFaRequired(true);
        setLoginError('');
        setIsSubmitting(false);
        return;
      }

      // Login success
      setIsSubmitting(false);
      router.push('/dashboard');

    } catch (err: any) {
      console.error('Login submit error:', err);
      setLoginError(err.message || 'Invalid credentials or login failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#04091A] text-white flex flex-col lg:flex-row relative">
      
      {/* Back to Home Link (Top Left) */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-text hover:text-gold transition-colors bg-navy-mid/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/5"
      >
        <ArrowLeft size={14} /> Back to Home
      </Link>

      {/* Left Branding Panel (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#04091A] relative flex-col justify-between p-16 overflow-hidden border-r border-white/5">
        {/* Diagonal Gold Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] bg-repeat pointer-events-none"
          style={{ 
            backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"60\" height=\"60\" viewBox=\"0 0 60 60\"><path d=\"M0 60 L60 0 M30 60 L60 30 M0 30 L30 0\" fill=\"none\" stroke=\"%23C9A84C\" stroke-width=\"1.5\"/></svg>')" 
          }}
        ></div>
        
        {/* Logo Link back to home */}
        <Link href="/" className="relative z-10 flex flex-col w-fit">
          <span className="font-serif text-3xl font-bold tracking-widest text-gold text-left">WILLISTON</span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-gray-text">Board of Realtors & Investments</span>
        </Link>

        {/* Center Content */}
        <div className="my-auto relative z-10 max-w-md">
          {/* Gold W Monogram Overlay */}
          <div className="w-20 h-20 rounded-full bg-gold/5 flex items-center justify-center border border-gold/15 mb-8">
            <svg viewBox="0 0 100 100" className="w-10 h-10 text-gold" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 25 L38 75 L50 45 L62 75 L80 25" />
            </svg>
          </div>
          
          <h2 className="text-4xl font-serif font-bold text-white mb-6 leading-tight">
            &ldquo;Your wealth journey starts with one decision.&rdquo;
          </h2>
          <div className="w-12 h-0.5 bg-gold mb-6"></div>
          <p className="text-gray-text text-sm tracking-wide leading-relaxed">
            Secure, verified real estate investments backed by prime assets across major development zones.
          </p>
        </div>

        {/* Bottom Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-6 pt-8 border-t border-white/5">
          <div>
            <div className="text-xl font-bold font-sans text-gold">4,800+</div>
            <div className="text-[10px] text-gray-text uppercase tracking-widest mt-1">Investors</div>
          </div>
          <div>
            <div className="text-xl font-bold font-sans text-gold">$2.4M+</div>
            <div className="text-[10px] text-gray-text uppercase tracking-widest mt-1">Paid</div>
          </div>
          <div>
            <div className="text-xl font-bold font-sans text-gold">8 Years</div>
            <div className="text-[10px] text-gray-text uppercase tracking-widest mt-1">Strong</div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 pt-24 lg:pt-12 bg-[#04091A]">
        <div className="bg-[#0e162f]/45 backdrop-blur-md border border-white/5 p-8 md:p-10 rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-500">
          
          {/* Logo on mobile view only */}
          <div className="flex flex-col mb-8 lg:hidden items-center text-center">
            <Link href="/" className="flex flex-col items-center">
              <span className="font-serif text-2xl font-bold tracking-widest text-gold">WILLISTON</span>
              <span className="text-[8px] uppercase tracking-[0.25em] text-gray-text mt-1">Board of Realtors & Investments</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-serif font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-text text-sm">Sign in to your investor dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {loginError && (
              <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold">
                ⚠️ {loginError}
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-text uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Mail size={16} />
                </span>
                <input 
                  type="text" 
                  value={email}
                  disabled={twoFaRequired}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  className={`w-full pl-10 pr-4 py-3 bg-[#04091A] rounded-xl border text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold transition-all disabled:opacity-50 ${
                    emailError ? 'border-red-500' : 'border-white/5'
                  }`}
                  placeholder="name@example.com"
                />
              </div>
              {emailError && <p className="text-xs text-red-500 mt-1 font-medium">⚠️ {emailError}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-text uppercase tracking-wider block">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Lock size={16} />
                </span>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  disabled={twoFaRequired}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  className={`w-full pl-10 pr-10 py-3 bg-[#04091A] rounded-xl border text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold transition-all disabled:opacity-50 ${
                    passwordError ? 'border-red-500' : 'border-white/5'
                  }`}
                  placeholder="Enter your password"
                />
                <button 
                  type="button"
                  disabled={twoFaRequired}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordError && <p className="text-xs text-red-500 mt-1 font-medium">⚠️ {passwordError}</p>}
            </div>

            {/* 2FA Token Prompt */}
            {twoFaRequired && (
              <div className="space-y-1.5 animate-in fade-in duration-300">
                <label className="text-xs font-semibold text-gold uppercase tracking-wider block flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-gold" />
                  Google Authenticator 2FA Code
                </label>
                <input 
                  type="text" 
                  maxLength={6}
                  value={totpToken}
                  onChange={(e) => setTotpToken(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 bg-[#04091A] rounded-xl border border-gold/40 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold transition-all"
                  placeholder="Enter 6-digit 2FA code"
                  required
                />
                <p className="text-[10px] text-gray-text">A 2FA authentication token is required to secure your session.</p>
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-gray-text hover:text-white transition-colors">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  disabled={twoFaRequired}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-gold bg-[#04091A] border-white/10 focus:ring-0 focus:ring-offset-0 cursor-pointer disabled:opacity-50"
                />
                <span>Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-gold hover:text-gold-light transition font-semibold">
                Forgot Password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gold hover:bg-gold-light text-navy font-bold rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                twoFaRequired ? 'Verify & Access' : 'Sign In'
              )}
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-x-0 h-px bg-white/5"></div>
            <span className="relative z-10 px-4 bg-[#0e162f] text-xs text-gray-500 uppercase tracking-widest">
              or continue with
            </span>
          </div>

          {/* Google Button */}
          <button className="w-full py-3 bg-[#04091A] hover:bg-navy-light/40 border border-white/10 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2.5 transition-all">
             <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" strokeWidth="0.5" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
             </svg>
             Google
          </button>

          {/* Bottom Signup Prompt */}
          <div className="mt-8 text-center text-sm">
            <span className="text-gray-text">Don&rsquo;t have an account? </span>
            <Link href="/register" className="text-gold hover:text-gold-light transition font-semibold">
              Create one &rarr;
            </Link>
          </div>

        </div>
      </div>
      
    </div>
  );
}
