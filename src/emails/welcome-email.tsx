interface WelcomeEmailProps {
  userName: string
  appUrl: string
}

export function WelcomeEmailTemplate({ userName, appUrl }: WelcomeEmailProps) {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', color: '#1a1a1a' }}>
      <div style={{ background: '#f57d00', padding: '24px', borderRadius: '8px 8px 0 0' }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: '24px' }}>Dealert</h1>
      </div>
      <div style={{ padding: '32px', background: '#ffffff', border: '1px solid #e5e5e5' }}>
        <h2>Welcome to Dealert, {userName}! 🎉</h2>
        <p>You&apos;re now part of Nepal&apos;s smartest price intelligence platform.</p>
        <p>Here&apos;s what you can do:</p>
        <ul style={{ lineHeight: '2' }}>
          <li>📈 Track product price history</li>
          <li>🔔 Set price drop alerts</li>
          <li>❤️ Save products to your wishlist</li>
          <li>🕵️ Detect fake seller pages</li>
        </ul>
        <a
          href={`${appUrl}/products`}
          style={{
            display: 'inline-block',
            background: '#f57d00',
            color: 'white',
            padding: '12px 28px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          Start Browsing Deals
        </a>
      </div>
    </div>
  )
}