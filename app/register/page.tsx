'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, CheckCircle2, ChevronDown, Check, User, Mail, Phone, Calendar, Globe, Eye, EyeOff, Lock } from 'lucide-react';
import { registerUser } from '@/lib/auth';

export default function Register() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // STEP 1 FIELDS
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState('');
  const [country, setCountry] = useState('United States');

  // STEP 2 FIELDS
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [referralCode, setReferralCode] = useState('');

  // STEP 3 FIELDS
  const [verificationType, setVerificationType] = useState<'bvn' | 'nin' | 'passport'>('bvn');
  const [bvnValue, setBvnValue] = useState('');
  const [ninValue, setNinValue] = useState('');
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // ERRORS
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // PIN refs for focus switching
  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  const confirmPinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  // PIN Focus Handlers
  const handlePinChange = (val: string, index: number, isConfirm: boolean) => {
    // Only allow numbers
    if (val && !/^\d+$/.test(val)) return;

    const targetPin = isConfirm ? confirmPin : pin;
    const targetSet = isConfirm ? setConfirmPin : setPin;
    const targetRefs = isConfirm ? confirmPinRefs : pinRefs;

    const newPin = [...targetPin];
    newPin[index] = val.slice(-1); // Take last digit
    targetSet(newPin);

    // Focus next box if digit entered
    if (val && index < 3) {
      targetRefs[index + 1].current?.focus();
    }
  };

  const handlePinKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number, isConfirm: boolean) => {
    const targetPin = isConfirm ? confirmPin : pin;
    const targetRefs = isConfirm ? confirmPinRefs : pinRefs;

    if (e.key === 'Backspace' && !targetPin[index] && index > 0) {
      targetRefs[index - 1].current?.focus();
    }
  };

  // Password Strength Check
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

  // Validate current step
  const handleNext = () => {
    const stepErrors: {[key: string]: string} = {};

    if (step === 1) {
      if (!fullName.trim()) stepErrors.fullName = 'Full Name is required';
      if (!email.trim()) {
        stepErrors.email = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        stepErrors.email = 'Please enter a valid email address';
      }
      if (!phoneNumber.trim()) {
        stepErrors.phoneNumber = 'Phone number is required';
      } else if (!/^\d{7,15}$/.test(phoneNumber)) {
        stepErrors.phoneNumber = 'Please enter a valid phone number (digits only)';
      }
      if (!dob) stepErrors.dob = 'Date of birth is required';
      if (!country) stepErrors.country = 'Country is required';
    }

    if (step === 2) {
      if (!password) {
        stepErrors.password = 'Password is required';
      } else if (password.length < 8) {
        stepErrors.password = 'Password must be at least 8 characters';
      }
      if (confirmPassword !== password) {
        stepErrors.confirmPassword = 'Passwords do not match';
      }
      if (pin.some(d => !d)) {
        stepErrors.pin = '4-digit Transaction PIN is required';
      }
      if (confirmPin.some(d => !d)) {
        stepErrors.confirmPin = 'Confirm PIN is required';
      } else if (confirmPin.join('') !== pin.join('')) {
        stepErrors.confirmPin = 'Transaction PINs do not match';
      }
    }

    setErrors(stepErrors);

    if (Object.keys(stepErrors).length === 0) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const stepErrors: {[key: string]: string} = {};

    if (verificationType === 'bvn') {
      if (!bvnValue) {
        stepErrors.verification = 'BVN is required';
      } else if (!/^\d{11}$/.test(bvnValue)) {
        stepErrors.verification = 'BVN must be exactly 11 digits';
      }
    } else if (verificationType === 'nin') {
      if (!ninValue) {
        stepErrors.verification = 'NIN is required';
      } else if (!/^\d{11}$/.test(ninValue)) {
        stepErrors.verification = 'NIN must be exactly 11 digits';
      }
    } else if (verificationType === 'passport') {
      if (!passportFile) {
        stepErrors.verification = 'International Passport upload is required';
      }
    }

    if (!termsAccepted) {
      stepErrors.terms = 'You must accept the terms & policies to register';
    }

    setErrors(stepErrors);

    if (Object.keys(stepErrors).length === 0) {
      setIsSubmitting(true);
      
      const phone = `${phonePrefix} ${phoneNumber}`;
      
      try {
        await registerUser({
          fullName,
          email,
          password,
          phone,
          country,
          referralCode,
        });

        setIsSubmitting(false);
        setIsSuccess(true);

      } catch (err: any) {
        console.error('Registration submit error:', err);
        setErrors({ submit: err.message || 'Registration failed' });
        setIsSubmitting(false);
      }
    }
  };

  const strength = getPasswordStrength(password);

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
        
        {/* Logo */}
        <Link href="/" className="relative z-10 flex flex-col w-fit">
          <span className="font-serif text-3xl font-bold tracking-widest text-gold text-left">WILLISTON</span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-gray-text">Board of Realtors & Investments</span>
        </Link>

        {/* Center Content */}
        <div className="my-auto relative z-10 max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-white mb-4 leading-tight">
              &ldquo;Join 4,800+ investors building generational wealth&rdquo;
            </h2>
            <div className="w-12 h-0.5 bg-gold"></div>
          </div>

          {/* Investment Plan Returns list */}
          <div className="space-y-4">
             {[
                { name: 'Foundation', roi: '18% Returns', desc: 'Secure entry-level plan' },
                { name: 'Prosperity', roi: '24% Returns', desc: 'Popular growth allocation' },
                { name: 'Legacy', roi: '30% Returns', desc: 'High-yield wealth builder' },
                { name: 'Dynasty', roi: '35%+ Returns', desc: 'Bespoke co-developer opportunity' }
             ].map(p => (
                <div key={p.name} className="flex justify-between items-center p-4 bg-navy-mid border border-white/5 rounded-xl hover:border-gold/25 transition">
                   <div>
                      <div className="text-sm font-semibold text-white">{p.name}</div>
                      <div className="text-xs text-gray-text mt-0.5">{p.desc}</div>
                   </div>
                   <div className="text-xs font-bold text-gold bg-gold/5 border border-gold/15 px-3 py-1.5 rounded-lg">
                      {p.roi}
                   </div>
                </div>
             ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-[10px] text-gray-text tracking-wide uppercase">
          SECURED BY PRIME REAL ESTATE COLLATERAL
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 pt-24 lg:pt-12 bg-[#04091A]">
        <div className="bg-[#0e162f]/45 backdrop-blur-md border border-white/5 p-8 md:p-10 rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-500">
          
          {/* Logo on mobile */}
          <div className="flex flex-col mb-6 lg:hidden items-center text-center">
            <Link href="/" className="flex flex-col items-center">
              <span className="font-serif text-2xl font-bold tracking-widest text-gold">WILLISTON</span>
              <span className="text-[8px] uppercase tracking-[0.25em] text-gray-text mt-1">Board of Realtors & Investments</span>
            </Link>
          </div>

          {!isSuccess ? (
            <>
              {/* Progress Indicator */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-xs uppercase tracking-wider font-bold text-gold">Step {step} of 3</span>
                  <span className="text-xs text-gray-text">{step === 1 ? 'Personal Info' : step === 2 ? 'Security Setup' : 'Identity Verification'}</span>
                </div>
                <div className="w-full bg-navy h-1.5 rounded-full overflow-hidden border border-white/5">
                  <div className="bg-gold h-full transition-all duration-300" style={{ width: step === 1 ? '33.33%' : step === 2 ? '66.66%' : '100%' }}></div>
                </div>
              </div>

              {/* STEP 1: PERSONAL INFO */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="mb-2">
                     <h1 className="text-xl font-serif font-bold text-white">Create Your Account</h1>
                     <p className="text-gray-text text-xs mt-0.5">Let&rsquo;s start with your basic information.</p>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-text uppercase tracking-wider block">Full Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                        <User size={14} />
                      </span>
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 bg-[#04091A] rounded-xl border text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold transition-all ${
                          errors.fullName ? 'border-red-500' : 'border-white/5'
                        }`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.fullName && <p className="text-[10px] text-red-500 mt-1">⚠️ {errors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-text uppercase tracking-wider block">Email Address</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                        <Mail size={14} />
                      </span>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 bg-[#04091A] rounded-xl border text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold transition-all ${
                          errors.email ? 'border-red-500' : 'border-white/5'
                        }`}
                        placeholder="john@example.com"
                      />
                    </div>
                    {errors.email && <p className="text-[10px] text-red-500 mt-1">⚠️ {errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-text uppercase tracking-wider block">Phone Number</label>
                    <div className="flex gap-2">
                      <div className="relative shrink-0">
                        <select 
                          value={phonePrefix}
                          onChange={(e) => setPhonePrefix(e.target.value)}
                          className="pl-3.5 pr-8 py-2.5 bg-[#04091A] rounded-xl border border-white/5 text-sm text-white focus:outline-none focus:border-gold appearance-none"
                        >
                          <option value="+234">🇳🇬 +234</option>
                          <option value="+1">🇺🇸 +1</option>
                          <option value="+44">🇬🇧 +44</option>
                          <option value="+27">🇿🇦 +27</option>
                          <option value="+254">🇰🇪 +254</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                      <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                          <Phone size={14} />
                        </span>
                        <input 
                          type="tel" 
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className={`w-full pl-10 pr-4 py-2.5 bg-[#04091A] rounded-xl border text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold transition-all ${
                            errors.phoneNumber ? 'border-red-500' : 'border-white/5'
                          }`}
                          placeholder="8012345678"
                        />
                      </div>
                    </div>
                    {errors.phoneNumber && <p className="text-[10px] text-red-500 mt-1">⚠️ {errors.phoneNumber}</p>}
                  </div>

                  {/* DOB */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-text uppercase tracking-wider block">Date of Birth</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                        <Calendar size={14} />
                      </span>
                      <input 
                        type="date" 
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 bg-[#04091A] rounded-xl border text-sm text-white focus:outline-none focus:border-gold transition-all ${
                          errors.dob ? 'border-red-500' : 'border-white/5'
                        }`}
                      />
                    </div>
                    {errors.dob && <p className="text-[10px] text-red-500 mt-1">⚠️ {errors.dob}</p>}
                  </div>

                  {/* Country */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-text uppercase tracking-wider block">Country of Residence</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                        <Globe size={14} />
                      </span>
                      <select 
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-[#04091A] rounded-xl border border-white/5 text-sm text-white focus:outline-none focus:border-gold appearance-none"
                      >
                        <option value="Nigeria">Nigeria</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="South Africa">South Africa</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Canada">Canada</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Action */}
                  <button 
                    onClick={handleNext}
                    className="w-full mt-4 py-3 bg-gold hover:bg-gold-light text-navy font-bold rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                  >
                    Continue
                  </button>
                </div>
              )}

              {/* STEP 2: SECURITY SETUP */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="mb-2">
                     <h1 className="text-xl font-serif font-bold text-white">Security Setup</h1>
                     <p className="text-gray-text text-xs mt-0.5">Secure your credentials and asset operations.</p>
                  </div>

                  {/* Create Password */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-text uppercase tracking-wider block">Create Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                        <Lock size={14} />
                      </span>
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full pl-10 pr-10 py-2.5 bg-[#04091A] rounded-xl border text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold transition-all ${
                          errors.password ? 'border-red-500' : 'border-white/5'
                        }`}
                        placeholder="At least 8 characters"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {/* Password Strength Meter */}
                    {password && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-gray-text">Strength:</span>
                        <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${getStrengthColor(strength)}`}>
                          {strength}
                        </span>
                      </div>
                    )}
                    {errors.password && <p className="text-[10px] text-red-500 mt-1">⚠️ {errors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-text uppercase tracking-wider block">Confirm Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                        <Lock size={14} />
                      </span>
                      <input 
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full pl-10 pr-10 py-2.5 bg-[#04091A] rounded-xl border text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold transition-all ${
                          errors.confirmPassword ? 'border-red-500' : 'border-white/5'
                        }`}
                        placeholder="Re-enter password"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-[10px] text-red-500 mt-1">⚠️ {errors.confirmPassword}</p>}
                  </div>

                  {/* 4-digit Transaction PIN */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-text uppercase tracking-wider block">4-Digit Transaction PIN</label>
                    <div className="flex justify-between gap-3 max-w-[200px]">
                      {pin.map((digit, idx) => (
                        <input
                          key={idx}
                          type="text"
                          maxLength={1}
                          value={digit}
                          ref={pinRefs[idx]}
                          onChange={(e) => handlePinChange(e.target.value, idx, false)}
                          onKeyDown={(e) => handlePinKeyDown(e, idx, false)}
                          className="w-10 h-10 bg-[#04091A] rounded-xl border border-white/5 focus:border-gold focus:outline-none text-center text-lg font-bold text-white"
                        />
                      ))}
                    </div>
                    {errors.pin && <p className="text-[10px] text-red-500 mt-1">⚠️ {errors.pin}</p>}
                  </div>

                  {/* Confirm PIN */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-text uppercase tracking-wider block">Confirm Transaction PIN</label>
                    <div className="flex justify-between gap-3 max-w-[200px]">
                      {confirmPin.map((digit, idx) => (
                        <input
                          key={idx}
                          type="text"
                          maxLength={1}
                          value={digit}
                          ref={confirmPinRefs[idx]}
                          onChange={(e) => handlePinChange(e.target.value, idx, true)}
                          onKeyDown={(e) => handlePinKeyDown(e, idx, true)}
                          className="w-10 h-10 bg-[#04091A] rounded-xl border border-white/5 focus:border-gold focus:outline-none text-center text-lg font-bold text-white"
                        />
                      ))}
                    </div>
                    {errors.confirmPin && <p className="text-[10px] text-red-500 mt-1">⚠️ {errors.confirmPin}</p>}
                  </div>

                  {/* Referral Code (optional) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-text uppercase tracking-wider block">Referral Code (Optional)</label>
                    <input 
                      type="text" 
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#04091A] rounded-xl border border-white/5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold transition-all"
                      placeholder="Have a referral code? Enter it here"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={handleBack}
                      className="flex-1 py-3 bg-[#04091A] hover:bg-navy-light/40 border border-white/10 rounded-xl text-sm font-semibold text-white transition-all duration-300"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handleNext}
                      className="flex-1 py-3 bg-gold hover:bg-gold-light text-navy font-bold rounded-xl text-sm transition-all duration-300 shadow-lg"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: VERIFICATION */}
              {step === 3 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="mb-2">
                     <h1 className="text-xl font-serif font-bold text-white">Verify Your Identity</h1>
                     <p className="text-gray-text text-xs mt-0.5">Please provide details to complete registration.</p>
                  </div>

                  {errors.submit && (
                    <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold">
                      ⚠️ {errors.submit}
                    </div>
                  )}

                  {/* Verification Type Toggle */}
                  <div className="grid grid-cols-3 gap-2 bg-[#04091A] p-1.5 rounded-xl border border-white/5">
                    {(['bvn', 'nin', 'passport'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setVerificationType(type);
                          setErrors({});
                        }}
                        className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition ${
                          verificationType === type ? 'bg-gold text-navy' : 'text-gray-text hover:text-white'
                        }`}
                      >
                        {type === 'bvn' ? 'BVN' : type === 'nin' ? 'NIN' : 'Passport'}
                      </button>
                    ))}
                  </div>

                  {/* Verification inputs based on type */}
                  {verificationType === 'bvn' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-text uppercase tracking-wider block">Bank Verification Number (BVN)</label>
                      <input 
                        type="text" 
                        maxLength={11}
                        value={bvnValue}
                        onChange={(e) => setBvnValue(e.target.value.replace(/\D/g, ''))}
                        className={`w-full px-4 py-2.5 bg-[#04091A] rounded-xl border text-sm text-white focus:outline-none focus:border-gold transition-all ${
                          errors.verification ? 'border-red-500' : 'border-white/5'
                        }`}
                        placeholder="11-digit BVN"
                      />
                    </div>
                  )}

                  {verificationType === 'nin' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-text uppercase tracking-wider block">National Identity Number (NIN)</label>
                      <input 
                        type="text" 
                        maxLength={11}
                        value={ninValue}
                        onChange={(e) => setNinValue(e.target.value.replace(/\D/g, ''))}
                        className={`w-full px-4 py-2.5 bg-[#04091A] rounded-xl border text-sm text-white focus:outline-none focus:border-gold transition-all ${
                          errors.verification ? 'border-red-500' : 'border-white/5'
                        }`}
                        placeholder="11-digit NIN"
                      />
                    </div>
                  )}

                  {verificationType === 'passport' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-text uppercase tracking-wider block">International Passport Page</label>
                      <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                        errors.verification ? 'border-red-500' : 'border-white/10 hover:border-gold/30'
                      }`}>
                        <input 
                          type="file" 
                          id="passport-file-input"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => {
                            if (e.target.files) setPassportFile(e.target.files[0]);
                          }}
                          className="hidden"
                        />
                        <label htmlFor="passport-file-input" className="cursor-pointer block">
                          <span className="text-2xl block mb-1">📤</span>
                          <span className="text-xs text-white font-medium block">
                            {passportFile ? passportFile.name : 'Click to Upload Document'}
                          </span>
                          <span className="text-[10px] text-gray-500 block mt-1">Supports PDF, PNG, JPG (Max 5MB)</span>
                        </label>
                      </div>
                    </div>
                  )}
                  {errors.verification && <p className="text-[10px] text-red-500 font-medium">⚠️ {errors.verification}</p>}

                  {/* Terms & Policies Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs select-none text-gray-text hover:text-white">
                      <input 
                        type="checkbox" 
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-gold bg-[#04091A] border-white/10 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      />
                      <span className="leading-normal">
                        I agree to the <Link href="/terms" target="_blank" className="text-gold font-semibold underline">Terms of Service</Link>, <Link href="/privacy" target="_blank" className="text-gold font-semibold underline">Privacy Policy</Link> and <Link href="/risk" target="_blank" className="text-gold font-semibold underline">Investment Risk Disclosure</Link>
                      </span>
                    </label>
                    {errors.terms && <p className="text-[10px] text-red-500 mt-1">⚠️ {errors.terms}</p>}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button 
                      type="button"
                      onClick={handleBack}
                      className="flex-1 py-3 bg-[#04091A] hover:bg-navy-light/40 border border-white/10 rounded-xl text-sm font-semibold text-white transition-all duration-300"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 bg-gold hover:bg-gold-light text-navy font-bold rounded-xl text-sm transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Bottom Login Prompt */}
              <div className="mt-8 text-center text-sm border-t border-white/5 pt-4">
                <span className="text-gray-text">Already have an account? </span>
                <Link href="/login" className="text-gold hover:text-gold-light transition font-semibold">
                  Sign In &rarr;
                </Link>
              </div>
            </>
          ) : (
            /* SUCCESS STATE */
            <div className="text-center py-4 space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mx-auto">
                <CheckCircle2 size={36} className="animate-pulse" />
              </div>
              
              <div>
                <h2 className="text-2xl font-serif font-bold text-white mb-2">Account Created Successfully!</h2>
                <p className="text-gray-text text-sm leading-relaxed">
                  We&rsquo;ve sent a verification link to your email. Check your inbox and click the link to activate your account.
                </p>
              </div>

              <div className="pt-4">
                <Link 
                  href="/login" 
                  className="w-full inline-block text-center py-3.5 bg-gold hover:bg-gold-light text-navy font-bold text-sm rounded-xl transition shadow-lg"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
      
    </div>
  );
}
