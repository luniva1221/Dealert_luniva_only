interface VerifyEmailProps {
  userName: string
  verificationUrl: string
}

export function VerifyEmailTemplate({ userName, verificationUrl }: VerifyEmailProps) {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', color: '#1a1a1a' }}>
      <div style={{ background: '#f57d00', padding: '24px', borderRadius: '8px 8px 0 0' }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: '24px' }}>Dealert</h1>
      </div>
      <div style={{ padding: '32px', background: '#ffffff', border: '1px solid #e5e5e5' }}>
        <h2 style={{ fontSize: '20px' }}>Verify your email address</h2>
        <p>Hi {userName},</p>
        <p>Thanks for signing up for Dealert — Nepal&apos;s price intelligence platform. Click the button below to verify your email.</p>
        <a
          href={verificationUrl}
          style={{
            display: 'inline-block',
            background: '#f57d00',
            color: 'white',
            padding: '12px 28px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold',
            margin: '16px 0',
          }}
        >
          Verify Email Address
        </a>
        <p style={{ color: '#666', fontSize: '14px' }}>This link expires in 24 hours.</p>
        <p style={{ color: '#666', fontSize: '14px' }}>
          If you did not create an account, you can safely ignore this email.
        </p>
      </div>
      <div style={{ padding: '16px', background: '#f9f9f9', borderRadius: '0 0 8px 8px', textAlign: 'center' }}>
        <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>
          © {new Date().getFullYear()} Dealert — Nepal Price Intelligence
        </p>
      </div>
    </div>
  )
}