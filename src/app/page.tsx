'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, AppContent, SiteConfig, MenuItem } from '@/lib/supabase'
import styles from './page.module.css'

export default function Home() {
  const { isAdmin, login, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('home')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [content, setContent] = useState<Record<string, AppContent[]>>({})
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const SCREENS = ['home', 'chat', 'prayer', 'give', 'live', 'events', 'podcasts', 'vod']

  useEffect(() => {
    loadAllContent()
  }, [])

  const loadAllContent = async () => {
    try {
      const { data: contentData, error: contentError } = await supabase
        .from('app_content')
        .select('*')
        .order('scope')
        .order('key')

      if (contentError) throw contentError

      const grouped: Record<string, AppContent[]> = {}
      SCREENS.forEach(screen => {
        grouped[screen] = (contentData || []).filter(item => item.scope === screen)
      })
      setContent(grouped)

      const { data: menuData, error: menuError } = await supabase
        .from('app_menu_items')
        .select('*')
        .eq('active', true)
        .order('sort_order')

      if (menuError) throw menuError
      setMenuItems(menuData || [])

      const { data: configData, error: configError } = await supabase
        .from('site_config')
        .select('*')
        .limit(1)
        .maybeSingle()

      if (configError) throw configError
      setSiteConfig(configData)
    } catch (error) {
      console.error('Error loading content:', error)
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
    } else {
      setLoginError('Invalid password')
      setTimeout(() => setLoginError(''), 3000)
    }
  }

  if (!isAdmin) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <h1>{siteConfig?.church_name || 'TPOG'}</h1>
          <p className={styles.loginSubtitle}>Admin Access</p>
          <form onSubmit={handleLogin}>
            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            {loginError && <div className={styles.loginError}>{loginError}</div>}
            <button type="submit" className={styles.btnPrimary}>Login</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1>{siteConfig?.church_name || 'TPOG'}</h1>
            <p className={styles.tagline}>{siteConfig?.tagline || 'Content Manager'}</p>
          </div>
          <button onClick={logout} className={styles.btnLogout}>Logout</button>
        </div>
      </header>

      <nav className={styles.tabs}>
        {SCREENS.map(screen => (
          <button
            key={screen}
            className={`${styles.tab} ${activeTab === screen ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(screen)}
          >
            {screen.charAt(0).toUpperCase() + screen.slice(1)}
          </button>
        ))}
      </nav>

      <main className={styles.main}>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className={styles.contentSection}>
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            {content[activeTab]?.length > 0 ? (
              <div className={styles.contentList}>
                {content[activeTab].map(item => (
                  <div key={`${item.scope}-${item.key}`} className={styles.contentItem}>
                    <div className={styles.contentLabel}>{item.key}</div>
                    <div className={styles.contentValue}>{item.value}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noContent}>No content configured for this screen yet.</p>
            )}
            <div className={styles.helpText}>
              To edit content, use the admin panel in Supabase or the web interface.
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
