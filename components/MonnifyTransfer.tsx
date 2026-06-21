"use client"
import { useState, useEffect } from 'react';

interface BankAccount {
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

interface MonnifyTransferProps {
  amount: number;
  userId: string;
  profile: any;
}

export default function MonnifyTransfer({ amount, userId, profile }: MonnifyTransferProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [copied, setCopied] = useState<string>('');

  async function fetchOrCreateAccount() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/monnify/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to initialize virtual bank account');
      }

      setAccounts(data.accounts || []);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve deposit bank details. Please contact support.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userId) {
      fetchOrCreateAccount();
    }
  }, [userId]);

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 3000);
  }

  if (loading) {
    return (
      <div style={{ padding: '30px 20px', textAlign: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(201,168,76,0.15)',
          borderTopColor: '#C9A84C',
          borderRadius: '50%',
          margin: '0 auto 20px',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#8A9BB5', fontSize: '14px' }}>Allocating your personal virtual bank account...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', background: 'rgba(255,68,68,0.04)', border: '1px solid rgba(255,68,68,0.2)' }}>
        <p style={{ color: '#ff4444', fontSize: '14px', marginBottom: '16px' }}>{error}</p>
        <button
          onClick={fetchOrCreateAccount}
          style={{
            padding: '10px 20px',
            background: '#C9A84C',
            color: '#04091A',
            border: 'none',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          🔄 Retry Setup
        </button>
      </div>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', background: 'rgba(255,165,0,0.04)', border: '1px solid rgba(255,165,0,0.2)' }}>
        <p style={{ color: '#FFA500', fontSize: '14px' }}>No virtual accounts assigned yet. Please contact support.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header Info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 16px',
        background: 'rgba(201,168,76,0.06)',
        border: '1px solid rgba(201,168,76,0.2)',
        marginBottom: '20px',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: '#C9A84C',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#04091A',
          fontWeight: 900,
          fontSize: '18px',
          flexShrink: 0,
        }}>
          🏦
        </div>
        <div>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: '15px', margin: 0 }}>
            Automated Bank Transfer
          </p>
          <p style={{ color: '#8A9BB5', fontSize: '12px', margin: '2px 0 0' }}>
            Instant detection & zero manual steps
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
          ⚡ Auto-Credit
        </div>
      </div>

      {/* Target Amount */}
      <div style={{
        textAlign: 'center',
        padding: '16px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        marginBottom: '20px',
      }}>
        <p style={{ color: '#8A9BB5', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 6px' }}>
          Suggested Transfer Amount
        </p>
        <p style={{ color: '#C9A84C', fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: 700, margin: 0, lineHeight: 1 }}>
          ₦{amount.toLocaleString()}
        </p>
      </div>

      <p style={{ color: '#8A9BB5', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
        Your Personal Deposit Account details:
      </p>

      {/* Account Details Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
        {accounts.map((acc, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              padding: '18px',
              position: 'relative',
            }}
          >
            {[
              { label: 'Bank Name', value: acc.bankName, keyName: `bank-${index}` },
              { label: 'Account Number', value: acc.accountNumber, keyName: `account-${index}`, highlight: true },
              { label: 'Account Name', value: acc.accountName, keyName: `name-${index}` },
            ].map((field) => (
              <div
                key={field.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: field.label !== 'Account Name' ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}
              >
                <div>
                  <p style={{ color: '#8A9BB5', fontSize: '11px', margin: '0 0 2px' }}>{field.label}</p>
                  <p style={{
                    color: field.highlight ? '#C9A84C' : '#fff',
                    fontWeight: field.highlight ? 700 : 500,
                    fontSize: field.highlight ? '20px' : '14px',
                    fontFamily: field.highlight ? 'monospace' : 'inherit',
                    letterSpacing: field.highlight ? '1px' : 'normal',
                    margin: 0,
                  }}>
                    {field.value}
                  </p>
                </div>
                {field.highlight && (
                  <button
                    onClick={() => copy(field.value, field.keyName)}
                    style={{
                      padding: '6px 12px',
                      background: copied === field.keyName ? '#27C574' : 'rgba(201,168,76,0.15)',
                      color: copied === field.keyName ? '#fff' : '#C9A84C',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 600,
                      transition: 'all 0.2s',
                    }}
                  >
                    {copied === field.keyName ? 'Copied ✓' : 'Copy'}
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Guide Note */}
      <div style={{
        background: 'rgba(39,197,116,0.04)',
        border: '1px solid rgba(39,197,116,0.2)',
        padding: '16px',
        marginBottom: '24px',
      }}>
        <p style={{ color: '#27C574', fontSize: '13px', fontWeight: 600, margin: '0 0 6px' }}>
          📌 Automatic confirmation active:
        </p>
        <p style={{ color: '#8A9BB5', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
          Transfer any amount to this account anytime. It belongs to you permanently and auto-credits 
          your wallet within seconds — no need to submit proof or wait for approval.
        </p>
      </div>

      {/* Finish button */}
      <a
        href="/dashboard"
        style={{
          display: 'block',
          width: '100%',
          padding: '14px',
          background: '#C9A84C',
          color: '#04091A',
          fontWeight: 700,
          fontSize: '15px',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'center',
          textDecoration: 'none',
          boxSizing: 'border-box',
        }}
      >
        Go to Dashboard →
      </a>
    </div>
  );
}
