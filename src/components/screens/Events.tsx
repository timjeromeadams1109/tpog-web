'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './screens.module.css'

export default function EventsScreen() {
  const [events, setEvents] = useState<any[]>([])
  const [categories, setCategories] = useState(['All'])
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    supabase.from('events').select('*').eq('active', true).order('date_text').then(r => {
      const cats = ['All']
      r.data?.forEach(e => {
        if (e.category && !cats.includes(e.category)) cats.push(e.category)
      })
      setCategories(cats)
      setEvents(r.data || [])
    })
  }, [])

  const filtered = filter === 'All' ? events : events.filter(e => e.category === filter)

  return (
    <div className={styles.events}>
      <div className={styles.filters}>
        {categories.map(c => (
          <button key={c} className={filter === c ? styles.filter_active : ''} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      <div className={styles.list}>
        {filtered.map(e => (
          <div key={e.id} className={`${styles.event} ${e.featured ? styles.featured : ''}`}>
            {e.image_url && <img src={e.image_url} alt={e.title} />}
            <div className={styles.content}>
              <h3>{e.title}</h3>
              <div className={styles.meta}>
                <span>📅 {e.date_text} at {e.time_text}</span>
                <span>📍 {e.location}</span>
              </div>
              <p>{e.description}</p>
              {e.rsvp_enabled && <button className={styles.rsvp_btn}>RSVP</button>}
              {e.external_url && <a href={e.external_url} target="_blank" rel="noopener noreferrer" className={styles.link_btn}>Learn More</a>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
