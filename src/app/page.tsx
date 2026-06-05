'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import styles from './page.module.css'
import HomeScreen from '@/components/Home'
import ChatScreen from '@/components/Chat'
import PrayerScreen from '@/components/Prayer'
import GiveScreen from '@/components/Give'
import LiveScreen from '@/components/Live'
import EventsScreen from '@/components/Events'
import PodcastsScreen from '@/components/Podcasts'
import VodScreen from '@/components/Vod'
import AdminDashboard from '@/components/AdminDashboard'

export default function App() {
  const { isAdmin, login, logout } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeScreen, setActiveScreen] = useState('home')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [siteConfig, setSiteConfig] = useState<any>(null)
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const [config, menu] = await Promise.all([
        supabase.from('site_config').select('*').limit(1).maybeSingle(),
        supabase.from('app_menu_items').select('*').eq('active', true).order('sort_order')
      ])
      setSiteConfig(config.data)
      setMenuItems(menu.data || [])
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
            <h1>{siteConfig?.church_name || 'TPOG'}</h1>
            <button onClick={logout} className={styles.logoutBtn}>Logout</button>
          </div>
        </header>
        <AdminDashboard siteConfig={siteConfig} />
      </div>
    )
  }

  const screenMap: Record<string, any> = {
    home: HomeScreen,
    chat: ChatScreen,
    prayer: PrayerScreen,
    give: GiveScreen,
    live: LiveScreen,
    events: EventsScreen,
    podcasts: PodcastsScreen,
    vod: VodScreen,
  }

  const CurrentScreen = screenMap[activeScreen] || HomeScreen

  return (
    <div className={styles.appContainer}>
      {drawerOpen && <div className={styles.drawerOverlay} onClick={() => setDrawerOpen(false)} />}

      <header className={styles.header}>
        <nav className={styles.navbar}>
          <div className={styles.navContainer}>
            <button className={styles.hamburger} onClick={() => setDrawerOpen(!drawerOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </button>

            <div className={styles.navBrand}>
              <a href="#" onClick={() => setActiveScreen('home')} className={styles.logo}>
                {siteConfig?.church_name || 'TPOG'}
              </a>
            </div>

            <nav className={`${styles.navMenu} ${drawerOpen ? styles.navMenuOpen : ''}`}>
              <button
                className={`${styles.navLink} ${activeScreen === 'home' ? styles.active : ''}`}
                onClick={() => { setActiveScreen('home'); setDrawerOpen(false); }}
              >
                Home
              </button>
              {menuItems.map(item => (
                <button
                  key={item.module_key}
                  className={`${styles.navLink} ${activeScreen === item.module_key ? styles.active : ''}`}
                  onClick={() => { setActiveScreen(item.module_key); setDrawerOpen(false); }}
                >
                  {item.display_text}
                </button>
              ))}
            </nav>

            <button
              className={styles.adminBtn}
              onClick={() => setShowLoginModal(true)}
              title="Admin"
            >
              ⚙️
            </button>
          </div>
        </nav>
      </header>

      <main className={styles.main}>
        <CurrentScreen />
      </main>

      {showLoginModal && (
        <div className={styles.modal}>
          <div className={styles.modalBox}>
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password"
                autoFocus
              />
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
