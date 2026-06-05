'use client'
import { useState } from 'react'
import styles from './admin.module.css'

export default function AdminDashboard({ siteConfig }: any) {
  const [tab, setTab] = useState('overview')

  return (
    <div className={styles.dashboard}>
      <nav className={styles.tabs}>
        {['overview', 'config', 'home', 'hero', 'events', 'prayers', 'donations', 'videos', 'content'].map(t => (
          <button key={t} className={tab === t ? styles.active : ''} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </nav>

      <div className={styles.content}>
        {tab === 'overview' && (
          <div className={styles.section}>
            <h2>Admin Dashboard</h2>
            <div className={styles.grid}>
              <div className={styles.card}>
                <h3>Church</h3>
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

        {tab === 'config' && (
          <div className={styles.section}>
            <h2>Site Configuration</h2>
            <p>Edit church information in the site_config table via Supabase</p>
            <ul>
              <li>Church Name: {siteConfig?.church_name}</li>
              <li>Pastor Name: {siteConfig?.pastor_name}</li>
              <li>Tagline: {siteConfig?.tagline}</li>
              <li>Denomination: {siteConfig?.denomination}</li>
            </ul>
          </div>
        )}

        {tab === 'home' && (
          <div className={styles.section}>
            <h2>Home Settings</h2>
            <p>Configure countdown timer and hero image via Supabase</p>
            <p>Edit home_settings table to:</p>
            <ul>
              <li>Set countdown_date for service countdown</li>
              <li>Toggle show_countdown</li>
              <li>Set hero_image_url for main hero image</li>
            </ul>
          </div>
        )}

        {tab === 'hero' && (
          <div className={styles.section}>
            <h2>Hero Slides</h2>
            <p>Manage carousel images in hero_slides table</p>
            <p>Add/edit slides with:</p>
            <ul>
              <li>image_url - Carousel image</li>
              <li>cta_text - Call-to-action button text</li>
              <li>cta_url - Button link</li>
              <li>sort_order - Display order</li>
              <li>active - Enable/disable slide</li>
            </ul>
          </div>
        )}

        {tab === 'events' && (
          <div className={styles.section}>
            <h2>Events</h2>
            <p>Manage events in events table</p>
            <p>Event fields:</p>
            <ul>
              <li>title, date_text, time_text, location</li>
              <li>description, image_url, category</li>
              <li>featured (boolean) - Highlight event</li>
              <li>rsvp_enabled (boolean) - Show RSVP button</li>
              <li>external_url - Registration link</li>
            </ul>
          </div>
        )}

        {tab === 'prayers' && (
          <div className={styles.section}>
            <h2>Prayer Requests</h2>
            <p>Approve prayer requests in prayer_requests table</p>
            <p>Set approved = true to display on site</p>
            <p>Prayer request fields:</p>
            <ul>
              <li>name, category, text</li>
              <li>is_anonymous, approved</li>
              <li>pray_count, created_at</li>
            </ul>
          </div>
        )}

        {tab === 'donations' && (
          <div className={styles.section}>
            <h2>Donations</h2>
            <p>Manage giving options in donations table</p>
            <p>Donation fields:</p>
            <ul>
              <li>title - Display name</li>
              <li>url - Giving link (PayPal, Giving platform, etc)</li>
              <li>image_url - Logo/image</li>
              <li>sort_order, active</li>
            </ul>
          </div>
        )}

        {tab === 'videos' && (
          <div className={styles.section}>
            <h2>Video Library</h2>
            <p>Manage VOD content in video_library table</p>
            <p>Video fields:</p>
            <ul>
              <li>title, speaker, date_text, duration</li>
              <li>platform (YouTube, Facebook, Vimeo, Instagram)</li>
              <li>video_url, image_url, description</li>
            </ul>
          </div>
        )}

        {tab === 'content' && (
          <div className={styles.section}>
            <h2>Text Content</h2>
            <p>Edit text strings in app_content table (key-value pairs)</p>
            <p>Examples:</p>
            <ul>
              <li>chat.welcome.message</li>
              <li>chat.suggestion.1-5</li>
              <li>chat.response.* (keyword responses)</li>
              <li>give.scripture.text, give.scripture.reference</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
