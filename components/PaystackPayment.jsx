"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PaystackPayment({
  amount,
  userId,
  planName,
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handlePay() {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount, planName }),
      })

      const data = await res.json()

      if (data.error) throw new Error(data.error)

      // Redirect to Paystack hosted payment page
      window.location.href = data.authorizationUrl

    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Paystack branding */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        background: 'rgba(0,195,247,0.05)',
        border: '1px solid rgba(0,195,247,0.2)',
        marginBottom: '16px',
      }}>
        <div style={{
          background: '#00C3F7',
          color: '#fff',
          fontWeight: 900,
          fontSize: '13px',
          padding: '6px 12px',
          borderRadius: '4px',
        }}>
          PAYSTACK
        </div>
        <div>
          <p style={{
            color: '#fff',
            fontWeight: 600,
            fontSize: '14px',
            margin: 0,
          }}>
            Pay Securely via Paystack
          </p>
          <p style={{
            color: '#8A9BB5',
            fontSize: '12px',
            margin: '2px 0 0',
          }}>
            Nigeria's most trusted payment gateway
          </p>
        </div>
        <div style={{
          marginLeft: 'auto',
          background: 'rgba(39,197,116,0.1)',
          border: '1px solid rgba(39,197,116,0.3)',
          color: '#27C574',
          fontSize: '11px',
          fontWeight: 600,
          padding: '3px 10px',
          borderRadius: '99px',
        }}>
          ✓ Secured
        </div>
      </div>

      {/* Payment channels */}
      <p style={{
        color: '#8A9BB5',
        fontSize: '11px',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        marginBottom: '10px',
      }}>
        Accepted Payment Channels
      </p>
      <div style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '20px',
      }}>
        {[
          { label: 'Debit Card', icon: '💳' },
          { label: 'Bank Transfer', icon: '🏦' },
          { label: 'USSD', icon: '📱' },
          { label: 'Opay', icon: '🟢' },
          { label: 'QR Code', icon: '🔲' },
        ].map(channel => (
          <div key={channel.label} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 12px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '99px',
          }}>
            <span style={{ fontSize: '12px' }}>{channel.icon}</span>
            <span style={{ color: '#8A9BB5', fontSize: '12px' }}>
              {channel.label}
            </span>
          </div>
        ))}
      </div>

      {/* Amount */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '14px 0',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        marginBottom: '20px',
      }}>
        <span style={{ color: '#8A9BB5', fontSize: '14px' }}>
          Amount:
        </span>
        <span style={{
          color: '#C9A84C',
          fontWeight: 700,
          fontSize: '22px',
          fontFamily: 'Cormorant Garamond, serif',
        }}>
          ₦{parseFloat(amount).toLocaleString()}
        </span>
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
        onClick={handlePay}
        disabled={loading}
        style={{
          width: '100%',
          padding: '15px',
          background: loading
            ? 'rgba(0,195,247,0.5)'
            : '#00C3F7',
          color: '#fff',
          fontWeight: 700,
          fontSize: '15px',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        {loading
          ? 'Redirecting to Paystack...'
          : `Pay ₦${parseFloat(amount).toLocaleString()} with Paystack`}
      </button>

      <p style={{
        textAlign: 'center',
        color: '#8A9BB5',
        fontSize: '11px',
        marginTop: '10px',
      }}>
        🔐 Secured by Paystack · PCI DSS Compliant
      </p>
    </div>
  )
}
