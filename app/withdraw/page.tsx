"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
  
  const [walletBalance, setWalletBalance] = useState<number>(0)
  const [balanceLoading, setBalanceLoading] = useState(true)
  const router = useRouter()

  const quickAmounts = [100, 500, 1000, 2000]

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

  function handleNext() {
    if (step === 1) {
      if (!amount || parseFloat(amount) < 100) {
        setError('Minimum withdrawal is $100')
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
            Your withdrawal of{' '}
            <strong style={{ color: '#fff' }}>
              ${parseFloat(amount).toLocaleString()}
            </strong>{' '}
            is being processed. Funds arrive within{' '}
            <strong style={{ color: '#fff' }}>24-48 hours</strong>.
          </p>
          
          <a
            href="https://t.me/willistonboardofrealtors"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              padding: '12px',
              background: 'rgba(201,168,76,0.08)',
              border: '1px solid rgba(201,168,76,0.2)',
              color: '#C9A84C',
              textDecoration: 'none',
              fontSize: '14px',
              marginBottom: '12px',
            }}
          >
            ✈️ Track on Telegram: @willistonboardofrealtors
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
              ${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div style={{
          background: '#0A1628',
          border: '1px solid rgba(255,255,255,0.07)',
          padding: '32px',
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

              <label style={labelStyle}>Amount (USD)</label>
              <div style={{ position: 'relative', marginBottom: '8px' }}>
                <span style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#C9A84C', fontSize: '18px', fontWeight: 700,
                }}>$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="100"
                  max={walletBalance}
                  style={{ ...inputStyle, paddingLeft: '36px', fontSize: '20px', marginBottom: 0 }}
                />
              </div>
              <p style={{ color: '#8A9BB5', fontSize: '12px', marginBottom: '16px' }}>
                Min: $100 · Max: ${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {quickAmounts.filter(q => q <= walletBalance).map(q => (
                  <button
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
                    }}
                  >
                    ${q.toLocaleString()}
                  </button>
                ))}
                <button
                  onClick={() => setAmount(walletBalance.toString())}
                  style={{
                    padding: '7px 14px',
                    background: 'rgba(201,168,76,0.1)',
                    color: '#C9A84C',
                    border: '1px solid rgba(201,168,76,0.2)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  Withdraw All
                </button>
              </div>

              {error && <p style={{ color: '#ff4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
              <button onClick={handleNext} style={{
                width: '100%', padding: '14px',
                background: '#C9A84C', color: '#04091A',
                fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '15px',
              }}>Continue →</button>
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
                  ${parseFloat(amount).toLocaleString()}
                </strong>
              </p>

              {[
                { id: 'cashapp', label: 'Cash App', icon: '$', desc: 'Fastest — usually within 2 hours' },
                { id: 'zelle', label: 'Zelle', desc: 'Same business day' },
                { id: 'bitcoin', label: 'Bitcoin (BTC)', desc: '30-60 minutes after approval' },
                { id: 'usdt', label: 'USDT (TRC20)', desc: '30-60 minutes after approval' },
                { id: 'bank', label: 'Bank Transfer (ACH)', desc: '2-3 business days' },
              ].map(m => (
                <div
                  key={m.id}
                  onClick={() => setMethod(m.id)}
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
                  }}
                >
                  <div>
                    <p style={{ color: '#fff', fontWeight: 600, fontSize: '14px', margin: 0 }}>
                      {m.label}
                    </p>
                    <p style={{ color: '#8A9BB5', fontSize: '12px', margin: '2px 0 0' }}>
                      {m.desc}
                    </p>
                  </div>
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%',
                    border: `2px solid ${method === m.id ? '#C9A84C' : 'rgba(255,255,255,0.2)'}`,
                    background: method === m.id ? '#C9A84C' : 'transparent',
                  }} />
                </div>
              ))}

              {error && <p style={{ color: '#ff4444', fontSize: '13px', margin: '12px 0' }}>{error}</p>}
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button onClick={() => setStep(1)} style={{
                  flex: 1, padding: '13px', background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#8A9BB5', cursor: 'pointer',
                }}>← Back</button>
                <button onClick={handleNext} style={{
                  flex: 2, padding: '13px', background: '#C9A84C',
                  color: '#04091A', fontWeight: 700, border: 'none', cursor: 'pointer',
                }}>Continue →</button>
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

              {method === 'cashapp' && (
                <div>
                  <label style={labelStyle}>Your Cash App $Cashtag</label>
                  <input
                    type="text"
                    placeholder="$YourCashTag"
                    value={details.cashappTag}
                    onChange={e => setDetails({ ...details, cashappTag: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              )}

              {method === 'zelle' && (
                <div>
                  <label style={labelStyle}>Your Zelle Email or Phone</label>
                  <input
                    type="text"
                    placeholder="your@email.com or phone number"
                    value={details.zelleEmail}
                    onChange={e => setDetails({ ...details, zelleEmail: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              )}

              {method === 'bitcoin' && (
                <div>
                  <label style={labelStyle}>Your Bitcoin (BTC) Wallet Address</label>
                  <input
                    type="text"
                    placeholder="Your BTC wallet address"
                    value={details.btcAddress}
                    onChange={e => setDetails({ ...details, btcAddress: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              )}

              {method === 'usdt' && (
                <div>
                  <label style={labelStyle}>Your USDT TRC20 Wallet Address</label>
                  <input
                    type="text"
                    placeholder="Your USDT TRC20 address"
                    value={details.usdtAddress}
                    onChange={e => setDetails({ ...details, usdtAddress: e.target.value })}
                    style={inputStyle}
                  />
                  <p style={{ color: '#FFA500', fontSize: '12px', marginTop: '-8px', marginBottom: '12px' }}>
                    ⚠️ Make sure this is a TRC20 (TRON) address only
                  </p>
                </div>
              )}

              {method === 'bank' && (
                <div>
                  <label style={labelStyle}>Account Holder Name</label>
                  <input type="text" placeholder="Full name on account"
                    value={details.accountName}
                    onChange={e => setDetails({ ...details, accountName: e.target.value })}
                    style={inputStyle} />
                  <label style={labelStyle}>Bank Name</label>
                  <input type="text" placeholder="e.g. Chase, Bank of America"
                    value={details.bankName}
                    onChange={e => setDetails({ ...details, bankName: e.target.value })}
                    style={inputStyle} />
                  <label style={labelStyle}>Account Number</label>
                  <input type="text" placeholder="Account number"
                    value={details.accountNumber}
                    onChange={e => setDetails({ ...details, accountNumber: e.target.value })}
                    style={inputStyle} />
                  <label style={labelStyle}>Routing Number</label>
                  <input type="text" placeholder="9-digit routing number"
                    value={details.routingNumber}
                    onChange={e => setDetails({ ...details, routingNumber: e.target.value })}
                    style={inputStyle} />
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
                    ${parseFloat(amount).toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#8A9BB5', fontSize: '13px' }}>Method</span>
                  <span style={{ color: '#fff' }}>{method}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8A9BB5', fontSize: '13px' }}>Processing Time</span>
                  <span style={{ color: '#27C574', fontSize: '13px' }}>24-48 hours</span>
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
                <button onClick={() => setStep(2)} style={{
                  flex: 1, padding: '13px', background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#8A9BB5', cursor: 'pointer',
                }}>← Back</button>
                <button
                  onClick={submitWithdrawal}
                  disabled={loading}
                  style={{
                    flex: 2, padding: '13px',
                    background: loading ? 'rgba(201,168,76,0.5)' : '#C9A84C',
                    color: '#04091A', fontWeight: 700,
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                  }}
                >
                  {loading ? 'Submitting...' : '✓ Submit Withdrawal Request'}
                </button>
              </div>
            </div>
          )}
        </div>

        <p style={{
          textAlign: 'center', color: '#8A9BB5',
          fontSize: '12px', marginTop: '16px',
        }}>
          🔐 Secured · Withdrawals reviewed within 24 hours
        </p>
      </div>
    </div>
  )
}
