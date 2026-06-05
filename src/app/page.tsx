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

      <div className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <h2>{siteConfig?.church_name || 'TPOG'}</h2>
          {siteConfig?.tagline && <p className={styles.drawerTagline}>{siteConfig.tagline}</p>}
          {siteConfig?.denomination && <p className={styles.drawerDenom}>{siteConfig.denomination}</p>}
          {siteConfig?.pastor_name && <p className={styles.drawerPastor}>{siteConfig.pastor_name}</p>}
        </div>
        <nav className={styles.drawerNav}>
          {[
            { key: 'home', label: 'Home' },
            ...menuItems.map(item => ({ key: item.module_key, label: item.display_text })),
          ].map(item => (
            <button
              key={item.key}
              className={`${styles.drawerItem} ${activeScreen === item.key ? styles.drawerItemActive : ''}`}
              onClick={() => {
                setActiveScreen(item.key)
                setDrawerOpen(false)
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <main className={styles.mainContent}>
        <button className={styles.hamburger} onClick={() => setDrawerOpen(!drawerOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={styles.screenContainer}>
          <CurrentScreen />
        </div>

        <nav className={styles.bottomNav}>
          <button
            className={`${styles.homeBtn} ${activeScreen === 'home' ? styles.active : ''}`}
            onClick={() => setActiveScreen('home')}
          >
            <span className="material-icons-outlined">home</span>
            <span>Home</span>
          </button>
          <div className={styles.navDivider}></div>
          <div className={styles.navScroll}>
            {menuItems.map(item => {
              const iconMap: Record<string, string> = {
                'post': 'article',
                'chat': 'chat_bubble',
                'watch': 'ondemand_video',
                'vod': 'ondemand_video',
                'resources': 'link',
                'donate': 'favorite',
                'event': 'calendar_today',
                'sermon': 'description',
                'podcasts': 'podcasts',
              }
              const icon = iconMap[item.module_key] || 'circle'
              return (
                <button
                  key={item.module_key}
                  className={`${styles.navItem} ${activeScreen === item.module_key ? styles.active : ''}`}
                  onClick={() => setActiveScreen(item.module_key)}
                >
                  <span className="material-icons-outlined">{icon}</span>
                  <span>{item.display_text}</span>
                </button>
              )
            })}
          </div>
        </nav>

        <button
          className={styles.adminIcon}
          onClick={() => setShowLoginModal(true)}
          title="Admin"
        >
          ⚙️
        </button>
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
