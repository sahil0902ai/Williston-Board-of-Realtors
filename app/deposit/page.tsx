"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import OpayTransfer from '@/components/OpayTransfer'
import MonnifyTransfer from '@/components/MonnifyTransfer'
import CryptoManualDeposit from '@/components/CryptoManualDeposit'

const PAYMENT_METHODS = [
  {
    id: 'monnify_transfer',
    label: 'Automated Bank Transfer',
    icon: '⚡',
    color: '#C9A84C',
    description: 'Get a permanent personal account that auto-credits instantly',
    badge: '⚡ Auto-Confirm',
    recommended: true,
  },
  {
    id: 'opay_transfer',
    label: 'OPay / Bank Transfer (Manual)',
    icon: '🏦',
    color: '#00A651',
    description: 'Transfer manually to our OPay account & upload proof',
    badge: '15-60 min',
    recommended: false,
  },
  {
    id: 'usdt',
    label: 'USDT (TRC20)',
    icon: '₮',
    color: '#26A17B',
    description: 'Send USDT — for diaspora investors',
    badge: '15-30 min',
    recommended: false,
  },
  {
    id: 'bitcoin',
    label: 'Bitcoin (BTC)',
    icon: '₿',
    color: '#F7931A',
    description: 'Send Bitcoin',
    badge: '15-45 min',
    recommended: false,
  },
]

export default function DepositPage() {
  const [paymentMethods, setPaymentMethods] = useState<any[]>(PAYMENT_METHODS)
  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<any>(null)
  const [reference, setReference] = useState('')
  const [proof, setProof] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState<any>(null)
  const [planName, setPlanName] = useState('Investment Deposit')
  const router = useRouter()

  const [bankDetails, setBankDetails] = useState({
    bank: 'OPay',
    accountName: 'Chukwuebuka Irenaus Onyegere',
    accountNumber: '9167455410',
    whatsapp: '+2349167455410',
    ussd: '*955#',
  })

  async function handleOnlinePayment(gateway: 'paystack' | 'flutterwave') {
    setLoading(true)
    setError('')
    try {
      const endpoint = gateway === 'paystack'
        ? '/api/paystack/initialize'
        : '/api/flutterwave/initialize'

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount: parseFloat(amount),
          planName: planName || 'Investment Deposit',
        }),
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error)

      const redirectUrl = gateway === 'paystack' ? data.authorizationUrl : data.link
      if (redirectUrl) {
        window.location.href = redirectUrl
      } else {
        throw new Error('Payment gateway redirect URL not found')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initialize payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const userId = profile?.id
  const selectedPlan = planName

  useEffect(() => {
    async function checkAuthAndSettings() {
      try {
        // Parse plan name from URL
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const plan = params.get('plan');
          if (plan) setPlanName(plan);
        }

        // Fetch user profile to get userId and check auth
        const profileRes = await fetch('/api/user/profile');
        if (profileRes.status === 401) {
          router.push('/login?redirect=/deposit');
          return;
        }
        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfile(data);
        }

        // Fetch settings
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.settings) {
            setBankDetails({
              bank: data.settings.bank_name || 'OPay',
              accountNumber: data.settings.account_number || '9167455410',
              accountName: data.settings.account_name || 'Chukwuebuka Irenaus Onyegere',
              whatsapp: data.settings.bank_whatsapp || '+2349167455410',
              ussd: data.settings.bank_ussd || '*955#',
            });
          }
        }
      } catch (err) {
        console.error('Failed to load settings or profile:', err);
      }
    }
    checkAuthAndSettings();
  }, [])

  const quickAmounts = [20000, 50000, 100000, 200000, 500000, 1000000]

  function copyDetail(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  function handleNextStep() {
    if (step === 1) {
      if (!amount || parseFloat(amount) < 500) {
        setError('Minimum deposit is ₦500')
        return
      }
      setError('')
      setStep(2)
    } else if (step === 2) {
      if (!selectedMethod) {
        setError('Please select a payment method')
        return
      }
      setError('')
      setStep(3)
    }
  }

  async function submitDeposit() {
    if (!proof) {
      setError('Please upload your payment screenshot')
      return
    }
    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('amount', amount)
    formData.append('method', selectedMethod.label)
    formData.append('reference', reference)
    formData.append('proof', proof)

    try {
      const res = await fetch('/api/payments/manual', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
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
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '32px',
            color: '#C9A84C',
            marginBottom: '12px',
          }}>
            Deposit Submitted!
          </h2>
          <p style={{ color: '#8A9BB5', fontSize: '14px', lineHeight: 1.8, marginBottom: '24px' }}>
            Your deposit of <strong style={{ color: '#fff' }}>₦{parseFloat(amount).toLocaleString()}</strong> via{' '}
            <strong style={{ color: '#fff' }}>{selectedMethod?.label}</strong> is under review.
            You will be notified once confirmed — usually within 15-60 minutes.
          </p>
          <div style={{
            background: 'rgba(201,168,76,0.06)',
            border: '1px solid rgba(201,168,76,0.2)',
            padding: '16px',
            marginBottom: '24px',
          }}>
            <p style={{ color: '#8A9BB5', fontSize: '12px', marginBottom: '4px' }}>
              Need help? Contact us:
            </p>
            <a
              href="https://t.me/willistonboardofrealtors"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#C9A84C', fontSize: '14px' }}
            >
              ✈️ @willistonboardofrealtors
            </a>
          </div>
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
            Go to Dashboard →
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

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <a
            href="/dashboard"
            style={{ color: '#8A9BB5', fontSize: '13px', textDecoration: 'none' }}
          >
            ← Back to Dashboard
          </a>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '40px',
            color: '#ffffff',
            marginTop: '12px',
          }}>
            Deposit Funds
          </h1>
          <p style={{ color: '#8A9BB5', fontSize: '14px' }}>
            Add money to your investment wallet
          </p>
        </div>

        {/* Step Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0',
          marginBottom: '32px',
        }}>
          {['Amount', 'Method', 'Confirm'].map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: step > i + 1
                    ? '#27C574'
                    : step === i + 1
                    ? '#C9A84C'
                    : 'rgba(255,255,255,0.07)',
                  border: `1px solid ${step >= i + 1 ? '#C9A84C' : 'rgba(255,255,255,0.1)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: step >= i + 1 ? '#04091A' : '#8A9BB5',
                }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span style={{
                  fontSize: '11px',
                  color: step === i + 1 ? '#C9A84C' : '#8A9BB5',
                  marginTop: '4px',
                }}>
                  {label}
                </span>
              </div>
              {i < 2 && (
                <div style={{
                  flex: 1,
                  height: '1px',
                  background: step > i + 1
                    ? '#C9A84C'
                    : 'rgba(255,255,255,0.07)',
                  margin: '0 8px',
                  marginBottom: '20px',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* STEP 1 — Amount */}
        {step === 1 && (
          <div style={{
            background: '#0A1628',
            border: '1px solid rgba(255,255,255,0.07)',
            padding: '32px',
          }}>
            <h3 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '24px',
              color: '#fff',
              marginBottom: '20px',
            }}>
              How much do you want to deposit?
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#8A9BB5',
                fontSize: '12px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                Amount (Naira)
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#C9A84C',
                  fontSize: '18px',
                  fontWeight: 700,
                }}>₦</span>
                <input
                  suppressHydrationWarning
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="500"
                  style={{
                    width: '100%',
                    padding: '14px 14px 14px 36px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '20px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <p style={{ color: '#8A9BB5', fontSize: '12px', marginTop: '6px' }}>
                Minimum deposit: ₦500
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <p style={{
                color: '#8A9BB5',
                fontSize: '12px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}>
                Quick Select
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {quickAmounts.map(q => (
                  <button
                    suppressHydrationWarning
                    key={q}
                    onClick={() => setAmount(q.toString())}
                    style={{
                      padding: '8px 16px',
                      background: amount === q.toString()
                        ? '#C9A84C'
                        : 'rgba(255,255,255,0.04)',
                      color: amount === q.toString() ? '#04091A' : '#8A9BB5',
                      border: `1px solid ${amount === q.toString()
                        ? '#C9A84C'
                        : 'rgba(255,255,255,0.07)'}`,
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
              </div>
            </div>

            {error && (
              <p style={{
                color: '#ff4444',
                fontSize: '13px',
                marginBottom: '16px',
                padding: '10px',
                background: 'rgba(255,68,68,0.08)',
                border: '1px solid rgba(255,68,68,0.2)',
              }}>
                {error}
              </p>
            )}

            <button
              suppressHydrationWarning
              onClick={handleNextStep}
              style={{
                width: '100%',
                padding: '14px',
                background: '#C9A84C',
                color: '#04091A',
                fontWeight: 700,
                fontSize: '15px',
                border: 'none',
                cursor: 'pointer',
                minHeight: '48px',
                minWidth: '48px',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <span style={{ pointerEvents: 'none' }}>
                Continue →
              </span>
            </button>
          </div>
        )}

        {/* STEP 2 — Payment Method */}
        {step === 2 && (
          <div style={{
            background: '#0A1628',
            border: '1px solid rgba(255,255,255,0.07)',
            padding: '32px',
          }}>
            <h3 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '24px',
              color: '#fff',
              marginBottom: '8px',
            }}>
              Choose Payment Method
            </h3>
            <p style={{ color: '#8A9BB5', fontSize: '13px', marginBottom: '20px' }}>
              Depositing: <strong style={{ color: '#C9A84C' }}>
                ₦{parseFloat(amount).toLocaleString()}
              </strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedMethod(method)
                    }
                  }}
                  style={{
                    position: 'relative',
                    padding: '20px 20px 16px',
                    border: selectedMethod?.id === method.id
                      ? '1px solid rgba(201,168,76,0.8)'
                      : method.recommended
                      ? '1px solid rgba(201,168,76,0.4)'
                      : '1px solid rgba(255,255,255,0.07)',
                    background: selectedMethod?.id === method.id
                      ? 'rgba(201,168,76,0.06)'
                      : method.recommended
                      ? 'rgba(201,168,76,0.02)'
                      : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    transition: 'all 0.2s',
                    minHeight: '64px',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                  }}
                >
                  <div style={{ pointerEvents: 'none', display: 'flex', alignItems: 'center', width: '100%', gap: '14px', position: 'relative' }}>
                    {method.recommended && (
                      <div style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#C9A84C',
                        color: '#04091A',
                        fontSize: '9px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '99px',
                        letterSpacing: '0.5px',
                      }}>
                        ⭐ RECOMMENDED
                      </div>
                    )}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: method.color + '20',
                      border: `1px solid ${method.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 700,
                      color: method.color,
                      flexShrink: 0,
                    }}>
                      {method.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#fff',
                        margin: 0,
                      }}>
                        {method.label}
                      </p>
                      <p style={{
                        fontSize: '12px',
                        color: '#8A9BB5',
                        margin: '2px 0 0',
                      }}>
                        {method.description || (method.instant ? '⚡ Instant confirmation' : '⏱ 15-45 min confirmation')}
                      </p>
                      {method.badge && (
                        <span style={{
                          display: 'inline-block',
                          background: method.recommended ? 'rgba(39,197,116,0.1)' : 'rgba(255,255,255,0.05)',
                          color: method.recommended ? '#27C574' : '#8A9BB5',
                          fontSize: '10px',
                          fontWeight: 600,
                          padding: '1px 6px',
                          marginTop: '4px',
                          borderRadius: '4px',
                          border: `1px solid ${method.recommended ? 'rgba(39,197,116,0.2)' : 'rgba(255,255,255,0.05)'}`,
                        }}>
                          {method.badge}
                        </span>
                      )}
                    </div>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: `2px solid ${selectedMethod?.id === method.id
                        ? '#C9A84C'
                        : 'rgba(255,255,255,0.2)'}`,
                      background: selectedMethod?.id === method.id
                        ? '#C9A84C'
                        : 'transparent',
                      flexShrink: 0,
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <p style={{
                color: '#ff4444',
                fontSize: '13px',
                margin: '16px 0',
              }}>
                {error}
              </p>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                suppressHydrationWarning
                onClick={() => setStep(1)}
                style={{
                  flex: 1,
                  padding: '13px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#8A9BB5',
                  cursor: 'pointer',
                  fontSize: '14px',
                  minHeight: '48px',
                  minWidth: '48px',
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <span style={{ pointerEvents: 'none' }}>
                  ← Back
                </span>
              </button>
              <button
                suppressHydrationWarning
                onClick={handleNextStep}
                style={{
                  flex: 2,
                  padding: '13px',
                  background: '#C9A84C',
                  color: '#04091A',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  minHeight: '48px',
                  minWidth: '48px',
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <span style={{ pointerEvents: 'none' }}>
                  Continue →
                </span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Send & Confirm */}
        {step === 3 && selectedMethod && (
          <div style={{
            background: '#0A1628',
            border: '1px solid rgba(255,255,255,0.07)',
            padding: '32px',
          }}>
            {selectedMethod.id === 'monnify_transfer' ? (
              <MonnifyTransfer
                amount={parseFloat(amount)}
                userId={userId}
                profile={profile}
              />
            ) : selectedMethod.id === 'opay_transfer' ? (
              <OpayTransfer
                amount={parseFloat(amount)}
                userId={userId}
                planName={planName || 'Investment Deposit'}
              />
            ) : selectedMethod.id === 'usdt' || selectedMethod.id === 'bitcoin' ? (
              <CryptoManualDeposit
                amountNgn={parseFloat(amount)}
                userId={userId}
                planName={planName || 'Investment Deposit'}
              />
            ) : (
              <>
                <h3 style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '24px',
                  color: '#fff',
                  marginBottom: '8px',
                }}>
                  Send Payment & Upload Proof
                </h3>
                <p style={{ color: '#8A9BB5', fontSize: '13px', marginBottom: '20px' }}>
                  Send <strong style={{ color: '#C9A84C' }}>
                    ₦{parseFloat(amount).toLocaleString()}
                  </strong> via {selectedMethod.label}
                </p>

                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  padding: '16px',
                  marginBottom: '16px',
                }}>
                  <p style={{
                    color: '#8A9BB5',
                    fontSize: '11px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}>
                    {selectedMethod.label} Address
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <span style={{
                      color: '#C9A84C',
                      fontSize: '14px',
                      fontWeight: 600,
                      wordBreak: 'break-all',
                      fontFamily: 'monospace',
                    }}>
                      {selectedMethod.id === 'usdt' 
                        ? 'TRC20placeholder_address_goes_here_xyz' 
                        : 'bc1qplaceholder_address_goes_here_xyz'}
                    </span>
                    <button
                      suppressHydrationWarning
                      onClick={() => copyDetail(selectedMethod.id === 'usdt' 
                        ? 'TRC20placeholder_address_goes_here_xyz' 
                        : 'bc1qplaceholder_address_goes_here_xyz')}
                      style={{
                        background: copied ? '#27C574' : 'rgba(201,168,76,0.15)',
                        color: copied ? '#fff' : '#C9A84C',
                        border: 'none',
                        padding: '6px 14px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 600,
                        flexShrink: 0,
                        marginLeft: '12px',
                        minHeight: '44px',
                        minWidth: '44px',
                        WebkitTapHighlightColor: 'transparent',
                        touchAction: 'manipulation',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      <span style={{ pointerEvents: 'none' }}>
                        Copy
                      </span>
                    </button>
                  </div>
                </div>

                {/* Instructions */}
                <div style={{
                  background: 'rgba(255,165,0,0.06)',
                  border: '1px solid rgba(255,165,0,0.2)',
                  padding: '14px',
                  marginBottom: '20px',
                }}>
                  <p style={{
                    color: '#FFA500',
                    fontSize: '12px',
                    fontWeight: 600,
                    marginBottom: '6px',
                  }}>
                    📌 How to send:
                  </p>
                  <p style={{ color: '#8A9BB5', fontSize: '13px', lineHeight: 1.7 }}>
                    Transfer the exact crypto amount to the address above, and upload proof.
                  </p>
                </div>

                {/* Reference input */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    color: '#8A9BB5',
                    fontSize: '12px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    marginBottom: '6px',
                  }}>
                    Transaction Reference (Optional)
                  </label>
                  <input
                    suppressHydrationWarning
                    type="text"
                    value={reference}
                    onChange={e => setReference(e.target.value)}
                    placeholder="Transaction ID or confirmation number"
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      color: '#fff',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Proof upload */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    border: `2px dashed ${proof
                      ? 'rgba(39,197,116,0.4)'
                      : 'rgba(201,168,76,0.25)'}`,
                    padding: '28px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: proof
                      ? 'rgba(39,197,116,0.04)'
                      : 'transparent',
                  }}>
                    <input
                      suppressHydrationWarning
                      type="file"
                      accept="image/*,.pdf"
                      style={{ display: 'none' }}
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          setProof(e.target.files[0])
                        }
                      }}
                    />
                    {proof ? (
                      <div>
                        <p style={{ color: '#27C574', fontSize: '14px', fontWeight: 600 }}>
                          ✓ {proof.name}
                        </p>
                        <p style={{ color: '#8A9BB5', fontSize: '12px', marginTop: '4px' }}>
                          Click to change file
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p style={{ fontSize: '32px', marginBottom: '8px' }}>📷</p>
                        <p style={{ color: '#C9A84C', fontSize: '14px', fontWeight: 600 }}>
                          Click to upload screenshot
                        </p>
                        <p style={{ color: '#8A9BB5', fontSize: '12px', marginTop: '4px' }}>
                          JPG, PNG or PDF — Max 5MB
                        </p>
                      </div>
                    )}
                  </label>
                </div>

                {error && (
                  <p style={{
                    color: '#ff4444',
                    fontSize: '13px',
                    marginBottom: '16px',
                    padding: '10px',
                    background: 'rgba(255,68,68,0.08)',
                    border: '1px solid rgba(255,68,68,0.2)',
                  }}>
                    {error}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    suppressHydrationWarning
                    onClick={() => setStep(2)}
                    style={{
                      flex: 1,
                      padding: '13px',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#8A9BB5',
                      cursor: 'pointer',
                      fontSize: '14px',
                      minHeight: '48px',
                      minWidth: '48px',
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <span style={{ pointerEvents: 'none' }}>
                      ← Back
                    </span>
                  </button>
                  <button
                    suppressHydrationWarning
                    onClick={submitDeposit}
                    disabled={loading}
                    style={{
                      flex: 2,
                      padding: '13px',
                      background: loading ? 'rgba(201,168,76,0.5)' : '#C9A84C',
                      color: '#04091A',
                      fontWeight: 700,
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      minHeight: '48px',
                      minWidth: '48px',
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <span style={{ pointerEvents: 'none' }}>
                      {loading ? 'Submitting...' : '✓ Submit Deposit'}
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Security note */}
        <p style={{
          textAlign: 'center',
          color: '#8A9BB5',
          fontSize: '12px',
          marginTop: '20px',
        }}>
          🔐 Secured by SSL · All deposits verified by our team
        </p>
      </div>
    </div>
  )
}
