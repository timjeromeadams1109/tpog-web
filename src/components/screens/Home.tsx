'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './screens.module.css'

export default function HomeScreen() {
  const [slides, setSlides] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 })
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    Promise.all([
      supabase.from('hero_slides').select('*').eq('active', true).order('sort_order'),
      supabase.from('home_settings').select('*').limit(1).maybeSingle()
    ]).then(([s, h]) => {
      setSlides(s.data || [])
      setSettings(h.data)
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (settings?.countdown_date) {
        const diff = new Date(settings.countdown_date).getTime() - Date.now()
        if (diff > 0) setCountdown({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) })
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [settings])

  useEffect(() => {
    if (slides.length < 2) return
    const interval = setInterval(() => setCurrent(p => (p + 1) % slides.length), 6000)
    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <div className={styles.home}>
      {slides[current] && (
        <div className={styles.carousel}>
          <img src={slides[current].image_url} alt="Hero" />
          {slides[current].cta_text && <button className={styles.cta}>{slides[current].cta_text}</button>}
          <div className={styles.dots}>{slides.map((_, i) => <span key={i} className={i === current ? styles.dot_active : ''} onClick={() => setCurrent(i)} />)}</div>
        </div>
      )}
      {settings?.show_countdown && (
        <div className={styles.countdown}>
          <h2>Next Service</h2>
          <div className={styles.grid}>
            <div><div className={styles.num}>{countdown.d}</div><div>Days</div></div>
            <div><div className={styles.num}>{countdown.h}</div><div>Hours</div></div>
            <div><div className={styles.num}>{countdown.m}</div><div>Mins</div></div>
            <div><div className={styles.num}>{countdown.s}</div><div>Secs</div></div>
          </div>
        </div>
      )}
    </div>
  )
}
