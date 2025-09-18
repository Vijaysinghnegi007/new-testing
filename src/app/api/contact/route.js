import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function readFormData(formData) {
  const obj = {}
  for (const [key, value] of formData.entries()) obj[key] = value
  return obj
}

export async function POST(req) {
  try {
    const contentType = req.headers.get('content-type') || ''

    let payload
    if (contentType.includes('application/json')) {
      payload = await req.json()
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const form = await req.formData()
      payload = readFormData(form)
    } else {
      return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 })
    }

    const name = (payload.name || '').trim()
    const email = (payload.email || '').trim().toLowerCase()
    const subject = (payload.subject || '').trim()
    const message = (payload.message || '').trim()

    if (name.length < 2 || !email.includes('@') || subject.length < 3 || message.length < 10) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    })

    // For form posts, redirect back with a simple success state
    if (!contentType.includes('application/json')) {
      return NextResponse.redirect(new URL('/contact?sent=1', req.url), 303)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

