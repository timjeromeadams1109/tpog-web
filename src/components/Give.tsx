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
    <div className={styles.giveScreen}>
      <h1 className={styles.screenTitle}>GIVE</h1>
      <div className={styles.scriptureHero}>
        <p>"Each of you should give what you have decided in your heart to give."</p>
        <p>— 2 Corinthians 9:7</p>
      </div>
      <div className={styles.donationOptions}>
        {donations.map(d => (
          <a key={d.id} href={d.url} target="_blank" rel="noopener noreferrer" className={styles.donationCard}>
            {d.image_url && <img src={d.image_url} alt={d.title} />}
            <h3>{d.title}</h3>
          </a>
        ))}
      </div>
    </div>
  )
}
