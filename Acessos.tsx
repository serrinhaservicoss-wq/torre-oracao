'use client'
import { useState } from 'react'
import { User, DIAS, TORRES, Dia, Torre, Role } from '@/lib/data'
import { showToast } from '../Toast'

interface Props {
  users: User[]
  setUsers: (u: User[]) => void
}

const BLANK = {
  editId: null as number | null,
  nome: '', tel: '', login: '', senha: '', confirmar: '',
  role: 'atalaia' as Role, torre: 'Oração' as Torre, dia: 'Segunda' as Dia
}

export default function Acessos({ users, setUsers }: Props) {
  const [form, setForm] = useState({ ...BLANK })
  const [showForm, setShowForm] = useState(false)
  const [showPw, setShowPw] = useState(false)

  // modal trocar senha
  const [senhaModal, setSenhaModal] = useState<{ open: boolean; uid: number | null; nova: string; conf: string }>({
    open: false, uid: null, nova: '', conf: ''
  })

  function save() {
    if (!form.nome.trim() || !form.login.trim() || !form.senha.trim()) {
      showToast('⚠️ Preencha nome, login e senha!', true); return
    }
    if (form.editId == null && form.senha !== form.confirmar) {
      showToast('❌ Senhas não conferem!', true); return
    }
    const dup = users.find(u => u.login === form.login.trim() && u.id !== form.editId)
    if (dup) { showToast('❌ Login já existe!', true); return }

    if (form.editId != null) {
      setUsers(users.map(u => u.id === form.editId
        ? { ...u, nome: form.nome, tel: form.tel, login: form.login, senha: form.senha, role: form.role, torre: form.role === 'atalaia' ? form.torre : null, dia: form.role === 'atalaia' ? form.dia : null }
        : u
      ))
      showToast('✅ Acesso atualizado!')
    } else {
      const nid = Math.max(...users.map(u => u.id)) + 1
      setUsers([...users, {
        id: nid, nome: form.nome, tel: form.tel, login: form.login, senha: form.senha,
        role: form.role, torre: form.role === 'atalaia' ? form.torre : null,
        dia: form.role === 'atalaia' ? form.dia : null, foto: ''
      }])
      showToast('✅ Acesso criado!')
    }
    setForm({ ...BLANK })
    setShowForm(false)
  }

  function editUser(u: User) {
    setForm({ editId: u.id, nome: u.nome, tel: u.tel, login: u.login, senha: u.senha, confirmar: u.senha, role: u.role, torre: u.torre || 'Oração', dia: u.dia || 'Segunda' })
    setShowForm(true)
  }

  function salvarSenha() {
    if (!senhaModal.nova) { showToast('⚠️ Informe a senha!', true); return }
    if (senhaModal.nova !== senhaModal.conf) { showToast('❌ Senhas não conferem!', true); return }
    setUsers(users.map(u => u.id === senhaModal.uid ? { ...u, senha: senhaModal.nova } : u))
    setSenhaModal({ open: false, uid: null, nova: '', conf: '' })
    showToast('✅ Senha alterada!')
  }

  return (
    <div>
      <div className="section-title">🔐 Acessos</div>

      <div style={{ marginBottom: 14 }}>
        <button className="btn-primary" onClick={() => { setForm({ ...BLANK }); setShowForm(true) }}>
          ➕ Novo Acesso
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="card" style={{ maxWidth: 500, marginBottom: 20 }}>
          <div style={{ fontWeight: 800, color: 'var(--gold-light)', marginBottom: 16 }}>
            {form.editId != null ? `✏️ Editando: ${form.nome}` : '➕ Novo Usuário'}
          </div>

          {/* Seletor de papel */}
          <div className="form-group">
            <label className="form-label">Tipo de acesso</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {([['adm','⭐ Administrador'],['atalaia','⚔️ Atalaia']] as [Role,string][]).map(([r, label]) => (
                <button
                  key={r}
                  onClick={() => setForm(p => ({ ...p, role: r }))}
                  style={{
                    flex: 1, padding: '10px 8px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: '.82rem',
                    border: `2px solid ${form.role === r ? 'var(--gold)' : 'rgba(201,168,76,.18)'}`,
                    background: form.role === r ? 'rgba(201,168,76,.14)' : 'var(--card2)',
                    color: form.role === r ? 'var(--gold-light)' : 'var(--gray2)',
                    transition: 'all .18s'
                  }}
                >{label}</button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nome completo</label>
            <input value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Telefone</label>
            <input value={form.tel} onChange={e => setForm(p => ({ ...p, tel: e.target.value }))} placeholder="(11)9..." />
          </div>

          {form.role === 'atalaia' && (
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Dia da semana</label>
                <select value={form.dia} onChange={e => setForm(p => ({ ...p, dia: e.target.value as Dia }))}>
                  {DIAS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Torre</label>
                <select value={form.torre} onChange={e => setForm(p => ({ ...p, torre: e.target.value as Torre }))}>
                  {TORRES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          )}

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Login</label>
              <input value={form.login} onChange={e => setForm(p => ({ ...p, login: e.target.value }))} autoCapitalize="none" />
            </div>
            <div className="form-group">
              <label className="form-label">Senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.senha}
                  onChange={e => setForm(p => ({ ...p, senha: e.target.value }))}
                  style={{ paddingRight: 36 }}
                />
                <span onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--gray2)' }}>
                  {showPw ? '🙈' : '👁'}
                </span>
              </div>
            </div>
          </div>

          {form.editId == null && (
            <div className="form-group">
              <label className="form-label">Confirmar senha</label>
              <input type="password" value={form.confirmar} onChange={e => setForm(p => ({ ...p, confirmar: e.target.value }))} />
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <button className="btn-secondary" onClick={() => { setForm({ ...BLANK }); setShowForm(false) }}>Cancelar</button>
            <button className="btn-primary" onClick={save}>Salvar</button>
          </div>
        </div>
      )}

      {/* Lista de usuários */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 10 }}>
        {users.map(u => (
          <div key={u.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '.88rem' }}>{u.nome}</div>
                <div style={{ fontSize: '.68rem', color: 'var(--gray2)', marginTop: 2 }}>
                  {u.role === 'adm' ? '⭐ Administrador' : `⚔️ ${u.dia} — ${u.torre}`}
                </div>
                <div style={{ fontSize: '.68rem', color: 'var(--gold-light)', fontFamily: 'monospace', marginTop: 2 }}>
                  🔑 {u.login}
                </div>
                {u.tel && <div style={{ fontSize: '.65rem', color: 'var(--gray)', marginTop: 1 }}>📞 {u.tel}</div>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>
                <button className="btn-edit" onClick={() => editUser(u)}>✏️</button>
                <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '.7rem' }}
                  onClick={() => setSenhaModal({ open: true, uid: u.id, nova: '', conf: '' })}>
                  🔑
                </button>
                {u.role !== 'adm' && (
                  <button className="btn-danger" onClick={() => {
                    if (!confirm('Remover usuário?')) return
                    setUsers(users.filter(x => x.id !== u.id))
                    showToast('🗑 Removido.')
                  }}>🗑</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal trocar senha */}
      {senhaModal.open && (
        <div className="modal-overlay" onClick={() => setSenhaModal(s => ({ ...s, open: false }))}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">🔑 Alterar Senha</div>
            <div style={{ fontSize: '.78rem', color: 'var(--gray2)', marginBottom: 14 }}>
              {users.find(u => u.id === senhaModal.uid)?.nome}
            </div>
            <div className="form-group">
              <label className="form-label">Nova senha</label>
              <input type="password" value={senhaModal.nova} onChange={e => setSenhaModal(s => ({ ...s, nova: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirmar senha</label>
              <input type="password" value={senhaModal.conf} onChange={e => setSenhaModal(s => ({ ...s, conf: e.target.value }))} />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setSenhaModal(s => ({ ...s, open: false }))}>Cancelar</button>
              <button className="btn-primary" onClick={salvarSenha}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
