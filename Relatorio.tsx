'use client'
import { useState } from 'react'
import { User, Gideao, DIAS, TORRES, H24, SEM_LABELS, Dia, Torre } from '@/lib/data'
import { showToast } from '../Toast'

interface Props {
  currentUser: User
  gideoes: Gideao[]
}

export default function Relatorio({ currentUser, gideoes }: Props) {
  const isAdm = currentUser.role === 'adm'
  const [semSel, setSemSel] = useState(1)

  const diasParaGerar = isAdm ? DIAS : [currentUser.dia!]
  const torresParaGerar = isAdm ? TORRES : [currentUser.torre!]

  function gerarTexto() {
    const semLabel = SEM_LABELS[semSel]
    let txt = `*Torre de Oração e Adoração*\n`
    txt += `*Relatório Semanal — ${semLabel}ª Semana*\n`
    txt += `━━━━━━━━━━━━━━━━━━━━━\n\n`

    diasParaGerar.forEach(dia => {
      torresParaGerar.forEach(torre => {
        const icon = torre === 'Oração' ? '🙏' : '🎵'
        txt += `${icon} *${dia} — Torre de ${torre}*\n`
        txt += `─────────────────\n`

        let preenchidos = 0, vagos = 0
        H24.forEach(h => {
          const g = gideoes.find(x => x.dia === dia && x.torre === torre && x.horario === h && x.semana === semSel)
          if (g) {
            txt += `✅ ${h} — ${g.nome}\n`
            preenchidos++
          } else {
            txt += `🔴 ${h} — Vago\n`
            vagos++
          }
        })

        const pct = Math.round(preenchidos / 24 * 100)
        txt += `\n📊 Ocupação: ${pct}% (${preenchidos} preenchidos / ${vagos} vagos)\n\n`
      })
    })

    txt += `━━━━━━━━━━━━━━━━━━━━━\n`
    txt += `_Sistema Torre de Oração e Adoração_`
    return txt
  }

  const texto = gerarTexto()

  function copiar() {
    navigator.clipboard.writeText(texto)
      .then(() => showToast('📋 Copiado! Cole no WhatsApp.'))
      .catch(() => showToast('⚠️ Não foi possível copiar.', true))
  }

  return (
    <div>
      <div className="section-title">📤 Relatório WhatsApp</div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <div>
          <label className="form-label">Semana do mês</label>
          <div className="sem-tabs" style={{ margin: 0 }}>
            {[1,2,3,4].map(s => (
              <button
                key={s}
                className={`sem-tab${semSel === s ? ' active' : ''}`}
                onClick={() => setSemSel(s)}
              >{SEM_LABELS[s]}ª</button>
            ))}
          </div>
        </div>
        <button
          className="btn-primary"
          style={{ marginTop: 16 }}
          onClick={copiar}
        >📋 Copiar para WhatsApp</button>
      </div>

      <div style={{
        background: 'var(--card2)',
        border: '1px solid rgba(201,168,76,.14)',
        borderRadius: 'var(--radius)',
        padding: 16,
        fontFamily: 'Arial, sans-serif',
        fontSize: '.8rem',
        lineHeight: 1.7,
        whiteSpace: 'pre-wrap',
        color: 'var(--white)',
        maxHeight: 500,
        overflowY: 'auto'
      }}>
        {texto}
      </div>
    </div>
  )
}
