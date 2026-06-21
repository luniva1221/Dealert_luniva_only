import { NextRequest, NextResponse } from 'next/server'
import { wishlistService } from '@/services/wishlist.service'
import { verifyAccessToken } from '@/lib/jwt'
import { addToWishlistSchema } from '@/validations/wishlist.schema'

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
    const { productId } = addToWishlistSchema.parse(body)

    const item = await wishlistService.addToWishlist(userId, productId)
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
