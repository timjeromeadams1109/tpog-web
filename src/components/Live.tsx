'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './screens.module.css'

export default function LiveScreen() {
  const [viewers, setViewers] = useState(342)
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    supabase.from('home_settings').select('*').limit(1).maybeSingle().then(r => setSettings(r.data))
    const timer = setInterval(() => setViewers(Math.floor(300 + Math.random() * 200)), 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className={styles.liveScreen}>
      <h1 className={styles.screenTitle}>LIVE</h1>
      <div className={styles.streamBox}>
        <div className={styles.streamPlaceholder}>
          <div>{settings?.vimeo_title || 'Sunday Worship Live'}</div>
          <div>👥 {viewers} watching</div>
        </div>
      </div>
      <div className={styles.liveChat}>
        <h3>Live Chat</h3>
        <div className={styles.chatBox}>
          <div>Sarah M.: Praise the Lord! 🙏</div>
          <div>James T.: Such a powerful word today</div>
          <div>Maria L.: Amen pastor! 🔥</div>
        </div>
      </div>
    </div>
  )
}
