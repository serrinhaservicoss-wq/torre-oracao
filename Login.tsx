'use client'
import { useState } from 'react'
import { User } from '@/lib/data'

interface Props {
  users: User[]
  onLogin: (user: User) => void
}

export default function Login({ users, onLogin }: Props) {
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [err, setErr] = useState('')

  function doLogin() {
    const u = users.find(x => x.login === login.trim() && x.senha === senha)
    if (!u) { setErr('❌ Usuário ou senha incorretos.'); return }
    setErr('')
    onLogin(u)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'radial-gradient(ellipse at top,#2c1a06,#080604)',
      padding: 20
    }}>
      <div style={{
        background: 'var(--card)', border: '1px solid rgba(201,168,76,.3)',
        borderRadius: 20, padding: '42px 36px 34px', width: '100%', maxWidth: 400,
        textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,.8)'
      }}>
        {/* Logo placeholder */}
        <div style={{
          width: 90, height: 90, borderRadius: '50%', background: 'var(--brown2)',
          border: '3px solid var(--gold)', margin: '0 auto 14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 38
        }}>🙏</div>

        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--gold-light)' }}>
          Torre de Oração e Adoração
        </div>
        <div style={{ fontSize: '.65rem', color: 'var(--gray2)', letterSpacing: '1.6px', textTransform: 'uppercase', marginTop: 3, marginBottom: 26 }}>
          Sistema Atalaia
        </div>

        <div className="form-group">
          <label className="form-label">Login</label>
          <input
            value={login}
            onChange={e => setLogin(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && doLogin()}
            placeholder="seu.login"
            autoCapitalize="none"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Senha</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPw ? 'text' : 'password'}
              value={senha}
              onChange={e => setSenha(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doLogin()}
              placeholder="••••••••"
              style={{ paddingRight: 38 }}
            />
            <span
              onClick={() => setShowPw(v => !v)}
              style={{
                position: 'absolute', right: 11, top: '50%',
                transform: 'translateY(-50%)', cursor: 'pointer',
                color: 'var(--gray2)', userSelect: 'none', fontSize: '1rem'
              }}
            >{showPw ? '🙈' : '👁'}</span>
          </div>
        </div>

        {err && <div style={{ color: '#ff7777', fontSize: '.78rem', marginTop: 6 }}>{err}</div>}

        <button className="btn-primary" onClick={doLogin} style={{ width: '100%', marginTop: 18 }}>
          Entrar 🔑
        </button>
      </div>
    </div>
  )
}
