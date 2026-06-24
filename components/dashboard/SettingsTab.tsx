'use client';

import { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Globe, Calendar, DollarSign, ShieldCheck, 
  ShieldAlert, Copy, Check, FileText, Camera, Lock, RefreshCw, 
  Download, ArrowRight, Eye, EyeOff, KeyRound, Clock, Laptop,
  Bell
} from 'lucide-react';

interface SettingsTabProps {
  profile: any;
  fetchProfile: () => Promise<void>;
}

export default function SettingsTab({ profile, fetchProfile }: SettingsTabProps) {
  const [subTab, setSubTab] = useState<'profile' | 'security'>('profile');
  
  // Profile Editor States
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [country, setCountry] = useState(profile?.country || 'United States');
  const [dob, setDob] = useState(profile?.dob || '');
  const [currency, setCurrency] = useState(profile?.preferred_currency || 'USD');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [copied, setCopied] = useState(false);

  // Notification Preferences States
  const [emailDeposit, setEmailDeposit] = useState(true);
  const [emailWithdrawal, setEmailWithdrawal] = useState(true);
  const [emailReturn, setEmailReturn] = useState(true);
  const [emailMaturity, setEmailMaturity] = useState(true);
  const [emailProperties, setEmailProperties] = useState(false);
  
  const [inAppDeposit, setInAppDeposit] = useState(true);
  const [inAppWithdrawal, setInAppWithdrawal] = useState(true);
  const [inAppReturn, setInAppReturn] = useState(true);
  const [inAppMaturity, setInAppMaturity] = useState(true);
  const [inAppProperties, setInAppProperties] = useState(true);
  
  const [notifSaving, setNotifSaving] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState('');
  const [notifError, setNotifError] = useState('');

  // Avatar Upload States
  const [avatarUploading, setAvatarUploading] = useState(false);

  // KYC States
  const [kycStep, setKycStep] = useState(1);
  const [idType, setIdType] = useState('Driver\'s License (US)');
  const [idFrontFile, setIdFrontFile] = useState<File | null>(null);
  const [idFrontPreview, setIdFrontPreview] = useState<string>('');
  const [idBackFile, setIdBackFile] = useState<File | null>(null);
  const [idBackPreview, setIdBackPreview] = useState<string>('');
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string>('');
  const [kycConfirmed, setKycConfirmed] = useState(false);
  const [kycSubmitting, setKycSubmitting] = useState(false);
  const [kycSuccessMsg, setKycSuccessMsg] = useState('');
  const [kycErrorMsg, setKycErrorMsg] = useState('');

  // Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');

  // 2FA States
  const [twoFaLoading, setTwoFaLoading] = useState(false);
  const [twoFaSetupData, setTwoFaSetupData] = useState<{ secret: string; qrCodeUrl: string } | null>(null);
  const [twoFaToken, setTwoFaToken] = useState('');
  const [twoFaBackupCodes, setTwoFaBackupCodes] = useState<string[]>([]);
  const [twoFaError, setTwoFaError] = useState('');
  const [twoFaSuccess, setTwoFaSuccess] = useState('');
  const [disableToken, setDisableToken] = useState('');
  const [showDisableForm, setShowDisableForm] = useState(false);

  // Login History States
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setCountry(profile.country || 'United States');
      setDob(profile.dob || '');
      setCurrency(profile.preferred_currency || 'USD');
      
      const notifs = profile.notification_settings || {};
      const emailSettings = notifs.email || {};
      setEmailDeposit(emailSettings.deposit !== undefined ? emailSettings.deposit : true);
      setEmailWithdrawal(emailSettings.withdrawal !== undefined ? emailSettings.withdrawal : true);
      setEmailReturn(emailSettings.payout !== undefined ? emailSettings.payout : true);
      setEmailMaturity(emailSettings.investment !== undefined ? emailSettings.investment : true);
      setEmailProperties(emailSettings.announcement !== undefined ? emailSettings.announcement : false);

      const inAppSettings = notifs.inApp || {};
      setInAppDeposit(inAppSettings.deposit !== undefined ? inAppSettings.deposit : true);
      setInAppWithdrawal(inAppSettings.withdrawal !== undefined ? inAppSettings.withdrawal : true);
      setInAppReturn(inAppSettings.payout !== undefined ? inAppSettings.payout : true);
      setInAppMaturity(inAppSettings.investment !== undefined ? inAppSettings.investment : true);
      setInAppProperties(inAppSettings.announcement !== undefined ? inAppSettings.announcement : true);
    }
  }, [profile]);

  useEffect(() => {
    if (subTab === 'security') {
      fetchLoginHistory();
    }
  }, [subTab]);

  const fetchLoginHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/user/login-history');
      if (res.ok) {
        const data = await res.json();
        setLoginHistory(data);
      }
    } catch (err) {
      console.error('Failed to fetch login history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          phone,
          country,
          dob,
          preferred_currency: currency,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setProfileSuccess('Profile changes saved successfully.');
      await fetchProfile();
    } catch (err: any) {
      setProfileError(err.message || 'Error saving changes.');
    } finally {
      setProfileSaving(false);
    }
  };

  // Notification Preferences Save
  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotifSaving(true);
    setNotifSuccess('');
    setNotifError('');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notification_settings: {
            email: {
              deposit: emailDeposit,
              withdrawal: emailWithdrawal,
              payout: emailReturn,
              investment: emailMaturity,
              announcement: emailProperties,
            },
            inApp: {
              deposit: inAppDeposit,
              withdrawal: inAppWithdrawal,
              payout: inAppReturn,
              investment: inAppMaturity,
              announcement: inAppProperties,
            }
          }
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update preferences');
      }

      setNotifSuccess('Notification preferences saved successfully.');
      await fetchProfile();
    } catch (err: any) {
      setNotifError(err.message || 'Error saving preferences.');
    } finally {
      setNotifSaving(false);
    }
  };

  // Avatar Upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Avatar upload failed');
      }

      setProfileSuccess('Avatar updated successfully.');
      await fetchProfile();
    } catch (err: any) {
      setProfileError(err.message || 'Error uploading avatar.');
    } finally {
      setAvatarUploading(false);
    }
  };

  // KYC Upload Box Event Handlers
  const handleIdFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdFrontFile(file);
      setIdFrontPreview(URL.createObjectURL(file));
    }
  };

  const handleIdBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdBackFile(file);
      setIdBackPreview(URL.createObjectURL(file));
    }
  };

  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelfieFile(file);
      setSelfiePreview(URL.createObjectURL(file));
    }
  };

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idFrontFile || !selfieFile) {
      setKycErrorMsg('Both identity document and selfie holding ID are required.');
      return;
    }
    if (!kycConfirmed) {
      setKycErrorMsg('Please confirm document authenticity.');
      return;
    }

    setKycSubmitting(true);
    setKycSuccessMsg('');
    setKycErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('idDocument', idFrontFile);
      formData.append('selfie', selfieFile);
      
      // Save ID Type to user metadata
      await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kyc_id_type: idType }),
      });

      const res = await fetch('/api/user/kyc', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit KYC documents');
      }

      setKycSuccessMsg('Verification documents submitted successfully.');
      await fetchProfile();
    } catch (err: any) {
      setKycErrorMsg(err.message || 'Error submitting KYC.');
    } finally {
      setKycSubmitting(false);
    }
  };

  // Password Strength Check
  const getPasswordStrength = () => {
    if (!newPassword) return { score: 0, label: 'None', color: 'bg-white/10' };
    if (newPassword.length < 8) return { score: 1, label: 'Too Short', color: 'bg-red-500' };
    
    let score = 2;
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
    const hasMixed = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);

    if (hasNumbers && hasMixed) score = 3;
    if (hasNumbers && hasMixed && hasSpecial) score = 4;

    switch (score) {
      case 2: return { score: 2, label: 'Weak', color: 'bg-orange-500' };
      case 3: return { score: 3, label: 'Strong', color: 'bg-yellow-500' };
      case 4: default: return { score: 4, label: 'Very Strong', color: 'bg-green-500' };
    }
  };

  // Password Save
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdSuccess('');
    setPwdError('');

    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setPwdError('Password must be at least 8 characters long.');
      return;
    }

    setPwdSaving(true);
    try {
      // Re-authenticate user to confirm current password
      const reAuthRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profile.email,
          password: currentPassword,
        }),
      });

      if (!reAuthRes.ok) {
        throw new Error('Current password is incorrect.');
      }

      // Update password via Client Supabase flow
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setPwdSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPwdError(err.message || 'Error changing password.');
    } finally {
      setPwdSaving(false);
    }
  };

  // 2FA Functions
  const handleSetup2FA = async () => {
    setTwoFaLoading(true);
    setTwoFaError('');
    try {
      const res = await fetch('/api/user/2fa');
      if (!res.ok) throw new Error('Failed to fetch 2FA secret.');
      const data = await res.json();
      if (data.success) {
        setTwoFaSetupData({
          secret: data.secret,
          qrCodeUrl: data.qrCodeUrl,
        });
      }
    } catch (err: any) {
      setTwoFaError(err.message);
    } finally {
      setTwoFaLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFaSetupData || !twoFaToken.trim()) return;

    setTwoFaLoading(true);
    setTwoFaError('');
    setTwoFaSuccess('');

    try {
      const res = await fetch('/api/user/2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: twoFaToken,
          secret: twoFaSetupData.secret,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to verify 2FA token');
      }

      setTwoFaSuccess('Two-Factor Authentication enabled successfully!');
      setTwoFaBackupCodes(data.backupCodes || []);
      setTwoFaSetupData(null);
      setTwoFaToken('');
      await fetchProfile();
    } catch (err: any) {
      setTwoFaError(err.message);
    } finally {
      setTwoFaLoading(false);
    }
  };

  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFaLoading(true);
    setTwoFaError('');
    setTwoFaSuccess('');

    try {
      const res = await fetch('/api/user/2fa', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: disableToken,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to disable 2FA');
      }

      setTwoFaSuccess('Two-Factor Authentication disabled successfully.');
      setDisableToken('');
      setShowDisableForm(false);
      await fetchProfile();
    } catch (err: any) {
      setTwoFaError(err.message);
    } finally {
      setTwoFaLoading(false);
    }
  };

  const downloadBackupCodes = () => {
    if (twoFaBackupCodes.length === 0) return;
    const txtContent = `WILLISTON INVESTMENTS 2FA BACKUP CODES\nDownloaded: ${new Date().toLocaleString()}\nKeep these keys safe. Each key can be used once to access your account.\n\n` + twoFaBackupCodes.join('\n');
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `williston_backup_codes_${profile?.email}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyReferralLink = () => {
    const code = profile?.referral_code || 'WILLISTON';
    const refUrl = `${window.location.origin}/register?ref=${code}`;
    navigator.clipboard.writeText(refUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getInitials = () => {
    if (!profile?.full_name) return 'US';
    return profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const pwdStrength = getPasswordStrength();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border-subtle pb-5 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight">Account Settings</h1>
          <p className="text-gray-text text-xs mt-1">Manage your identity documentation, contact details, and platform security</p>
        </div>
        
        {/* Sub-tabs Selection */}
        <div className="flex bg-[#0A1224] p-1.5 rounded-xl border border-border-subtle shrink-0">
          <button
            onClick={() => setSubTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              subTab === 'profile' ? 'bg-gold text-navy font-bold' : 'text-gray-text hover:text-white'
            }`}
            style={{
              minHeight: '44px',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ pointerEvents: 'none' }} className="flex items-center gap-2">
              <User size={14} /> Profile & KYC
            </span>
          </button>
          <button
            onClick={() => setSubTab('security')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              subTab === 'security' ? 'bg-gold text-navy font-bold' : 'text-gray-text hover:text-white'
            }`}
            style={{
              minHeight: '44px',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ pointerEvents: 'none' }} className="flex items-center gap-2">
              <KeyRound size={14} /> Security & 2FA
            </span>
          </button>
        </div>
      </div>

      {subTab === 'profile' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* PROFILE CARD COLUMN */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#0A1224] border border-border-subtle rounded-2xl p-6 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-gold via-gold-light to-gold"></div>
              
              {/* Initials or Uploaded Avatar */}
              <div className="relative group w-28 h-28 rounded-full border-2 border-border-gold p-1 mb-4">
                <div className="w-full h-full rounded-full bg-[#0E1B35] flex items-center justify-center text-gold font-bold text-3xl font-serif overflow-hidden">
                  {profile?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    getInitials()
                  )}
                </div>
                
                {/* Camera Overlay Hover upload button */}
                <label className="absolute inset-0 bg-navy/80 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-[10px] uppercase font-bold tracking-wider">
                  <Camera size={18} className="text-gold mb-1" />
                  <span>{avatarUploading ? 'Uploading...' : 'Change'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={avatarUploading} />
                </label>
              </div>

              <h3 className="font-serif text-lg font-bold text-white truncate w-full">{profile?.full_name}</h3>
              <p className="text-xs text-gray-text truncate w-full mt-0.5">{profile?.email}</p>
              
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <span className="bg-gold/10 text-gold px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border border-gold/20 flex items-center gap-1.5">
                  <ShieldCheck size={10} /> {profile?.investor_level || 'Starter'} Level
                </span>
                <span className="bg-navy-light border border-border-subtle/50 text-gray-text px-2.5 py-0.5 rounded-full text-[9px] font-medium font-sans">
                  Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'March 2026'}
                </span>
              </div>

              {/* Referral Box */}
              <div className="mt-8 pt-6 border-t border-border-subtle w-full text-left space-y-2.5">
                <span className="text-[10px] uppercase tracking-wider text-gray-text font-bold">Referral Partner Link</span>
                <div className="flex bg-[#04091A] border border-border-subtle rounded-xl p-1 justify-between items-center w-full">
                  <span className="text-xs font-mono text-white truncate px-3 flex-1">{profile?.referral_code || 'WILLISTON'}</span>
                  <button 
                    onClick={copyReferralLink} 
                    className="p-2.5 bg-gold hover:bg-gold-light text-navy rounded-lg transition shrink-0 cursor-pointer flex items-center justify-center"
                    title="Copy Partner URL"
                    style={{
                      minHeight: '44px',
                      minWidth: '44px',
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    <span style={{ pointerEvents: 'none' }} className="flex items-center justify-center">
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </span>
                  </button>
                </div>
                <p className="text-[9px] text-gray-500 font-sans leading-relaxed">Refer investors to earn 5%-10% instant commissions paid directly into your wallet.</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - EDIT PROFILE & KYC */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* EDIT PROFILE CARD */}
            <div className="bg-[#0A1224] border border-border-subtle rounded-2xl p-6 md:p-8 shadow-lg">
              <h2 className="text-md font-serif font-bold text-white uppercase tracking-wider text-gold mb-6 pb-2 border-b border-border-subtle/40 flex items-center gap-2">
                <User size={16} /> Personal Credentials
              </h2>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#04091A] border border-border-subtle rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Email Address</label>
                    <input
                      type="email"
                      readOnly
                      value={profile?.email || ''}
                      className="w-full bg-navy border border-border-subtle/40 rounded-xl px-4 py-3 text-xs text-gray-text/60 cursor-not-allowed outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#04091A] border border-border-subtle rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Country of Residence</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-[#04091A] border border-border-subtle rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold"
                    >
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Date of Birth</label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-[#04091A] border border-border-subtle rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Preferred Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full bg-[#04091A] border border-border-subtle rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold"
                    >
                      <option value="NGN">NGN (₦)</option>
                    </select>
                  </div>
                </div>

                {profileSuccess && (
                  <div className="p-3.5 bg-green-950/30 border border-green-500/20 rounded-xl text-green-400 text-xs text-center font-medium font-sans">
                    {profileSuccess}
                  </div>
                )}
                {profileError && (
                  <div className="p-3.5 bg-red-950/30 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-medium font-sans">
                    {profileError}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="px-6 py-3 bg-gold hover:bg-gold-light text-navy font-bold rounded-xl transition text-xs shadow-lg uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-50 justify-center"
                    style={{
                      minHeight: '44px',
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    <span style={{ pointerEvents: 'none' }} className="flex items-center gap-1.5 justify-center">
                      {profileSaving && <RefreshCw size={14} className="animate-spin" />}
                      Save Profile changes
                    </span>
                  </button>
                </div>
              </form>
            </div>

            {/* KYC VERIFICATION SYSTEM */}
            <div className="bg-[#0A1224] border border-border-subtle rounded-2xl p-6 md:p-8 shadow-lg">
              <h2 className="text-md font-serif font-bold text-white uppercase tracking-wider text-gold mb-4 pb-2 border-b border-border-subtle/40 flex items-center gap-2">
                <ShieldCheck size={16} /> Identity Verification (KYC)
              </h2>

              {/* KYC BANNER STATUS */}
              {profile?.kyc_status === 'pending' && (
                <div className="mb-6 p-4 bg-amber-950/30 border border-amber-500/20 rounded-xl flex items-center gap-3 text-amber-400 text-xs font-sans">
                  <ShieldAlert size={18} className="shrink-0" />
                  <span><strong>Identity not verified:</strong> Verify your credentials below to unlock cashout withdrawals.</span>
                </div>
              )}

              {profile?.kyc_status === 'submitted' && (
                <div className="mb-6 p-4 bg-blue-950/30 border border-blue-500/20 rounded-xl flex items-center gap-3 text-blue-400 text-xs font-sans">
                  <Clock size={18} className="shrink-0" />
                  <span><strong>Documents under review:</strong> Verification typically takes 24-48 business hours. We will notify you once audited.</span>
                </div>
              )}

              {profile?.kyc_status === 'verified' && (
                <div className="mb-6 p-4 bg-green-950/30 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-400 text-xs font-sans">
                  <ShieldCheck size={18} className="shrink-0" />
                  <span><strong>Identity Verified:</strong> Audit checklist complete. Full account features and withdrawals unlocked.</span>
                </div>
              )}

              {profile?.kyc_status === 'rejected' && (
                <div className="mb-6 p-4 bg-red-950/30 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs font-sans">
                  <ShieldAlert size={18} className="shrink-0" />
                  <span><strong>Verification rejected:</strong> Documents did not meet criteria. Please review details and resubmit.</span>
                </div>
              )}

              {/* Submitted State View */}
              {profile?.kyc_status === 'submitted' && (
                <div className="p-6 bg-navy rounded-xl border border-border-subtle/40 space-y-4 text-center">
                  <FileText size={40} className="text-gold mx-auto" />
                  <h4 className="text-sm font-semibold text-white">KYC Documents Submitted</h4>
                  <p className="text-xs text-gray-text max-w-md mx-auto leading-relaxed">
                    We have successfully received your identity documents. Verification reviews are processed within 24-48 business hours.
                  </p>
                  <div className="pt-4 border-t border-border-subtle/50 text-[11px] text-gray-400 flex flex-col sm:flex-row justify-center gap-4">
                    <span>📧 email: <a href="mailto:willistonboardofrealtors@gmail.com" className="text-gold hover:underline">willistonboardofrealtors@gmail.com</a></span>
                    <span>✈️ support: <a href="https://t.me/willistonboardofrealtors" target="_blank" rel="noopener" className="text-[#0088cc] hover:underline">@willistonboardofrealtors</a></span>
                  </div>
                </div>
              )}

              {/* Verified State View */}
              {profile?.kyc_status === 'verified' && (
                <div className="p-6 bg-navy rounded-xl border border-border-subtle/40 text-center space-y-3">
                  <div className="w-12 h-12 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center text-green-400 mx-auto">
                    <ShieldCheck size={24} />
                  </div>
                  <h4 className="text-sm font-semibold text-white">Verification Complete</h4>
                  <p className="text-xs text-gray-text max-w-sm mx-auto leading-relaxed">
                    Thank you. Your identity has been verified. You now have full access to platform properties, investments, and payouts.
                  </p>
                </div>
              )}

              {/* KYC FORM (Show if pending or rejected) */}
              {(profile?.kyc_status === 'pending' || profile?.kyc_status === 'rejected') && (
                <form onSubmit={handleKycSubmit} className="space-y-6">
                  {/* Step Tracker */}
                  <div className="flex justify-between items-center bg-[#04091A] p-3 rounded-xl border border-border-subtle text-[10px] font-semibold uppercase tracking-wider text-gray-text">
                    <span className={kycStep === 1 ? 'text-gold' : ''}>1. ID Type</span>
                    <ArrowRight size={10} />
                    <span className={kycStep === 2 ? 'text-gold' : ''}>2. ID Image</span>
                    <ArrowRight size={10} />
                    <span className={kycStep === 3 ? 'text-gold' : ''}>3. Selfie</span>
                    <ArrowRight size={10} />
                    <span className={kycStep === 4 ? 'text-gold' : ''}>4. Confirm</span>
                  </div>

                  {/* Step 1: Choose ID Type */}
                  {kycStep === 1 && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <h4 className="text-xs uppercase tracking-wider text-gray-text font-bold mb-3">Choose ID Document Type</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {['Driver\'s License (US)', 'US Passport', 'International Passport', 'State ID Card'].map((type) => (
                          <label key={type} className={`p-4 border rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
                            idType === type ? 'border-gold bg-gold/5 text-white' : 'border-border-subtle hover:border-white/20 text-gray-text'
                          }`}>
                            <input type="radio" name="idType" value={type} checked={idType === type} onChange={() => setIdType(type)} className="text-gold focus:ring-0 focus:ring-offset-0 bg-transparent border-border-subtle" />
                            <span className="text-xs font-semibold">{type}</span>
                          </label>
                        ))}
                      </div>
                      <div className="flex justify-end pt-4">
                        <button 
                          type="button" 
                          onClick={() => setKycStep(2)} 
                          className="px-5 py-2.5 bg-gold hover:bg-gold-light text-navy font-bold rounded-lg text-xs transition uppercase tracking-wider cursor-pointer flex items-center justify-center"
                          style={{
                            minHeight: '44px',
                            minWidth: '44px',
                            touchAction: 'manipulation',
                            WebkitTapHighlightColor: 'transparent',
                          }}
                        >
                          <span style={{ pointerEvents: 'none' }}>Continue</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Upload ID Document */}
                  {kycStep === 2 && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <h4 className="text-xs uppercase tracking-wider text-gray-text font-bold mb-3">Upload Identification Images</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Front of ID */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Front of Document (Required)</span>
                          {idFrontPreview ? (
                            <div className="relative border border-border-subtle rounded-xl overflow-hidden h-40 bg-navy">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={idFrontPreview} alt="Front ID Preview" className="w-full h-full object-contain" />
                              <button 
                                onClick={() => { setIdFrontFile(null); setIdFrontPreview(''); }} 
                                className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 p-1.5 rounded text-white text-[10px] font-bold flex items-center justify-center"
                                style={{
                                  minHeight: '44px',
                                  minWidth: '44px',
                                  touchAction: 'manipulation',
                                  WebkitTapHighlightColor: 'transparent',
                                }}
                              >
                                <span style={{ pointerEvents: 'none' }}>Remove</span>
                              </button>
                            </div>
                          ) : (
                            <label className="border border-dashed border-border-subtle/80 hover:border-gold/50 rounded-xl h-40 flex flex-col items-center justify-center bg-[#04091A] cursor-pointer transition text-gray-text hover:text-white">
                              <Camera size={24} className="mb-2 text-gold" />
                              <span className="text-xs">Front Photo File</span>
                              <input type="file" accept="image/*" required className="hidden" onChange={handleIdFrontChange} />
                            </label>
                          )}
                        </div>

                        {/* Back of ID */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Back of Document (Optional)</span>
                          {idBackPreview ? (
                            <div className="relative border border-border-subtle rounded-xl overflow-hidden h-40 bg-navy">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={idBackPreview} alt="Back ID Preview" className="w-full h-full object-contain" />
                              <button 
                                onClick={() => { setIdBackFile(null); setIdBackPreview(''); }} 
                                className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 p-1.5 rounded text-white text-[10px] font-bold flex items-center justify-center"
                                style={{
                                  minHeight: '44px',
                                  minWidth: '44px',
                                  touchAction: 'manipulation',
                                  WebkitTapHighlightColor: 'transparent',
                                }}
                              >
                                <span style={{ pointerEvents: 'none' }}>Remove</span>
                              </button>
                            </div>
                          ) : (
                            <label className="border border-dashed border-border-subtle/80 hover:border-gold/50 rounded-xl h-40 flex flex-col items-center justify-center bg-[#04091A] cursor-pointer transition text-gray-text hover:text-white">
                              <Camera size={24} className="mb-2 text-gold" />
                              <span className="text-xs">Back Photo File</span>
                              <input type="file" accept="image/*" className="hidden" onChange={handleIdBackChange} />
                            </label>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between pt-4 gap-3">
                        <button 
                          type="button" 
                          onClick={() => setKycStep(1)} 
                          className="px-5 py-2.5 bg-navy border border-border-subtle text-xs text-gray-text hover:text-white rounded-lg transition uppercase tracking-wider cursor-pointer flex items-center justify-center"
                          style={{
                            minHeight: '44px',
                            minWidth: '44px',
                            touchAction: 'manipulation',
                            WebkitTapHighlightColor: 'transparent',
                          }}
                        >
                          <span style={{ pointerEvents: 'none' }}>Back</span>
                        </button>
                        <button 
                          type="button" 
                          onClick={() => { if (idFrontFile) setKycStep(3); else setKycErrorMsg('Front of ID document is required.'); }} 
                          className="px-5 py-2.5 bg-gold hover:bg-gold-light text-navy font-bold rounded-lg text-xs transition uppercase tracking-wider cursor-pointer flex items-center justify-center"
                          style={{
                            minHeight: '44px',
                            minWidth: '44px',
                            touchAction: 'manipulation',
                            WebkitTapHighlightColor: 'transparent',
                          }}
                        >
                          <span style={{ pointerEvents: 'none' }}>Continue</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Upload Selfie */}
                  {kycStep === 3 && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <h4 className="text-xs uppercase tracking-wider text-gray-text font-bold mb-3">Selfie Verification holding ID</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div className="space-y-3">
                          <p className="text-xs text-gray-text leading-relaxed font-sans">
                            Hold your verification ID document next to your face and take a clear, well-lit selfie photo.
                          </p>
                          <div className="p-3.5 bg-navy border border-border-subtle rounded-xl text-[10px] text-gray-400 space-y-1.5 font-sans leading-relaxed">
                            <span className="text-gold font-bold block">Selfie Audit Checklist:</span>
                            <span>&bull; Your face and ID details must be fully visible and legible.</span>
                            <span>&bull; Do not wear glasses, hats, or masks.</span>
                          </div>
                        </div>

                        {/* Selfie File Upload Box */}
                        <div className="flex flex-col gap-2">
                          {selfiePreview ? (
                            <div className="relative border border-border-subtle rounded-xl overflow-hidden h-44 bg-navy">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={selfiePreview} alt="Selfie ID Preview" className="w-full h-full object-contain" />
                              <button 
                                onClick={() => { setSelfieFile(null); setSelfiePreview(''); }} 
                                className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 p-1.5 rounded text-white text-[10px] font-bold flex items-center justify-center"
                                style={{
                                  minHeight: '44px',
                                  minWidth: '44px',
                                  touchAction: 'manipulation',
                                  WebkitTapHighlightColor: 'transparent',
                                }}
                              >
                                <span style={{ pointerEvents: 'none' }}>Remove</span>
                              </button>
                            </div>
                          ) : (
                            <label className="border border-dashed border-border-subtle/80 hover:border-gold/50 rounded-xl h-44 flex flex-col items-center justify-center bg-[#04091A] cursor-pointer transition text-gray-text hover:text-white">
                              <Camera size={26} className="mb-2 text-gold" />
                              <span className="text-xs font-semibold">Upload Selfie Photo</span>
                              <input type="file" accept="image/*" required className="hidden" onChange={handleSelfieChange} />
                            </label>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between pt-4 gap-3">
                        <button 
                          type="button" 
                          onClick={() => setKycStep(2)} 
                          className="px-5 py-2.5 bg-navy border border-border-subtle text-xs text-gray-text hover:text-white rounded-lg transition uppercase tracking-wider cursor-pointer flex items-center justify-center"
                          style={{
                            minHeight: '44px',
                            minWidth: '44px',
                            touchAction: 'manipulation',
                            WebkitTapHighlightColor: 'transparent',
                          }}
                        >
                          <span style={{ pointerEvents: 'none' }}>Back</span>
                        </button>
                        <button 
                          type="button" 
                          onClick={() => { if (selfieFile) setKycStep(4); else setKycErrorMsg('Verification selfie holding ID is required.'); }} 
                          className="px-5 py-2.5 bg-gold hover:bg-gold-light text-navy font-bold rounded-lg text-xs transition uppercase tracking-wider cursor-pointer flex items-center justify-center"
                          style={{
                            minHeight: '44px',
                            minWidth: '44px',
                            touchAction: 'manipulation',
                            WebkitTapHighlightColor: 'transparent',
                          }}
                        >
                          <span style={{ pointerEvents: 'none' }}>Continue</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Confirm */}
                  {kycStep === 4 && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <h4 className="text-xs uppercase tracking-wider text-gray-text font-bold mb-3">Review & Submit Documentation</h4>

                      <div className="p-4 bg-navy rounded-xl border border-border-subtle/60 text-xs space-y-3 font-sans leading-relaxed">
                        <span className="font-bold text-white uppercase block tracking-wider">KYC Submission summary:</span>
                        <div className="flex justify-between"><span className="text-gray-text">Document Type:</span><span className="text-white font-medium">{idType}</span></div>
                        <div className="flex justify-between"><span className="text-gray-text">ID Document Front:</span><span className="text-green-400 font-medium">Uploaded</span></div>
                        <div className="flex justify-between"><span className="text-gray-text">Verification Selfie:</span><span className="text-green-400 font-medium">Uploaded</span></div>
                      </div>

                      <label className="flex items-start gap-3 p-3 bg-navy-light/40 border border-border-subtle rounded-xl cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={kycConfirmed} 
                          onChange={(e) => setKycConfirmed(e.target.checked)} 
                          className="mt-0.5 rounded text-gold focus:ring-0 focus:ring-offset-0 bg-transparent border-border-subtle cursor-pointer" 
                        />
                        <span className="text-xs text-gray-text select-none leading-relaxed font-sans">
                          I confirm these documents belong to me, are genuine, and represent my verified identity.
                        </span>
                      </label>

                      {kycSuccessMsg && (
                        <div className="p-3 bg-green-950/30 border border-green-500/20 rounded-xl text-green-400 text-xs text-center font-medium font-sans">
                          {kycSuccessMsg}
                        </div>
                      )}
                      {kycErrorMsg && (
                        <div className="p-3 bg-red-950/30 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-medium font-sans">
                          {kycErrorMsg}
                        </div>
                      )}

                      <div className="flex justify-between pt-4 gap-3">
                        <button 
                          type="button" 
                          onClick={() => setKycStep(3)} 
                          className="px-5 py-2.5 bg-navy border border-border-subtle text-xs text-gray-text hover:text-white rounded-lg transition uppercase tracking-wider cursor-pointer flex items-center justify-center"
                          style={{
                            minHeight: '44px',
                            minWidth: '44px',
                            touchAction: 'manipulation',
                            WebkitTapHighlightColor: 'transparent',
                          }}
                        >
                          <span style={{ pointerEvents: 'none' }}>Back</span>
                        </button>
                        <button 
                          type="submit" 
                          disabled={kycSubmitting}
                          className="px-5 py-2.5 bg-gold hover:bg-gold-light text-navy font-bold rounded-lg text-xs transition uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                          style={{
                            minHeight: '44px',
                            touchAction: 'manipulation',
                            WebkitTapHighlightColor: 'transparent',
                          }}
                        >
                          <span style={{ pointerEvents: 'none' }} className="flex items-center gap-1.5 justify-center">
                            {kycSubmitting && <RefreshCw size={14} className="animate-spin" />}
                            Submit for Verification
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* NOTIFICATION PREFERENCES CARD */}
            <div className="bg-[#0A1224] border border-border-subtle rounded-2xl p-6 md:p-8 shadow-lg">
              <h2 className="text-md font-serif font-bold text-white uppercase tracking-wider text-gold mb-6 pb-2 border-b border-border-subtle/40 flex items-center gap-2">
                <Bell size={16} /> Notification Preferences
              </h2>

              <form onSubmit={handleSaveNotifications} className="space-y-6">
                
                {/* Email Notifications */}
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-wider text-white font-bold pb-1.5 border-b border-border-subtle/20">
                    Email Notifications
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between cursor-pointer group select-none">
                      <span className="text-xs text-gray-text group-hover:text-white transition-colors">Deposit confirmed — Email me</span>
                      <div className="relative inline-flex items-center">
                        <input 
                          type="checkbox" 
                          checked={emailDeposit}
                          onChange={(e) => setEmailDeposit(e.target.checked)}
                          className="sr-only peer" 
                          suppressHydrationWarning
                        />
                        <div className="w-8 h-4.5 bg-[#04091A] rounded-full border border-border-subtle peer peer-checked:bg-gold peer-checked:border-gold transition-colors duration-200"></div>
                        <div className="absolute top-[2.5px] left-[2.5px] w-3 h-3 bg-gray-text rounded-full transition-transform duration-200 peer-checked:translate-x-3.5 peer-checked:bg-navy pointer-events-none"></div>
                      </div>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group select-none">
                      <span className="text-xs text-gray-text group-hover:text-white transition-colors">Withdrawal approved — Email me</span>
                      <div className="relative inline-flex items-center">
                        <input 
                          type="checkbox" 
                          checked={emailWithdrawal}
                          onChange={(e) => setEmailWithdrawal(e.target.checked)}
                          className="sr-only peer" 
                          suppressHydrationWarning
                        />
                        <div className="w-8 h-4.5 bg-[#04091A] rounded-full border border-border-subtle peer peer-checked:bg-gold peer-checked:border-gold transition-colors duration-200"></div>
                        <div className="absolute top-[2.5px] left-[2.5px] w-3 h-3 bg-gray-text rounded-full transition-transform duration-200 peer-checked:translate-x-3.5 peer-checked:bg-navy pointer-events-none"></div>
                      </div>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group select-none">
                      <span className="text-xs text-gray-text group-hover:text-white transition-colors">Monthly return paid — Email me</span>
                      <div className="relative inline-flex items-center">
                        <input 
                          type="checkbox" 
                          checked={emailReturn}
                          onChange={(e) => setEmailReturn(e.target.checked)}
                          className="sr-only peer" 
                          suppressHydrationWarning
                        />
                        <div className="w-8 h-4.5 bg-[#04091A] rounded-full border border-border-subtle peer peer-checked:bg-gold peer-checked:border-gold transition-colors duration-200"></div>
                        <div className="absolute top-[2.5px] left-[2.5px] w-3 h-3 bg-gray-text rounded-full transition-transform duration-200 peer-checked:translate-x-3.5 peer-checked:bg-navy pointer-events-none"></div>
                      </div>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group select-none">
                      <span className="text-xs text-gray-text group-hover:text-white transition-colors">Investment matured — Email me</span>
                      <div className="relative inline-flex items-center">
                        <input 
                          type="checkbox" 
                          checked={emailMaturity}
                          onChange={(e) => setEmailMaturity(e.target.checked)}
                          className="sr-only peer" 
                          suppressHydrationWarning
                        />
                        <div className="w-8 h-4.5 bg-[#04091A] rounded-full border border-border-subtle peer peer-checked:bg-gold peer-checked:border-gold transition-colors duration-200"></div>
                        <div className="absolute top-[2.5px] left-[2.5px] w-3 h-3 bg-gray-text rounded-full transition-transform duration-200 peer-checked:translate-x-3.5 peer-checked:bg-navy pointer-events-none"></div>
                      </div>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group select-none">
                      <span className="text-xs text-gray-text group-hover:text-white transition-colors">New properties listed — Email me</span>
                      <div className="relative inline-flex items-center">
                        <input 
                          type="checkbox" 
                          checked={emailProperties}
                          onChange={(e) => setEmailProperties(e.target.checked)}
                          className="sr-only peer" 
                          suppressHydrationWarning
                        />
                        <div className="w-8 h-4.5 bg-[#04091A] rounded-full border border-border-subtle peer peer-checked:bg-gold peer-checked:border-gold transition-colors duration-200"></div>
                        <div className="absolute top-[2.5px] left-[2.5px] w-3 h-3 bg-gray-text rounded-full transition-transform duration-200 peer-checked:translate-x-3.5 peer-checked:bg-navy pointer-events-none"></div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* In-App Notifications */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs uppercase tracking-wider text-white font-bold pb-1.5 border-b border-border-subtle/20">
                    In-App Notifications
                  </h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center justify-between cursor-pointer group select-none">
                      <span className="text-xs text-gray-text group-hover:text-white transition-colors">Deposit confirmed — In-app notify</span>
                      <div className="relative inline-flex items-center">
                        <input 
                          type="checkbox" 
                          checked={inAppDeposit}
                          onChange={(e) => setInAppDeposit(e.target.checked)}
                          className="sr-only peer" 
                          suppressHydrationWarning
                        />
                        <div className="w-8 h-4.5 bg-[#04091A] rounded-full border border-border-subtle peer peer-checked:bg-gold peer-checked:border-gold transition-colors duration-200"></div>
                        <div className="absolute top-[2.5px] left-[2.5px] w-3 h-3 bg-gray-text rounded-full transition-transform duration-200 peer-checked:translate-x-3.5 peer-checked:bg-navy pointer-events-none"></div>
                      </div>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group select-none">
                      <span className="text-xs text-gray-text group-hover:text-white transition-colors">Withdrawal approved — In-app notify</span>
                      <div className="relative inline-flex items-center">
                        <input 
                          type="checkbox" 
                          checked={inAppWithdrawal}
                          onChange={(e) => setInAppWithdrawal(e.target.checked)}
                          className="sr-only peer" 
                          suppressHydrationWarning
                        />
                        <div className="w-8 h-4.5 bg-[#04091A] rounded-full border border-border-subtle peer peer-checked:bg-gold peer-checked:border-gold transition-colors duration-200"></div>
                        <div className="absolute top-[2.5px] left-[2.5px] w-3 h-3 bg-gray-text rounded-full transition-transform duration-200 peer-checked:translate-x-3.5 peer-checked:bg-navy pointer-events-none"></div>
                      </div>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group select-none">
                      <span className="text-xs text-gray-text group-hover:text-white transition-colors">Monthly return paid — In-app notify</span>
                      <div className="relative inline-flex items-center">
                        <input 
                          type="checkbox" 
                          checked={inAppReturn}
                          onChange={(e) => setInAppReturn(e.target.checked)}
                          className="sr-only peer" 
                          suppressHydrationWarning
                        />
                        <div className="w-8 h-4.5 bg-[#04091A] rounded-full border border-border-subtle peer peer-checked:bg-gold peer-checked:border-gold transition-colors duration-200"></div>
                        <div className="absolute top-[2.5px] left-[2.5px] w-3 h-3 bg-gray-text rounded-full transition-transform duration-200 peer-checked:translate-x-3.5 peer-checked:bg-navy pointer-events-none"></div>
                      </div>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group select-none">
                      <span className="text-xs text-gray-text group-hover:text-white transition-colors">Investment matured — In-app notify</span>
                      <div className="relative inline-flex items-center">
                        <input 
                          type="checkbox" 
                          checked={inAppMaturity}
                          onChange={(e) => setInAppMaturity(e.target.checked)}
                          className="sr-only peer" 
                          suppressHydrationWarning
                        />
                        <div className="w-8 h-4.5 bg-[#04091A] rounded-full border border-border-subtle peer peer-checked:bg-gold peer-checked:border-gold transition-colors duration-200"></div>
                        <div className="absolute top-[2.5px] left-[2.5px] w-3 h-3 bg-gray-text rounded-full transition-transform duration-200 peer-checked:translate-x-3.5 peer-checked:bg-navy pointer-events-none"></div>
                      </div>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group select-none">
                      <span className="text-xs text-gray-text group-hover:text-white transition-colors">New properties listed — In-app notify</span>
                      <div className="relative inline-flex items-center">
                        <input 
                          type="checkbox" 
                          checked={inAppProperties}
                          onChange={(e) => setInAppProperties(e.target.checked)}
                          className="sr-only peer" 
                          suppressHydrationWarning
                        />
                        <div className="w-8 h-4.5 bg-[#04091A] rounded-full border border-border-subtle peer peer-checked:bg-gold peer-checked:border-gold transition-colors duration-200"></div>
                        <div className="absolute top-[2.5px] left-[2.5px] w-3 h-3 bg-gray-text rounded-full transition-transform duration-200 peer-checked:translate-x-3.5 peer-checked:bg-navy pointer-events-none"></div>
                      </div>
                    </label>
                  </div>
                </div>

                {notifSuccess && (
                  <div className="p-3.5 bg-green-950/30 border border-green-500/20 rounded-xl text-green-400 text-xs text-center font-medium font-sans">
                    {notifSuccess}
                  </div>
                )}
                {notifError && (
                  <div className="p-3.5 bg-red-950/30 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-medium font-sans">
                    {notifError}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={notifSaving}
                    className="px-6 py-3 bg-gold hover:bg-gold-light text-navy font-bold rounded-xl transition text-xs shadow-lg uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {notifSaving && <RefreshCw size={14} className="animate-spin" />}
                    Save Preferences
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        /* ==========================================
           SECURITY & 2FA TAB
           ========================================== */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* PASSWORD RESET FORM */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#0A1224] border border-border-subtle rounded-2xl p-6 shadow-lg">
              <h2 className="text-sm font-serif font-bold text-white uppercase tracking-wider text-gold mb-6 pb-2 border-b border-border-subtle/40 flex items-center gap-2">
                <Lock size={16} /> Update Password
              </h2>

              <form onSubmit={handleSavePassword} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPwd ? 'text' : 'password'}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-[#04091A] border border-border-subtle rounded-xl pl-4 pr-12 py-3 text-xs text-white focus:outline-none focus:border-gold"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowCurrentPwd(!showCurrentPwd)} 
                      className="absolute right-0 top-0 h-full px-3 text-gray-text hover:text-white flex items-center justify-center"
                      style={{
                        minHeight: '44px',
                        minWidth: '44px',
                        cursor: 'pointer',
                        WebkitTapHighlightColor: 'transparent',
                        touchAction: 'manipulation',
                      }}
                    >
                      <span style={{ pointerEvents: 'none' }} className="flex items-center justify-center">
                        {showCurrentPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPwd ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#04091A] border border-border-subtle rounded-xl pl-4 pr-12 py-3 text-xs text-white focus:outline-none focus:border-gold"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowNewPwd(!showNewPwd)} 
                      className="absolute right-0 top-0 h-full px-3 text-gray-text hover:text-white flex items-center justify-center"
                      style={{
                        minHeight: '44px',
                        minWidth: '44px',
                        cursor: 'pointer',
                        WebkitTapHighlightColor: 'transparent',
                        touchAction: 'manipulation',
                      }}
                    >
                      <span style={{ pointerEvents: 'none' }} className="flex items-center justify-center">
                        {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                      </span>
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {newPassword && (
                    <div className="mt-2.5 space-y-1">
                      <div className="flex justify-between items-center text-[9px] uppercase tracking-wider font-bold">
                        <span className="text-gray-500">Strength:</span>
                        <span className={`text-[9px] font-sans ${
                          pwdStrength.score === 1 ? 'text-red-500' :
                          pwdStrength.score === 2 ? 'text-orange-500' :
                          pwdStrength.score === 3 ? 'text-yellow-500' : 'text-green-500'
                        }`}>{pwdStrength.label}</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full flex overflow-hidden">
                        <div className={`h-full ${pwdStrength.color} transition-all duration-300`} style={{ width: `${pwdStrength.score * 25}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPwd ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#04091A] border border-border-subtle rounded-xl pl-4 pr-12 py-3 text-xs text-white focus:outline-none focus:border-gold"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPwd(!showConfirmPwd)} 
                      className="absolute right-0 top-0 h-full px-3 text-gray-text hover:text-white flex items-center justify-center"
                      style={{
                        minHeight: '44px',
                        minWidth: '44px',
                        cursor: 'pointer',
                        WebkitTapHighlightColor: 'transparent',
                        touchAction: 'manipulation',
                      }}
                    >
                      <span style={{ pointerEvents: 'none' }} className="flex items-center justify-center">
                        {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                      </span>
                    </button>
                  </div>
                </div>

                {pwdSuccess && (
                  <div className="p-3 bg-green-950/30 border border-green-500/20 rounded-xl text-green-400 text-xs text-center font-medium font-sans">
                    {pwdSuccess}
                  </div>
                )}
                {pwdError && (
                  <div className="p-3 bg-red-950/30 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-medium font-sans">
                    {pwdError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={pwdSaving}
                  className="w-full mt-2 py-3 bg-gold hover:bg-gold-light text-navy font-bold rounded-xl transition text-xs shadow-lg uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  style={{
                    minHeight: '44px',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <span style={{ pointerEvents: 'none' }} className="flex items-center justify-center gap-1.5">
                    {pwdSaving && <RefreshCw size={14} className="animate-spin" />}
                    Save Password
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* TWO FACTOR AUTHENTICATION SECTION */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0A1224] border border-border-subtle rounded-2xl p-6 md:p-8 shadow-lg">
              <h2 className="text-md font-serif font-bold text-white uppercase tracking-wider text-gold mb-6 pb-2 border-b border-border-subtle/40 flex items-center justify-between">
                <span className="flex items-center gap-2"><ShieldCheck size={16} /> Two-Factor Authentication (2FA)</span>
                
                {profile?.two_fa_enabled ? (
                  <span className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Enabled</span>
                ) : (
                  <span className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Disabled</span>
                )}
              </h2>

              <p className="text-xs text-gray-text leading-relaxed mb-6 font-sans">
                Secure your login session audits with Google Authenticator. Enabling 2FA requires you to enter a 6-digit verification code each time you sign in.
              </p>

              {/* Status & Toggle logic */}
              {!profile?.two_fa_enabled ? (
                // 2FA Setup
                <div className="space-y-6">
                  {!twoFaSetupData ? (
                    <button
                      onClick={handleSetup2FA}
                      disabled={twoFaLoading}
                      className="px-6 py-3 bg-gold hover:bg-gold-light text-navy font-bold rounded-xl transition text-xs uppercase tracking-wider cursor-pointer flex items-center gap-1.5 disabled:opacity-50 justify-center"
                      style={{
                        minHeight: '44px',
                        touchAction: 'manipulation',
                        WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      <span style={{ pointerEvents: 'none' }} className="flex items-center gap-1.5 justify-center">
                        {twoFaLoading && <RefreshCw size={14} className="animate-spin" />}
                        Setup 2FA Authentication
                      </span>
                    </button>
                  ) : (
                    // Setup Wizard Renders QR
                    <div className="bg-navy p-5 rounded-xl border border-border-subtle flex flex-col md:flex-row items-center gap-6 animate-in zoom-in-95 duration-200">
                      {/* QR Code Container */}
                      <div className="bg-white p-3 rounded-lg w-36 h-36 shrink-0 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={twoFaSetupData.qrCodeUrl} alt="Google Authenticator QR Code" className="w-full h-full object-contain" />
                      </div>

                      {/* Instructions */}
                      <div className="flex-1 space-y-4 text-xs font-sans">
                        <span className="font-bold text-white uppercase block text-[10px] tracking-wider text-gold">Scan QR Code</span>
                        <p className="text-gray-300 leading-relaxed">
                          Scan the QR code with Google Authenticator or entry the secret code manually:
                        </p>
                        <div className="bg-[#04091A] p-2.5 rounded-lg border border-border-subtle/60 text-xs font-mono text-white flex justify-between items-center select-all">
                          <span>{twoFaSetupData.secret}</span>
                        </div>

                        {/* Verification Form */}
                        <form onSubmit={handleVerify2FA} className="pt-2 flex flex-col sm:flex-row gap-3">
                          <input
                            type="text"
                            required
                            maxLength={6}
                            placeholder="Enter 6-digit code"
                            value={twoFaToken}
                            onChange={(e) => setTwoFaToken(e.target.value.replace(/\D/g, ''))}
                            className="bg-[#04091A] border border-border-subtle rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold w-full sm:max-w-[150px] text-center tracking-widest font-mono"
                          />
                          <button
                            type="submit"
                            disabled={twoFaLoading}
                            className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-xs transition uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                            style={{
                              minHeight: '44px',
                              touchAction: 'manipulation',
                              WebkitTapHighlightColor: 'transparent',
                            }}
                          >
                            <span style={{ pointerEvents: 'none' }} className="flex items-center justify-center gap-1.5">
                              {twoFaLoading && <RefreshCw size={14} className="animate-spin" />}
                              Confirm & Enable
                            </span>
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Backup codes view after successful enable */}
                  {twoFaBackupCodes.length > 0 && (
                    <div className="p-5 bg-green-950/20 border border-green-500/20 rounded-xl space-y-4 animate-in fade-in duration-300">
                      <div className="flex items-center gap-2 text-green-400 text-xs font-semibold">
                        <ShieldCheck size={18} />
                        <span>Two-factor authentication is active! Save your backup codes:</span>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs text-white bg-[#04091A] p-4 rounded-lg border border-border-subtle">
                        {twoFaBackupCodes.map((code, idx) => (
                          <div key={idx} className="text-center bg-navy-light/60 p-1.5 rounded border border-white/5">{code}</div>
                        ))}
                      </div>

                      <button
                        onClick={downloadBackupCodes}
                        className="px-4 py-2 bg-navy border border-border-subtle text-[11px] text-gray-text hover:text-white rounded-lg flex items-center gap-1.5 transition font-semibold uppercase tracking-wider cursor-pointer justify-center"
                        style={{
                          minHeight: '44px',
                          touchAction: 'manipulation',
                          WebkitTapHighlightColor: 'transparent',
                        }}
                      >
                        <span style={{ pointerEvents: 'none' }} className="flex items-center justify-center gap-1.5">
                          <Download size={13} /> Download Codes (.txt)
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Disable 2FA
                <div className="space-y-4">
                  {!showDisableForm ? (
                    <button
                      onClick={() => setShowDisableForm(true)}
                      className="px-5 py-2.5 bg-red-650 hover:bg-red-600 text-white font-bold rounded-xl text-xs transition uppercase tracking-wider cursor-pointer flex items-center gap-1.5 justify-center"
                      style={{
                        minHeight: '44px',
                        touchAction: 'manipulation',
                        WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      <span style={{ pointerEvents: 'none' }}>
                        Disable Two-Factor Auth
                      </span>
                    </button>
                  ) : (
                    <form onSubmit={handleDisable2FA} className="bg-navy p-5 border border-red-500/20 rounded-xl space-y-4 animate-in zoom-in-95 duration-200">
                      <span className="font-bold text-red-400 uppercase block text-[10px] tracking-wider">Confirm 2FA Deactivation</span>
                      <p className="text-xs text-gray-300 font-sans leading-relaxed">Enter a 6-digit TOTP code to confirm you want to disable 2FA security.</p>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          required
                          maxLength={6}
                          placeholder="Enter 2FA Code"
                          value={disableToken}
                          onChange={(e) => setDisableToken(e.target.value.replace(/\D/g, ''))}
                          className="bg-[#04091A] border border-border-subtle rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold w-full sm:max-w-[150px] text-center tracking-widest font-mono"
                        />
                        <button
                          type="submit"
                          disabled={twoFaLoading}
                          className="px-5 py-2.5 bg-red-650 hover:bg-red-600 text-white font-bold rounded-xl text-xs transition uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          style={{
                            minHeight: '44px',
                            touchAction: 'manipulation',
                            WebkitTapHighlightColor: 'transparent',
                          }}
                        >
                          <span style={{ pointerEvents: 'none' }} className="flex items-center justify-center gap-1.5">
                            {twoFaLoading && <RefreshCw size={14} className="animate-spin" />}
                            Confirm Deactivation
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowDisableForm(false)}
                          className="px-5 py-2.5 bg-navy border border-border-subtle text-xs text-gray-text hover:text-white rounded-xl transition uppercase tracking-wider cursor-pointer flex items-center justify-center"
                          style={{
                            minHeight: '44px',
                            touchAction: 'manipulation',
                            WebkitTapHighlightColor: 'transparent',
                          }}
                        >
                          <span style={{ pointerEvents: 'none' }}>
                            Cancel
                          </span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {twoFaSuccess && (
                <div className="mt-4 p-3 bg-green-950/30 border border-green-500/20 rounded-xl text-green-400 text-xs text-center font-medium font-sans">
                  {twoFaSuccess}
                </div>
              )}
              {twoFaError && (
                <div className="mt-4 p-3 bg-red-950/30 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-medium font-sans">
                  {twoFaError}
                </div>
              )}
            </div>

            {/* LOGIN HISTORY logs */}
            <div className="bg-[#0A1224] border border-border-subtle rounded-2xl p-6 md:p-8 shadow-lg overflow-x-auto">
              <h2 className="text-md font-serif font-bold text-white uppercase tracking-wider text-gold mb-6 pb-2 border-b border-border-subtle/40 flex items-center gap-2">
                <Clock size={16} /> Device Session Login History
              </h2>

              {historyLoading ? (
                <div className="flex justify-center py-6 text-gray-text text-xs items-center gap-1.5">
                  <RefreshCw size={14} className="animate-spin text-gold" /> Loading session audit logs...
                </div>
              ) : (
                <div className="w-full">
                  <table className="w-full text-xs text-left text-gray-300 font-sans border-collapse">
                    <thead>
                      <tr className="border-b border-border-subtle/60 text-gray-text text-[10px] uppercase tracking-wider font-bold">
                        <th className="pb-3 pr-4">Date</th>
                        <th className="pb-3 pr-4">Time</th>
                        <th className="pb-3 pr-4">IP Address</th>
                        <th className="pb-3 pr-4">Device/Browser</th>
                        <th className="pb-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loginHistory.map((log, idx) => (
                        <tr key={idx} className="border-b border-border-subtle/30 hover:bg-navy-light/10 transition-colors">
                          <td className="py-3.5 pr-4 font-mono">{log.date}</td>
                          <td className="py-3.5 pr-4">{log.time}</td>
                          <td className="py-3.5 pr-4 font-mono text-gray-400">{log.ipAddress}</td>
                          <td className="py-3.5 pr-4 flex items-center gap-1.5 text-gray-400">
                            <Laptop size={12} className="text-gold" />
                            <span>{log.device}</span>
                          </td>
                          <td className="py-3.5 text-right font-medium">
                            {log.status === 'Success' ? (
                              <span className="text-green-400">&bull; Success</span>
                            ) : (
                              <span className="text-red-400">&bull; Failed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {loginHistory.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-text">No recent login records found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
