'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './screens.module.css'

export default function HomeScreen() {
  const [heroSlides, setHeroSlides] = useState<any[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [homeSettings, setHomeSettings] = useState<any>(null)

  useEffect(() => {
    loadData()
    const countdownInterval = setInterval(() => updateCountdown(), 1000)
    const carouselInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % Math.max(heroSlides.length, 1))
    }, 6000)
    return () => {
      clearInterval(countdownInterval)
      clearInterval(carouselInterval)
    }
  }, [heroSlides.length])

  const loadData = async () => {
    try {
      const [slides, settings] = await Promise.all([
        supabase.from('hero_slides').select('*').eq('active', true).order('sort_order'),
        supabase.from('home_settings').select('*').limit(1).maybeSingle()
      ])
      setHeroSlides(slides.data || [])
      setHomeSettings(settings.data)
    } catch (error) {
      console.error('Error loading home data:', error)
    }
  }

  const updateCountdown = () => {
    if (!homeSettings?.show_countdown || !homeSettings?.countdown_date) return
    const target = new Date(homeSettings.countdown_date).getTime()
    const now = new Date().getTime()
    const diff = target - now
    if (diff > 0) {
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      })
    }
  }

  return (
    <div className={styles.homeScreen}>
      {heroSlides.length > 0 && (
        <div className={styles.carousel}>
          <div className={styles.slide}>
            <img src={heroSlides[currentSlide]?.image_url} alt="Hero" />
            {heroSlides[currentSlide]?.cta_text && (
              <button className={styles.ctaBtn}>{heroSlides[currentSlide].cta_text}</button>
            )}
          </div>
        </div>
      )}

      {homeSettings?.show_countdown && (
        <div className={styles.countdown}>
          <h2>Next Service</h2>
          <div className={styles.countdownGrid}>
            <div className={styles.countdownItem}>
              <div className={styles.number}>{countdown.days}</div>
              <div>Days</div>
            </div>
            <div className={styles.countdownItem}>
              <div className={styles.number}>{countdown.hours}</div>
              <div>Hours</div>
            </div>
            <div className={styles.countdownItem}>
              <div className={styles.number}>{countdown.minutes}</div>
              <div>Minutes</div>
            </div>
            <div className={styles.countdownItem}>
              <div className={styles.number}>{countdown.seconds}</div>
              <div>Seconds</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
