'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './screens.module.css'

const DEMO_MESSAGES = [
  { user: 'Sarah M.', text: 'Praise the Lord! 🙏', color: '#FF5252' },
  { user: 'James T.', text: 'Such a powerful word today', color: '#448AFF' },
  { user: 'Maria L.', text: 'Amen pastor! 🔥', color: '#69F0AE' },
  { user: 'David K.', text: 'Watching from Miami! God bless', color: '#FFD740' },
]

export default function LiveScreen() {
  const [viewers, setViewers] = useState(342)
  const [input, setInput] = useState('')
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    supabase.from('home_settings').select('*').limit(1).maybeSingle().then(r => setSettings(r.data))
    const timer = setInterval(() => setViewers(Math.floor(300 + Math.random() * 200)), 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className={styles.live}>
      <div className={styles.stream}>
        <div className={styles.placeholder}>
          <div className={styles.stream_title}>{settings?.vimeo_title || 'Sunday Worship Live'}</div>
          <div className={styles.viewers}>👥 {viewers} watching</div>
        </div>

        <div className={styles.platform_links}>
          <a href="#" className={styles.link}>YouTube Live</a>
          <a href="#" className={styles.link}>Facebook Live</a>
        </div>
      </div>

      <div className={styles.chat_section}>
        <h3>Live Chat</h3>
        <div className={styles.chat_messages}>
          {DEMO_MESSAGES.map((m, i) => (
            <div key={i} className={styles.chat_msg}>
              <strong style={{ color: m.color }}>{m.user}</strong>
              <p>{m.text}</p>
            </div>
          ))}
        </div>
        <div className={styles.chat_input}>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Join the conversation..." />
          <button onClick={() => setInput('')}>Send</button>
        </div>
      </div>
    </div>
  )
}
