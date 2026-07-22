import { User } from '@/lib/data'
import Avatar from './Avatar'

interface Props {
  user: User
  onLogout: () => void
}

export default function Header({ user, onLogout }: Props) {
  return (
    <header style={{
      background: 'linear-gradient(135deg,var(--dark2),var(--brown2))',
      borderBottom: '2px solid var(--gold)',
      padding: '9px 18px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 9,
      position: 'sticky', top: 0, zIndex: 200
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <div style={{
          width: 42, height: 42, borderRadius: '50%', background: 'var(--brown2)',
          border: '2px solid var(--gold)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 22
        }}>🙏</div>
        <div>
          <div style={{ fontSize: '.9rem', fontWeight: 800, color: 'var(--gold-light)' }}>
            Torre de Oração e Adoração
          </div>
          <div style={{ fontSize: '.58rem', color: 'var(--gray2)', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
            Sistema Atalaia
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{
          background: 'rgba(201,168,76,.12)', border: '1px solid rgba(201,168,76,.28)',
          color: 'var(--gold-light)', fontSize: '.68rem', fontWeight: 700,
          padding: '3px 10px', borderRadius: 18
        }}>
          {user.role === 'adm' ? '⭐ Administrador' : `⚔️ Atalaia — ${user.dia} / ${user.torre}`}
        </span>

        <div style={{
          background: 'var(--brown2)', border: '1px solid rgba(201,168,76,.22)',
          borderRadius: 18, padding: '3px 10px', fontSize: '.72rem',
          display: 'flex', alignItems: 'center', gap: 7
        }}>
          <Avatar user={user} size={26} />
          <span style={{ color: 'var(--gold-light)', fontWeight: 700 }}>{user.nome}</span>
        </div>

        <button
          onClick={onLogout}
          style={{
            background: 'none', border: '1px solid rgba(120,110,90,.4)',
            color: 'var(--gray2)', borderRadius: 7, padding: '4px 10px',
            fontSize: '.7rem', cursor: 'pointer'
          }}
        >Sair 🚪</button>
      </div>
    </header>
  )
}
