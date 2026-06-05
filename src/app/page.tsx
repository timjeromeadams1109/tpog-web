'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, SiteConfig } from '@/lib/supabase'
import styles from './page.module.css'

const SCREENS = ['home', 'chat', 'prayer', 'give', 'live', 'events', 'podcasts', 'vod']

const SCREEN_FIELDS: Record<string, string[]> = {
  home: ['title', 'subtitle', 'cta_text', 'image'],
  chat: ['title', 'description', 'welcome'],
  prayer: ['title', 'instructions', 'thankyou'],
  give: ['title', 'description', 'button'],
  live: ['title', 'stream_url', 'status'],
  events: ['title', 'description'],
  podcasts: ['title', 'description'],
  vod: ['title', 'description'],
}

export default function Home() {
  const { isAdmin, login, logout } = useAuth()
  const [view, setView] = useState<'demo' | 'login' | 'admin'>('demo')
  const [activeScreen, setActiveScreen] = useState('home')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [content, setContent] = useState<Record<string, Record<string, string>>>({})
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('home')

  useEffect(() => {
    if (isAdmin) {
      setView('admin')
    } else {
      setView('demo')
    }
    loadAllContent()
  }, [isAdmin])

  const loadAllContent = async () => {
    try {
      const { data: contentData, error: contentError } = await supabase
        .from('app_content')
        .select('*')
        .order('scope')
        .order('key')

      if (contentError) throw contentError

      const grouped: Record<string, Record<string, string>> = {}
      SCREENS.forEach(screen => {
        grouped[screen] = {}
        SCREEN_FIELDS[screen].forEach(field => {
          const found = contentData?.find(item => item.scope === screen && item.key === field)
          grouped[screen][field] = found?.value || ''
        })
      })
      setContent(grouped)

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

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
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

  const startEdit = (key: string) => {
    setEditingKey(key)
    setEditValue(content[activeTab]?.[key] || '')
  }

  const cancelEdit = () => {
    setEditingKey(null)
    setEditValue('')
  }

  const saveField = async (key: string) => {
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('app_content')
        .upsert([
          {
            scope: activeTab,
            key,
            value: editValue,
            updated_at: new Date().toISOString(),
          },
        ], { onConflict: 'scope,key' })

      if (error) throw error

      setContent(prev => ({
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          [key]: editValue,
        },
      }))

      showMessage('✓ Saved successfully', 'success')
      setEditingKey(null)
    } catch (error) {
      showMessage('Error saving content', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const saveSiteConfig = async (updates: Partial<SiteConfig>) => {
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('site_config')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', 1)

      if (error) throw error

      setSiteConfig(prev => prev ? { ...prev, ...updates } : null)
      showMessage('✓ Site config saved', 'success')
    } catch (error) {
      showMessage('Error saving site config', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  // LOGIN VIEW
  if (view === 'login' || (!isAdmin && view === 'demo' && activeScreen === 'admin')) {
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

  // ADMIN VIEW
  if (isAdmin) {
    return (
      <div className={styles.appContainer}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div>
              <h1>{siteConfig?.church_name || 'TPOG'}</h1>
              <p className={styles.tagline}>Content Manager</p>
            </div>
            <button onClick={logout} className={styles.btnLogout}>Logout</button>
          </div>
        </header>

        {message.text && (
          <div className={`${styles.message} ${styles[`message${message.type === 'success' ? 'Success' : 'Error'}`]}`}>
            {message.text}
          </div>
        )}

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
          <button
            className={`${styles.tab} ${activeTab === 'config' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('config')}
          >
            Config
          </button>
        </nav>

        <main className={styles.main}>
          {isLoading ? (
            <p className={styles.loading}>Loading...</p>
          ) : activeTab === 'config' ? (
            <div className={styles.contentSection}>
              <h2>Site Configuration</h2>
              <div className={styles.configGrid}>
                <div className={styles.configField}>
                  <label>Church Name</label>
                  <input
                    type="text"
                    value={siteConfig?.church_name || ''}
                    onChange={(e) => setSiteConfig(prev => prev ? { ...prev, church_name: e.target.value } : null)}
                    onBlur={() => siteConfig && saveSiteConfig({ church_name: siteConfig.church_name })}
                    placeholder="Church name"
                  />
                </div>
                <div className={styles.configField}>
                  <label>Pastor Name</label>
                  <input
                    type="text"
                    value={siteConfig?.pastor_name || ''}
                    onChange={(e) => setSiteConfig(prev => prev ? { ...prev, pastor_name: e.target.value } : null)}
                    onBlur={() => siteConfig && saveSiteConfig({ pastor_name: siteConfig.pastor_name })}
                    placeholder="Pastor name"
                  />
                </div>
                <div className={styles.configField}>
                  <label>Tagline</label>
                  <input
                    type="text"
                    value={siteConfig?.tagline || ''}
                    onChange={(e) => setSiteConfig(prev => prev ? { ...prev, tagline: e.target.value } : null)}
                    onBlur={() => siteConfig && saveSiteConfig({ tagline: siteConfig.tagline })}
                    placeholder="Tagline"
                  />
                </div>
                <div className={styles.configField}>
                  <label>Denomination</label>
                  <input
                    type="text"
                    value={siteConfig?.denomination || ''}
                    onChange={(e) => setSiteConfig(prev => prev ? { ...prev, denomination: e.target.value } : null)}
                    onBlur={() => siteConfig && saveSiteConfig({ denomination: siteConfig.denomination })}
                    placeholder="Denomination"
                  />
                </div>
                <div className={styles.configField}>
                  <label>Logo URL</label>
                  <input
                    type="text"
                    value={siteConfig?.logo_url || ''}
                    onChange={(e) => setSiteConfig(prev => prev ? { ...prev, logo_url: e.target.value } : null)}
                    onBlur={() => siteConfig && saveSiteConfig({ logo_url: siteConfig.logo_url })}
                    placeholder="https://..."
                  />
                </div>
                <div className={styles.configField}>
                  <label>Primary Color</label>
                  <input
                    type="text"
                    value={siteConfig?.primary_color || ''}
                    onChange={(e) => setSiteConfig(prev => prev ? { ...prev, primary_color: e.target.value } : null)}
                    onBlur={() => siteConfig && saveSiteConfig({ primary_color: siteConfig.primary_color })}
                    placeholder="#2741e8"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.contentSection}>
              <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
              <div className={styles.fieldsList}>
                {SCREEN_FIELDS[activeTab]?.map(field => (
                  <div key={field} className={styles.editField}>
                    <div className={styles.fieldHeader}>
                      <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                      {editingKey !== field && (
                        <button
                          className={styles.btnEdit}
                          onClick={() => startEdit(field)}
                        >
                          Edit
                        </button>
                      )}
                    </div>

                    {editingKey === field ? (
                      <div className={styles.editMode}>
                        {field === 'description' || field === 'instructions' || field === 'welcome' || field === 'thankyou' ? (
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            placeholder={`Enter ${field}...`}
                            rows={4}
                          />
                        ) : (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            placeholder={`Enter ${field}...`}
                          />
                        )}
                        <div className={styles.editActions}>
                          <button
                            className={styles.btnSave}
                            onClick={() => saveField(field)}
                            disabled={isSaving}
                          >
                            {isSaving ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            className={styles.btnCancel}
                            onClick={cancelEdit}
                            disabled={isSaving}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.viewMode}>
                        <p className={styles.fieldValue}>
                          {content[activeTab]?.[field] || '(Not set)'}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    )
  }

  // PUBLIC DEMO VIEW
  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1>{siteConfig?.church_name || 'TPOG'}</h1>
            <p className={styles.tagline}>{siteConfig?.tagline || 'The Purpose Ordained Grace'}</p>
          </div>
          <button onClick={() => setView('login')} className={styles.btnAdmin}>Admin</button>
        </div>
      </header>

      <nav className={styles.tabs}>
        {SCREENS.map(screen => (
          <button
            key={screen}
            className={`${styles.tab} ${activeScreen === screen ? styles.tabActive : ''}`}
            onClick={() => setActiveScreen(screen)}
          >
            {screen.charAt(0).toUpperCase() + screen.slice(1)}
          </button>
        ))}
      </nav>

      <main className={styles.main}>
        {isLoading ? (
          <p className={styles.loading}>Loading...</p>
        ) : (
          <div className={styles.demoSection}>
            <h1>{content[activeScreen]?.title || activeScreen.charAt(0).toUpperCase() + activeScreen.slice(1)}</h1>

            {content[activeScreen]?.image && (
              <div className={styles.demoImage}>
                <img src={content[activeScreen]?.image} alt={content[activeScreen]?.title} />
              </div>
            )}

            {content[activeScreen]?.subtitle && (
              <h2 className={styles.subtitle}>{content[activeScreen]?.subtitle}</h2>
            )}

            {content[activeScreen]?.description && (
              <p className={styles.description}>{content[activeScreen]?.description}</p>
            )}

            {content[activeScreen]?.welcome && (
              <p className={styles.content}>{content[activeScreen]?.welcome}</p>
            )}

            {content[activeScreen]?.instructions && (
              <div className={styles.content}>{content[activeScreen]?.instructions}</div>
            )}

            {content[activeScreen]?.thankyou && (
              <p className={styles.content}>{content[activeScreen]?.thankyou}</p>
            )}

            {content[activeScreen]?.cta_text && (
              <button className={styles.ctaButton}>{content[activeScreen]?.cta_text}</button>
            )}

            {content[activeScreen]?.button && (
              <button className={styles.ctaButton}>{content[activeScreen]?.button}</button>
            )}

            {content[activeScreen]?.stream_url && (
              <p className={styles.streamUrl}>Stream: {content[activeScreen]?.stream_url}</p>
            )}

            {content[activeScreen]?.status && (
              <p className={styles.status}>Status: {content[activeScreen]?.status}</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
