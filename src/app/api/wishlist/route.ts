import { NextRequest, NextResponse } from 'next/server'
import { wishlistService } from '@/services/wishlist.service'
import { verifyAccessToken } from '@/lib/jwt'

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

export async function GET(request: NextRequest) {
  const userId = await getUserId(request)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const products = await wishlistService.getWishlist(userId)
    return NextResponse.json(products)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 })
  }
}
