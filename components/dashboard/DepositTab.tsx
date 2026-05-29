"use client";
import { useState } from 'react';
import { Bitcoin, Wallet, CircleDollarSign, Send, Landmark, ShieldCheck, CheckCircle2, Lock, ArrowRight, Upload, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface DepositTabProps {
  setActiveTab: (tab: string) => void;
  profile: any;
  fetchProfile: () => void;
}

export default function DepositTab({ setActiveTab, profile, fetchProfile }: DepositTabProps) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('500');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cryptoTab, setCryptoTab] = useState('BTC');
  const [confirmed, setConfirmed] = useState(false);

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
          method: paymentMethod,
          transactionHash: paymentMethod === 'crypto' ? txHash : undefined,
          bankReference: paymentMethod === 'wire' ? bankRef : undefined,
          walletAddress: paymentMethod === 'crypto' ? (cryptoTab === 'BTC' ? 'bc1qplaceholder_address_goes_here_xyz' : cryptoTab === 'USDT' ? 'TRC20placeholder_address_goes_here_xyz' : '0xplaceholder_address_goes_here_xyz') : undefined,
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
                <label className="text-sm text-gray-text font-medium block">Amount ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-text text-lg">$</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-navy border border-border-subtle rounded-xl py-4 pl-10 pr-4 text-white text-lg focus:outline-none focus:border-gold transition-colors font-medium"
                    placeholder="Enter amount"
                  />
                </div>
                <div className="text-xs text-yellow-500">Minimum deposit: $100</div>
              </div>

              <div className="space-y-3">
                <label className="text-sm text-gray-text font-medium block">Quick Amounts</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['500', '1000', '2000', '5000'].map(val => (
                    <button 
                      key={val}
                      onClick={() => handleAmountSelect(val)}
                      className={`py-3 px-2 rounded-lg border text-sm font-medium transition-colors ${amount === val ? 'bg-gold/10 border-gold text-gold' : 'bg-navy border-border-subtle text-gray-text hover:text-white hover:border-gray-500'}`}
                    >
                      ${parseInt(val).toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={handleNext}
                  disabled={parseInt(amount) < 100}
                  className="w-full py-4 bg-gold text-navy rounded-xl font-bold text-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <button onClick={handleBack} className="p-2 bg-navy rounded-lg border border-border-subtle text-gray-text hover:text-white transition-colors">
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <h3 className="text-xl font-serif mb-1">Choose Payment Method</h3>
                  <p className="text-sm text-gray-text">Select how you want to fund your account.</p>
                </div>
              </div>

              <div className="space-y-4">
                
                {/* Cash App */}
                <div 
                  className={`border rounded-xl p-5 cursor-pointer transition ${paymentMethod === 'cashapp' ? 'bg-green-500/10 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'bg-navy border-border-subtle hover:border-gray-500'}`}
                  onClick={() => setPaymentMethod('cashapp')}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0 border border-green-500/30">
                      <CircleDollarSign size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Cash App <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded ml-2">⚡ Instant — 15 mins</span></h4>
                      <p className="text-xs text-gray-text">Send instantly via Cash App. Fastest method — credited within minutes.</p>
                    </div>
                  </div>
                  
                  {paymentMethod === 'cashapp' && (
                    <div className="mt-4 pt-4 border-t border-border-subtle space-y-4 animate-in fade-in slide-in-from-top-2 duration-300" onClick={(e) => e.stopPropagation()}>
                      <div className="bg-navy-light rounded-lg p-4 space-y-4 text-sm text-gray-300">
                        <ol className="list-decimal pl-4 space-y-2">
                          <li>Open your Cash App</li>
                          <li>Tap <b>&quot;Pay&quot;</b></li>
                          <li>Send to <span className="text-green-400 font-mono select-all">$WillistonInvest</span></li>
                          <li>Enter your investment amount in USD: <b>${parseInt(amount).toLocaleString()}</b></li>
                          <li>In the note/memo write: <b>Your Full Name + Deposit</b> <br/> <em className="text-gray-500">(Example: &quot;John Smith - Deposit&quot;)</em></li>
                          <li>Take a screenshot and upload proof below</li>
                        </ol>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-gray-text block">Upload Cash App payment screenshot:</label>
                        <div className="flex flex-col items-center justify-center w-full h-24 border-2 border-border-subtle border-dashed rounded-lg cursor-pointer bg-navy hover:bg-navy-light/50 transition-colors relative">
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer w-full" onChange={handleFileChange} accept="image/*" />
                            <Upload className="w-6 h-6 mb-2 text-gray-text" />
                            <p className="text-xs text-gray-text">
                              {uploadFile ? <span className="text-gold font-medium">{uploadFile.name}</span> : <span className="text-green-400 font-medium tracking-wide">Click to upload image</span>}
                            </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Crypto */}
                <div 
                  className={`border rounded-xl p-5 cursor-pointer transition ${paymentMethod === 'crypto' ? 'bg-gold/5 border-gold shadow-[0_0_15px_rgba(201,168,76,0.1)]' : 'bg-navy border-border-subtle hover:border-gray-500'}`}
                  onClick={() => setPaymentMethod('crypto')}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/30">
                      <Bitcoin size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Crypto Payment <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded ml-2">🔄 15–45 mins</span></h4>
                      <p className="text-xs text-gray-text">Pay with Bitcoin, USDT, Ethereum, or other major cryptocurrencies.</p>
                    </div>
                  </div>
                  
                  {paymentMethod === 'crypto' && (
                    <div className="mt-4 pt-4 border-t border-border-subtle space-y-4 animate-in fade-in slide-in-from-top-2 duration-300" onClick={(e) => e.stopPropagation()}>
                      <div className="flex border border-border-subtle rounded-lg overflow-hidden bg-navy">
                        <button onClick={() => { setCryptoTab('BTC'); setUploadFile(null); }} className={`flex-1 py-2 text-xs font-bold font-mono transition ${cryptoTab === 'BTC' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white hover:bg-navy-light'}`}>Bitcoin (BTC)</button>
                        <button onClick={() => { setCryptoTab('USDT'); setUploadFile(null); }} className={`flex-1 py-2 text-xs font-bold font-mono transition border-x border-border-subtle ${cryptoTab === 'USDT' ? 'bg-[#26A17B] text-white' : 'text-gray-400 hover:text-white hover:bg-navy-light'}`}>USDT (TRC20)</button>
                        <button onClick={() => { setCryptoTab('ETH'); setUploadFile(null); }} className={`flex-1 py-2 text-xs font-bold font-mono transition ${cryptoTab === 'ETH' ? 'bg-[#627EEA] text-white' : 'text-gray-400 hover:text-white hover:bg-navy-light'}`}>Ethereum (ETH)</button>
                      </div>

                      <div className="bg-navy-light p-4 rounded-lg space-y-3">
                        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded text-amber-500 text-xs flex gap-2">
                          <span className="shrink-0">⚠️</span>
                          <span>Always double-check the wallet address before sending. Crypto transactions are irreversible. Send only the exact currency to its matching address.</span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start pt-2">
                          <div className="w-24 h-24 shrink-0 bg-white p-1 rounded">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${cryptoTab === 'BTC' ? 'bc1qplaceholder_address_goes_here_xyz' : cryptoTab === 'USDT' ? 'TRC20placeholder_address_goes_here_xyz' : '0xplaceholder_address_goes_here_xyz'}`} alt="QR Code" className="w-full h-full opacity-80" />
                          </div>
                          <div className="flex-1 w-full space-y-2">
                            <div className="text-xs text-gray-text">{cryptoTab} Wallet Address:</div>
                            <div className="font-mono text-sm break-all bg-navy p-2 rounded border border-border-subtle text-white select-all">
                              {cryptoTab === 'BTC' ? 'bc1qplaceholder_address_goes_here_xyz' : cryptoTab === 'USDT' ? 'TRC20placeholder_address_goes_here_xyz' : '0xplaceholder_address_goes_here_xyz'}
                            </div>
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-gray-text">Network: <span className="text-white">
                                {cryptoTab === 'BTC' ? 'Bitcoin Mainnet' : cryptoTab === 'USDT' ? 'TRON (TRC20)' : 'Ethereum Mainnet'}
                              </span></span>
                              <span className="text-gray-text">Minimum: <span className="text-white">$100 equivalent</span></span>
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
                
                {/* Zelle */}
                <div 
                  className={`border rounded-xl p-5 cursor-pointer transition ${paymentMethod === 'zelle' ? 'bg-purple-500/10 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.1)]' : 'bg-navy border-border-subtle hover:border-gray-500'}`}
                  onClick={() => setPaymentMethod('zelle')}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30">
                      <Send size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">Zelle <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded ml-2">⚡ Same Day</span></h4>
                      <p className="text-xs text-gray-text">Send directly from your US bank account via Zelle. Zero fees.</p>
                    </div>
                  </div>
                  {paymentMethod === 'zelle' && (
                    <div className="mt-4 pt-4 border-t border-border-subtle animate-in fade-in duration-300" onClick={(e) => e.stopPropagation()}>
                      <div className="bg-navy-light rounded-lg p-4 space-y-4 text-sm text-gray-300">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center bg-navy p-2 rounded border border-border-subtle">
                            <span className="text-gray-text text-xs">Email:</span>
                            <span className="font-medium text-white select-all">willistonboardofrealtors@gmail.com</span>
                          </div>
                        </div>
                        <ol className="list-decimal pl-4 space-y-2 mt-4 text-xs">
                          <li>Open your bank&apos;s Zelle feature</li>
                          <li>Send exactly <b>${parseInt(amount).toLocaleString()}</b> to the email above</li>
                          <li>Memo: <b>Your Full Name + Deposit</b></li>
                          <li>Upload confirmation screenshot below</li>
                        </ol>
                        <div className="mt-2">
                             <input type="file" onChange={handleFileChange} accept="image/*" className="w-full text-xs text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-navy-mid file:text-white file:border file:border-border-subtle hover:file:bg-navy-light cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Wire Transfer */}
                <div 
                  className={`border rounded-xl p-5 cursor-pointer transition ${paymentMethod === 'wire' ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-navy border-border-subtle hover:border-gray-500'}`}
                  onClick={() => setPaymentMethod('wire')}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                      <Landmark size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Bank Wire Transfer <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded ml-2">🏦 1–2 Days</span></h4>
                      <p className="text-xs text-gray-text">Direct bank-to-bank wire transfer. Best for large investments ($1,000+).</p>
                    </div>
                  </div>
                   {paymentMethod === 'wire' && (
                     <div className="mt-4 pt-4 border-t border-border-subtle space-y-4 animate-in fade-in slide-in-from-top-2 duration-300" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-navy-light rounded-lg p-4 space-y-2">
                           <div className="flex justify-between text-sm">
                             <span className="text-gray-text">Bank Name:</span>
                             <span className="font-medium text-white">Chase Bank</span>
                           </div>
                           <div className="flex justify-between text-sm">
                             <span className="text-gray-text">Account Name:</span>
                             <span className="font-medium text-white text-right">Williston Board of Realtors & Investments LLC</span>
                           </div>
                           <div className="flex justify-between text-sm">
                             <span className="text-gray-text">Account Number:</span>
                             <span className="font-mono text-white tracking-widest text-lg">1234567890</span>
                           </div>
                           <div className="flex justify-between text-sm">
                             <span className="text-gray-text">Routing Number:</span>
                             <span className="font-mono text-white tracking-widest text-lg">987654321</span>
                           </div>
                           <div className="flex justify-between text-sm">
                             <span className="text-gray-text">Swift Code (Intl):</span>
                             <span className="font-mono text-white tracking-widest">CHASUS33</span>
                           </div>
                           <div className="flex justify-between text-sm border-t border-border-subtle pt-2 mt-2">
                             <span className="text-gray-text">Reference:</span>
                             <span className="font-medium text-white text-right break-all max-w-[60%]">Your Full Name + Deposit</span>
                           </div>
                           <div className="flex justify-between text-sm">
                             <span className="text-gray-text">Minimum:</span>
                             <span className="font-medium text-white">$1,000</span>
                           </div>
                        </div>

                        <div className="space-y-3 pt-3 border-t border-border-subtle">
                          <div>
                            <label className="text-xs text-gray-text block mb-1">Bank Reference/Wire ID:</label>
                            <input type="text" value={bankRef} onChange={(e) => setBankRef(e.target.value)} placeholder="Enter bank transaction reference number" className="w-full bg-navy border border-border-subtle rounded py-2 px-3 text-white text-sm focus:outline-none focus:border-gold transition-colors" />
                          </div>
                          <div>
                            <label className="text-xs text-gray-text block mb-1">Upload wire receipt screenshot:</label>
                             <input type="file" onChange={handleFileChange} accept="image/*" className="w-full text-xs text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-navy-mid file:text-white file:border file:border-border-subtle hover:file:bg-navy-light cursor-pointer" />
                          </div>
                        </div>
                     </div>
                   )}
                </div>

              </div>

              <div className="pt-6">
                <button 
                  onClick={handleNext}
                  disabled={!paymentMethod || (paymentMethod === 'wire' && parseInt(amount) < 1000)}
                  className="w-full py-4 bg-gold text-navy rounded-xl font-bold text-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight size={20} />
                </button>
                {paymentMethod === 'wire' && parseInt(amount) < 1000 && (
                  <p className="text-center text-xs text-red-400 mt-2">Bank wire transfers require a minimum of $1,000.</p>
                )}
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
                  <span className="text-2xl font-serif text-white">${parseInt(amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-text text-sm">Payment Method</span>
                  <span className="text-white font-medium text-sm capitalize flex items-center gap-1.5">
                    {paymentMethod === 'cashapp' && 'Cash App'}
                    {paymentMethod === 'crypto' && `Cryptocurrency (${cryptoTab})`}
                    {paymentMethod === 'zelle' && 'Zelle'}
                    {paymentMethod === 'wire' && 'Bank Wire Transfer'}
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
                    {paymentMethod === 'cashapp' && '15 minutes'}
                    {paymentMethod === 'crypto' && '15-45 minutes'}
                    {paymentMethod === 'zelle' && 'Same day'}
                    {paymentMethod === 'wire' && '1-2 business days'}
                  </span>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer group">
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
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      {isUploading ? 'Uploading proof...' : 'Submitting request...'}
                    </>
                  ) : (
                    <>
                      Confirm Deposit <CheckCircle2 size={20} />
                    </>
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab('wallet')}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-navy border border-border-subtle text-white rounded-xl font-bold hover:border-white transition-colors disabled:opacity-50"
                >
                  Cancel
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
             <li className="flex gap-2 isolate"><span className="w-2.5 h-2.5 rounded-full bg-gold/50 shrink-0 mt-1"></span> Cash App: 15 minutes</li>
             <li className="flex gap-2 isolate"><span className="w-2.5 h-2.5 rounded-full bg-gold/50 shrink-0 mt-1"></span> Crypto (BTC/ETH/USDT): 15–45 minutes</li>
             <li className="flex gap-2 isolate"><span className="w-2.5 h-2.5 rounded-full bg-gold/50 shrink-0 mt-1"></span> Zelle: Same day (business hours)</li>
             <li className="flex gap-2 isolate"><span className="w-2.5 h-2.5 rounded-full bg-gold/50 shrink-0 mt-1"></span> Bank Wire: 1–2 business days</li>
          </ul>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs text-gray-text uppercase tracking-wider font-semibold p-4 bg-navy-mid border border-border-subtle rounded-xl">
           <div className="flex items-center gap-1.5"><Lock size={14} className="text-gold" /> 256-bit SSL Encrypted</div>
           <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-gold" /> FinCEN Compliant</div>
           <div className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-gold" /> AML Verified</div>
        </div>
      </div>

    </div>
  );
}
