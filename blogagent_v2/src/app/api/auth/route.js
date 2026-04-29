import { NextResponse } from 'next/server'

export async function POST(request) {
  const { password } = await request.json()

  if (password === process.env.ACCESS_PASSWORD) {
    const response = NextResponse.json({ ok: true })
    response.cookies.set('bf_auth', process.env.ACCESS_TOKEN, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 dagen
      path: '/',
    })
    return response
  }

  return NextResponse.json({ ok: false }, { status: 401 })
}
