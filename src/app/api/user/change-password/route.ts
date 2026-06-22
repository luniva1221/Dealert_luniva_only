import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/jwt'
import bcrypt from 'bcryptjs'

async function getUserId(request: NextRequest): Promise<string | null> {
  const token = request.cookies.get('access_token')?.value
  if (!token) return null
  try {
    const payload = await verifyAccessToken(token)
    return payload.userId
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  const userId = await getUserId(request)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { oldPass, newPass } = body

    if (!oldPass || !newPass) {
      return NextResponse.json({ error: 'Both old and new passwords are required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'User not found or password not set' }, { status: 400 })
    }

    const isMatch = await bcrypt.compare(oldPass, user.passwordHash)
    if (!isMatch) {
      return NextResponse.json({ error: 'Old password is incorrect' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(newPass, 12)
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashed },
    })

    return NextResponse.json({ success: true, message: 'Password updated successfully' })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
