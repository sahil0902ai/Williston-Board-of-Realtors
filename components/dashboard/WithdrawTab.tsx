"use client";
import { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, Building, ChevronDown, ChevronUp, Lock, ArrowUpRight, Loader2 } from 'lucide-react';

interface WithdrawTabProps {
  setActiveTab: (tab: string) => void;
  profile: any;
  fetchProfile: () => void;
}

export default function WithdrawTab({ setActiveTab, profile, fetchProfile }: WithdrawTabProps) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState<'bank' | 'opay' | 'crypto'>('bank');
  
  // Bank details
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [sortCode, setSortCode] = useState('');
  const [accountName, setAccountName] = useState('');
  
  // Opay details
  const [opayPhone, setOpayPhone] = useState('');
  const [opayName, setOpayName] = useState('');

  // Crypto details
  const [cryptoCoin, setCryptoCoin] = useState<'BTC' | 'USDT'>('USDT');
  const [cryptoAddress, setCryptoAddress] = useState('');

  const [pin, setPin] = useState(['', '', '', '']);
  const [rulesExpanded, setRulesExpanded] = useState(false);
  
  // Status States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [refNumber, setRefNumber] = useState('');

  const availableBalance = parseFloat(profile?.wallet_balance || '0');
  const pinRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const handleAmountSelect = (val: string) => {
    setAmount(val);
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    
    if (value && index < 3) {
      pinRefs[index + 1].current?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
  };

  const handleSubmitWithdrawal = async () => {
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/withdrawals/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          method: payoutMethod === 'crypto' ? (cryptoCoin === 'BTC' ? 'bitcoin' : 'usdt') : payoutMethod,
          bankName: payoutMethod === 'bank' ? bankName : (payoutMethod === 'opay' ? 'Opay' : undefined),
          accountNumber: payoutMethod === 'bank' ? accountNumber : (payoutMethod === 'opay' ? opayPhone : undefined),
          routingNumber: payoutMethod === 'bank' ? sortCode : (payoutMethod === 'opay' ? 'Opay' : undefined),
          accountName: payoutMethod === 'bank' ? accountName : (payoutMethod === 'opay' ? opayName : undefined),
          btcAddress: payoutMethod === 'crypto' && cryptoCoin === 'BTC' ? cryptoAddress : undefined,
          usdtAddress: payoutMethod === 'crypto' && cryptoCoin === 'USDT' ? cryptoAddress : undefined,
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit withdrawal request');
      }

      setRefNumber(`WD-${data.withdrawalId.substring(0, 8).toUpperCase()}`);
      fetchProfile(); // Refresh balance in dashboard
      setStep(5); // Advance to success step

    } catch (err: any) {
      console.error('Submit withdrawal error:', err);
      setErrorMsg(err.message || 'An error occurred during submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 5) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-navy-mid border border-border-subtle rounded-2xl p-8 md:p-12 text-center relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="w-20 h-20 bg-gold/20 flex items-center justify-center rounded-full text-gold mb-6 relative z-10">
             <div className="w-12 h-12 bg-gold flex items-center justify-center rounded-full text-navy animate-bounce">
               <CheckCircle2 size={32} />
             </div>
          </div>
          
          <h2 className="text-3xl font-serif text-white mb-2 relative z-10">Withdrawal Request Submitted</h2>
          <p className="text-gray-text max-w-md mx-auto mb-6 relative z-10">
            Funds will be credited via your selected payout method shortly.
          </p>
          
          <div className="bg-navy border border-border-subtle rounded-xl p-4 w-full max-w-sm mb-8 relative z-10">
            <div className="text-xs text-gray-text uppercase tracking-widest mb-1">Reference Number</div>
            <div className="font-mono text-lg text-white">{refNumber || 'WD-PENDING'}</div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md relative z-10">
            <button 
              onClick={() => setActiveTab('wallet')}
              className="flex-1 px-6 py-3 bg-navy-light border border-border-subtle rounded-xl text-white font-medium hover:border-gold hover:text-gold transition-colors"
            >
              View Transactions
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
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Top Balance */}
      <div className="bg-navy-mid border border-border-subtle rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-[40px] pointer-events-none"></div>
        <div>
           <div className="text-gray-text text-sm mb-1">Available Balance</div>
           <div className="text-4xl font-serif text-gold">₦{availableBalance.toLocaleString()}</div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-3 flex flex-col items-center md:items-end w-full md:w-auto">
          <div className="text-xs text-gray-text flex items-center gap-1.5"><ArrowUpRight size={14} className="text-yellow-500" /> Secure platform</div>
          <div className="text-yellow-500 font-medium">CBN Compliant <span className="text-[10px] text-gray-text font-normal">(Verified)</span></div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-between items-center relative mb-8 px-2 md:px-0">
         <div className="absolute left-[5%] right-[5%] top-1/2 -translate-y-1/2 h-px bg-border-subtle -z-10"></div>
         <div className="absolute left-[5%] top-1/2 -translate-y-1/2 h-px bg-gold transition duration-500 -z-10" style={{ width: step === 1 ? '5%' : step === 2 ? '35%' : step === 3 ? '65%' : '90%' }}></div>
         
         {[
           { num: 1, label: 'Amount' },
           { num: 2, label: 'Bank' },
           { num: 3, label: 'Verify' },
           { num: 4, label: 'Confirm' }
         ].map((s) => (
           <div key={s.num} className="flex flex-col items-center gap-2 bg-navy px-2 z-10 w-16 md:w-20">
             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s.num ? 'bg-gold text-navy' : 'bg-navy-light text-gray-text border border-border-subtle'}`}>
               {step > s.num ? <CheckCircle2 size={16} /> : s.num}
             </div>
             <span className={`text-[10px] md:text-xs font-medium uppercase tracking-wider text-center ${step >= s.num ? 'text-gold' : 'text-gray-text'}`}>{s.label}</span>
           </div>
         ))}
      </div>

      <div className="bg-navy-mid border border-border-subtle rounded-2xl overflow-hidden relative shadow-lg">
        <div className="p-6 md:p-8">
          
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-950/20 border border-red-500/20 rounded-xl text-red-400 text-sm">
              ⚠️ {errorMsg}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
               <div>
                 <h3 className="text-xl font-serif mb-1">Enter Withdrawal Amount</h3>
                 <p className="text-sm text-gray-text">How much would you like to withdraw?</p>
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
               </div>

               <div className="space-y-3">
                 <label className="text-sm text-gray-text font-medium block">Quick Amounts</label>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                   {[
                      { label: '₦10,000', val: '10000' }, 
                      { label: '₦50,000', val: '50000' }, 
                      { label: '₦100,000', val: '100000' }, 
                      { label: 'Withdraw All', val: availableBalance.toString() }
                   ].map(btn => (
                     <button 
                       key={btn.val}
                       onClick={() => handleAmountSelect(btn.val)}
                       className={`py-3 px-2 rounded-lg border text-sm font-medium transition-colors ${amount === btn.val ? 'bg-gold/10 border-gold text-gold' : 'bg-navy border-border-subtle text-gray-text hover:text-white hover:border-gray-500'}`}
                     >
                       {btn.label}
                     </button>
                   ))}
                 </div>
               </div>

               <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3 text-sm">
                  <AlertTriangle size={20} className="text-yellow-500 shrink-0" />
                  <div className="text-yellow-500 space-y-1">
                     <p className="font-medium">Minimum withdrawal: ₦5,000</p>
                     <p className="text-xs opacity-80">Processing time varies by payout method</p>
                  </div>
               </div>

               <div className="pt-2">
                 <button 
                   onClick={handleNext}
                   disabled={!amount || parseInt(amount) < 5000 || parseInt(amount) > availableBalance || parseInt(amount) > 10000000}
                   className="w-full py-4 bg-gold text-navy rounded-xl font-bold text-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                 >
                   Continue <ArrowRight size={20} />
                 </button>
                 {parseInt(amount) > availableBalance && (
                    <p className="text-red-400 text-xs text-center mt-2">Insufficient balance</p>
                 )}
                 {parseInt(amount) > 10000000 && (
                    <p className="text-red-400 text-xs text-center mt-2">Maximum single withdrawal is ₦10,000,000</p>
                 )}
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
                  <h3 className="text-xl font-serif mb-1">Payout Method</h3>
                  <p className="text-sm text-gray-text">Select how you want to receive your funds.</p>
                </div>
              </div>

              <div className="space-y-4">
                 
                 {/* Local Bank Transfer */}
                 <div 
                   className={`border rounded-xl p-5 cursor-pointer transition ${payoutMethod === 'bank' ? 'bg-gold/5 border-gold shadow-[0_0_15px_rgba(201,168,76,0.1)]' : 'bg-navy border-border-subtle hover:border-gray-500'}`}
                   onClick={() => setPayoutMethod('bank')}
                 >
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-navy-light flex items-center justify-center border border-border-subtle shrink-0">
                         <Building size={20} className="text-white" />
                      </div>
                      <div>
                         <h4 className="font-medium text-white mb-1 flex items-center gap-2">Local Bank Transfer</h4>
                         <p className="text-xs text-gray-text">Processing: 1-2 business days</p>
                      </div>
                      <div className="ml-auto w-5 h-5 rounded-full border border-border-subtle flex items-center justify-center transition-colors">
                         {payoutMethod === 'bank' && <div className="w-3 h-3 bg-gold rounded-full"></div>}
                      </div>
                   </div>
                   {payoutMethod === 'bank' && (
                     <div className="mt-4 pt-4 border-t border-border-subtle space-y-4 animate-in fade-in slide-in-from-top-2" onClick={(e) => e.stopPropagation()}>
                       <div className="space-y-1.5">
                         <label className="text-xs text-gray-text">Bank Name</label>
                         <input 
                           type="text" 
                           value={bankName}
                           onChange={(e) => setBankName(e.target.value)}
                           className="w-full bg-navy border border-border-subtle rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-gold"
                           placeholder="e.g. GTBank, Access Bank, Zenith Bank"
                         />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1.5">
                           <label className="text-xs text-gray-text">Account Number</label>
                           <input 
                             type="text" 
                             value={accountNumber}
                             onChange={(e) => setAccountNumber(e.target.value)}
                             className="w-full bg-navy border border-border-subtle rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-gold font-mono"
                             placeholder="10 digits"
                             maxLength={10}
                           />
                         </div>
                         <div className="space-y-1.5">
                           <label className="text-xs text-gray-text">Sort Code / Routing</label>
                           <input 
                             type="text" 
                             value={sortCode}
                             onChange={(e) => setSortCode(e.target.value)}
                             className="w-full bg-navy border border-border-subtle rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-gold font-mono"
                             placeholder="Sort Code"
                           />
                         </div>
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-xs text-gray-text">Account Name</label>
                         <input 
                           type="text" 
                           value={accountName}
                           onChange={(e) => setAccountName(e.target.value)}
                           className="w-full bg-navy border border-border-subtle rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-gold"
                           placeholder="Full name on account"
                         />
                       </div>
                     </div>
                   )}
                 </div>

                 {/* Opay Payout */}
                 <div 
                   className={`border rounded-xl p-5 cursor-pointer transition ${payoutMethod === 'opay' ? 'bg-gold/5 border-gold shadow-[0_0_15px_rgba(201,168,76,0.1)]' : 'bg-navy border-border-subtle hover:border-gray-500'}`}
                   onClick={() => setPayoutMethod('opay')}
                 >
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-navy-light flex items-center justify-center border border-border-subtle shrink-0 font-serif italic text-xl text-green-400">
                         OP
                      </div>
                      <div>
                         <h4 className="font-medium text-white mb-1">Opay Transfer</h4>
                         <p className="text-xs text-gray-text">Processing: Within 2 hours</p>
                      </div>
                      <div className="ml-auto w-5 h-5 rounded-full border border-border-subtle flex items-center justify-center transition-colors">
                         {payoutMethod === 'opay' && <div className="w-3 h-3 bg-gold rounded-full"></div>}
                      </div>
                   </div>
                   {payoutMethod === 'opay' && (
                     <div className="mt-4 pt-4 border-t border-border-subtle space-y-4 animate-in fade-in slide-in-from-top-2" onClick={(e) => e.stopPropagation()}>
                       <div className="space-y-1.5">
                         <label className="text-xs text-gray-text block mb-1.5">Opay Account / Phone Number</label>
                         <input 
                           type="text" 
                           value={opayPhone}
                           onChange={(e) => setOpayPhone(e.target.value)}
                           className="w-full bg-navy border border-border-subtle rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-gold"
                           placeholder="Opay account number"
                         />
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-xs text-gray-text block mb-1.5">Account Name</label>
                         <input 
                           type="text" 
                           value={opayName}
                           onChange={(e) => setOpayName(e.target.value)}
                           className="w-full bg-navy border border-border-subtle rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-gold"
                           placeholder="Account owner's name"
                         />
                       </div>
                     </div>
                   )}
                 </div>

                 {/* Crypto */}
                 <div 
                   className={`border rounded-xl p-5 cursor-pointer transition ${payoutMethod === 'crypto' ? 'bg-gold/5 border-gold shadow-[0_0_15px_rgba(201,168,76,0.1)]' : 'bg-navy border-border-subtle hover:border-gray-500'}`}
                   onClick={() => setPayoutMethod('crypto')}
                 >
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-navy-light flex items-center justify-center border border-border-subtle shrink-0">
                         <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs">₿</div>
                      </div>
                      <div>
                         <h4 className="font-medium text-white mb-1">Crypto Withdrawal</h4>
                         <p className="text-xs text-gray-text">Processing: 30-60 mins</p>
                      </div>
                      <div className="ml-auto w-5 h-5 rounded-full border border-border-subtle flex items-center justify-center transition-colors">
                         {payoutMethod === 'crypto' && <div className="w-3 h-3 bg-gold rounded-full"></div>}
                      </div>
                   </div>
                   {payoutMethod === 'crypto' && (
                     <div className="mt-4 pt-4 border-t border-border-subtle space-y-4 animate-in fade-in slide-in-from-top-2" onClick={(e) => e.stopPropagation()}>
                       {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && cryptoCoin === 'BTC' && (
                         <div className="text-xs text-green-400 font-medium">Estimated payout: {(parseFloat(amount) / 1600 / 64300).toFixed(6)} BTC (at ₦1,600/$)</div>
                       )}
                       {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && cryptoCoin === 'USDT' && (
                         <div className="text-xs text-green-400 font-medium">Estimated payout: {(parseFloat(amount) / 1600).toFixed(2)} USDT (at ₦1,600/$)</div>
                       )}
                       <div className="space-y-1.5">
                         <label className="text-xs text-gray-text">Select Asset</label>
                         <div className="relative">
                            <select 
                              value={cryptoCoin} 
                              onChange={(e) => setCryptoCoin(e.target.value as any)}
                              className="w-full bg-navy border border-border-subtle rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-gold appearance-none"
                            >
                               <option value="USDT">Tether (USDT TRC20)</option>
                               <option value="BTC">Bitcoin (BTC)</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-text pointer-events-none" />
                         </div>
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-xs text-gray-text">Wallet Address</label>
                         <input 
                           type="text" 
                           value={cryptoAddress}
                           onChange={(e) => setCryptoAddress(e.target.value)}
                           className="w-full bg-navy border border-border-subtle rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-gold font-mono"
                           placeholder="Enter your receiving wallet address"
                         />
                       </div>
                     </div>
                   )}
                 </div>

              </div>

              <div className="pt-4">
                <button 
                  onClick={handleNext}
                  disabled={
                    (payoutMethod === 'bank' && (!bankName || !accountNumber || !sortCode || !accountName)) ||
                    (payoutMethod === 'opay' && (!opayPhone || !opayName)) ||
                    (payoutMethod === 'crypto' && (!cryptoAddress || parseFloat(amount) < 5000))
                  }
                  className="w-full py-4 bg-gold text-navy rounded-xl font-bold text-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight size={20} />
                </button>
                {payoutMethod === 'crypto' && parseFloat(amount) < 5000 && (
                   <p className="text-red-400 text-xs text-center mt-2">Minimum crypto withdrawal is ₦5,000</p>
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
                  <h3 className="text-xl font-serif mb-1">Security Verification</h3>
                  <p className="text-sm text-gray-text">Enter your 4-digit transaction PIN.</p>
                </div>
              </div>

              <div className="flex justify-center gap-4 py-8">
                 {pin.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={pinRefs[idx]}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(idx, e.target.value)}
                      onKeyDown={(e) => handlePinKeyDown(idx, e)}
                      className="w-14 h-16 bg-navy border border-border-subtle rounded-xl text-center text-2xl text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition"
                    />
                 ))}
              </div>

              <div className="text-center space-y-4">
                 <button className="text-sm text-gold hover:underline">Forgot PIN?</button>
                 <div className="text-xs text-gray-text">
                    Alternative: <button className="text-white hover:text-gold transition-colors">Use OTP verification on file</button>
                 </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleNext}
                  disabled={pin.some(p => !p)}
                  className="w-full py-4 bg-gold text-navy rounded-xl font-bold text-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Verify <CheckCircle2 size={20} />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <button onClick={handleBack} className="p-2 bg-navy rounded-lg border border-border-subtle text-gray-text hover:text-white transition-colors">
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <h3 className="text-xl font-serif mb-1">Confirm Withdrawal</h3>
                  <p className="text-sm text-gray-text">Please review details before proceeding.</p>
                </div>
              </div>

              <div className="bg-navy border border-border-subtle rounded-xl overflow-hidden shadow">
                 <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-border-subtle">
                       <span className="text-gray-text text-sm">Withdrawal Amount</span>
                       <span className="font-serif text-2xl text-white">₦{parseInt(amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-gray-text text-sm">Method</span>
                       <span className="text-white text-sm font-medium">
                         {payoutMethod === 'bank' ? 'Bank Transfer' : 
                          payoutMethod === 'opay' ? 'Opay Transfer' : 
                          `Crypto (${cryptoCoin})`}
                       </span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-border-subtle bg">
                       <span className="text-gray-text text-sm">Destination</span>
                       <span className="text-white text-sm font-medium truncate max-w-[200px] text-right font-mono text-xs">
                         {payoutMethod === 'bank' ? `${bankName} (${accountNumber})` :
                          payoutMethod === 'opay' ? `Opay (${opayPhone})` :
                          cryptoAddress}
                       </span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-gray-text text-sm">Processing Fee</span>
                       <span className="text-green-400 text-sm font-medium">₦0 (Free)</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                       <span className="text-gray-text text-sm">Expected Arrival</span>
                       <span className="text-gold text-sm font-medium">
                         {payoutMethod === 'bank' ? '1-2 business days' : 
                          payoutMethod === 'opay' ? 'Within 2 hours' : 
                          '30-60 minutes'}
                       </span>
                    </div>
                 </div>
                 <div className="bg-navy-light/50 p-6 border-t border-border-subtle flex justify-between items-center">
                    <span className="text-white font-medium uppercase tracking-wider text-xs">You Receive</span>
                    <span className="font-serif text-3xl text-gold">₦{parseInt(amount).toLocaleString()}</span>
                 </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button 
                  onClick={handleSubmitWithdrawal}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gold text-navy rounded-xl font-bold text-lg hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gold/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Submitting request...
                    </>
                  ) : (
                    <>
                      Confirm Withdrawal <ArrowUpRight size={20} />
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

      {/* Withdrawal Rules */}
      <div className="bg-navy-mid border border-border-subtle rounded-xl overflow-hidden mt-6">
         <button 
            className="w-full p-5 flex items-center justify-between text-left hover:bg-navy-light/50 transition-colors"
            onClick={() => setRulesExpanded(!rulesExpanded)}
         >
            <div className="flex items-center gap-2 text-white font-serif text-lg">
               <Lock size={18} className="text-gold" /> Withdrawal Rules & Guidelines
            </div>
            {rulesExpanded ? <ChevronUp size={20} className="text-gray-text" /> : <ChevronDown size={20} className="text-gray-text" />}
         </button>
         
         {rulesExpanded && (
            <div className="p-5 pt-0 text-sm text-gray-text border-t border-border-subtle bg-navy/30">
               <ul className="space-y-3 mt-4 ml-2">
                  <li className="flex gap-3 isolate"><div className="w-1.5 h-1.5 rounded-full bg-gold/50 shrink-0 mt-1.5"></div> Minimum withdrawal: ₦5,000</li>
                  <li className="flex gap-3 isolate"><div className="w-1.5 h-1.5 rounded-full bg-gold/50 shrink-0 mt-1.5"></div> Maximum single withdrawal: ₦10,000,000</li>
                  <li className="flex gap-3 isolate"><div className="w-1.5 h-1.5 rounded-full bg-gold/50 shrink-0 mt-1.5"></div> Withdrawals processed Monday–Friday, 9am–5pm WAT</li>
                  <li className="flex gap-3 isolate"><div className="w-1.5 h-1.5 rounded-full bg-gold/50 shrink-0 mt-1.5"></div> Crypto withdrawals: 24/7</li>
                  <li className="flex gap-3 isolate"><div className="w-1.5 h-1.5 rounded-full bg-gold/50 shrink-0 mt-1.5"></div> Opay: business hours only</li>
                  <li className="flex gap-3 isolate"><div className="w-1.5 h-1.5 rounded-full bg-gold/50 shrink-0 mt-1.5"></div> Local Bank Transfer: 1–2 business days</li>
                  <li className="flex gap-3 isolate"><div className="w-1.5 h-1.5 rounded-full bg-gold/50 shrink-0 mt-1.5"></div> Early exit from active plan: 10% penalty applies</li>
               </ul>
            </div>
         )}
      </div>

    </div>
  );
}
