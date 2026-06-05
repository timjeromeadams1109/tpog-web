'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './admin.module.css'

export default function AdminDashboard({ siteConfig }: any) {
  const [tab, setTab] = useState('overview')
  const [heroSlides, setHeroSlides] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [newHeroUrl, setNewHeroUrl] = useState('')
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', location: '', category: '', image_url: '', featured: false })

  useEffect(() => {
    loadHeroSlides()
    loadEvents()
  }, [])

  const loadHeroSlides = async () => {
    setLoading(true)
    const { data } = await supabase.from('hero_slides').select('*').order('sort_order')
    setHeroSlides(data || [])
    setLoading(false)
  }

  const loadEvents = async () => {
    const { data } = await supabase.from('events').select('*').order('event_date')
    setEvents(data || [])
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

  const addEvent = async () => {
    if (!newEvent.title.trim() || !newEvent.date) return
    setLoading(true)
    const { error } = await supabase.from('events').insert({
      title: newEvent.title,
      event_date: newEvent.date,
      event_time: newEvent.time,
      location: newEvent.location,
      category: newEvent.category,
      image_url: newEvent.image_url,
      featured: newEvent.featured,
      active: true,
    })
    if (!error) {
      setNewEvent({ title: '', date: '', time: '', location: '', category: '', image_url: '', featured: false })
      loadEvents()
    }
    setLoading(false)
  }

  const deleteEvent = async (id: string) => {
    setLoading(true)
    await supabase.from('events').delete().eq('id', id)
    loadEvents()
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

        {tab === 'events' && (
          <div className={styles.section}>
            <h2>Events</h2>
            <div className={styles.formGrid}>
              <input type="text" placeholder="Event Title" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} />
              <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} />
              <input type="time" value={newEvent.time} onChange={(e) => setNewEvent({...newEvent, time: e.target.value})} />
              <input type="text" placeholder="Location" value={newEvent.location} onChange={(e) => setNewEvent({...newEvent, location: e.target.value})} />
              <input type="text" placeholder="Category" value={newEvent.category} onChange={(e) => setNewEvent({...newEvent, category: e.target.value})} />
              <input type="url" placeholder="Image URL" value={newEvent.image_url} onChange={(e) => setNewEvent({...newEvent, image_url: e.target.value})} />
              <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <input type="checkbox" checked={newEvent.featured} onChange={(e) => setNewEvent({...newEvent, featured: e.target.checked})} />
                Featured
              </label>
              <button onClick={addEvent} disabled={loading} style={{gridColumn: '1/-1'}}>{loading ? 'Adding...' : 'Add Event'}</button>
            </div>
            <div className={styles.eventsList}>
              {events.map((event) => (
                <div key={event.id} className={styles.eventItem}>
                  {event.image_url && <img src={event.image_url} alt={event.title} />}
                  <div className={styles.eventInfo}>
                    <h3>{event.title}</h3>
                    <p><strong>Date:</strong> {event.event_date} {event.event_time && `@ ${event.event_time}`}</p>
                    <p><strong>Location:</strong> {event.location}</p>
                    <p><strong>Category:</strong> {event.category}</p>
                    {event.featured && <span className={styles.badge}>Featured</span>}
                  </div>
                  <button onClick={() => deleteEvent(event.id)} className={styles.deleteBtn}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab !== 'overview' && tab !== 'hero' && tab !== 'events' && (
          <div className={styles.section}>
            <h2>{tab.charAt(0).toUpperCase() + tab.slice(1)}</h2>
            <p>Coming soon</p>
          </div>
        )}
      </div>
    </div>
  )
}
