'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './screens.module.css'

export default function GiveScreen() {
  const [donations, setDonations] = useState<any[]>([])

  useEffect(() => {
    supabase.from('donations').select('*').eq('active', true).order('sort_order').then(r => setDonations(r.data || []))
  }, [])

  return (
    <div className={styles.give}>
      <div className={styles.hero}>
        <div className={styles.icon}>❤️</div>
        <h2>"Each of you should give what you have decided in your heart to give."</h2>
        <p>— 2 Corinthians 9:7</p>
      </div>

      <div className={styles.banner}>
        <h3>Text to Give</h3>
        <p>Send your gift via text message</p>
      </div>

      <div className={styles.options}>
        {donations.map(d => (
          <a key={d.id} href={d.url} target="_blank" rel="noopener noreferrer" className={styles.donation}>
            {d.image_url && <img src={d.image_url} alt={d.title} />}
            <h3>{d.title}</h3>
          </a>
        ))}
      </div>
    </div>
  )
}
