'use client'

import { useState } from 'react'
import styles from './admin.module.css'

interface AdminDashboardProps {
  siteConfig: any
}

export default function AdminDashboard({ siteConfig }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'config', label: 'Site Config' },
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'hero', label: 'Hero Slides' },
    { id: 'events', label: 'Events' },
    { id: 'prayers', label: 'Prayers' },
    { id: 'donations', label: 'Donations' },
    { id: 'videos', label: 'Videos' },
    { id: 'content', label: 'Content' },
  ]

  return (
    <div className={styles.adminDashboard}>
      <nav className={styles.tabNav}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className={styles.tabContent}>
        {activeTab === 'overview' && (
          <div className={styles.section}>
            <h2>Admin Dashboard</h2>
            <p>Manage all TPOG content and settings</p>
            <div className={styles.grid}>
              <div className={styles.card}>
                <h3>Church Info</h3>
                <p>{siteConfig?.church_name}</p>
              </div>
              <div className={styles.card}>
                <h3>Pastor</h3>
                <p>{siteConfig?.pastor_name}</p>
              </div>
              <div className={styles.card}>
                <h3>Tagline</h3>
                <p>{siteConfig?.tagline}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className={styles.section}>
            <h2>Site Configuration</h2>
            <p>Core church information</p>
            {/* Detailed config editor would go here */}
            <p>Church: {siteConfig?.church_name}</p>
            <p>Pastor: {siteConfig?.pastor_name}</p>
            <p>Tagline: {siteConfig?.tagline}</p>
            <p>Denomination: {siteConfig?.denomination}</p>
          </div>
        )}

        {activeTab === 'home' && (
          <div className={styles.section}>
            <h2>Home Settings</h2>
            <p>Configure countdown and hero image</p>
            {/* Home settings editor would go here */}
          </div>
        )}

        {activeTab === 'menu' && (
          <div className={styles.section}>
            <h2>Navigation Menu</h2>
            <p>Manage app menu items and reorder</p>
            {/* Menu manager would go here */}
          </div>
        )}

        {activeTab === 'hero' && (
          <div className={styles.section}>
            <h2>Hero Slides</h2>
            <p>Manage carousel images</p>
            {/* Hero slides manager would go here */}
          </div>
        )}

        {activeTab === 'events' && (
          <div className={styles.section}>
            <h2>Events</h2>
            <p>Create and manage events</p>
            {/* Events manager would go here */}
          </div>
        )}

        {activeTab === 'prayers' && (
          <div className={styles.section}>
            <h2>Prayer Requests</h2>
            <p>Approve prayer requests</p>
            {/* Prayer approval would go here */}
          </div>
        )}

        {activeTab === 'donations' && (
          <div className={styles.section}>
            <h2>Donations</h2>
            <p>Manage giving options</p>
            {/* Donations manager would go here */}
          </div>
        )}

        {activeTab === 'videos' && (
          <div className={styles.section}>
            <h2>Video Library</h2>
            <p>Manage VOD content</p>
            {/* Videos manager would go here */}
          </div>
        )}

        {activeTab === 'content' && (
          <div className={styles.section}>
            <h2>Text Content</h2>
            <p>Edit all text strings and messages</p>
            {/* Content editor would go here */}
          </div>
        )}
      </div>
    </div>
  )
}
