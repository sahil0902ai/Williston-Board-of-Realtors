"use client"
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const BANK_DETAILS = {
  bankName: process.env.NEXT_PUBLIC_BANK_NAME || 'OPay',
  accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER || '9167455410',
  accountName: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || 'Chukwuebuka Irenaus Onyegere',
  whatsapp: process.env.NEXT_PUBLIC_BANK_WHATSAPP || '2349167455410',
  ussd: '*955#',
}

export default function OpayTransfer({ amount, userId, planName }) {
  const [step, setStep] = useState(1)
  const [copied, setCopied] = useState('')
  const [proof, setProof] = useState(null)
  const [reference, setReference] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)
  const router = useRouter()

  function copy(text, label) {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 3000)
  }

  async function submitProof() {
    if (!proof) {
      setError('Please upload your payment screenshot')
      return
    }
    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('amount', amount)
    formData.append('method', 'OPay Bank Transfer')
    formData.append('reference', reference)
    formData.append('proof', proof)
    formData.append('planName', planName)

    try {
      const res = await fetch('/api/payments/manual', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  // SUCCESS STATE
  if (success) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(39,197,116,0.1)',
          border: '2px solid #27C574',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: '36px',
        }}>
          ✅
        </div>
        <h3 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '28px',
          color: '#C9A84C',
          marginBottom: '12px',
        }}>
          Payment Submitted!
        </h3>
        <p style={{
          color: '#8A9BB5',
          fontSize: '14px',
          lineHeight: 1.8,
          marginBottom: '24px',
        }}>
          Your deposit of{' '}
          <strong style={{ color: '#fff' }}>
            ₦{parseFloat(amount).toLocaleString()}
          </strong>{' '}
          is being reviewed. You will be notified once 
          confirmed — usually within 15-60 minutes.
        </p>

        <a
          href={`https://wa.me/${BANK_DETAILS.whatsapp.replace('+', '')}?text=Hello, I just made a deposit of ₦${parseFloat(amount).toLocaleString()} for ${planName}. Please confirm. Reference: ${reference}`}
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
            marginBottom: '10px',
          }}
        >
          📲 Notify Us on WhatsApp
        </a>

        <a
          href="/dashboard"
          style={{
            display: 'block',
            padding: '13px',
            background: '#C9A84C',
            color: '#04091A',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '15px',
          }}
        >
          Go to Dashboard →
        </a>
      </div>
    )
  }

  return (
    <div>
      {/* STEP 1 — Bank Details */}
      {step === 1 && (
        <div>
          {/* OPay header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 16px',
            background: 'rgba(0,166,81,0.06)',
            border: '1px solid rgba(0,166,81,0.2)',
            marginBottom: '20px',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#00A651',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 900,
              fontSize: '16px',
              flexShrink: 0,
            }}>
              O
            </div>
            <div>
              <p style={{
                color: '#fff',
                fontWeight: 700,
                fontSize: '15px',
                margin: 0,
              }}>
                OPay Transfer
              </p>
              <p style={{
                color: '#8A9BB5',
                fontSize: '12px',
                margin: '2px 0 0',
              }}>
                Transfer from any Nigerian bank or OPay
              </p>
            </div>
            <div style={{
              marginLeft: 'auto',
              background: 'rgba(39,197,116,0.1)',
              color: '#27C574',
              fontSize: '11px',
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: '99px',
              border: '1px solid rgba(39,197,116,0.3)',
            }}>
              ✓ Instant
            </div>
          </div>

          {/* Amount to send */}
          <div style={{
            textAlign: 'center',
            padding: '16px',
            background: 'rgba(201,168,76,0.04)',
            border: '1px solid rgba(201,168,76,0.2)',
            marginBottom: '20px',
          }}>
            <p style={{
              color: '#8A9BB5',
              fontSize: '11px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              margin: '0 0 6px',
            }}>
              Transfer Exactly This Amount
            </p>
            <p style={{
              color: '#C9A84C',
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '40px',
              fontWeight: 700,
              margin: 0,
              lineHeight: 1,
            }}>
              ₦{parseFloat(amount).toLocaleString()}
            </p>
          </div>

          {/* Bank details cards */}
          <p style={{
            color: '#8A9BB5',
            fontSize: '11px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}>
            Transfer To
          </p>

          {[
            {
              label: 'Bank Name',
              value: BANK_DETAILS.bankName,
              copyKey: 'bank',
            },
            {
              label: 'Account Number',
              value: BANK_DETAILS.accountNumber,
              copyKey: 'account',
              highlight: true,
            },
            {
              label: 'Account Name',
              value: BANK_DETAILS.accountName,
              copyKey: 'name',
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 16px',
                background: item.highlight
                  ? 'rgba(201,168,76,0.05)'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${item.highlight
                  ? 'rgba(201,168,76,0.2)'
                  : 'rgba(255,255,255,0.07)'}`,
                marginBottom: '8px',
              }}
            >
              <div>
                <p style={{
                  color: '#8A9BB5',
                  fontSize: '11px',
                  margin: '0 0 4px',
                }}>
                  {item.label}
                </p>
                <p style={{
                  color: item.highlight ? '#C9A84C' : '#fff',
                  fontWeight: item.highlight ? 700 : 500,
                  fontSize: item.highlight ? '20px' : '15px',
                  margin: 0,
                  fontFamily: item.highlight
                    ? 'monospace'
                    : 'inherit',
                  letterSpacing: item.highlight ? '2px' : 'normal',
                }}>
                  {item.value}
                </p>
              </div>
              <button
                onClick={() => copy(item.value, item.copyKey)}
                style={{
                  padding: '7px 16px',
                  background: copied === item.copyKey
                    ? 'rgba(39,197,116,0.15)'
                    : 'rgba(201,168,76,0.1)',
                  color: copied === item.copyKey
                    ? '#27C574'
                    : '#C9A84C',
                  border: `1px solid ${copied === item.copyKey
                    ? 'rgba(39,197,116,0.3)'
                    : 'rgba(201,168,76,0.2)'}`,
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                  flexShrink: 0,
                  marginLeft: '12px',
                }}
              >
                {copied === item.copyKey ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          ))}

          {/* USSD option */}
          <div style={{
            padding: '14px 16px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <span style={{ fontSize: '24px' }}>📱</span>
            <div>
              <p style={{
                color: '#fff',
                fontSize: '13px',
                fontWeight: 600,
                margin: '0 0 2px',
              }}>
                Transfer via USSD
              </p>
              <p style={{
                color: '#8A9BB5',
                fontSize: '12px',
                margin: 0,
              }}>
                Dial <strong style={{ color: '#C9A84C' }}>
                  {BANK_DETAILS.ussd}
                </strong> on your phone to transfer without internet
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div style={{
            padding: '14px',
            background: 'rgba(255,165,0,0.05)',
            border: '1px solid rgba(255,165,0,0.15)',
            marginBottom: '20px',
          }}>
            <p style={{
              color: '#FFA500',
              fontSize: '12px',
              fontWeight: 700,
              marginBottom: '8px',
            }}>
              📌 How to Pay:
            </p>
            <ol style={{
              color: '#8A9BB5',
              fontSize: '13px',
              paddingLeft: '18px',
              margin: 0,
              lineHeight: '2',
            }}>
              <li>
                Open your bank app, OPay, or dial{' '}
                <strong style={{ color: '#fff' }}>
                  {BANK_DETAILS.ussd}
                </strong>
              </li>
              <li>
                Transfer exactly{' '}
                <strong style={{ color: '#C9A84C' }}>
                  ₦{parseFloat(amount).toLocaleString()}
                </strong>{' '}
                to the account above
              </li>
              <li>
                Save your transfer receipt/screenshot
              </li>
              <li>
                Come back here and click{' '}
                <strong style={{ color: '#fff' }}>
                  "I Have Paid"
                </strong>
              </li>
              <li>
                Upload the screenshot as proof
              </li>
            </ol>
          </div>

          <button
            onClick={() => setStep(2)}
            style={{
              width: '100%',
              padding: '15px',
              background: '#00A651',
              color: '#fff',
              fontWeight: 700,
              fontSize: '15px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ✅ I Have Paid — Upload Proof →
          </button>

          {/* WhatsApp quick message */}
          <a
            href={`https://wa.me/${BANK_DETAILS.whatsapp.replace('+', '')}?text=Hello, I want to make a deposit of ₦${parseFloat(amount).toLocaleString()} for ${planName}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '10px',
              padding: '12px',
              background: 'transparent',
              border: '1px solid rgba(37,211,102,0.3)',
              color: '#25D366',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            <span>📲</span>
            Have a question? Chat on WhatsApp
          </a>
        </div>
      )}

      {/* STEP 2 — Upload Proof */}
      {step === 2 && (
        <div>
          <button
            onClick={() => setStep(1)}
            style={{
              background: 'none',
              border: 'none',
              color: '#8A9BB5',
              cursor: 'pointer',
              fontSize: '13px',
              marginBottom: '20px',
              padding: 0,
            }}
          >
            ← Back to bank details
          </button>

          <h3 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '24px',
            color: '#fff',
            marginBottom: '6px',
          }}>
            Upload Payment Proof
          </h3>
          <p style={{
            color: '#8A9BB5',
            fontSize: '13px',
            marginBottom: '20px',
          }}>
            Upload your transfer receipt for{' '}
            <strong style={{ color: '#C9A84C' }}>
              ₦{parseFloat(amount).toLocaleString()}
            </strong>
          </p>

          {/* Reference input */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              color: '#8A9BB5',
              fontSize: '11px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}>
              Transaction Reference (Optional)
            </label>
            <input
              type="text"
              value={reference}
              onChange={e => setReference(e.target.value)}
              placeholder="e.g. 230517123456789"
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* File upload */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#8A9BB5',
              fontSize: '11px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}>
              Payment Screenshot (Required)
            </label>
            <label
              htmlFor="proof-upload"
              style={{
                display: 'block',
                border: `2px dashed ${proof
                  ? 'rgba(39,197,116,0.5)'
                  : 'rgba(201,168,76,0.25)'}`,
                padding: '32px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                background: proof
                  ? 'rgba(39,197,116,0.04)'
                  : 'transparent',
                transition: 'all 0.3s',
              }}
            >
              {proof ? (
                <div>
                  <p style={{
                    fontSize: '32px',
                    marginBottom: '8px',
                  }}>
                    🖼️
                  </p>
                  <p style={{
                    color: '#27C574',
                    fontSize: '14px',
                    fontWeight: 600,
                    margin: '0 0 4px',
                  }}>
                    ✓ {proof.name}
                  </p>
                  <p style={{
                    color: '#8A9BB5',
                    fontSize: '12px',
                    margin: 0,
                  }}>
                    Click to change file
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '40px', marginBottom: '12px' }}>
                    📷
                  </p>
                  <p style={{
                    color: '#C9A84C',
                    fontSize: '15px',
                    fontWeight: 600,
                    margin: '0 0 6px',
                  }}>
                    Tap to upload screenshot
                  </p>
                  <p style={{
                    color: '#8A9BB5',
                    fontSize: '12px',
                    margin: 0,
                  }}>
                    JPG, PNG or PDF — Max 5MB
                  </p>
                </div>
              )}
            </label>
            <input
              id="proof-upload"
              type="file"
              accept="image/*,.pdf"
              style={{ display: 'none' }}
              onChange={e => setProof(e.target.files[0])}
            />
          </div>

          {error && (
            <div style={{
              padding: '12px',
              background: 'rgba(255,68,68,0.08)',
              border: '1px solid rgba(255,68,68,0.2)',
              color: '#ff6b6b',
              fontSize: '13px',
              marginBottom: '16px',
            }}>
              {error}
            </div>
          )}

          <button
            onClick={submitProof}
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              background: loading
                ? 'rgba(201,168,76,0.5)'
                : '#C9A84C',
              color: '#04091A',
              fontWeight: 700,
              fontSize: '15px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading
              ? 'Submitting...'
              : '✓ Submit for Verification'}
          </button>

          <p style={{
            textAlign: 'center',
            color: '#8A9BB5',
            fontSize: '12px',
            marginTop: '12px',
          }}>
            🔐 Your payment will be confirmed within
            15-60 minutes during business hours
          </p>
        </div>
      )}
    </div>
  )
}
