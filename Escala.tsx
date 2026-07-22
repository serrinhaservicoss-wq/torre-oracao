'use client'
import { useState } from 'react'
import { User, Gideao, DIAS, TORRES, H24, SEM_LABELS, Dia, Torre } from '@/lib/data'

interface Props {
  currentUser: User
  gideoes: Gideao[]
}

const SEMANAS = [1, 2, 3, 4, 5]

function EscalaTable({ dia, torre, semana, gideoes }: {
  dia: Dia; torre: Torre; semana: number; gideoes: Gideao[]
}) {
  return (
    <div className="tbl-wrap">
      <table>
        <thead>
          <tr>
            <th style={{ width: 80 }}>Horário</th>
            <th>{torre === 'Oração' ? '🙏 Oração' : '🎵 Adoração'} — {SEM_LABELS[semana]} semana</th>
          </tr>
        </thead>
        <tbody>
          {H24.map(h => {
            const g = gideoes.find(x => x.dia === dia && x.torre === torre && x.horario === h && x.semana === semana)
            return (
              <tr key={h}>
                <td style={{ color: 'var(--gold-light)', fontWeight: 700, fontSize: '.78rem' }}>{h}</td>
                <td>
                  {g
                    ? <span className="hora-ok">✅ {g.nome}</span>
                    : <span className="hora-vago">🔴 Vago</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function Escala({ currentUser, gideoes }: Props) {
  const isAdm = currentUser.role === 'adm'
  const [diaSel, setDiaSel] = useState<Dia>(isAdm ? 'Segunda' : currentUser.dia!)
  const [torreSel, setTorreSel] = useState<Torre>(currentUser.torre ?? 'Oração')
  const [semSel, setSemSel] = useState(1)

  return (
    <div>
      <div className="section-title">📋 Escala Mensal</div>

      {/* Filtros ADM */}
      {isAdm && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
          <div>
            <label className="form-label">Dia</label>
            <select value={diaSel} onChange={e => setDiaSel(e.target.value as Dia)} style={{ width: 'auto', paddingRight: 30 }}>
              {DIAS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Torre</label>
            <select value={torreSel} onChange={e => setTorreSel(e.target.value as Torre)} style={{ width: 'auto', paddingRight: 30 }}>
              {TORRES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Atalaia: só vê o seu dia, pode trocar torre */}
      {!isAdm && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
          {TORRES.map(t => (
            <button
              key={t}
              className={`subtab-item${torreSel === t ? ' active' : ''}`}
              onClick={() => setTorreSel(t)}
              disabled={t !== currentUser.torre}
              style={t !== currentUser.torre ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
            >
              {t === 'Oração' ? '🙏' : '🎵'} {t}
            </button>
          ))}
        </div>
      )}

      {/* Semanas */}
      <div className="sem-tabs">
        {SEMANAS.map(s => (
          <button
            key={s}
            className={`sem-tab${semSel === s ? ' active' : ''}`}
            onClick={() => setSemSel(s)}
          >
            {SEM_LABELS[s]} Sem
          </button>
        ))}
      </div>

      <EscalaTable dia={diaSel} torre={torreSel} semana={semSel} gideoes={gideoes} />
    </div>
  )
}
