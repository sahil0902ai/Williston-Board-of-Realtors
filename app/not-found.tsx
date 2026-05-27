import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#04091A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#C9A84C',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '80px', margin: 0 }}>404</h1>
      <p style={{ color: '#8A9BB5' }}>Page not found</p>
      <Link href="/" style={{
        marginTop: '24px',
        padding: '12px 28px',
        background: '#C9A84C',
        color: '#04091A',
        fontWeight: 600,
        textDecoration: 'none'
      }}>
        Go Home
      </Link>
    </div>
  )
}
