"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const WITHDRAWAL_METHODS = [
  {
    id: 'bank_transfer',
    label: 'Bank Transfer',
    icon: '🏦',
    color: '#C9A84C',
    description: 'Withdraw to any Nigerian bank account',
    badge: '2-4 hours',
    recommended: true,
  },
  {
    id: 'opay',
    label: 'OPay',
    icon: '🟢',
    color: '#00A651',
    description: 'Withdraw directly to your OPay wallet',
    badge: '⚡ Instant',
  },
  {
    id: 'usdt',
    label: 'USDT (TRC20)',
    icon: '₮',
    color: '#26A17B',
    description: 'For diaspora investors',
    badge: '30-60 min',
  },
  {
    id: 'bitcoin',
    label: 'Bitcoin (BTC)',
    icon: '₿',
    color: '#F7931A',
    description: 'For diaspora investors',
    badge: '30-60 min',
  },
]

const nigerianBanks = [
  "Access Bank", "GTBank", "Zenith Bank", "UBA", "First Bank",
  "OPay", "Moniepoint", "Kuda", "Fidelity Bank", "Union Bank",
  "Wema Bank", "Sterling Bank", "Stanbic IBTC", "Polaris Bank",
  "FCMB", "Ecobank", "Heritage Bank", "Keystone Bank", "Unity Bank"
]

export default function WithdrawPage() {
  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('')
  const [details, setDetails] = useState({
    cashappTag: '',
    zelleEmail: '',
    btcAddress: '',
    usdtAddress: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    accountName: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [submittedRef, setSubmittedRef] = useState('')
  
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [walletBalance, setWalletBalance] = useState<number>(0)
  const [balanceLoading, setBalanceLoading] = useState(true)
  const router = useRouter()

  const quickAmounts = [10000, 50000, 100000, 500000]

  useEffect(() => {
    async function fetchBalance() {
      try {
        const res = await fetch('/api/user/profile')
        if (res.status === 401) {
          router.push('/login')
          return
        }
        if (!res.ok) throw new Error('Failed to load profile')
        const data = await res.json()
        setWalletBalance(parseFloat(data.wallet_balance || '0'))
      } catch (err: any) {
        console.error('Error fetching balance:', err)
        setError('Could not fetch wallet balance')
      } finally {
        setBalanceLoading(false)
      }
    }
    fetchBalance()
  }, [router])

  // Map method changes
  useEffect(() => {
    if (method === 'opay') {
      setDetails(prev => ({ ...prev, bankName: 'OPay' }))
    } else if (method === 'bank_transfer') {
      setDetails(prev => ({ ...prev, bankName: prev.bankName === 'OPay' ? '' : prev.bankName }))
    }
  }, [method])

  // Account auto-verify simulator
  useEffect(() => {
    if ((method === 'bank_transfer' || method === 'opay') && details.accountNumber.length === 10) {
      setVerifying(true)
      setVerified(false)
      const timer = setTimeout(() => {
        setVerifying(false)
        setVerified(true)
        if (!details.accountName) {
          setDetails(prev => ({ ...prev, accountName: 'Chukwuebuka Onyegere' }))
        }
      }, 1200)
      return () => clearTimeout(timer)
    } else {
      setVerified(false)
      setVerifying(false)
    }
  }, [details.accountNumber, method])

  const amtVal = parseFloat(amount) || 0
  const fee = amtVal >= 50000 ? 0 : 100
  const totalPayout = amtVal > 0 ? Math.max(0, amtVal - fee) : 0

  function handleNext() {
    if (step === 1) {
      if (!amount || parseFloat(amount) < 2000) {
        setError('Minimum withdrawal is ₦2,000')
        return
      }
      if (parseFloat(amount) > 5000000) {
        setError('Maximum single withdrawal is ₦5,000,000')
        return
      }
      if (parseFloat(amount) > walletBalance) {
        setError('Amount exceeds your available balance')
        return
      }
      setError('')
      setStep(2)
    } else if (step === 2) {
      if (!method) {
        setError('Please select a withdrawal method')
        return
      }
      setError('')
      setStep(3)
    }
  }

  async function submitWithdrawal() {
    // Basic validation on step 3
    if (method === 'bank_transfer' || method === 'opay') {
      if (!details.bankName) {
        setError('Please select/specify your bank name')
        return
      }
      if (!details.accountNumber || details.accountNumber.length !== 10) {
        setError('Please enter a valid 10-digit account number')
        return
      }
      if (!details.accountName) {
        setError('Please enter the account name')
        return
      }
    } else if (method === 'bitcoin') {
      if (!details.btcAddress) {
        setError('Please enter your Bitcoin wallet address')
        return
      }
    } else if (method === 'usdt') {
      if (!details.usdtAddress) {
        setError('Please enter your USDT TRC20 wallet address')
        return
      }
    }

    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/withdrawals/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          method,
          ...details,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      
      if (data.withdrawalId) {
        setSubmittedRef(`WD-${data.withdrawalId.substring(0, 8).toUpperCase()}`)
      }
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    marginBottom: '12px',
  }

  const labelStyle = {
    display: 'block',
    color: '#8A9BB5',
    fontSize: '11px',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
    marginBottom: '6px',
  }

  if (balanceLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#04091A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        color: '#C9A84C',
        fontSize: '18px',
        fontWeight: 600,
      }}>
        Loading Payout Options...
      </div>
    )
  }

  if (success) {
    const isCrypto = method === 'bitcoin' || method === 'usdt'
    const last4Str = isCrypto
      ? (method === 'bitcoin' ? details.btcAddress : details.usdtAddress).slice(-4)
      : details.accountNumber.slice(-4)
    const targetDest = isCrypto ? 'wallet' : (method === 'opay' ? 'OPay' : details.bankName)
    const arriveTime = isCrypto ? '30-60 minutes' : '2-4 hours'

    const waMsgText = `Hello, I just requested a withdrawal of ₦${parseFloat(amount).toLocaleString()} to ${isCrypto ? (method === 'bitcoin' ? 'Bitcoin' : 'USDT') : (method === 'opay' ? 'OPay' : details.bankName)} (${isCrypto ? (method === 'bitcoin' ? details.btcAddress : details.usdtAddress) : details.accountNumber}). Reference: ${submittedRef}`
    const whatsappUrl = `https://wa.me/2349167455410?text=${encodeURIComponent(waMsgText)}`

    return (
      <div style={{
        minHeight: '100vh',
        background: '#04091A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        <div style={{
          maxWidth: '480px',
          width: '100%',
          background: '#0A1628',
          border: '1px solid rgba(201,168,76,0.3)',
          padding: '48px 40px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>💸</div>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '32px',
            color: '#C9A84C',
            marginBottom: '12px',
          }}>
            Withdrawal Submitted
          </h2>
          <p style={{
            color: '#8A9BB5',
            fontSize: '14px',
            lineHeight: 1.8,
            marginBottom: '24px',
          }}>
            Your withdrawal of <strong style={{ color: '#fff' }}>₦{parseFloat(amount).toLocaleString()}</strong> has been submitted. Funds will arrive in your <strong style={{ color: '#fff' }}>{targetDest}</strong> {isCrypto ? 'address' : 'account'} ending in <strong style={{ color: '#fff' }}>{last4Str}</strong> within {arriveTime}.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              padding: '13px',
              background: '#25D366',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '14px',
              marginBottom: '12px',
              borderRadius: '2px',
            }}
          >
            📲 Notify Admin on WhatsApp
          </a>
          
          <a
            href="/dashboard"
            style={{
              display: 'block',
              padding: '14px',
              background: '#C9A84C',
              color: '#04091A',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '15px',
            }}
          >
            Back to Dashboard →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#04091A',
      padding: '100px 20px 60px',
    }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>

        <div style={{ marginBottom: '28px' }}>
          <a href="/dashboard" style={{
            color: '#8A9BB5', fontSize: '13px', textDecoration: 'none',
          }}>
            ← Back to Dashboard
          </a>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '40px',
            color: '#fff',
            marginTop: '12px',
          }}>
            Withdraw Funds
          </h1>
          <div style={{
            display: 'inline-block',
            marginTop: '8px',
            padding: '8px 16px',
            background: 'rgba(201,168,76,0.08)',
            border: '1px solid rgba(201,168,76,0.2)',
          }}>
            <span style={{ color: '#8A9BB5', fontSize: '12px' }}>Available Balance: </span>
            <span style={{ color: '#C9A84C', fontWeight: 700, fontSize: '16px' }}>
              ₦{walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div style={{
          background: '#0A1628',
          border: '1px solid rgba(255,255,255,0.07)',
          padding: '32px',
          marginBottom: '24px'
        }}>
          {/* STEP 1 — Amount */}
          {step === 1 && (
            <div>
              <h3 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '24px',
                color: '#fff',
                marginBottom: '20px',
              }}>
                How much to withdraw?
              </h3>

              <label style={labelStyle}>Amount (Naira)</label>
              <div style={{ position: 'relative', marginBottom: '8px' }}>
                <span style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#C9A84C', fontSize: '18px', fontWeight: 700,
                }}>₦</span>
                <input
                  suppressHydrationWarning
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="2000"
                  max="5000000"
                  style={{ ...inputStyle, paddingLeft: '36px', fontSize: '20px', marginBottom: 0 }}
                />
              </div>
              <p style={{ color: '#8A9BB5', fontSize: '12px', marginBottom: '16px' }}>
                Min: ₦2,000 · Max: ₦5,000,000
              </p>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {quickAmounts.filter(q => q <= walletBalance && q <= 5000000).map(q => (
                  <button
                    suppressHydrationWarning
                    key={q}
                    onClick={() => setAmount(q.toString())}
                    style={{
                      padding: '7px 14px',
                      background: amount === q.toString()
                        ? '#C9A84C' : 'rgba(255,255,255,0.04)',
                      color: amount === q.toString() ? '#04091A' : '#8A9BB5',
                      border: `1px solid ${amount === q.toString()
                        ? '#C9A84C' : 'rgba(255,255,255,0.07)'}`,
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                      minHeight: '44px',
                      minWidth: '44px',
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <span style={{ pointerEvents: 'none' }}>
                      ₦{q.toLocaleString()}
                    </span>
                  </button>
                ))}
                <button
                  suppressHydrationWarning
                  onClick={() => setAmount(Math.min(walletBalance, 5000000).toString())}
                  style={{
                    padding: '7px 14px',
                    background: 'rgba(201,168,76,0.1)',
                    color: '#C9A84C',
                    border: '1px solid rgba(201,168,76,0.2)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    minHeight: '44px',
                    minWidth: '44px',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <span style={{ pointerEvents: 'none' }}>
                    Withdraw All
                  </span>
                </button>
              </div>

              {error && <p style={{ color: '#ff4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
              <button suppressHydrationWarning onClick={handleNext} style={{
                width: '100%', padding: '14px',
                background: '#C9A84C', color: '#04091A',
                fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '15px',
                minHeight: '48px', minWidth: '48px',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                position: 'relative', zIndex: 1,
              }}>
                <span style={{ pointerEvents: 'none' }}>
                  Continue →
                </span>
              </button>
            </div>
          )}

          {/* STEP 2 — Method */}
          {step === 2 && (
            <div>
              <h3 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '24px', color: '#fff', marginBottom: '8px',
              }}>
                How should we pay you?
              </h3>
              <p style={{ color: '#8A9BB5', fontSize: '13px', marginBottom: '20px' }}>
                Withdrawing: <strong style={{ color: '#C9A84C' }}>
                  ₦{parseFloat(amount).toLocaleString()}
                </strong>
              </p>

              {WITHDRAWAL_METHODS.map(m => (
                <div
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setMethod(m.id)
                    }
                  }}
                  style={{
                    padding: '14px 16px',
                    border: `1px solid ${method === m.id
                      ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.07)'}`,
                    background: method === m.id
                      ? 'rgba(201,168,76,0.05)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                    minHeight: '64px',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                  }}
                >
                  <div style={{ pointerEvents: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '20px' }}>{m.icon}</span>
                      <div>
                        <p style={{ color: '#fff', fontWeight: 600, fontSize: '14px', margin: 0 }}>
                          {m.label} {m.recommended && <span style={{ color: '#C9A84C', fontSize: '11px', background: 'rgba(201,168,76,0.1)', padding: '2px 6px', marginLeft: '6px', fontWeight: 700 }}>Recommended</span>}
                        </p>
                        <p style={{ color: '#8A9BB5', fontSize: '12px', margin: '2px 0 0' }}>
                          {m.description}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: m.color, fontSize: '12px', fontWeight: 600, background: `${m.color}15`, padding: '2px 8px', borderRadius: '4px' }}>
                        {m.badge}
                      </span>
                      <div style={{
                        width: '18px', height: '18px', borderRadius: '50%',
                        border: `2px solid ${method === m.id ? '#C9A84C' : 'rgba(255,255,255,0.2)'}`,
                        background: method === m.id ? '#C9A84C' : 'transparent',
                      }} />
                    </div>
                  </div>
                </div>
              ))}

              {error && <p style={{ color: '#ff4444', fontSize: '13px', margin: '12px 0' }}>{error}</p>}
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button suppressHydrationWarning onClick={() => setStep(1)} style={{
                  flex: 1, padding: '13px', background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#8A9BB5', cursor: 'pointer',
                  minHeight: '48px', minWidth: '48px',
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                  position: 'relative', zIndex: 1,
                }}>
                  <span style={{ pointerEvents: 'none' }}>
                    ← Back
                  </span>
                </button>
                <button suppressHydrationWarning onClick={handleNext} style={{
                  flex: 2, padding: '13px', background: '#C9A84C',
                  color: '#04091A', fontWeight: 700, border: 'none', cursor: 'pointer',
                  minHeight: '48px', minWidth: '48px',
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                  position: 'relative', zIndex: 1,
                }}>
                  <span style={{ pointerEvents: 'none' }}>
                    Continue →
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Details */}
          {step === 3 && (
            <div>
              <h3 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '24px', color: '#fff', marginBottom: '20px',
              }}>
                Enter Your Payout Details
              </h3>

              {method === 'opay' && (
                <div>
                  <label style={labelStyle}>Bank Name</label>
                  <input
                    suppressHydrationWarning
                    type="text"
                    value="OPay"
                    disabled
                    style={{ ...inputStyle, opacity: 0.7 }}
                  />
                  <label style={labelStyle}>Your OPay Account Number (Phone)</label>
                  <input
                    suppressHydrationWarning
                    type="text"
                    maxLength={10}
                    placeholder="e.g. 9016745541"
                    value={details.accountNumber}
                    onChange={e => setDetails({ ...details, accountNumber: e.target.value.replace(/\D/g, '') })}
                    style={inputStyle}
                  />
                  <label style={labelStyle}>Account Name</label>
                  <input
                    suppressHydrationWarning
                    type="text"
                    placeholder="Holder's full name"
                    value={details.accountName}
                    onChange={e => setDetails({ ...details, accountName: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              )}

              {method === 'bank_transfer' && (
                <div>
                  <label style={labelStyle}>Bank Name</label>
                  <select
                    suppressHydrationWarning
                    value={details.bankName}
                    onChange={e => setDetails({ ...details, bankName: e.target.value })}
                    style={{ ...inputStyle, background: '#04091A' }}
                  >
                    <option value="">Select your bank</option>
                    {nigerianBanks.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  
                  <label style={labelStyle}>Account Number</label>
                  <input
                    suppressHydrationWarning
                    type="text"
                    maxLength={10}
                    placeholder="10-digit account number"
                    value={details.accountNumber}
                    onChange={e => setDetails({ ...details, accountNumber: e.target.value.replace(/\D/g, '') })}
                    style={inputStyle}
                  />

                  <label style={labelStyle}>Account Holder Name</label>
                  <input
                    suppressHydrationWarning
                    type="text"
                    placeholder="Full name on account"
                    value={details.accountName}
                    onChange={e => setDetails({ ...details, accountName: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              )}

              {verifying && (
                <p style={{ color: '#C9A84C', fontSize: '12px', margin: '-8px 0 12px', fontStyle: 'italic' }}>
                  🔍 Verifying account details with bank...
                </p>
              )}
              {verified && (
                <p style={{ color: '#27C574', fontSize: '12px', margin: '-8px 0 12px', fontWeight: 600 }}>
                  ✅ Account Verified: {details.accountName}
                </p>
              )}

              {method === 'bitcoin' && (
                <div>
                  <label style={labelStyle}>Your Bitcoin (BTC) Wallet Address</label>
                  <input
                    suppressHydrationWarning
                    type="text"
                    placeholder="Your BTC wallet address"
                    value={details.btcAddress}
                    onChange={e => setDetails({ ...details, btcAddress: e.target.value })}
                    style={inputStyle}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', marginTop: '-4px' }}>
                    <input
                      type="checkbox"
                      id="btcNetworkConfirm"
                      required
                      defaultChecked
                      style={{ accentColor: '#F7931A' }}
                    />
                    <label htmlFor="btcNetworkConfirm" style={{ color: '#8A9BB5', fontSize: '12px', cursor: 'pointer' }}>
                      Confirm native Bitcoin network address
                    </label>
                  </div>
                </div>
              )}

              {method === 'usdt' && (
                <div>
                  <label style={labelStyle}>Your USDT TRC20 Wallet Address</label>
                  <input
                    suppressHydrationWarning
                    type="text"
                    placeholder="Your USDT TRC20 address"
                    value={details.usdtAddress}
                    onChange={e => setDetails({ ...details, usdtAddress: e.target.value })}
                    style={inputStyle}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', marginTop: '-4px' }}>
                    <input
                      type="checkbox"
                      id="networkConfirm"
                      required
                      defaultChecked
                      style={{ accentColor: '#26A17B' }}
                    />
                    <label htmlFor="networkConfirm" style={{ color: '#8A9BB5', fontSize: '12px', cursor: 'pointer' }}>
                      Confirm USDT TRC20 network (Only send TRON/TRC20 assets)
                    </label>
                  </div>
                </div>
              )}

              {/* Summary */}
              <div style={{
                background: 'rgba(201,168,76,0.05)',
                border: '1px solid rgba(201,168,76,0.15)',
                padding: '16px',
                marginBottom: '20px',
              }}>
                <p style={{ color: '#8A9BB5', fontSize: '12px', marginBottom: '8px' }}>
                  WITHDRAWAL SUMMARY
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#8A9BB5', fontSize: '13px' }}>Amount</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>
                    ₦{parseFloat(amount).toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#8A9BB5', fontSize: '13px' }}>Processing Fee</span>
                  <span style={{ color: fee === 0 ? '#27C574' : '#fff', fontWeight: 600 }}>
                    {fee === 0 ? 'Free' : `₦${fee}`}
                  </span>
                </div>
                <hr style={{ border: '0', borderTop: '1px solid rgba(255,255,255,0.07)', margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#8A9BB5', fontSize: '13px' }}>Total Payout</span>
                  <span style={{ color: '#C9A84C', fontWeight: 700, fontSize: '16px' }}>
                    ₦{totalPayout.toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8A9BB5', fontSize: '13px' }}>Processing Time</span>
                  <span style={{ color: '#27C574', fontSize: '13px' }}>
                    {WITHDRAWAL_METHODS.find(m => m.id === method)?.badge || '24-48 hours'}
                  </span>
                </div>
              </div>

              {error && (
                <p style={{
                  color: '#ff4444', fontSize: '13px', marginBottom: '12px',
                  padding: '10px', background: 'rgba(255,68,68,0.08)',
                }}>
                  {error}
                </p>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button suppressHydrationWarning onClick={() => setStep(2)} style={{
                  flex: 1, padding: '13px', background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#8A9BB5', cursor: 'pointer',
                  minHeight: '48px', minWidth: '48px',
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                  position: 'relative', zIndex: 1,
                }}>
                  <span style={{ pointerEvents: 'none' }}>
                    ← Back
                  </span>
                </button>
                <button
                  suppressHydrationWarning
                  onClick={submitWithdrawal}
                  disabled={loading}
                  style={{
                    flex: 2, padding: '13px',
                    background: loading ? 'rgba(201,168,76,0.5)' : '#C9A84C',
                    color: '#04091A', fontWeight: 700,
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    minHeight: '48px', minWidth: '48px',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                    position: 'relative', zIndex: 1,
                  }}
                >
                  <span style={{ pointerEvents: 'none' }}>
                    {loading ? 'Submitting...' : '✓ Submit Withdrawal Request'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* WITHDRAWAL RULES CONTAINER */}
        <div style={{
          background: '#060C1C',
          border: '1px solid rgba(255,255,255,0.04)',
          padding: '24px',
          color: '#8A9BB5',
          fontSize: '13px',
          lineHeight: 1.7,
        }}>
          <h4 style={{
            color: '#fff',
            fontWeight: 700,
            fontSize: '14px',
            marginTop: 0,
            marginBottom: '12px',
            fontFamily: 'Cormorant Garamond, serif',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            Withdrawal Rules & Guidelines
          </h4>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li>Minimum withdrawal: <strong style={{ color: '#fff' }}>₦5,000</strong></li>
            <li>Withdrawals processed <strong style={{ color: '#fff' }}>Monday-Saturday, 9am-7pm WAT</strong></li>
            <li>Bank transfers: <strong style={{ color: '#fff' }}>2-4 hours</strong> during business hours</li>
            <li>OPay to OPay: <strong style={{ color: '#fff' }}>instant</strong></li>
            <li>Crypto withdrawals: <strong style={{ color: '#fff' }}>24/7, 30-60 minutes</strong></li>
            <li>Early exit from active plan: <strong style={{ color: '#ff4444' }}>10% penalty</strong> applies</li>
            <li><strong style={{ color: '#fff' }}>KYC verification required</strong> before first withdrawal</li>
          </ul>
        </div>

        <p style={{
          textAlign: 'center', color: '#8A9BB5',
          fontSize: '12px', marginTop: '24px',
        }}>
          🔐 Secured · Withdrawals reviewed within 24 hours
        </p>
      </div>
    </div>
  )
}
