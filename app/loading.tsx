export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#04091A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px'
    }}>
      {/* Animated W logo */}
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        border: '2px solid #C9A84C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'spin 1.5s linear infinite',
        fontSize: '22px',
        color: '#C9A84C',
        fontFamily: 'serif',
        fontWeight: 700,
      }}>
        W
      </div>
      <p style={{
        color: '#8A9BB5',
        fontSize: '13px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
      }}>
        Loading...
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
