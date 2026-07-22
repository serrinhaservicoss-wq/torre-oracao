'use client'
import { useState, useEffect, useCallback } from 'react'
import { User, Gideao, PresencaMap } from '@/lib/data'
import { loadUsers, loadGideoes, loadPres, saveUsers, saveGideoes, savePres } from '@/lib/store'

import Toast from './Toast'
import Login from './Login'
import Header from './Header'
import Dashboard from './tabs/Dashboard'
import Escala from './tabs/Escala'
import Gideoes from './tabs/Gideoes'
import Presenca from './tabs/Presenca'
import Relatorio from './tabs/Relatorio'
import Atalaias from './tabs/Atalaias'
import Acessos from './tabs/Acessos'

type Tab = 'dashboard' | 'escala' | 'gideoes' | 'presenca' | 'relatorio' | 'atalaias' | 'acessos'

export default function App() {
  const [users, setUsersRaw]     = useState<User[]>([])
  const [gideoes, setGideoesRaw] = useState<Gideao[]>([])
  const [presenca, setPresencaRaw] = useState<PresencaMap>({})
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [tab, setTab] = useState<Tab>('dashboard')
  const [hydrated, setHydrated] = useState(false)

  // Carrega do localStorage apenas no cliente
  useEffect(() => {
    setUsersRaw(loadUsers())
    setGideoesRaw(loadGideoes())
    setPresencaRaw(loadPres())
    setHydrated(true)
  }, [])

  // Wrappers que persistem ao salvar
  const setUsers = useCallback((u: User[]) => {
    setUsersRaw(u); saveUsers(u)
  }, [])
  const setGideoes = useCallback((g: Gideao[]) => {
    setGideoesRaw(g); saveGideoes(g)
  }, [])
  const setPresenca = useCallback((p: PresencaMap) => {
    setPresencaRaw(p); savePres(p)
  }, [])

  function handleLogin(user: User) {
    setCurrentUser(user)
    setTab('dashboard')
  }

  function handleLogout() {
    setCurrentUser(null)
    setTab('dashboard')
  }

  if (!hydrated) return null // evita hydration mismatch

  if (!currentUser) {
    return (
      <>
        <Login users={users} onLogin={handleLogin} />
        <Toast />
      </>
    )
  }

  const isAdm = currentUser.role === 'adm'

  const tabs: { id: Tab; label: string; admOnly?: boolean }[] = [
    { id: 'dashboard',  label: '🏠 Dashboard' },
    { id: 'escala',     label: '📋 Escala Mensal' },
    { id: 'gideoes',    label: '👥 Gideões' },
    { id: 'presenca',   label: '📊 Presença' },
    { id: 'relatorio',  label: '📤 Relatório' },
    { id: 'atalaias',   label: '⚔️ Atalaias',  admOnly: true },
    { id: 'acessos',    label: '🔐 Acessos',   admOnly: true },
  ]

  const visibleTabs = tabs.filter(t => !t.admOnly || isAdm)

  function renderTab() {
    switch (tab) {
      case 'dashboard': return <Dashboard currentUser={currentUser!} gideoes={gideoes} />
      case 'escala':    return <Escala currentUser={currentUser!} gideoes={gideoes} />
      case 'gideoes':   return <Gideoes currentUser={currentUser!} gideoes={gideoes} setGideoes={setGideoes} />
      case 'presenca':  return <Presenca currentUser={currentUser!} gideoes={gideoes} presenca={presenca} setPresenca={setPresenca} />
      case 'relatorio': return <Relatorio currentUser={currentUser!} gideoes={gideoes} />
      case 'atalaias':  return isAdm ? <Atalaias users={users} setUsers={setUsers} /> : null
      case 'acessos':   return isAdm ? <Acessos users={users} setUsers={setUsers} /> : null
    }
  }

  return (
    <>
      <Header user={currentUser} onLogout={handleLogout} />
      <nav className="tab-list">
        {visibleTabs.map(t => (
          <button
            key={t.id}
            className={`tab-item${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >{t.label}</button>
        ))}
      </nav>
      <main style={{ padding: 16, maxWidth: 1280, margin: '0 auto' }}>
        {renderTab()}
      </main>
      <Toast />
    </>
  )
}
