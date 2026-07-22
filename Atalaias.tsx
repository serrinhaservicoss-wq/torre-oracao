'use client'
import { useState, useRef } from 'react'
import { User, DIAS, TORRES, Dia, Torre } from '@/lib/data'
import Avatar from '../Avatar'
import { showToast } from '../Toast'

interface Props {
  users: User[]
  setUsers: (u: User[]) => void
}

const BLANK: Partial<User> & { editId: number | null } = {
  editId: null, nome: '', login: '', senha: '', tel: '', role: 'atalaia', torre: 'Oração', dia: 'Segunda', foto: ''
}

export default function Atalaias({ users, setUsers }: Props) {
  const [form, setForm] = useState({ ...BLANK })
  const [showList, setShowList] = useState(true)
  const fileRef = useRef<HTMLInputElement>(null)

  const atalaias = users.filter(u => u.role === 'atalaia')

  function save() {
    if (!form.nome?.trim() || !form.login?.trim() || !form.senha?.trim()) {
      showToast('⚠️ Preencha nome, login e senha!', true); return
    }
    const dup = users.find(u => u.login === form.login && u.id !== form.editId)
    if (dup) { showToast('❌ Login já existe!', true); return }

    if (form.editId != null) {
      setUsers(users.map(u => u.id === form.editId
        ? { ...u, nome: form.nome!, login: form.login!, senha: form.senha!, tel: form.tel || '', torre: form.torre as Torre, dia: form.dia as Dia, foto: form.foto || '' }
        : u
      ))
      showToast('✅ Atalaia atualizado!')
    } else {
      const nid = Math.max(...users.map(u => u.id)) + 1
      setUsers([...users, {
        id: nid, nome: form.nome!, login: form.login!, senha: form.senha!,
        role: 'atalaia', torre: form.torre as Torre, dia: form.dia as Dia,
        tel: form.tel || '', foto: form.foto || ''
      }])
      showToast('✅ Atalaia cadastrado!')
    }
    setForm({ ...BLANK })
    setShowList(true)
  }

  function editAt(u: User) {
    setForm({ editId: u.id, nome: u.nome, login: u.login, senha: u.senha, tel: u.tel, role: 'atalaia', torre: u.torre!, dia: u.dia!, foto: u.foto })
    setShowList(false)
  }

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 2 * 1024 * 1024) { showToast('⚠️ Foto muito grande! Máx 2MB', true); return }
    const r = new FileReader()
    r.onload = ev => setForm(prev => ({ ...prev, foto: ev.target?.result as string }))
    r.readAsDataURL(f)
  }

  return (
    <div>
      <div className="section-title">⚔️ Atalaias</div>

      <div className="subtab-list">
        <button className={`subtab-item${showList ? ' active' : ''}`} onClick={() => setShowList(true)}>📋 Lista</button>
        <button className={`subtab-item${!showList ? ' active' : ''}`} onClick={() => { setForm({ ...BLANK }); setShowList(false) }}>
          {form.editId != null ? '✏️ Editando' : '➕ Novo Atalaia'}
        </button>
      </div>

      {showList ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 12 }}>
          {atalaias.map(u => (
            <div key={u.id} className="card" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Avatar user={u} size={52} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '.88rem', color: 'var(--white)' }}>{u.nome}</div>
                <div style={{ fontSize: '.7rem', color: 'var(--gray2)', marginTop: 2 }}>
                  {u.dia} — Torre de {u.torre}
                </div>
                <div style={{ fontSize: '.68rem', color: 'var(--gold-light)', fontFamily: 'monospace', marginTop: 2 }}>
                  🔑 {u.login}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <button className="btn-edit" onClick={() => editAt(u)}>✏️</button>
                <button className="btn-danger" onClick={() => {
                  if (!confirm('Remover atalaia?')) return
                  setUsers(users.filter(x => x.id !== u.id))
                  showToast('🗑 Atalaia removido.')
                }}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ maxWidth: 480 }}>
          <div style={{ fontWeight: 800, color: 'var(--gold-light)', marginBottom: 16 }}>
            {form.editId != null ? `✏️ Editando: ${form.nome}` : '➕ Novo Atalaia'}
          </div>

          {/* Foto */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Avatar user={{ nome: form.nome || '?', foto: form.foto || '' } as User} size={66} />
            <div>
              <button className="btn-secondary" style={{ fontSize: '.75rem' }} onClick={() => fileRef.current?.click()}>
                📷 Foto
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFoto} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nome completo</label>
            <input value={form.nome || ''} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))} />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Dia da semana</label>
              <select value={form.dia || 'Segunda'} onChange={e => setForm(p => ({ ...p, dia: e.target.value as Dia }))}>
                {DIAS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Torre</label>
              <select value={form.torre || 'Oração'} onChange={e => setForm(p => ({ ...p, torre: e.target.value as Torre }))}>
                {TORRES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Telefone</label>
            <input value={form.tel || ''} onChange={e => setForm(p => ({ ...p, tel: e.target.value }))} placeholder="(11)9..." />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Login</label>
              <input value={form.login || ''} onChange={e => setForm(p => ({ ...p, login: e.target.value }))} autoCapitalize="none" />
            </div>
            <div className="form-group">
              <label className="form-label">Senha</label>
              <input type="password" value={form.senha || ''} onChange={e => setForm(p => ({ ...p, senha: e.target.value }))} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <button className="btn-secondary" onClick={() => { setForm({ ...BLANK }); setShowList(true) }}>Cancelar</button>
            <button className="btn-primary" onClick={save}>Salvar Atalaia</button>
          </div>
        </div>
      )}
    </div>
  )
}
