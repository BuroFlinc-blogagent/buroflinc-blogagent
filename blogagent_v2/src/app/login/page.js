'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/')
      router.refresh()
    } else {
      setError('Wachtwoord klopt niet.')
      setLoading(false)
    }
  }

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: '#16140f',
      color: '#ede8df',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: 380,
        background: '#1e1c16',
        border: '1px solid #333028',
        borderRadius: 14,
        padding: '40px 36px',
      }}>
        {/* Logo */}
        <div style={{
          fontFamily: 'Georgia, serif',
          fontSize: 22,
          marginBottom: 6,
          color: '#ede8df',
        }}>
          Buro<span style={{ color: '#c9a96e' }}>Flinc</span>
        </div>
        <div style={{ fontSize: 13, color: '#7a7568', marginBottom: 32 }}>
          AI Blogagent — intern gebruik
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#a09990', letterSpacing: '0.5px', display: 'block', marginBottom: 7 }}>
              TOEGANGSCODE
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
              style={{
                width: '100%',
                background: '#252219',
                border: `1px solid ${error ? '#c47878' : '#3e3b30'}`,
                borderRadius: 8,
                padding: '11px 14px',
                color: '#ede8df',
                fontFamily: 'inherit',
                fontSize: 15,
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
            />
            {error && (
              <div style={{ fontSize: 12.5, color: '#c47878', marginTop: 7 }}>{error}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: 8,
              border: 'none',
              background: loading || !password ? '#3e3b30' : '#c9a96e',
              color: loading || !password ? '#7a7568' : '#16140f',
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: 600,
              cursor: loading || !password ? 'default' : 'pointer',
              transition: 'all 0.18s',
            }}
          >
            {loading ? 'Even geduld…' : 'Inloggen'}
          </button>
        </form>

        <div style={{ marginTop: 28, fontSize: 12, color: '#4a4540', lineHeight: 1.6 }}>
          Toegang alleen voor BuroFlinc-team.<br />
          Vraag de toegangscode aan Frank.
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        input:focus { border-color: #c9a96e !important; }
      `}</style>
    </div>
  )
}
