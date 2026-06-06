'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './screens.module.css'

export default function HomeScreen() {
  const [heroSlides, setHeroSlides] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 })
  const [settings, setSettings] = useState<any>(null)
  const [appSettings, setAppSettings] = useState<any>(null)

  useEffect(() => {
    Promise.all([
      supabase.from('hero_slides').select('*').eq('active', true).order('sort_order'),
      supabase.from('home_settings').select('*').limit(1).maybeSingle(),
      supabase.from('app_settings').select('*').limit(1).maybeSingle(),
    ]).then(([s, h, a]) => {
      setHeroSlides(s.data || [])
      setSettings(h.data)
      setAppSettings(a.data)
    })
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      if (settings?.countdown_date) {
        const diff = new Date(settings.countdown_date).getTime() - Date.now()
        if (diff > 0) {
          setCountdown({
            d: Math.floor(diff / 86400000),
            h: Math.floor((diff % 86400000) / 3600000),
            m: Math.floor((diff % 3600000) / 60000),
            s: Math.floor((diff % 60000) / 1000)
          })
        }
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [settings])

  useEffect(() => {
    if (heroSlides.length < 2) return
    const timer = setInterval(() => setCurrent(p => (p + 1) % heroSlides.length), 6000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  const primaryColor = appSettings?.primary_color || '#2741e8'

  return (
    <div className={styles.homeContainer}>
      {heroSlides[current] ? (
        <div className={styles.heroCarousel}>
          <img src={heroSlides[current].image_url} alt="Hero" />
          <div className={styles.heroDots}>
            {heroSlides.map((_, i) => (
              <span key={i} className={i === current ? styles.dotActive : ''} onClick={() => setCurrent(i)} />
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.heroCarousel} style={{ background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
          No images added yet
        </div>
      )}

      {settings?.show_countdown && (
        <div className={styles.countdownSection} style={{ background: primaryColor }}>
          <div className={styles.countdownTitle}>
            <span>Countdown To</span>
            <span className={styles.countdownEvent}>{settings.countdown_label || 'LIVE SERVICE'}</span>
          </div>
          <div className={styles.countdownBar}>
            <div className={styles.countdownItem}>
              <div className={styles.countdownValue}>{countdown.d}</div>
              <div className={styles.countdownLabel}>Day</div>
            </div>
            <div className={styles.countdownDivider}></div>
            <div className={styles.countdownItem}>
              <div className={styles.countdownValue}>{countdown.h}</div>
              <div className={styles.countdownLabel}>Hours</div>
            </div>
            <div className={styles.countdownDivider}></div>
            <div className={styles.countdownItem}>
              <div className={styles.countdownValue}>{countdown.m}</div>
              <div className={styles.countdownLabel}>Minute</div>
            </div>
            <div className={styles.countdownDivider}></div>
            <div className={styles.countdownItem}>
              <div className={styles.countdownValue}>{countdown.s}</div>
              <div className={styles.countdownLabel}>Secs</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: '20px 16px', background: '#ffffff' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#2741e8', marginBottom: '16px', fontFamily: 'Poppins, sans-serif', textTransform: 'uppercase' }}>Welcome</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6, fontFamily: 'Poppins, sans-serif' }}>
          {siteConfig?.tagline || 'The Place of Grace Church'}
        </p>
        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '12px', fontFamily: 'Poppins, sans-serif' }}>
          {'Pastor: '}{siteConfig?.pastor_name || 'Keith L. Odom'}
        </p>
      </div>
    </div>
  )
}
