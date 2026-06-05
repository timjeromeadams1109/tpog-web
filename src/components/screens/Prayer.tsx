'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './screens.module.css'

const CATEGORIES = ['All', 'Health', 'Family', 'Financial', 'Guidance', 'Gratitude', 'Other']

export default function PrayerScreen() {
  const [requests, setRequests] = useState<any[]>([])
  const [filter, setFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Health')
  const [text, setText] = useState('')
  const [anon, setAnon] = useState(false)

  useEffect(() => {
    supabase.from('prayer_requests').select('*').eq('approved', true).order('created_at', { ascending: false }).then(r => setRequests(r.data || []))
  }, [])

  const formatTime = (date: string) => {
    const d = new Date(date)
    const diff = Date.now() - d.getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
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
    setRequests(r => r.map(x => x.id === id ? { ...x, pray_count: count + 1 } : x))
  }

  const filtered = filter === 'All' ? requests : requests.filter(r => r.category === filter)

  return (
    <div className={styles.prayer}>
      <button onClick={() => setShowForm(!showForm)} className={styles.submit_btn}>Submit Prayer Request</button>

      {showForm && (
        <div className={styles.form_box}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Prayer request..." rows={4} />
          <label><input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} /> Submit anonymously</label>
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}

      <div className={styles.filters}>
        {CATEGORIES.map(c => (
          <button key={c} className={filter === c ? styles.filter_active : ''} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      <div className={styles.list}>
        {filtered.map(r => (
          <div key={r.id} className={styles.item}>
            <div className={styles.header}>
              <h3>{r.name}</h3>
              <span className={styles.time}>{formatTime(r.created_at)}</span>
            </div>
            <span className={styles.category}>{r.category}</span>
            <p>{r.text}</p>
            <button onClick={() => prayCount(r.id, r.pray_count || 0)} className={styles.pray_btn}>🙏 Pray ({r.pray_count || 0})</button>
          </div>
        ))}
      </div>
    </div>
  )
}
