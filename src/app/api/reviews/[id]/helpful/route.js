import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(_request, { params }) {
  try {
    const id = params.id
    await prisma.review.update({
      where: { id },
      data: { helpfulVotes: { increment: 1 } },
    })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('POST /api/reviews/[id]/helpful error', e)
    return NextResponse.json({ error: 'Failed to mark helpful' }, { status: 500 })
  }
}

