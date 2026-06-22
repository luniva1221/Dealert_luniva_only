export const authConfig = {
  jwt: {
    accessExpiresIn: '15m',
    refreshExpiresIn: '7d',
  },
  google: {
    scopes: ['openid', 'email', 'profile'],
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
  },
  bcrypt: {
    saltRounds: 12,
  },
  emailVerification: {
    expiresInMs: 24 * 60 * 60 * 1000, // 24 hours
  },
  passwordReset: {
    expiresInMs: 60 * 60 * 1000, // 1 hour
  },
}