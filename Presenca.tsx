'use client'
import { useState } from 'react'
import { User, Gideao, DIAS, TORRES, H24, SEM_LABELS, PresencaMap, PresStatus, Dia, Torre } from '@/lib/data'

interface Props {
  currentUser: User
  gideoes: Gideao[]
  presenca: PresencaMap
  setPresenca: (p: PresencaMap) => void
}

function presKey(dia: Dia, torre: Torre, hora: string, sem: number) {
  return `${dia}|${torre}|${hora}|${sem}`
}

// ── Gráfico horizontal por dia ─────────────────────────────────────────────
function Chart({ gideoes, presenca, dias, torre }: {
  gideoes: Gideao[]; presenca: PresencaMap; dias: Dia[]; torre?: Torre
}) {
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div style={{ fontWeight: 700, color: 'var(--gold-light)', fontSize: '.85rem', marginBottom: 12 }}>
        📊 Resumo por dia
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: '.68rem', marginBottom: 10 }}>
        <span><span style={{ color: 'var(--green2)' }}>█</span> Presentes</span>
        <span><span style={{ color: 'var(--orange)' }}>█</span> Faltaram</span>
        <span><span style={{ color: 'var(--red2)' }}>█</span> Vagos</span>
      </div>

      <div className="chart-bar-wrap">
        {dias.map(dia => {
          const torres = torre ? [torre] : TORRES
          let presentes = 0, faltaram = 0, vagos = 0

          torres.forEach(t => {
            H24.forEach(h => {
              [1,2,3,4].forEach(sem => {
                const g = gideoes.find(x => x.dia === dia && x.torre === t && x.horario === h && x.semana === sem)
                const status = presenca[presKey(dia, t, h, sem)] as PresStatus
                if (!g && !status) { vagos++; return }
                if (status === 'presente' || (!status && g?.presente)) presentes++
                else if (status === 'faltou' || (!status && g?.faltou)) faltaram++
                else if (status === 'vago' || !g) vagos++
              })
            })
          })

          const total = presentes + faltaram + vagos || 1
          const pPres = Math.round(presentes / total * 100)
          const pFalt = Math.round(faltaram / total * 100)
          const pVago = 100 - pPres - pFalt

          return (
            <div key={dia} className="chart-row">
              <div className="chart-label">{dia.slice(0,3)}</div>
              <div className="chart-bars" style={{ background: 'var(--card2)' }}>
                {pPres > 0 && <div className="chart-seg" style={{ width: pPres+'%', background: 'var(--green)' }}>{pPres > 8 ? pPres+'%' : ''}</div>}
                {pFalt > 0 && <div className="chart-seg" style={{ width: pFalt+'%', background: 'var(--orange)' }}>{pFalt > 8 ? pFalt+'%' : ''}</div>}
                {pVago > 0 && <div className="chart-seg" style={{ width: pVago+'%', background: 'var(--red)' }}>{pVago > 8 ? pVago+'%' : ''}</div>}
              </div>
              <div className="chart-count">{presentes}/{total}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Detalhamento por horário ───────────────────────────────────────────────
function Detalhe({ dia, torre, semana, gideoes, presenca, setPresenca, readOnly }: {
  dia: Dia; torre: Torre; semana: number
  gideoes: Gideao[]; presenca: PresencaMap; setPresenca: (p: PresencaMap) => void
  readOnly?: boolean
}) {
  function setPres(hora: string, val: PresStatus) {
    const key = presKey(dia, torre, hora, semana)
    setPresenca({ ...presenca, [key]: val })
  }

  return (
    <div className="tbl-wrap">
      <table>
        <thead>
          <tr>
            <th style={{ width: 72 }}>Horário</th>
            <th>Gideão</th>
            <th>Status</th>
            {!readOnly && <th>Marcar</th>}
          </tr>
        </thead>
        <tbody>
          {H24.map(h => {
            const g = gideoes.find(x => x.dia === dia && x.torre === torre && x.horario === h && x.semana === semana)
            const key = presKey(dia, torre, h, semana)
            const status = (presenca[key] || (g ? (g.presente ? 'presente' : g.faltou ? 'faltou' : '') : 'vago')) as PresStatus

            return (
              <tr key={h}>
                <td style={{ color: 'var(--gold-light)', fontWeight: 700, fontSize: '.78rem' }}>{h}</td>
                <td style={{ fontWeight: g ? 600 : 400, color: g ? 'var(--white)' : 'var(--gray)' }}>
                  {g ? g.nome : '—'}
                </td>
                <td>
                  {status === 'presente' && <span className="badge badge-green">✅ Presente</span>}
                  {status === 'faltou'   && <span className="badge badge-orange">⚠️ Faltou</span>}
                  {status === 'vago'     && <span className="badge badge-red">🔴 Vago</span>}
                  {status === ''         && <span style={{ color: 'var(--gray)', fontSize: '.75rem' }}>—</span>}
                </td>
                {!readOnly && (
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        className={`pres-btn${status === 'presente' ? ' sel-presente' : ''}`}
                        onClick={() => setPres(h, 'presente')}
                      >✅</button>
                      {g && (
                        <button
                          className={`pres-btn${status === 'faltou' ? ' sel-faltou' : ''}`}
                          onClick={() => setPres(h, 'faltou')}
                        >⚠️</button>
                      )}
                      <button
                        className={`pres-btn${status === 'vago' ? ' sel-vago' : ''}`}
                        onClick={() => setPres(h, 'vago')}
                      >🔴</button>
                    </div>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────
export default function Presenca({ currentUser, gideoes, presenca, setPresenca }: Props) {
  const isAdm = currentUser.role === 'adm'
  const [diaSel, setDiaSel] = useState<Dia>(isAdm ? 'Segunda' : currentUser.dia!)
  const [torreSel, setTorreSel] = useState<Torre>(currentUser.torre ?? 'Oração')
  const [semSel, setSemSel] = useState(1)

  return (
    <div>
      <div className="section-title">📊 Presença</div>

      {/* Gráfico resumo */}
      <Chart
        gideoes={gideoes}
        presenca={presenca}
        dias={isAdm ? DIAS : [currentUser.dia!]}
        torre={isAdm ? undefined : currentUser.torre!}
      />

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        {isAdm && (
          <div>
            <label className="form-label">Dia</label>
            <select value={diaSel} onChange={e => setDiaSel(e.target.value as Dia)} style={{ width: 'auto' }}>
              {DIAS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        )}
        <div>
          <label className="form-label">Torre</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {TORRES.map(t => (
              <button
                key={t}
                className={`subtab-item${torreSel === t ? ' active' : ''}`}
                onClick={() => setTorreSel(t)}
                disabled={!isAdm && t !== currentUser.torre}
                style={!isAdm && t !== currentUser.torre ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
              >
                {t === 'Oração' ? '🙏' : '🎵'} {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="form-label">Semana</label>
          <div className="sem-tabs" style={{ margin: 0 }}>
            {[1,2,3,4].map(s => (
              <button
                key={s}
                className={`sem-tab${semSel === s ? ' active' : ''}`}
                onClick={() => setSemSel(s)}
              >{SEM_LABELS[s]}</button>
            ))}
          </div>
        </div>
      </div>

      <Detalhe
        dia={diaSel}
        torre={torreSel}
        semana={semSel}
        gideoes={gideoes}
        presenca={presenca}
        setPresenca={setPresenca}
        readOnly={isAdm}
      />
    </div>
  )
}
