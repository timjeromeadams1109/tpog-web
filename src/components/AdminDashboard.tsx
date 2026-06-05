'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './admin.module.css'

export default function AdminDashboard({ siteConfig }: any) {
  const [tab, setTab] = useState('overview')
  const [heroSlides, setHeroSlides] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [newHeroUrl, setNewHeroUrl] = useState('')

  useEffect(() => {
    loadHeroSlides()
  }, [])

  const loadHeroSlides = async () => {
    setLoading(true)
    const { data } = await supabase.from('hero_slides').select('*').order('sort_order')
    setHeroSlides(data || [])
    setLoading(false)
  }

  const addHeroSlide = async () => {
    if (!newHeroUrl.trim()) return
    setLoading(true)
    const { error } = await supabase.from('hero_slides').insert({
      image_url: newHeroUrl,
      active: true,
      sort_order: heroSlides.length,
    })
    if (!error) {
      setNewHeroUrl('')
      loadHeroSlides()
    }
    setLoading(false)
  }

  const deleteHeroSlide = async (id: string) => {
    setLoading(true)
    await supabase.from('hero_slides').delete().eq('id', id)
    loadHeroSlides()
    setLoading(false)
  }

  return (
    <div className={styles.dashboard}>
      <nav className={styles.tabs}>
        {['overview', 'site', 'home', 'hero', 'events', 'prayers', 'donations', 'videos', 'content'].map(t => (
          <button key={t} className={tab === t ? styles.active : ''} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </nav>

      <div className={styles.content}>
        {tab === 'overview' && (
          <div className={styles.section}>
            <h2>Admin Dashboard</h2>
            <p>Manage all TPOG content</p>
            <div className={styles.grid}>
              <div className={styles.card}>
                <h3>Church</h3>
                <p>{siteConfig?.church_name}</p>
              </div>
              <div className={styles.card}>
                <h3>Pastor</h3>
                <p>{siteConfig?.pastor_name}</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'hero' && (
          <div className={styles.section}>
            <h2>Hero Slides</h2>
            <div className={styles.form}>
              <input
                type="url"
                placeholder="Image URL (paste from Supabase Storage or external URL)"
                value={newHeroUrl}
                onChange={(e) => setNewHeroUrl(e.target.value)}
              />
              <button onClick={addHeroSlide} disabled={loading}>{loading ? 'Adding...' : 'Add Slide'}</button>
            </div>
            <div className={styles.list}>
              {heroSlides.map((slide, i) => (
                <div key={slide.id} className={styles.item}>
                  <img src={slide.image_url} alt={`Slide ${i + 1}`} />
                  <div>
                    <p><strong>Slide {i + 1}</strong></p>
                    <p className={styles.url}>{slide.image_url}</p>
                  </div>
                  <button onClick={() => deleteHeroSlide(slide.id)} className={styles.deleteBtn}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab !== 'overview' && tab !== 'hero' && (
          <div className={styles.section}>
            <h2>{tab.charAt(0).toUpperCase() + tab.slice(1)}</h2>
            <p>Coming soon</p>
          </div>
        )}
      </div>
    </div>
  )
}
