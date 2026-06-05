'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import styles from './page.module.css'
import HomeScreen from '@/components/screens/Home'
import ChatScreen from '@/components/screens/Chat'
import PrayerScreen from '@/components/screens/Prayer'
import GiveScreen from '@/components/screens/Give'
import LiveScreen from '@/components/screens/Live'
import EventsScreen from '@/components/screens/Events'
import PodcastsScreen from '@/components/screens/Podcasts'
import VodScreen from '@/components/screens/Vod'
import AdminDashboard from '@/components/admin/Dashboard'

const SCREENS = [
  { key: 'home', label: 'Home', component: HomeScreen },
  { key: 'chat', label: 'Chat', component: ChatScreen },
  { key: 'prayer', label: 'Prayer', component: PrayerScreen },
  { key: 'give', label: 'Give', component: GiveScreen },
  { key: 'live', label: 'Live', component: LiveScreen },
  { key: 'events', label: 'Events', component: EventsScreen },
  { key: 'podcasts', label: 'Podcasts', component: PodcastsScreen },
  { key: 'vod', label: 'VOD', component: VodScreen },
]

export default function App() {
  const { isAdmin, login, logout } = useAuth()
  const [activeScreen, setActiveScreen] = useState('home')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [siteConfig, setSiteConfig] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const { data } = await supabase.from('site_config').select('*').limit(1).maybeSingle()
      setSiteConfig(data)
    } catch (error) {
      console.error('Error loading config:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login(loginPassword)
    if (success) {
      setLoginPassword('')
      setLoginError('')
      setShowLoginModal(false)
    } else {
      setLoginError('Invalid password')
      setTimeout(() => setLoginError(''), 3000)
    }
  }

  if (isLoading) {
    return <div className={styles.loading}><div className={styles.spinner}></div></div>
  }

  if (isAdmin) {
    return (
      <div className={styles.adminContainer}>
        <header className={styles.adminHeader}>
          <div className={styles.headerContent}>
            <div>
              <h1>{siteConfig?.church_name || 'TPOG'}</h1>
              <p className={styles.subtitle}>Admin Panel</p>
            </div>
            <button onClick={logout} className={styles.logoutBtn}>Logout</button>
          </div>
        </header>
        <AdminDashboard />
      </div>
    )
  }

  const CurrentScreen = SCREENS.find(s => s.key === activeScreen)?.component || HomeScreen

  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1>{siteConfig?.church_name || 'The Place of Grace Church Demo'}</h1>
            <p className={styles.subtitle}>{siteConfig?.tagline || 'The Purpose Ordained Grace'}</p>
          </div>
          <button onClick={() => setShowLoginModal(true)} className={styles.adminBtn}>Admin</button>
        </div>
      </header>

      <nav className={styles.nav}>
        {SCREENS.map(screen => (
          <button
            key={screen.key}
            className={`${styles.navBtn} ${activeScreen === screen.key ? styles.active : ''}`}
            onClick={() => setActiveScreen(screen.key)}
          >
            {screen.label}
          </button>
        ))}
      </nav>

      <main className={styles.main}>
        <CurrentScreen />
      </main>

      {showLoginModal && (
        <div className={styles.modal}>
          <div className={styles.modalBox}>
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Password" autoFocus />
              {loginError && <div className={styles.error}>{loginError}</div>}
              <button type="submit">Login</button>
              <button type="button" onClick={() => { setShowLoginModal(false); setLoginPassword(''); setLoginError(''); }}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
