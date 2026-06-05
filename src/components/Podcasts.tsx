'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './screens.module.css'

export default function PodcastsScreen() {
  const [episodes, setEpisodes] = useState<any[]>([])

  useEffect(() => {
    supabase.from('sermons').select('*').eq('active', true).order('date_text', { ascending: false }).then(r => setEpisodes(r.data || []))
  }, [])

  return (
    <div className={styles.podcastsScreen}>
      <h1 className={styles.screenTitle}>PODCASTS</h1>
      <div className={styles.platforms}>
        <a href="#" className={styles.platformBtn}>🎵 Spotify</a>
        <a href="#" className={styles.platformBtn}>🎙️ Apple Podcasts</a>
        <a href="#" className={styles.platformBtn}>📺 YouTube</a>
      </div>
      <div className={styles.episodesList}>
        {episodes.map(e => (
          <div key={e.id} className={styles.episodeCard}>
            {e.image_url && <img src={e.image_url} alt={e.title} />}
            <div>
              <h3>{e.title}</h3>
              {e.series && <p className={styles.series}>{e.series}</p>}
              <p className={styles.date}>{e.date_text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
