'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './screens.module.css'

const PLATFORMS = ['All', 'YouTube', 'Facebook', 'Vimeo', 'Instagram']

export default function VodScreen() {
  const [videos, setVideos] = useState<any[]>([])
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    supabase.from('video_library').select('*').eq('active', true).order('date_text', { ascending: false }).then(r => setVideos(r.data || []))
  }, [])

  const filtered = filter === 'All' ? videos : videos.filter(v => v.platform === filter)

  return (
    <div className={styles.vod}>
      <div className={styles.filters}>
        {PLATFORMS.map(p => (
          <button key={p} className={filter === p ? styles.filter_active : ''} onClick={() => setFilter(p)}>{p}</button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map(v => (
          <a key={v.id} href={v.video_url} target="_blank" rel="noopener noreferrer" className={styles.video}>
            {v.image_url && <img src={v.image_url} alt={v.title} />}
            <div className={styles.info}>
              <h3>{v.title}</h3>
              {v.speaker && <p className={styles.speaker}>{v.speaker}</p>}
              {v.date_text && <p className={styles.date}>{v.date_text}</p>}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
