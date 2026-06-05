'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './admin.module.css'

export default function AdminDashboard({ siteConfig }: any) {
  const [tab, setTab] = useState('overview')
  const [heroSlides, setHeroSlides] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [prayers, setPrayers] = useState<any[]>([])
  const [donations, setDonations] = useState<any[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [newHeroUrl, setNewHeroUrl] = useState('')
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', location: '', category: '', image_url: '', featured: false })
  const [newPrayer, setNewPrayer] = useState({ name: '', category: '', prayer_text: '', is_anonymous: false })
  const [newDonation, setNewDonation] = useState({ title: '', description: '', icon: '', link: '' })
  const [newVideo, setNewVideo] = useState({ title: '', description: '', thumbnail_url: '', video_url: '', speaker: '' })

  useEffect(() => {
    loadHeroSlides()
    loadEvents()
    loadPrayers()
    loadDonations()
    loadVideos()
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

  const loadPrayers = async () => {
    const { data } = await supabase.from('prayers').select('*').order('created_at', { ascending: false })
    setPrayers(data || [])
  }

  const loadDonations = async () => {
    const { data } = await supabase.from('donation_options').select('*').order('sort_order')
    setDonations(data || [])
  }

  const loadVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false })
    setVideos(data || [])
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

  const addPrayer = async () => {
    if (!newPrayer.name.trim() || !newPrayer.prayer_text.trim()) return
    setLoading(true)
    await supabase.from('prayers').insert({
      name: newPrayer.name,
      category: newPrayer.category,
      prayer_text: newPrayer.prayer_text,
      is_anonymous: newPrayer.is_anonymous,
      active: true,
    })
    setNewPrayer({ name: '', category: '', prayer_text: '', is_anonymous: false })
    loadPrayers()
    setLoading(false)
  }

  const deletePrayer = async (id: string) => {
    setLoading(true)
    await supabase.from('prayers').delete().eq('id', id)
    loadPrayers()
    setLoading(false)
  }

  const addDonation = async () => {
    if (!newDonation.title.trim()) return
    setLoading(true)
    await supabase.from('donation_options').insert({
      title: newDonation.title,
      description: newDonation.description,
      icon: newDonation.icon,
      link: newDonation.link,
      active: true,
      sort_order: donations.length,
    })
    setNewDonation({ title: '', description: '', icon: '', link: '' })
    loadDonations()
    setLoading(false)
  }

  const deleteDonation = async (id: string) => {
    setLoading(true)
    await supabase.from('donation_options').delete().eq('id', id)
    loadDonations()
    setLoading(false)
  }

  const addVideo = async () => {
    if (!newVideo.title.trim()) return
    setLoading(true)
    await supabase.from('videos').insert({
      title: newVideo.title,
      description: newVideo.description,
      thumbnail_url: newVideo.thumbnail_url,
      video_url: newVideo.video_url,
      speaker: newVideo.speaker,
      active: true,
    })
    setNewVideo({ title: '', description: '', thumbnail_url: '', video_url: '', speaker: '' })
    loadVideos()
    setLoading(false)
  }

  const deleteVideo = async (id: string) => {
    setLoading(true)
    await supabase.from('videos').delete().eq('id', id)
    loadVideos()
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

        {tab === 'prayers' && (
          <div className={styles.section}>
            <h2>Prayer Requests</h2>
            <div className={styles.formGrid}>
              <input type="text" placeholder="Name" value={newPrayer.name} onChange={(e) => setNewPrayer({...newPrayer, name: e.target.value})} />
              <input type="text" placeholder="Category" value={newPrayer.category} onChange={(e) => setNewPrayer({...newPrayer, category: e.target.value})} />
              <textarea placeholder="Prayer Text" value={newPrayer.prayer_text} onChange={(e) => setNewPrayer({...newPrayer, prayer_text: e.target.value})} style={{gridColumn: '1/-1', minHeight: '80px'}} />
              <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <input type="checkbox" checked={newPrayer.is_anonymous} onChange={(e) => setNewPrayer({...newPrayer, is_anonymous: e.target.checked})} />
                Anonymous
              </label>
              <button onClick={addPrayer} disabled={loading} style={{gridColumn: '1/-1'}}>{loading ? 'Adding...' : 'Add Prayer'}</button>
            </div>
            <div className={styles.list}>
              {prayers.map((prayer) => (
                <div key={prayer.id} className={styles.item}>
                  <div style={{flex: 1}}>
                    <p><strong>{prayer.is_anonymous ? 'Anonymous' : prayer.name}</strong></p>
                    <p style={{fontSize: '12px', color: '#666'}}>{prayer.category}</p>
                    <p style={{fontSize: '12px', marginTop: '4px'}}>{prayer.prayer_text.substring(0, 100)}...</p>
                  </div>
                  <button onClick={() => deletePrayer(prayer.id)} className={styles.deleteBtn}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'donations' && (
          <div className={styles.section}>
            <h2>Donation Options</h2>
            <div className={styles.formGrid}>
              <input type="text" placeholder="Title" value={newDonation.title} onChange={(e) => setNewDonation({...newDonation, title: e.target.value})} />
              <input type="text" placeholder="Description" value={newDonation.description} onChange={(e) => setNewDonation({...newDonation, description: e.target.value})} />
              <input type="text" placeholder="Icon/Emoji" value={newDonation.icon} onChange={(e) => setNewDonation({...newDonation, icon: e.target.value})} />
              <input type="url" placeholder="Link" value={newDonation.link} onChange={(e) => setNewDonation({...newDonation, link: e.target.value})} />
              <button onClick={addDonation} disabled={loading} style={{gridColumn: '1/-1'}}>{loading ? 'Adding...' : 'Add Option'}</button>
            </div>
            <div className={styles.list}>
              {donations.map((donation) => (
                <div key={donation.id} className={styles.item}>
                  <div style={{fontSize: '24px'}}>{donation.icon}</div>
                  <div style={{flex: 1}}>
                    <p><strong>{donation.title}</strong></p>
                    <p style={{fontSize: '12px', color: '#666'}}>{donation.description}</p>
                  </div>
                  <button onClick={() => deleteDonation(donation.id)} className={styles.deleteBtn}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'videos' && (
          <div className={styles.section}>
            <h2>Videos</h2>
            <div className={styles.formGrid}>
              <input type="text" placeholder="Title" value={newVideo.title} onChange={(e) => setNewVideo({...newVideo, title: e.target.value})} />
              <input type="text" placeholder="Speaker" value={newVideo.speaker} onChange={(e) => setNewVideo({...newVideo, speaker: e.target.value})} />
              <textarea placeholder="Description" value={newVideo.description} onChange={(e) => setNewVideo({...newVideo, description: e.target.value})} style={{gridColumn: '1/-1', minHeight: '60px'}} />
              <input type="url" placeholder="Thumbnail URL" value={newVideo.thumbnail_url} onChange={(e) => setNewVideo({...newVideo, thumbnail_url: e.target.value})} style={{gridColumn: '1/-1'}} />
              <input type="url" placeholder="Video URL" value={newVideo.video_url} onChange={(e) => setNewVideo({...newVideo, video_url: e.target.value})} style={{gridColumn: '1/-1'}} />
              <button onClick={addVideo} disabled={loading} style={{gridColumn: '1/-1'}}>{loading ? 'Adding...' : 'Add Video'}</button>
            </div>
            <div className={styles.list}>
              {videos.map((video) => (
                <div key={video.id} className={styles.item}>
                  {video.thumbnail_url && <img src={video.thumbnail_url} alt={video.title} />}
                  <div style={{flex: 1}}>
                    <p><strong>{video.title}</strong></p>
                    <p style={{fontSize: '12px', color: '#666'}}>by {video.speaker}</p>
                    <p style={{fontSize: '12px', marginTop: '4px'}}>{video.description?.substring(0, 60)}...</p>
                  </div>
                  <button onClick={() => deleteVideo(video.id)} className={styles.deleteBtn}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'site' && (
          <div className={styles.section}>
            <h2>Site Settings</h2>
            <p>Coming soon - Site configuration</p>
          </div>
        )}

        {tab === 'home' && (
          <div className={styles.section}>
            <h2>Home Settings</h2>
            <p>Coming soon - Home page configuration</p>
          </div>
        )}

        {tab === 'content' && (
          <div className={styles.section}>
            <h2>App Content</h2>
            <p>Coming soon - General app content</p>
          </div>
        )}
      </div>
    </div>
  )
}
