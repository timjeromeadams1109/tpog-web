'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './screens.module.css'

const CATEGORIES = ['All', 'Health', 'Family', 'Financial', 'Guidance', 'Gratitude', 'Other']

export default function PrayerScreen() {
  const [prayers, setPrayers] = useState<any[]>([])
  const [filter, setFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Health')
  const [text, setText] = useState('')
  const [anon, setAnon] = useState(false)

  useEffect(() => {
    supabase.from('prayer_requests').select('*').eq('approved', true).order('created_at', { ascending: false }).then(r => setPrayers(r.data || []))
  }, [])

  const formatTime = (date: string) => {
    const d = new Date(date), diff = Date.now() - d.getTime(), mins = Math.floor(diff / 60000), hours = Math.floor(diff / 3600000), days = Math.floor(diff / 86400000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days === 1) return '1 day ago'
    if (days < 7) return `${days}d ago`
    return Math.floor(days / 7) + 'w ago'
  }

  const handleSubmit = async () => {
    if (!text.trim()) return
    await supabase.from('prayer_requests').insert([{ name: anon ? 'Anonymous' : (name || 'Anonymous'), category, text, is_anonymous: anon, approved: false }])
    setText('')
    setName('')
    setCategory('Health')
    setAnon(false)
    setShowForm(false)
  }

  const prayCount = async (id: string, count: number) => {
    await supabase.from('prayer_requests').update({ pray_count: count + 1 }).eq('id', id)
    setPrayers(p => p.map(x => x.id === id ? { ...x, pray_count: count + 1 } : x))
  }

  const filtered = filter === 'All' ? prayers : prayers.filter(p => p.category === filter)

  return (
    <div className={styles.prayerScreen}>
      <h1 className={styles.screenTitle}>PRAYER WALL</h1>
      <button onClick={() => setShowForm(!showForm)} className={styles.submitBtn}>Submit Prayer Request</button>
      {showForm && (
        <div className={styles.formBox}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Prayer request..." rows={4} />
          <label><input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} /> Anonymous</label>
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}
      <div className={styles.filters}>{CATEGORIES.map(c => <button key={c} className={filter === c ? styles.filterActive : ''} onClick={() => setFilter(c)}>{c}</button>)}</div>
      <div className={styles.prayerList}>
        {filtered.map(p => (
          <div key={p.id} className={styles.prayerItem}>
            <div className={styles.prayerHeader}>
              <h3>{p.name}</h3>
              <span className={styles.time}>{formatTime(p.created_at)}</span>
            </div>
            <span className={styles.category}>{p.category}</span>
            <p>{p.text}</p>
            <button onClick={() => prayCount(p.id, p.pray_count || 0)} className={styles.prayBtn}>🙏 Pray ({p.pray_count || 0})</button>
          </div>
        ))}
      </div>
    </div>
  )
}
