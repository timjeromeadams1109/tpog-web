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

  const getMonth = (date: string) => {
    const months = { 'jan': 'JAN', 'feb': 'FEB', 'mar': 'MAR', 'apr': 'APR', 'may': 'MAY', 'jun': 'JUN', 'jul': 'JUL', 'aug': 'AUG', 'sep': 'SEP', 'oct': 'OCT', 'nov': 'NOV', 'dec': 'DEC' }
    for (const [k, v] of Object.entries(months)) if (date.toLowerCase().includes(k)) return v
    return '•••'
  }

  const getDay = (date: string) => {
    const match = date.match(/(\d{1,2})/)
    return match?.[1] || '—'
  }

  const filtered = filter === 'All' ? events : events.filter(e => e.category === filter)

  return (
    <div className={styles.eventsScreen}>
      <h1 className={styles.screenTitle}>EVENTS</h1>
      
      <div className={styles.categoryFilters}>
        {categories.map(c => (
          <button key={c} className={`${styles.categoryPill} ${filter === c ? styles.categoryPillActive : ''}`} onClick={() => setFilter(c)}>
            {c}
          </button>
        ))}
      </div>

      <div className={styles.eventsList}>
        {filtered.map(e => (
          <div key={e.id} className={`${styles.eventCard} ${e.featured ? styles.eventCardFeatured : ''}`}>
            <div className={styles.dateBadge}>
              <div className={styles.month}>{getMonth(e.date_text)}</div>
              <div className={styles.day}>{getDay(e.date_text)}</div>
            </div>
            <div className={styles.eventContent}>
              <div className={styles.eventTitleRow}>
                <h3 className={styles.eventTitle}>{e.title}</h3>
                <span className={styles.eventCategory}>{e.category}</span>
              </div>
              <p className={styles.eventMeta}>⏰ {e.time_text}</p>
              <p className={styles.eventMeta}>📍 {e.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
