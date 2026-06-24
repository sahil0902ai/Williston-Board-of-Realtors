"use client"
import { useState } from 'react'

const CRYPTO_ADDRESSES = {
  usdt: {
    label: 'USDT (TRC20)',
    color: '#26A17B',
    icon: '₮',
    address: process.env.NEXT_PUBLIC_USDT_TRC20_ADDRESS || 'your_usdt_trc20_address_here',
    network: 'TRON (TRC20) Network',
    warning: 'Only send USDT on TRC20 network. Sending on ERC20 or BEP20 will result in lost funds.',
  },
  btc: {
    label: 'Bitcoin (BTC)',
    color: '#F7931A',
    icon: '₿',
    address: process.env.NEXT_PUBLIC_BTC_ADDRESS || 'your_btc_address_here',
    network: 'Bitcoin Mainnet',
    warning: 'Make sure you are sending on Bitcoin network, not Lightning.',
  },
}

export default function CryptoManualDeposit({ amountNgn, userId, planName }) {
  const [selectedCoin, setSelectedCoin] = useState('usdt')
  const [copied, setCopied] = useState(false)
  const [step, setStep] = useState(1)
  const [txHash, setTxHash] = useState('')
  const [proof, setProof] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const coin = CRYPTO_ADDRESSES[selectedCoin]
  
  // Approximate conversion
  const usdEquivalent = (amountNgn / 1600).toFixed(2)

  function copyAddress() {
    navigator.clipboard.writeText(coin.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  async function submitProof() {
    if (!txHash && !proof) {
      setError('Please provide transaction hash or upload screenshot')
      return
    }
    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('amount', amountNgn)
    formData.append('method', `Crypto — ${coin.label}`)
    formData.append('reference', txHash)
    if (proof) formData.append('proof', proof)
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

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
        <h3 style={{ color: '#C9A84C', fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', marginBottom: '12px' }}>
          Crypto Payment Submitted
        </h3>
        <p style={{ color: '#8A9BB5', fontSize: '14px', lineHeight: 1.8 }}>
          We are verifying your transaction on the blockchain.
          This usually takes 15-45 minutes. You will be 
          notified once confirmed.
        </p>
        <a href="/dashboard" style={{
          display: 'block', marginTop: '24px', padding: '14px',
          background: '#C9A84C', color: '#04091A',
          fontWeight: 700, textDecoration: 'none', textAlign: 'center'
        }}>
          Go to Dashboard →
        </a>
      </div>
    )
  }

  return (
    <div>
      {/* Diaspora badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '10px 14px', background: 'rgba(201,168,76,0.06)',
        border: '1px solid rgba(201,168,76,0.2)', marginBottom: '16px',
      }}>
        <span>🌍</span>
        <span style={{ color: '#C9A84C', fontSize: '13px', fontWeight: 600 }}>
          For investors outside Nigeria
        </span>
      </div>

      {step === 1 && (
        <div>
          {/* Coin selector */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {Object.entries(CRYPTO_ADDRESSES).map(([key, c]) => (
              <button
                key={key}
                onClick={() => setSelectedCoin(key)}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: selectedCoin === key ? c.color : `${c.color}15`,
                  border: `1px solid ${c.color}40`,
                  color: selectedCoin === key ? '#fff' : c.color,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '14px',
                  minHeight: '48px',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <span style={{ pointerEvents: 'none' }}>
                  {c.icon} {c.label}
                </span>
              </button>
            ))}
          </div>

          {/* Amount */}
          <div style={{
            textAlign: 'center', padding: '16px',
            background: 'rgba(201,168,76,0.04)',
            border: '1px solid rgba(201,168,76,0.2)',
            marginBottom: '20px',
          }}>
            <p style={{ color: '#8A9BB5', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Send Equivalent Of
            </p>
            <p style={{ color: '#C9A84C', fontSize: '32px', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', margin: '6px 0' }}>
              ₦{amountNgn.toLocaleString()}
            </p>
            <p style={{ color: '#8A9BB5', fontSize: '14px' }}>
              ≈ ${usdEquivalent} USD in {coin.label}
            </p>
          </div>

          {/* Address */}
          <p style={{ color: '#8A9BB5', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            {coin.network} Address
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '14px', background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px',
          }}>
            <span style={{
              flex: 1, color: coin.color, fontSize: '13px',
              fontFamily: 'monospace', wordBreak: 'break-all',
            }}>
              {coin.address}
            </span>
            <button onClick={copyAddress} style={{
              flexShrink: 0, padding: '8px 16px',
              background: copied ? 'rgba(39,197,116,0.15)' : `${coin.color}20`,
              color: copied ? '#27C574' : coin.color,
              border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
              minHeight: '44px',
              minWidth: '44px',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}>
              <span style={{ pointerEvents: 'none' }}>
                {copied ? '✓ Copied' : 'Copy'}
              </span>
            </button>
          </div>

          <div style={{
            padding: '12px', background: 'rgba(255,68,68,0.06)',
            border: '1px solid rgba(255,68,68,0.2)', marginBottom: '20px',
          }}>
            <p style={{ color: '#ff6b6b', fontSize: '12px', margin: 0 }}>
              ⚠️ {coin.warning}
            </p>
          </div>

          <button onClick={() => setStep(2)} style={{
            width: '100%', padding: '15px', background: coin.color,
            color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer',
            minHeight: '48px',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
          }}>
            <span style={{ pointerEvents: 'none' }}>
              I've Sent the Payment →
            </span>
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <button onClick={() => setStep(1)} style={{
            background: 'none', border: 'none', color: '#8A9BB5',
            cursor: 'pointer', fontSize: '13px', marginBottom: '16px', padding: 0,
            minHeight: '44px',
            minWidth: '44px',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            display: 'inline-flex',
            alignItems: 'center',
          }}>
            <span style={{ pointerEvents: 'none' }}>
              ← Back
            </span>
          </button>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: '#8A9BB5', fontSize: '11px', textTransform: 'uppercase', marginBottom: '6px' }}>
              Transaction Hash (TxID)
            </label>
            <input
              type="text"
              value={txHash}
              onChange={e => setTxHash(e.target.value)}
              placeholder="Paste your transaction hash here"
              style={{
                width: '100%', padding: '12px', background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)', color: '#fff',
                fontSize: '16px', boxSizing: 'border-box',
              }}
            />
          </div>

          <p style={{ color: '#8A9BB5', fontSize: '13px', textAlign: 'center', margin: '12px 0' }}>
            — OR —
          </p>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#8A9BB5', fontSize: '11px', textTransform: 'uppercase', marginBottom: '6px' }}>
              Upload Screenshot
            </label>
            <label style={{
              display: 'block', border: '2px dashed rgba(201,168,76,0.25)',
              padding: '24px', textAlign: 'center', cursor: 'pointer',
              background: proof ? 'rgba(39,197,116,0.04)' : 'transparent',
              minHeight: '48px',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}>
              <input type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => setProof(e.target.files[0])} />
              {proof ? `✓ ${proof.name}` : '📷 Click to upload'}
            </label>
          </div>

          {error && <p style={{ color: '#ff4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

          <button onClick={submitProof} disabled={loading} style={{
            width: '100%', padding: '15px',
            background: loading ? 'rgba(201,168,76,0.5)' : '#C9A84C',
            color: '#04091A', fontWeight: 700, border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            minHeight: '48px',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
          }}>
            <span style={{ pointerEvents: 'none' }}>
              {loading ? 'Submitting...' : 'Submit for Verification'}
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
