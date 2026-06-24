"use client";
import { useState, useEffect } from 'react';
import { Bitcoin, Wallet, CircleDollarSign, Send, Landmark, ShieldCheck, CheckCircle2, Lock, ArrowRight, Upload, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface DepositTabProps {
  setActiveTab: (tab: string) => void;
  profile: any;
  fetchProfile: () => void;
}

export default function DepositTab({ setActiveTab, profile, fetchProfile }: DepositTabProps) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('50000');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cryptoTab, setCryptoTab] = useState('USDT');
  const [confirmed, setConfirmed] = useState(false);

  const [bankDetails, setBankDetails] = useState({
    bank: 'OPay',
    accountName: 'Chukwuebuka Irenaus Onyegere',
    accountNumber: '9167455410',
    whatsapp: '+2349167455410',
    ussd: '*955#',
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.settings) {
            setBankDetails({
              bank: data.settings.bank_name || 'OPay',
              accountName: data.settings.account_name || 'Chukwuebuka Irenaus Onyegere',
              accountNumber: data.settings.account_number || '9167455410',
              whatsapp: data.settings.bank_whatsapp || '+2349167455410',
              ussd: data.settings.bank_ussd || '*955#',
            });
          }
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    }
    loadSettings();
  }, []);

  // Form Fields
  const [txHash, setTxHash] = useState('');
  const [bankRef, setBankRef] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Status States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [refNumber, setRefNumber] = useState('');

  const handleAmountSelect = (val: string) => {
    setAmount(val);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmitDeposit = async () => {
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      if (paymentMethod === 'paystack' || paymentMethod === 'flutterwave') {
        const endpoint = paymentMethod === 'paystack'
          ? '/api/paystack/initialize'
          : '/api/flutterwave/initialize';

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: profile?.id,
            amount: parseFloat(amount),
            planName: 'Investment Deposit',
          }),
        });

        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || 'Failed to initialize payment');
        }

        const redirectUrl = paymentMethod === 'paystack' ? data.authorizationUrl : data.link;
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          throw new Error('Payment gateway redirect URL not found');
        }
        return;
      }

      let proofUrl = '';

      // 1. Upload proof receipt to Supabase Storage if file is selected
      if (uploadFile) {
        setIsUploading(true);
        const fileExt = uploadFile.name.split('.').pop();
        const fileName = `${profile?.id || 'anonymous'}-${Date.now()}.${fileExt}`;
        const filePath = `receipts/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('deposit-proofs')
          .upload(filePath, uploadFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw new Error(`Receipt upload failed: ${uploadError.message}`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('deposit-proofs')
          .getPublicUrl(filePath);

        proofUrl = publicUrl;
        setIsUploading(false);
      }

      // 2. Submit Deposit to the backend API
      const res = await fetch('/api/deposits/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          method: paymentMethod === 'crypto' ? (cryptoTab === 'BTC' ? 'bitcoin' : 'usdt') : 'bank_transfer',
          transactionHash: paymentMethod === 'crypto' ? txHash : undefined,
          bankReference: paymentMethod === 'bank' ? bankRef : undefined,
          walletAddress: paymentMethod === 'crypto' ? (cryptoTab === 'BTC' ? 'bc1qplaceholder_address_goes_here_xyz' : 'TRC20placeholder_address_goes_here_xyz') : undefined,
          proofUrl: proofUrl || undefined
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit deposit request');
      }

      setRefNumber(data.referenceNumber);
      fetchProfile(); // Refresh balance in dashboard
      setStep(4); // Advance to success step

    } catch (err: any) {
      console.error('Submit deposit error:', err);
      setErrorMsg(err.message || 'An error occurred during submission. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  if (step === 4) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-navy-mid border border-border-subtle rounded-2xl p-8 md:p-12 text-center relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 mb-6 relative z-10 animate-bounce">
            <CheckCircle2 size={40} />
          </div>
          
          <h2 className="text-3xl font-serif text-white mb-2 relative z-10">Deposit Request Submitted!</h2>
          <p className="text-gray-text max-w-md mx-auto mb-6 relative z-10">
            Your deposit will be confirmed within 2-4 hours after payment verification.
          </p>
          
          <div className="bg-navy border border-border-subtle rounded-xl p-4 w-full max-w-sm mb-8 relative z-10">
            <div className="text-xs text-gray-text uppercase tracking-widest mb-1">Reference Number</div>
            <div className="font-mono text-lg text-white">{refNumber || 'DEP-PENDING'}</div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md relative z-10">
            <button 
              onClick={() => setActiveTab('wallet')}
              className="flex-1 px-6 py-3 bg-navy-light border border-border-subtle rounded-xl text-white font-medium hover:border-gold hover:text-gold transition-colors"
            >
              View Wallet
            </button>
            <button 
              onClick={() => setActiveTab('overview')}
              className="flex-1 px-6 py-3 bg-gold text-navy rounded-xl font-bold hover:bg-white transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-border-subtle -z-10"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-px bg-gold transition duration-500 -z-10" style={{ width: step === 1 ? '10%' : step === 2 ? '50%' : '100%' }}></div>
        
        {[
          { num: 1, label: 'Amount' },
          { num: 2, label: 'Payment Method' },
          { num: 3, label: 'Confirm' }
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center gap-2 bg-navy px-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s.num ? 'bg-gold text-navy' : 'bg-navy-light text-gray-text border border-border-subtle'}`}>
              {step > s.num ? <CheckCircle2 size={16} /> : s.num}
            </div>
            <span className={`text-xs font-medium uppercase tracking-wider ${step >= s.num ? 'text-gold' : 'text-gray-text'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-navy-mid border border-border-subtle rounded-2xl overflow-hidden relative">
        <div className="p-6 md:p-8">
          
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-950/20 border border-red-500/20 rounded-xl text-red-400 text-sm">
              ⚠️ {errorMsg}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-serif mb-1">Enter Deposit Amount</h3>
                <p className="text-sm text-gray-text">How much would you like to add to your wallet?</p>
              </div>

              <div className="space-y-3">
                <label className="text-sm text-gray-text font-medium block">Amount (₦)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-text text-lg">₦</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-navy border border-border-subtle rounded-xl py-4 pl-10 pr-4 text-white text-lg focus:outline-none focus:border-gold transition-colors font-medium"
                    placeholder="Enter amount"
                  />
                </div>
                <div className="text-xs text-yellow-500">Minimum deposit: ₦20,000</div>
              </div>

              <div className="space-y-3">
                <label className="text-sm text-gray-text font-medium block">Quick Amounts</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['20000', '50000', '100000', '500000'].map(val => (
                    <button 
                      key={val}
                      onClick={() => handleAmountSelect(val)}
                      className={`py-3 px-2 rounded-lg border text-sm font-medium transition-colors ${amount === val ? 'bg-gold/10 border-gold text-gold' : 'bg-navy border-border-subtle text-gray-text hover:text-white hover:border-gray-500'}`}
                    >
                      ₦{parseInt(val).toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={handleNext}
                  disabled={parseInt(amount) < 20000}
                  className="w-full py-4 bg-gold text-navy rounded-xl font-bold text-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    minHeight: '48px',
                    minWidth: '48px',
                    padding: '14px 24px',
                    cursor: 'pointer',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <span style={{ pointerEvents: 'none' }} className="flex items-center justify-center gap-2">
                    Continue <ArrowRight size={20} />
                  </span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <button 
                  onClick={handleBack} 
                  className="p-2 bg-navy rounded-lg border border-border-subtle text-gray-text hover:text-white transition-colors flex items-center justify-center"
                  style={{
                    minHeight: '48px',
                    minWidth: '48px',
                    cursor: 'pointer',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <span style={{ pointerEvents: 'none' }} className="flex items-center justify-center">
                    <ArrowLeft size={16} />
                  </span>
                </button>
                <div>
                  <h3 className="text-xl font-serif mb-1">Choose Payment Method</h3>
                  <p className="text-sm text-gray-text">Select how you want to fund your account.</p>
                </div>
              </div>

              <div className="space-y-4">
                
                {/* Paystack */}
                <div 
                  className={`border rounded-xl p-5 cursor-pointer transition ${paymentMethod === 'paystack' ? 'bg-gold/5 border-gold shadow-[0_0_15px_rgba(201,168,76,0.1)]' : 'bg-navy border-border-subtle hover:border-gray-500'}`}
                  onClick={() => setPaymentMethod('paystack')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setPaymentMethod('paystack');
                    }
                  }}
                  style={{
                    minHeight: '64px',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                  }}
                >
                  <div style={{ pointerEvents: 'none' }} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#00C3F7]/20 text-[#00C3F7] flex items-center justify-center shrink-0 border border-[#00C3F7]/30">
                      💳
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Paystack <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded ml-2">⚡ Instant</span></h4>
                      <p className="text-xs text-gray-text">Pay with card, bank transfer, USSD, or Opay.</p>
                    </div>
                  </div>
                </div>

                {/* Flutterwave */}
                <div 
                  className={`border rounded-xl p-5 cursor-pointer transition ${paymentMethod === 'flutterwave' ? 'bg-gold/5 border-gold shadow-[0_0_15px_rgba(201,168,76,0.1)]' : 'bg-navy border-border-subtle hover:border-gray-500'}`}
                  onClick={() => setPaymentMethod('flutterwave')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setPaymentMethod('flutterwave');
                    }
                  }}
                  style={{
                    minHeight: '64px',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                  }}
                >
                  <div style={{ pointerEvents: 'none' }} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#F5A623]/20 text-[#F5A623] flex items-center justify-center shrink-0 border border-[#F5A623]/30">
                      🌊
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Flutterwave <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded ml-2">⚡ Instant</span></h4>
                      <p className="text-xs text-gray-text">Card, bank transfer, mobile money, USSD.</p>
                    </div>
                  </div>
                </div>

                {/* Local Bank Transfer */}
                <div 
                  className={`border rounded-xl p-5 cursor-pointer transition ${paymentMethod === 'bank' ? 'bg-gold/5 border-gold shadow-[0_0_15px_rgba(201,168,76,0.1)]' : 'bg-navy border-border-subtle hover:border-gray-500'}`}
                  onClick={() => setPaymentMethod('bank')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setPaymentMethod('bank');
                    }
                  }}
                  style={{
                    minHeight: '64px',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                  }}
                >
                  <div style={{ pointerEvents: 'none' }} className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-navy-light flex items-center justify-center shrink-0 border border-border-subtle text-white">
                      <Landmark size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Direct Bank Transfer <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded ml-2">⏱ 2–4 Hours</span></h4>
                      <p className="text-xs text-gray-text">Transfer directly to our Nigerian bank accounts.</p>
                    </div>
                  </div>
                  
                  {paymentMethod === 'bank' && (
                    <div className="mt-4 pt-4 border-t border-border-subtle space-y-4 animate-in fade-in slide-in-from-top-2 duration-300" onClick={(e) => e.stopPropagation()}>
                      <div className="bg-navy-light rounded-lg p-4 space-y-3 text-sm text-gray-300">
                        {/* Bank Details */}
                        <div>
                          <div className="text-xs text-gold font-bold uppercase tracking-wider mb-2">{bankDetails.bank} Account</div>
                          <div className="flex justify-between">
                            <span className="text-gray-text">Account Name:</span>
                            <span className="font-medium text-white">{bankDetails.accountName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-text">Account Number:</span>
                            <span className="font-mono text-white font-bold select-all">{bankDetails.accountNumber}</span>
                          </div>
                          {bankDetails.ussd && (
                            <div className="flex justify-between">
                              <span className="text-gray-text">USSD Transfer Code:</span>
                              <span className="font-mono text-white select-all">{bankDetails.ussd}</span>
                            </div>
                          )}
                          {bankDetails.whatsapp && (
                            <div className="border-t border-border-subtle pt-2 mt-2">
                              <a
                                href={`https://wa.me/${bankDetails.whatsapp.replace(/\+/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-400 text-xs hover:underline flex items-center gap-1.5"
                                style={{
                                  minHeight: '44px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  touchAction: 'manipulation',
                                }}
                              >
                                💬 Contact on WhatsApp for instant confirmation
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="border-t border-border-subtle pt-2 mt-2">
                          <div className="text-xs text-gray-text mb-1">Transfer Steps:</div>
                          <ol className="list-decimal pl-4 space-y-1 text-xs">
                            <li>Transfer exactly <b>₦{parseInt(amount).toLocaleString()}</b> to the account above.</li>
                            <li>Write <b>Your Full Name + Deposit</b> in the reference/narration box.</li>
                            <li>Input your transfer reference/receipt ID and upload proof below.</li>
                          </ol>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-text block mb-1">Bank Reference/Session ID:</label>
                          <input type="text" value={bankRef} onChange={(e) => setBankRef(e.target.value)} placeholder="Enter transfer reference number" className="w-full bg-navy border border-border-subtle rounded py-2 px-3 text-white text-sm focus:outline-none focus:border-gold transition-colors" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-text block mb-1">Upload payment receipt/screenshot:</label>
                          <div className="flex flex-col items-center justify-center w-full h-24 border-2 border-border-subtle border-dashed rounded-lg cursor-pointer bg-navy hover:bg-navy-light/50 transition-colors relative">
                              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer w-full" onChange={handleFileChange} accept="image/*" />
                              <Upload className="w-6 h-6 mb-2 text-gray-text" />
                              <p className="text-xs text-gray-text">
                                {uploadFile ? <span className="text-gold font-medium">{uploadFile.name}</span> : <span className="text-green-400 font-medium tracking-wide">Click to upload receipt</span>}
                              </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Crypto */}
                <div 
                  className={`border rounded-xl p-5 cursor-pointer transition ${paymentMethod === 'crypto' ? 'bg-gold/5 border-gold shadow-[0_0_15px_rgba(201,168,76,0.1)]' : 'bg-navy border-border-subtle hover:border-gray-500'}`}
                  onClick={() => setPaymentMethod('crypto')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setPaymentMethod('crypto');
                    }
                  }}
                  style={{
                    minHeight: '64px',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                  }}
                >
                  <div style={{ pointerEvents: 'none' }} className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/30">
                      <Bitcoin size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Crypto Payment <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded ml-2">🔄 15–45 mins</span></h4>
                      <p className="text-xs text-gray-text">Pay with Bitcoin or USDT (converted at ₦1,600 per USD).</p>
                    </div>
                  </div>
                  
                  {paymentMethod === 'crypto' && (
                    <div className="mt-4 pt-4 border-t border-border-subtle space-y-4 animate-in fade-in slide-in-from-top-2 duration-300" onClick={(e) => e.stopPropagation()}>
                      <div className="flex border border-border-subtle rounded-lg overflow-hidden bg-navy">
                        <button 
                          onClick={() => { setCryptoTab('USDT'); setUploadFile(null); }} 
                          className={`flex-1 py-2 text-xs font-bold font-mono transition border-r border-border-subtle ${cryptoTab === 'USDT' ? 'bg-[#26A17B] text-white' : 'text-gray-400 hover:text-white hover:bg-navy-light'}`}
                          style={{
                            minHeight: '44px',
                            cursor: 'pointer',
                            touchAction: 'manipulation',
                            WebkitTapHighlightColor: 'transparent',
                          }}
                        >
                          USDT (TRC20)
                        </button>
                        <button 
                          onClick={() => { setCryptoTab('BTC'); setUploadFile(null); }} 
                          className={`flex-1 py-2 text-xs font-bold font-mono transition ${cryptoTab === 'BTC' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white hover:bg-navy-light'}`}
                          style={{
                            minHeight: '44px',
                            cursor: 'pointer',
                            touchAction: 'manipulation',
                            WebkitTapHighlightColor: 'transparent',
                          }}
                        >
                          Bitcoin (BTC)
                        </button>
                      </div>

                      <div className="bg-navy-light p-4 rounded-lg space-y-3">
                        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded text-amber-500 text-xs flex gap-2">
                          <span className="shrink-0">⚠️</span>
                          <span>Always double-check the wallet address. Crypto transactions are irreversible. Secondary Conversion rate: $1 USD = ₦1,600.</span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start pt-2">
                          <div className="w-24 h-24 shrink-0 bg-white p-1 rounded">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${cryptoTab === 'BTC' ? 'bc1qplaceholder_address_goes_here_xyz' : 'TRC20placeholder_address_goes_here_xyz'}`} alt="QR Code" className="w-full h-full opacity-80" />
                          </div>
                          <div className="flex-1 w-full space-y-2">
                            <div className="text-xs text-gray-text">{cryptoTab} Wallet Address:</div>
                            <div className="font-mono text-sm break-all bg-navy p-2 rounded border border-border-subtle text-white select-all">
                              {cryptoTab === 'BTC' ? 'bc1qplaceholder_address_goes_here_xyz' : 'TRC20placeholder_address_goes_here_xyz'}
                            </div>
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-gray-text">Network: <span className="text-white">
                                {cryptoTab === 'BTC' ? 'Bitcoin Mainnet' : 'TRON (TRC20)'}
                              </span></span>
                              <span className="text-gray-text">Convert Amount: <span className="text-gold font-bold">${(parseInt(amount) / 1600).toFixed(2)} USD</span></span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 pt-3 border-t border-border-subtle">
                          <div>
                            <label className="text-xs text-gray-text block mb-1">Transaction Hash/TXID:</label>
                            <input type="text" value={txHash} onChange={(e) => setTxHash(e.target.value)} placeholder="Enter your transaction hash" className="w-full bg-navy border border-border-subtle rounded py-2 px-3 text-white text-sm focus:outline-none focus:border-gold transition-colors" />
                          </div>
                          <div>
                            <label className="text-xs text-gray-text block mb-1">Upload proof image:</label>
                             <input type="file" onChange={handleFileChange} accept="image/*" className="w-full text-xs text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-navy-mid file:text-white file:border file:border-border-subtle hover:file:bg-navy-light cursor-pointer" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
              </div>

              <div className="pt-6">
                <button 
                  onClick={handleNext}
                  disabled={!paymentMethod}
                  className="w-full py-4 bg-gold text-navy rounded-xl font-bold text-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <button onClick={handleBack} className="p-2 bg-navy rounded-lg border border-border-subtle text-gray-text hover:text-white transition-colors">
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <h3 className="text-xl font-serif mb-1">Confirm Deposit</h3>
                  <p className="text-sm text-gray-text">Please review your deposit details.</p>
                </div>
              </div>

              <div className="bg-navy border border-border-subtle rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-border-subtle">
                  <span className="text-gray-text">Amount</span>
                  <span className="text-2xl font-serif text-white">₦{parseInt(amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-text text-sm">Payment Method</span>
                  <span className="text-white font-medium text-sm capitalize flex items-center gap-1.5">
                    {paymentMethod === 'paystack' && 'Paystack'}
                    {paymentMethod === 'flutterwave' && 'Flutterwave'}
                    {paymentMethod === 'bank' && 'Direct Bank Transfer'}
                    {paymentMethod === 'crypto' && `Cryptocurrency (${cryptoTab})`}
                  </span>
                </div>
                {uploadFile && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-text text-sm">Uploaded Proof</span>
                    <span className="text-green-400 font-medium text-sm truncate max-w-[50%]">{uploadFile.name}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-text text-sm">Processing Time</span>
                  <span className="text-gold font-medium text-sm">
                    {paymentMethod === 'paystack' && 'Instant'}
                    {paymentMethod === 'flutterwave' && 'Instant'}
                    {paymentMethod === 'bank' && '2–4 hours'}
                    {paymentMethod === 'crypto' && '15-45 minutes'}
                  </span>
                </div>
              </div>

              <label 
                className="flex items-start gap-3 cursor-pointer group"
                style={{
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="peer sr-only" 
                  />
                  <div className="w-5 h-5 border-2 border-border-subtle rounded bg-navy peer-checked:bg-gold peer-checked:border-gold transition-colors flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-navy opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                </div>
                <span className="text-sm text-gray-text group-hover:text-white transition-colors">
                  I confirm this deposit is from my own funds, I have completed the transfer details, and I agree to the terms of service.
                </span>
              </label>

              <div className="pt-6 flex flex-col gap-3">
                <button 
                  onClick={handleSubmitDeposit}
                  disabled={!confirmed || isSubmitting || isUploading}
                  className="w-full py-4 bg-gold text-navy rounded-xl font-bold text-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    minHeight: '48px',
                    minWidth: '48px',
                    padding: '14px 24px',
                    cursor: 'pointer',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {isSubmitting ? (
                    <span style={{ pointerEvents: 'none' }} className="flex items-center justify-center gap-2">
                      <Loader2 size={20} className="animate-spin" />
                      {isUploading ? 'Uploading proof...' : 'Submitting request...'}
                    </span>
                  ) : (
                    <span style={{ pointerEvents: 'none' }} className="flex items-center justify-center gap-2">
                      Confirm Deposit <CheckCircle2 size={20} />
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab('wallet')}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-navy border border-border-subtle text-white rounded-xl font-bold hover:border-white transition-colors disabled:opacity-50"
                  style={{
                    minHeight: '48px',
                    minWidth: '48px',
                    padding: '14px 24px',
                    cursor: 'pointer',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <span style={{ pointerEvents: 'none' }}>
                    Cancel
                  </span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Info & Security */}
      <div className="space-y-6 pt-4">
        <div className="bg-navy border border-border-subtle rounded-xl p-4 md:p-6 text-sm text-gray-text">
          <h4 className="font-semibold text-white mb-2">Processing Times:</h4>
          <ul className="space-y-1">
             <li className="flex gap-2 isolate"><span className="w-2.5 h-2.5 rounded-full bg-gold/50 shrink-0 mt-1"></span> Paystack / Flutterwave: Instant</li>
             <li className="flex gap-2 isolate"><span className="w-2.5 h-2.5 rounded-full bg-gold/50 shrink-0 mt-1"></span> Direct Bank Transfer: 2–4 hours</li>
             <li className="flex gap-2 isolate"><span className="w-2.5 h-2.5 rounded-full bg-gold/50 shrink-0 mt-1"></span> Crypto (USDT/BTC): 15–45 minutes</li>
          </ul>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs text-gray-text uppercase tracking-wider font-semibold p-4 bg-navy-mid border border-border-subtle rounded-xl">
           <div className="flex items-center gap-1.5"><Lock size={14} className="text-gold" /> 256-bit SSL Encrypted</div>
           <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-gold" /> CBN Compliant</div>
           <div className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-gold" /> AML Verified</div>
        </div>
      </div>

    </div>
  );
}
