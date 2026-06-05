'use client'
import { useState } from 'react'
import styles from './admin.module.css'

export default function AdminDashboard({ siteConfig, onRefresh }: any) {
  const [tab, setTab] = useState('overview')

  return (
    <div className={styles.dashboard}>
      <nav className={styles.tabs}>
        {['overview', 'site', 'home', 'hero', 'events', 'prayers', 'donations', 'videos', 'content'].map(t => (
          <button key={t} className={tab === t ? styles.active : ''} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </nav>

      <div className={styles.content}>
        {tab === 'overview' && (
          <div className={styles.section}>
            <h2>Admin Dashboard</h2>
            <p>Manage all TPOG content</p>
            <div className={styles.grid}>
              <div className={styles.card}>
                <h3>Church</h3>
                <p>{siteConfig?.church_name}</p>
              </div>
              <div className={styles.card}>
                <h3>Pastor</h3>
                <p>{siteConfig?.pastor_name}</p>
              </div>
            </div>
          </div>
        )}
        {tab !== 'overview' && (
          <div className={styles.section}>
            <h2>{tab.charAt(0).toUpperCase() + tab.slice(1)}</h2>
            <p>Edit {tab} content</p>
          </div>
        )}
      </div>
    </div>
  )
}
