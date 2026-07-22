'use client'
import { User, Gideao, DIAS, TORRES, H24, Torre, Dia } from '@/lib/data'

interface Props {
  currentUser: User
  gideoes: Gideao[]
}

function calcStats(gideoes: Gideao[], dia: Dia, torre: Torre) {
  const total = H24.length * 4 // 4 semanas × 24h
  const preenchidos = gideoes.filter(g => g.dia === dia && g.torre === torre).length
  const vagos = total - preenchidos
  const pct = Math.round((preenchidos / total) * 100)
  return { preenchidos, vagos, pct }
}

function DayCard({ dia, torre, gideoes, locked }: {
  dia: Dia; torre: Torre; gideoes: Gideao[]; locked: boolean
}) {
  if (locked) {
    return (
      <div className="locked-card">
        <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>🔒</div>
        <div style={{ fontWeight: 700, color: 'var(--gray2)', fontSize: '.82rem' }}>{dia}</div>
        <div style={{ fontSize: '.7rem', marginTop: 3, color: 'var(--gray)' }}>Acesso restrito</div>
      </div>
    )
  }

  const { preenchidos, vagos, pct } = calcStats(gideoes, dia, torre)
  const cor = pct >= 75 ? 'var(--green2)' : pct >= 40 ? 'var(--orange)' : 'var(--red2)'

  return (
    <div className="card" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ fontWeight: 800, color: 'var(--gold-light)', fontSize: '.9rem' }}>{dia}</div>
          <div style={{ fontSize: '.7rem', color: 'var(--gray2)', marginTop: 2 }}>
            {torre === 'Oração' ? '🙏 Torre de Oração' : '🎵 Torre de Adoração'}
          </div>
        </div>
        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: cor }}>{pct}%</div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: pct + '%', background: cor }} />
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 10, fontSize: '.75rem' }}>
        <span style={{ color: 'var(--green2)' }}>✅ {preenchidos} preenchidos</span>
        <span style={{ color: 'var(--red2)' }}>🔴 {vagos} vagos</span>
      </div>
    </div>
  )
}

export default function Dashboard({ currentUser, gideoes }: Props) {
  const isAdm = currentUser.role === 'adm'

  if (isAdm) {
    return (
      <div>
        <div className="section-title">🏠 Dashboard Geral</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 12 }}>
          {DIAS.map(dia =>
            TORRES.map(torre => (
              <DayCard key={dia+torre} dia={dia} torre={torre} gideoes={gideoes} locked={false} />
            ))
          )}
        </div>
      </div>
    )
  }

  // Atalaia: só vê os cards do seu dia e suas duas torres
  return (
    <div>
      <div className="section-title">🏠 Meu Dashboard — {currentUser.dia}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 12 }}>
        {TORRES.map(torre => (
          <DayCard
            key={torre}
            dia={currentUser.dia!}
            torre={torre}
            gideoes={gideoes}
            locked={torre !== currentUser.torre}
          />
        ))}
      </div>
    </div>
  )
}
