'use client'
import { useState } from 'react'
import { User, Gideao, DIAS, TORRES, H24, SEM_LABELS, Dia, Torre } from '@/lib/data'
import { showToast } from '../Toast'

interface Props {
  currentUser: User
  gideoes: Gideao[]
  setGideoes: (g: Gideao[]) => void
}

interface ModalState {
  open: boolean
  editId: number | null
  nome: string; tel: string; dia: Dia; torre: Torre; hora: string; sem: number
}

const BLANK_MODAL: ModalState = {
  open: false, editId: null,
  nome: '', tel: '', dia: 'Segunda', torre: 'Oração', hora: '06:00', sem: 1
}

// ── ADM: Board de dias ─────────────────────────────────────────────────────
function AdmBoard({ gideoes, setGideoes, openModal }: {
  gideoes: Gideao[]
  setGideoes: (g: Gideao[]) => void
  openModal: (dia: Dia, torre: Torre, g?: Gideao) => void
}) {
  const [diaSel, setDiaSel] = useState<Dia>('Segunda')

  return (
    <div>
      {/* Abas de dias */}
      <div className="tab-list" style={{ marginBottom: 16, borderRadius: 'var(--radius)' }}>
        {DIAS.map(d => (
          <button
            key={d}
            className={`tab-item${diaSel === d ? ' active' : ''}`}
            onClick={() => setDiaSel(d)}
          >{d}</button>
        ))}
      </div>

      {/* Torres do dia selecionado */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {TORRES.map(torre => {
          const lista = gideoes.filter(g => g.dia === diaSel && g.torre === torre)
          return (
            <div key={torre} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontWeight: 800, color: 'var(--gold-light)', fontSize: '.88rem' }}>
                  {torre === 'Oração' ? '🙏' : '🎵'} Torre de {torre}
                </div>
                <button
                  className="btn-primary"
                  style={{ padding: '5px 12px', fontSize: '.75rem' }}
                  onClick={() => openModal(diaSel, torre)}
                >+ Gideão</button>
              </div>

              {lista.length === 0
                ? <div style={{ color: 'var(--gray)', fontSize: '.8rem', textAlign: 'center', padding: '16px 0' }}>Nenhum Gideão cadastrado</div>
                : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {lista.map(g => (
                      <div key={g.id} style={{
                        background: 'var(--card2)', borderRadius: 8, padding: '8px 10px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8
                      }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '.82rem' }}>{g.nome}</div>
                          <div style={{ fontSize: '.7rem', color: 'var(--gray2)', marginTop: 1 }}>
                            ⏰ {g.horario} &nbsp;·&nbsp; {SEM_LABELS[g.semana]} sem &nbsp;·&nbsp; {g.tel}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                          <button className="btn-edit" onClick={() => openModal(diaSel, torre, g)}>✏️</button>
                          <button className="btn-danger" onClick={() => {
                            if (!confirm('Remover?')) return
                            setGideoes(gideoes.filter(x => x.id !== g.id))
                            showToast('🗑 Gideão removido.')
                          }}>🗑</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Atalaia: lista simples do seu dia e torre ──────────────────────────────
function AtalaiaList({ currentUser, gideoes, setGideoes, openModal }: {
  currentUser: User
  gideoes: Gideao[]
  setGideoes: (g: Gideao[]) => void
  openModal: (dia: Dia, torre: Torre) => void
}) {
  const lista = gideoes.filter(g => g.dia === currentUser.dia && g.torre === currentUser.torre)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ color: 'var(--gray2)', fontSize: '.82rem' }}>
          {currentUser.dia} — Torre de {currentUser.torre}
        </div>
        <button
          className="btn-primary"
          style={{ padding: '6px 14px', fontSize: '.78rem' }}
          onClick={() => openModal(currentUser.dia!, currentUser.torre!)}
        >+ Gideão</button>
      </div>

      {lista.length === 0
        ? <div style={{ color: 'var(--gray)', textAlign: 'center', padding: 32 }}>Nenhum Gideão cadastrado</div>
        : (
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Horário</th>
                  <th>Semana</th>
                  <th>Telefone</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {lista.map(g => (
                  <tr key={g.id}>
                    <td style={{ fontWeight: 600 }}>{g.nome}</td>
                    <td><span className="badge badge-gold">{g.horario}</span></td>
                    <td>{SEM_LABELS[g.semana]}ª sem</td>
                    <td style={{ fontSize: '.75rem', color: 'var(--gray2)' }}>{g.tel}</td>
                    <td>
                      <button className="btn-danger" onClick={() => {
                        if (!confirm('Remover?')) return
                        setGideoes(gideoes.filter(x => x.id !== g.id))
                        showToast('🗑 Removido.')
                      }}>🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  )
}

// ── Modal de cadastro/edição ───────────────────────────────────────────────
function GideaoModal({ modal, setModal, gideoes, setGideoes, currentUser }: {
  modal: ModalState
  setModal: (m: ModalState) => void
  gideoes: Gideao[]
  setGideoes: (g: Gideao[]) => void
  currentUser: User
}) {
  const isAdm = currentUser.role === 'adm'

  function save() {
    if (!modal.nome.trim()) { showToast('⚠️ Informe o nome!', true); return }
    if (modal.editId != null) {
      setGideoes(gideoes.map(g => g.id === modal.editId
        ? { ...g, nome: modal.nome, tel: modal.tel, dia: modal.dia, torre: modal.torre, horario: modal.hora, semana: modal.sem }
        : g
      ))
      showToast('✅ Gideão atualizado!')
    } else {
      const nid = gideoes.length ? Math.max(...gideoes.map(g => g.id)) + 1 : 1
      setGideoes([...gideoes, { id: nid, nome: modal.nome, tel: modal.tel, torre: modal.torre, horario: modal.hora, dia: modal.dia, semana: modal.sem, presente: false, faltou: false }])
      showToast('✅ Gideão cadastrado!')
    }
    setModal(BLANK_MODAL)
  }

  if (!modal.open) return null

  return (
    <div className="modal-overlay" onClick={() => setModal(BLANK_MODAL)}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-title">{modal.editId != null ? '✏️ Editar Gideão' : '➕ Novo Gideão'}</div>

        <div className="form-group">
          <label className="form-label">Nome completo</label>
          <input value={modal.nome} onChange={e => setModal({ ...modal, nome: e.target.value })} placeholder="Nome do Gideão" />
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Telefone</label>
            <input value={modal.tel} onChange={e => setModal({ ...modal, tel: e.target.value })} placeholder="(11)9..." />
          </div>
          <div className="form-group">
            <label className="form-label">Semana do mês</label>
            <select value={modal.sem} onChange={e => setModal({ ...modal, sem: +e.target.value })}>
              {[1,2,3,4].map(s => <option key={s} value={s}>{SEM_LABELS[s]}ª semana</option>)}
            </select>
          </div>
        </div>

        {isAdm && (
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Dia da semana</label>
              <select value={modal.dia} onChange={e => setModal({ ...modal, dia: e.target.value as Dia })}>
                {DIAS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Torre</label>
              <select value={modal.torre} onChange={e => setModal({ ...modal, torre: e.target.value as Torre })}>
                {TORRES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Horário</label>
          <select value={modal.hora} onChange={e => setModal({ ...modal, hora: e.target.value })}>
            {H24.map(h => <option key={h}>{h}</option>)}
          </select>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={() => setModal(BLANK_MODAL)}>Cancelar</button>
          <button className="btn-primary" onClick={save}>Salvar</button>
        </div>
      </div>
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────
export default function Gideoes({ currentUser, gideoes, setGideoes }: Props) {
  const [modal, setModal] = useState<ModalState>(BLANK_MODAL)
  const isAdm = currentUser.role === 'adm'

  function openModal(dia: Dia, torre: Torre, g?: Gideao) {
    if (g) {
      setModal({ open: true, editId: g.id, nome: g.nome, tel: g.tel, dia, torre, hora: g.horario, sem: g.semana })
    } else {
      setModal({ ...BLANK_MODAL, open: true, dia, torre })
    }
  }

  return (
    <div>
      <div className="section-title">👥 Gideões</div>

      {isAdm
        ? <AdmBoard gideoes={gideoes} setGideoes={setGideoes} openModal={openModal} />
        : <AtalaiaList currentUser={currentUser} gideoes={gideoes} setGideoes={setGideoes} openModal={openModal} />
      }

      <GideaoModal modal={modal} setModal={setModal} gideoes={gideoes} setGideoes={setGideoes} currentUser={currentUser} />
    </div>
  )
}
