interface ResetPasswordProps {
  userName: string
  resetUrl: string
}

export function ResetPasswordTemplate({ userName, resetUrl }: ResetPasswordProps): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
      <div style="background: #f57d00; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Dealert</h1>
      </div>
      <div style="padding: 32px; background: #ffffff; border: 1px solid #e5e5e5;">
        <h2 style="font-size: 20px;">Reset your password</h2>
        <p>Hi ${userName},</p>
        <p>We received a request to reset your Dealert password. Click the button below to set a new one.</p>
        <a
          href="${resetUrl}"
          style="display: inline-block; background: #f57d00; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 16px 0;"
        >
          Reset Password
        </a>
        <p style="color: #666; font-size: 14px;">This link expires in 1 hour.</p>
        <p style="color: #666; font-size: 14px;">
          If you did not request a password reset, you can safely ignore this email.
        </p>
      </div>
    </div>
  `;
}