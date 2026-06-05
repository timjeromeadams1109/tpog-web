'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './admin.module.css'

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview')
  const [data, setData] = useState<any>({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      const results = await Promise.all([
        supabase.from('site_config').select('*').limit(1).maybeSingle(),
        supabase.from('home_settings').select('*').limit(1).maybeSingle(),
        supabase.from('hero_slides').select('*').order('sort_order'),
        supabase.from('events').select('*').order('date_text'),
        supabase.from('prayer_requests').select('*'),
        supabase.from('donations').select('*').order('sort_order'),
        supabase.from('video_library').select('*'),
        supabase.from('app_content').select('*'),
      ])
      setData({
        siteConfig: results[0].data,
        homeSettings: results[1].data,
        heroSlides: results[2].data || [],
        events: results[3].data || [],
        prayers: results[4].data || [],
        donations: results[5].data || [],
        videos: results[6].data || [],
        content: results[7].data || [],
      })
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const showMsg = (text: string) => {
    setMessage(text)
    setTimeout(() => setMessage(''), 3000)
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

      {message && <div className={styles.message}>{message}</div>}

      <div className={styles.content}>
        {tab === 'overview' && <OverviewTab siteConfig={data.siteConfig} />}
        {tab === 'site' && <SiteConfigTab config={data.siteConfig} onSave={() => { loadAllData(); showMsg('Saved!'); }} />}
        {tab === 'home' && <HomeSettingsTab settings={data.homeSettings} onSave={() => { loadAllData(); showMsg('Saved!'); }} />}
        {tab === 'hero' && <HeroSlidesTab slides={data.heroSlides} onSave={() => { loadAllData(); showMsg('Saved!'); }} />}
        {tab === 'events' && <EventsTab events={data.events} onSave={() => { loadAllData(); showMsg('Saved!'); }} />}
        {tab === 'prayers' && <PrayersTab prayers={data.prayers} onSave={() => { loadAllData(); showMsg('Saved!'); }} />}
        {tab === 'donations' && <DonationsTab donations={data.donations} onSave={() => { loadAllData(); showMsg('Saved!'); }} />}
        {tab === 'videos' && <VideosTab videos={data.videos} onSave={() => { loadAllData(); showMsg('Saved!'); }} />}
        {tab === 'content' && <ContentTab content={data.content} onSave={() => { loadAllData(); showMsg('Saved!'); }} />}
      </div>
    </div>
  )
}

function OverviewTab({ siteConfig }: any) {
  return (
    <div className={styles.section}>
      <h2>Admin Overview</h2>
      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Church</h3>
          <p>{siteConfig?.church_name || 'Not set'}</p>
        </div>
        <div className={styles.card}>
          <h3>Pastor</h3>
          <p>{siteConfig?.pastor_name || 'Not set'}</p>
        </div>
        <div className={styles.card}>
          <h3>Tagline</h3>
          <p>{siteConfig?.tagline || 'Not set'}</p>
        </div>
      </div>
      <p style={{ marginTop: '20px', color: '#666' }}>Use the tabs above to edit all app content, settings, and user submissions.</p>
    </div>
  )
}

function SiteConfigTab({ config, onSave }: any) {
  const [form, setForm] = useState(config || {})
  return (
    <div className={styles.section}>
      <h2>Site Configuration</h2>
      <div className={styles.form}>
        <label>Church Name
          <input value={form.church_name || ''} onChange={(e) => setForm({ ...form, church_name: e.target.value })} />
        </label>
        <label>Pastor Name
          <input value={form.pastor_name || ''} onChange={(e) => setForm({ ...form, pastor_name: e.target.value })} />
        </label>
        <label>Tagline
          <input value={form.tagline || ''} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
        </label>
        <label>Denomination
          <input value={form.denomination || ''} onChange={(e) => setForm({ ...form, denomination: e.target.value })} />
        </label>
        <button onClick={async () => {
          await supabase.from('site_config').update(form).eq('id', form.id)
          onSave()
        }}>Save Changes</button>
      </div>
    </div>
  )
}

function HomeSettingsTab({ settings, onSave }: any) {
  const [form, setForm] = useState(settings || {})
  return (
    <div className={styles.section}>
      <h2>Home Settings</h2>
      <div className={styles.form}>
        <label>Show Countdown
          <input type="checkbox" checked={form.show_countdown} onChange={(e) => setForm({ ...form, show_countdown: e.target.checked })} />
        </label>
        <label>Countdown Date (YYYY-MM-DD)
          <input value={form.countdown_date || ''} onChange={(e) => setForm({ ...form, countdown_date: e.target.value })} />
        </label>
        <label>Countdown Time (HH:MM)
          <input value={form.countdown_time || ''} onChange={(e) => setForm({ ...form, countdown_time: e.target.value })} />
        </label>
        <label>Hero Image URL
          <input value={form.hero_image_url || ''} onChange={(e) => setForm({ ...form, hero_image_url: e.target.value })} />
        </label>
        <button onClick={async () => {
          await supabase.from('home_settings').update(form).eq('id', form.id)
          onSave()
        }}>Save Changes</button>
      </div>
    </div>
  )
}

function HeroSlidesTab({ slides, onSave }: any) {
  const [newSlide, setNewSlide] = useState({ image_url: '', cta_text: '', sort_order: slides.length + 1 })

  return (
    <div className={styles.section}>
      <h2>Hero Carousel Slides</h2>
      <div className={styles.form}>
        <h3>Add New Slide</h3>
        <input placeholder="Image URL" value={newSlide.image_url} onChange={(e) => setNewSlide({ ...newSlide, image_url: e.target.value })} />
        <input placeholder="CTA Button Text" value={newSlide.cta_text} onChange={(e) => setNewSlide({ ...newSlide, cta_text: e.target.value })} />
        <button onClick={async () => {
          await supabase.from('hero_slides').insert([{ ...newSlide, active: true }])
          setNewSlide({ image_url: '', cta_text: '', sort_order: slides.length + 2 })
          onSave()
        }}>Add Slide</button>
      </div>
      <div className={styles.list}>
        {slides.map((s: any) => (
          <div key={s.id} className={styles.item}>
            {s.image_url && <img src={s.image_url} alt="Slide" style={{ maxWidth: '150px' }} />}
            <p>{s.cta_text}</p>
            <button onClick={async () => {
              await supabase.from('hero_slides').delete().eq('id', s.id)
              onSave()
            }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function EventsTab({ events, onSave }: any) {
  const [newEvent, setNewEvent] = useState({ title: '', date_text: '', time_text: '', location: '', description: '', image_url: '', category: 'General' })

  return (
    <div className={styles.section}>
      <h2>Events</h2>
      <div className={styles.form}>
        <h3>Add New Event</h3>
        <input placeholder="Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
        <input placeholder="Date (YYYY-MM-DD)" value={newEvent.date_text} onChange={(e) => setNewEvent({ ...newEvent, date_text: e.target.value })} />
        <input placeholder="Time (HH:MM)" value={newEvent.time_text} onChange={(e) => setNewEvent({ ...newEvent, time_text: e.target.value })} />
        <input placeholder="Location" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} />
        <input placeholder="Category" value={newEvent.category} onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })} />
        <textarea placeholder="Description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
        <input placeholder="Image URL" value={newEvent.image_url} onChange={(e) => setNewEvent({ ...newEvent, image_url: e.target.value })} />
        <button onClick={async () => {
          await supabase.from('events').insert([{ ...newEvent, active: true }])
          setNewEvent({ title: '', date_text: '', time_text: '', location: '', description: '', image_url: '', category: 'General' })
          onSave()
        }}>Add Event</button>
      </div>
      <div className={styles.list}>
        {events.map((e: any) => (
          <div key={e.id} className={styles.item}>
            <h3>{e.title}</h3>
            <p>{e.date_text} at {e.time_text} - {e.location}</p>
            <button onClick={async () => {
              await supabase.from('events').delete().eq('id', e.id)
              onSave()
            }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function PrayersTab({ prayers, onSave }: any) {
  return (
    <div className={styles.section}>
      <h2>Prayer Requests - Approve/Reject</h2>
      <div className={styles.list}>
        {prayers.map((p: any) => (
          <div key={p.id} className={styles.item}>
            <h3>{p.name} ({p.category})</h3>
            <p>{p.text}</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={async () => {
                await supabase.from('prayer_requests').update({ approved: true }).eq('id', p.id)
                onSave()
              }} style={{ background: '#22c55e', color: 'white' }}>Approve</button>
              <button onClick={async () => {
                await supabase.from('prayer_requests').delete().eq('id', p.id)
                onSave()
              }} style={{ background: '#ef4444', color: 'white' }}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DonationsTab({ donations, onSave }: any) {
  const [newDonation, setNewDonation] = useState({ title: '', url: '', image_url: '' })

  return (
    <div className={styles.section}>
      <h2>Donation Options</h2>
      <div className={styles.form}>
        <h3>Add Giving Option</h3>
        <input placeholder="Title (e.g., PayPal)" value={newDonation.title} onChange={(e) => setNewDonation({ ...newDonation, title: e.target.value })} />
        <input placeholder="URL" value={newDonation.url} onChange={(e) => setNewDonation({ ...newDonation, url: e.target.value })} />
        <input placeholder="Logo/Image URL" value={newDonation.image_url} onChange={(e) => setNewDonation({ ...newDonation, image_url: e.target.value })} />
        <button onClick={async () => {
          await supabase.from('donations').insert([{ ...newDonation, active: true, sort_order: donations.length + 1 }])
          setNewDonation({ title: '', url: '', image_url: '' })
          onSave()
        }}>Add Option</button>
      </div>
      <div className={styles.list}>
        {donations.map((d: any) => (
          <div key={d.id} className={styles.item}>
            <h3>{d.title}</h3>
            <a href={d.url} target="_blank" rel="noopener noreferrer">{d.url}</a>
            <button onClick={async () => {
              await supabase.from('donations').delete().eq('id', d.id)
              onSave()
            }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function VideosTab({ videos, onSave }: any) {
  const [newVideo, setNewVideo] = useState({ title: '', speaker: '', date_text: '', duration: '', platform: 'YouTube', video_url: '', image_url: '' })

  return (
    <div className={styles.section}>
      <h2>Video Library</h2>
      <div className={styles.form}>
        <h3>Add Video</h3>
        <input placeholder="Title" value={newVideo.title} onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })} />
        <input placeholder="Speaker" value={newVideo.speaker} onChange={(e) => setNewVideo({ ...newVideo, speaker: e.target.value })} />
        <input placeholder="Date (YYYY-MM-DD)" value={newVideo.date_text} onChange={(e) => setNewVideo({ ...newVideo, date_text: e.target.value })} />
        <input placeholder="Duration (e.g., 45:32)" value={newVideo.duration} onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })} />
        <select value={newVideo.platform} onChange={(e) => setNewVideo({ ...newVideo, platform: e.target.value })}>
          <option>YouTube</option>
          <option>Facebook</option>
          <option>Vimeo</option>
          <option>Instagram</option>
        </select>
        <input placeholder="Video URL" value={newVideo.video_url} onChange={(e) => setNewVideo({ ...newVideo, video_url: e.target.value })} />
        <input placeholder="Thumbnail URL" value={newVideo.image_url} onChange={(e) => setNewVideo({ ...newVideo, image_url: e.target.value })} />
        <button onClick={async () => {
          await supabase.from('video_library').insert([{ ...newVideo, active: true }])
          setNewVideo({ title: '', speaker: '', date_text: '', duration: '', platform: 'YouTube', video_url: '', image_url: '' })
          onSave()
        }}>Add Video</button>
      </div>
      <div className={styles.list}>
        {videos.map((v: any) => (
          <div key={v.id} className={styles.item}>
            <h3>{v.title}</h3>
            <p>{v.speaker} - {v.platform}</p>
            <button onClick={async () => {
              await supabase.from('video_library').delete().eq('id', v.id)
              onSave()
            }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function ContentTab({ content, onSave }: any) {
  const [newContent, setNewContent] = useState({ scope: 'chat', key: '', value: '' })
  const grouped = content.reduce((acc: any, c: any) => {
    if (!acc[c.scope]) acc[c.scope] = []
    acc[c.scope].push(c)
    return acc
  }, {})

  return (
    <div className={styles.section}>
      <h2>Text Content & Messages</h2>
      <div className={styles.form}>
        <h3>Add/Edit Content</h3>
        <input placeholder="Scope (chat, give, etc)" value={newContent.scope} onChange={(e) => setNewContent({ ...newContent, scope: e.target.value })} />
        <input placeholder="Key (e.g., welcome.message)" value={newContent.key} onChange={(e) => setNewContent({ ...newContent, key: e.target.value })} />
        <textarea placeholder="Value" value={newContent.value} onChange={(e) => setNewContent({ ...newContent, value: e.target.value })} />
        <button onClick={async () => {
          await supabase.from('app_content').upsert([{ scope: newContent.scope, key: newContent.key, value: newContent.value }], { onConflict: 'scope,key' })
          setNewContent({ scope: 'chat', key: '', value: '' })
          onSave()
        }}>Save Content</button>
      </div>
      {Object.entries(grouped).map(([scope, items]: any) => (
        <div key={scope} style={{ marginTop: '20px' }}>
          <h3>{scope}</h3>
          {items.map((item: any) => (
            <div key={item.id} className={styles.item}>
              <strong>{item.key}</strong>
              <p>{item.value}</p>
              <button onClick={async () => {
                await supabase.from('app_content').delete().eq('id', item.id)
                onSave()
              }}>Delete</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
