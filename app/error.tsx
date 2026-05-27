'use client';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#04091A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      textAlign: 'center',
      padding: '20px',
    }}>
      <div style={{
        fontSize: '48px',
        color: '#C9A84C',
        fontFamily: 'serif',
        fontWeight: 700,
      }}>
        WILLISTON
      </div>
      <h2 style={{ color: '#ffffff', fontSize: '20px', margin: 0 }}>
        Something went wrong
      </h2>
      <p style={{ color: '#8A9BB5', fontSize: '14px', maxWidth: '400px' }}>
        We encountered an issue loading this page.
        Please try again.
      </p>
      <button
        onClick={() => reset()}
        style={{
          padding: '12px 28px',
          background: '#C9A84C',
          color: '#04091A',
          border: 'none',
          fontWeight: 600,
          fontSize: '14px',
          cursor: 'pointer',
          marginTop: '8px',
        }}
      >
        Try Again
      </button>
      <Link href="/" style={{
        color: '#C9A84C',
        fontSize: '13px',
        textDecoration: 'none',
        marginTop: '4px',
      }}>
        Return to Homepage
      </Link>
    </div>
  )
}
