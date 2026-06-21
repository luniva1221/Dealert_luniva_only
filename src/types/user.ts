export interface User {
  id: string
  fullName: string
  email: string
  phoneNumber?: string
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PublicUser {
  id: string
  fullName: string
  email: string
  role: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: PublicUser
  tokens: AuthTokens
}

export type UserProfile = User;