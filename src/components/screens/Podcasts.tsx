'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './screens.module.css'

const PLATFORM_LINKS = [
  { name: 'Spotify', icon: '🎵', url: '#' },
  { name: 'Apple Podcasts', icon: '🎙️', url: '#' },
  { name: 'YouTube', icon: '📺', url: '#' },
  { name: 'Google Podcasts', icon: '🔊', url: '#' },
]

export default function PodcastsScreen() {
  const [episodes, setEpisodes] = useState<any[]>([])

  useEffect(() => {
    supabase.from('sermons').select('*').eq('active', true).order('date_text', { ascending: false }).then(r => setEpisodes(r.data || []))
  }, [])

  return (
    <div className={styles.podcasts}>
      <div className={styles.platforms}>
        <h3>Subscribe On</h3>
        <div className={styles.platform_buttons}>
          {PLATFORM_LINKS.map(p => (
            <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className={styles.platform}>{p.icon} {p.name}</a>
          ))}
        </div>
      </div>

      <div className={styles.list}>
        {episodes.map(e => (
          <div key={e.id} className={styles.episode}>
            {e.image_url && <img src={e.image_url} alt={e.title} />}
            <div className={styles.info}>
              <h3>{e.title}</h3>
              {e.series && <p className={styles.series}>{e.series}</p>}
              <p className={styles.date}>{e.date_text}</p>
              {e.description && <p>{e.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
