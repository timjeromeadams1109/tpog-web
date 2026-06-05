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
        <p>❤️</p>
        <p>"Each of you should give what you have decided in your heart to give."</p>
        <p>— 2 Corinthians 9:7</p>
      </div>

      <div className={styles.donationGrid}>
        {donations.map(d => (
          <a key={d.id} href={d.url} target="_blank" rel="noopener noreferrer" className={styles.donationItem}>
            <div className={styles.donationIcon}>
              {d.image_url ? <img src={d.image_url} alt={d.title} /> : <span>🤝</span>}
            </div>
            <h3>{d.title}</h3>
            <div className={styles.giveNowLink}>
              <span>🔗</span> Give Now
            </div>
          </a>
        ))}
      </div>

      <div className={styles.otherWays}>
        <h3 className={styles.otherWaysTitle}>OTHER WAYS TO GIVE</h3>
        <div className={styles.wayCard}>
          <span className={styles.wayIcon}>⛪</span>
          <div>
            <h4>In Person</h4>
            <p>Drop your offering during any service</p>
          </div>
        </div>
        <div className={styles.wayCard}>
          <span className={styles.wayIcon}>📧</span>
          <div>
            <h4>Mail a Check</h4>
            <p>Contact your church office for the mailing address</p>
          </div>
        </div>
      </div>
    </div>
  )
}
