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
      r.data?.forEach(e => { if (e.category && !cats.includes(e.category)) cats.push(e.category) })
      setCategories(cats)
      setEvents(r.data || [])
    })
  }, [])

  const filtered = filter === 'All' ? events : events.filter(e => e.category === filter)

  return (
    <div className={styles.eventsScreen}>
      <h1 className={styles.screenTitle}>EVENTS</h1>
      <div className={styles.filters}>{categories.map(c => <button key={c} className={filter === c ? styles.filterActive : ''} onClick={() => setFilter(c)}>{c}</button>)}</div>
      <div className={styles.eventsList}>
        {filtered.map(e => (
          <div key={e.id} className={`${styles.eventCard} ${e.featured ? styles.featured : ''}`}>
            {e.image_url && <img src={e.image_url} alt={e.title} />}
            <div className={styles.eventInfo}>
              <h3>{e.title}</h3>
              <p>📅 {e.date_text} at {e.time_text}</p>
              <p>📍 {e.location}</p>
              <p>{e.description}</p>
              {e.rsvp_enabled && <button className={styles.rsvpBtn}>RSVP</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
